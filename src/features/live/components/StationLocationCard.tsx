import { lazy, Suspense } from "react";

type Props = {
  stationId: string;
  latitude: number | null;
  longitude: number | null;
};

const StationMap = lazy(() => import("./StationMap"));

export function StationLocationCard({ stationId, latitude, longitude }: Props) {
  const coordinates = latitude !== null && longitude !== null ? { latitude, longitude } : null;

  return (
    <section className="station-location-section" aria-labelledby="station-location-title">
      <h2 id="station-location-title" className="measurement-heading station-location-heading">
        Localização da estação
      </h2>
      {coordinates ? (
        <>
          <div
            className="station-location-map"
            data-testid="station-location-map"
            data-latitude={coordinates.latitude}
            data-longitude={coordinates.longitude}
            role="region"
            aria-label={`Mapa da localização de ${stationId}`}
          >
            <Suspense
              fallback={
                <div className="station-map-loading" role="status">
                  Carregando mapa...
                </div>
              }
            >
              <StationMap
                stationId={stationId}
                latitude={coordinates.latitude}
                longitude={coordinates.longitude}
              />
            </Suspense>
          </div>
          <p className="station-location-coordinates">
            {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
          </p>
        </>
      ) : (
        <p className="station-location-pending" role="status">
          Aguardando coordenadas da estação
        </p>
      )}
    </section>
  );
}
