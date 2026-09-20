import { lazy, Suspense } from "react";
import { FeedbackMessage } from "./components/FeedbackMessage";
import { LiveDashboard } from "./features/live";

const selectedStationId = "station-01";
const HistoryDashboard = lazy(() =>
  import("./features/history/components/HistoryDashboard").then(
    ({ HistoryDashboard: dashboard }) => ({
      default: dashboard,
    }),
  ),
);

function HistoryModuleFallback() {
  return (
    <section
      className="history-section"
      data-testid="history-module-fallback"
      aria-labelledby="history-loading-title"
    >
      <FeedbackMessage>Carregando histórico...</FeedbackMessage>
    </section>
  );
}

function App() {
  return (
    <main className="app-shell app-shell--viewport">
      <LiveDashboard stationId={selectedStationId} />
      <Suspense fallback={<HistoryModuleFallback />}>
        <HistoryDashboard stationId={selectedStationId} />
      </Suspense>
    </main>
  );
}

export default App;
