import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import { DeferredToaster } from "./components/DeferredToaster";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const DownloadPage = lazy(() => import("./pages/Download"));
const BugReport = lazy(() => import("./pages/BugReport"));
const DocsPage = lazy(() => import("./pages/DocsPage"));

/** Landing boot: no QueryClient/ThemeProvider/TooltipProvider (unused on Home). */
const App = () => (
  <>
    <DeferredToaster />
    <BrowserRouter>
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
    </BrowserRouter>
  </>
);

export default App;
