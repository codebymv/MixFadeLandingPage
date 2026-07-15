import { hydrateRoot, createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppShell } from "./App.tsx";
import "./index.css";

const el = document.getElementById("root");
if (!el) {
  throw new Error("Missing #root");
}

const app = (
  <BrowserRouter>
    <AppShell />
  </BrowserRouter>
);

// Prerendered builds ship real Home HTML inside #root — hydrate in place (no wipe/flash).
// Dev / empty root still uses createRoot.
if (el.hasChildNodes()) {
  hydrateRoot(el, app);
} else {
  createRoot(el).render(app);
}
