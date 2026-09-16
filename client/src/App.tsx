import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { FieldNoteDetailPage } from "./pages/FieldNoteDetailPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const FieldNotesIndexPage = lazy(() =>
  import("./pages/FieldNotesIndexPage").then((m) => ({ default: m.FieldNotesIndexPage })),
);
const MapPage = lazy(() => import("./pages/MapPage").then((m) => ({ default: m.MapPage })));
const RegionHubPage = lazy(() => import("./pages/RegionHubPage").then((m) => ({ default: m.RegionHubPage })));
const DestinationDetailPage = lazy(() =>
  import("./pages/DestinationDetailPage").then((m) => ({ default: m.DestinationDetailPage })),
);
const SeasonalPillarPage = lazy(() =>
  import("./pages/SeasonalPillarPage").then((m) => ({ default: m.SeasonalPillarPage })),
);
const RoutesIndexPage = lazy(() => import("./pages/RoutesIndexPage").then((m) => ({ default: m.RoutesIndexPage })));
const RouteDetailPage = lazy(() => import("./pages/RouteDetailPage").then((m) => ({ default: m.RouteDetailPage })));
const AboutPage = lazy(() => import("./pages/AboutPage").then((m) => ({ default: m.AboutPage })));
const AccountPage = lazy(() => import("./pages/AccountPage").then((m) => ({ default: m.AccountPage })));
const StudioPage = lazy(() => import("./pages/StudioPage").then((m) => ({ default: m.StudioPage })));

function PageFallback() {
  return <div className="mx-auto max-w-6xl px-4 py-24 text-center text-ink-500 sm:px-6">Loading&#8230;</div>;
}

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/field-notes" element={<FieldNotesIndexPage />} />
          <Route path="/field-notes/:slug" element={<FieldNoteDetailPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/regions/:region" element={<RegionHubPage />} />
          <Route path="/regions/:region/destinations/:slug" element={<DestinationDetailPage />} />
          <Route path="/best-time-to-visit-india" element={<SeasonalPillarPage />} />
          <Route path="/routes" element={<RoutesIndexPage />} />
          <Route path="/routes/:slug" element={<RouteDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/studio" element={<StudioPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
