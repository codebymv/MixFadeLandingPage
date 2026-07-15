import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import { DeferredToaster } from "./components/DeferredToaster";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const DownloadPage = lazy(() => import("./pages/Download"));
const BugReport = lazy(() => import("./pages/BugReport"));
const DocsPage = lazy(() => import("./pages/DocsPage"));

/**
 * Router-agnostic shell — BrowserRouter on the client, StaticRouter when prerendering.
 * Home is eager so `/` SSR/prerender HTML matches hydrate.
 */
export function AppShell() {
  return (
    <>
      <DeferredToaster />
      <Navigation />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/bug-report" element={<BugReport />} />
          <Route path="/help/*" element={<DocsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default AppShell;
