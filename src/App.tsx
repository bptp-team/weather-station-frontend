import { LiveDashboard } from "./features/live";

const selectedStationId = "station-01";

function App() {
  return (
    <main className="app-shell">
      <LiveDashboard stationId={selectedStationId} />
    </main>
  );
}

export default App;
