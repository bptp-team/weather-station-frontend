import type { Plugin } from "vite";
import type { WeatherSnapshot } from "../src/shared/weather/weatherSnapshot.ts";

const historyPointLimit = 120;
const streamIntervalMilliseconds = 3000;

type MiddlewareRequest = {
  method?: string;
  url?: string;
};

function createReading(stationId: string, date: Date, index: number): WeatherSnapshot {
  const timeOfDay = ((date.getUTCHours() * 60 + date.getUTCMinutes()) / (24 * 60)) * Math.PI * 2;

  return {
    device_id: stationId,
    air_temperature: Number(
      (19 + 5 * Math.sin(timeOfDay - Math.PI / 2) + Math.sin(index / 4)).toFixed(1),
    ),
    air_pressure: Number((1012 + 4 * Math.sin(index / 11)).toFixed(1)),
    air_humidity: Math.round(58 + 14 * Math.sin(index / 8)),
    air_quality: Math.round(18 + 7 * (0.5 + 0.5 * Math.sin(index / 9))),
    daylight: Math.round(2200 - 1800 * Math.cos(timeOfDay - Math.PI)),
    latitude: -23.089397,
    longitude: -45.69898,
    precipitation_interval: Math.max(0, Math.round(3 + 3 * Math.sin(index / 6))),
    received_at: date.toISOString(),
  };
}

function createHistory(stationId: string, from: Date, to: Date): WeatherSnapshot[] {
  const fromTime = from.getTime();
  const toTime = to.getTime();

  if (toTime < fromTime) return [];

  const interval = Math.max(15 * 60 * 1000, Math.ceil((toTime - fromTime) / historyPointLimit));
  const readings: WeatherSnapshot[] = [];

  for (let timestamp = fromTime; timestamp <= toTime; timestamp += interval) {
    readings.push(createReading(stationId, new Date(timestamp), readings.length));
  }

  if (readings.at(-1)?.received_at !== to.toISOString()) {
    readings.push(createReading(stationId, to, readings.length));
  }

  return readings;
}

function fakeApiPlugin(): Plugin {
  return {
    name: "weather-station-fake-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const incomingRequest = request as unknown as MiddlewareRequest;
        if (incomingRequest.method !== "GET") {
          next();
          return;
        }

        const url = new URL(incomingRequest.url ?? "/", "http://localhost");
        const match = /^\/api\/v1\/readings\/([^/]+)(\/stream)?$/.exec(url.pathname);

        if (!match) {
          next();
          return;
        }

        let stationId: string;
        try {
          stationId = decodeURIComponent(match[1]);
        } catch {
          response.statusCode = 400;
          response.end("Invalid station ID");
          return;
        }

        if (match[2] === "/stream") {
          response.statusCode = 200;
          response.setHeader("Content-Type", "text/event-stream; charset=utf-8");
          response.setHeader("Cache-Control", "no-cache, no-transform");
          response.setHeader("Connection", "keep-alive");
          response.flushHeaders();

          let index = 0;
          const sendReading = () => {
            response.write(
              `data: ${JSON.stringify(createReading(stationId, new Date(), index++))}\n\n`,
            );
          };

          sendReading();
          const interval = setInterval(sendReading, streamIntervalMilliseconds);
          response.on("close", () => clearInterval(interval));
          return;
        }

        const from = new Date(url.searchParams.get("from") ?? "");
        const to = new Date(url.searchParams.get("to") ?? "");
        if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
          response.statusCode = 400;
          response.setHeader("Content-Type", "text/plain; charset=utf-8");
          response.end("Expected valid from and to query parameters");
          return;
        }

        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json; charset=utf-8");
        response.setHeader("Cache-Control", "no-store");
        response.end(JSON.stringify(createHistory(stationId, from, to)));
      });
    },
  };
}

export default fakeApiPlugin;
