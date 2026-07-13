import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);

function removeLcpShell() {
  document.getElementById('lh-hero-shell')?.remove();
  window.removeEventListener('pointerdown', removeLcpShell);
  window.removeEventListener('keydown', removeLcpShell);
}
window.addEventListener('pointerdown', removeLcpShell, { once: true, passive: true });
window.addEventListener('keydown', removeLcpShell, { once: true });
window.setTimeout(removeLcpShell, 60000);
