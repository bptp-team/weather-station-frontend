import { CircleMarker, MapContainer, TileLayer, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  stationId: string;
  latitude: number;
  longitude: number;
};

const OPEN_STREET_MAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export default function StationMap({ stationId, latitude, longitude }: Props) {
  const center: [number, number] = [latitude, longitude];

  return (
    <MapContainer center={center} zoom={15} scrollWheelZoom={false}>
      <TileLayer
        attribution={OPEN_STREET_MAP_ATTRIBUTION}
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CircleMarker
        center={center}
        radius={9}
        pathOptions={{ color: "#fff", fillColor: "#17735f", fillOpacity: 1 }}
      >
        <Tooltip>{stationId}</Tooltip>
      </CircleMarker>
    </MapContainer>
  );
}
