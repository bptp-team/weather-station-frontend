import { HistoryDashboard } from "./features/history/components/HistoryDashboard";
import { LiveDashboard } from "./features/live";

const selectedStationId = "station-01";

function App() {
  return (
    <main className="app-shell">
      <LiveDashboard stationId={selectedStationId} />
      <HistoryDashboard stationId={selectedStationId} />
    </main>
  );
}

export default App;
