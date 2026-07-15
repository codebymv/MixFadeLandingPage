/**
 * After `vite build`, inject real `/` HTML into dist/index.html (Gleam-style first paint).
 * Client hydrates via hydrateRoot when #root already has children.
 */
import { createServer } from "vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distIndex = path.join(root, "dist", "index.html");

/** Replace #root contents using tag-depth matching (React HTML has nested </div>). */
function replaceRootInner(html, appHtml) {
  const openRe = /<div id="root"[^>]*>/;
  const open = openRe.exec(html);
  if (!open) {
    throw new Error('dist/index.html missing <div id="root">');
  }

  let i = open.index + open[0].length;
  let depth = 1;
  while (i < html.length && depth > 0) {
    const nextOpen = html.indexOf("<div", i);
    const nextClose = html.indexOf("</div>", i);
    if (nextClose === -1) {
      throw new Error("Unclosed #root in dist/index.html");
    }
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth += 1;
      i = nextOpen + 4;
    } else {
      depth -= 1;
      if (depth === 0) {
        return (
          html.slice(0, open.index) +
          `<div id="root">${appHtml}</div>` +
          html.slice(nextClose + "</div>".length)
        );
      }
      i = nextClose + "</div>".length;
    }
  }
  throw new Error("Failed to locate #root closing tag");
}

async function main() {
  if (!fs.existsSync(distIndex)) {
    throw new Error(`Missing ${distIndex} — run vite build first`);
  }

  // mode: production so lovable-tagger data-* attrs are NOT in SSR HTML
  // (mismatch with client bundle causes hydration rebuild → CLS).
  const vite = await createServer({
    root,
    configFile: path.join(root, "vite.config.ts"),
    mode: "production",
    server: { middlewareMode: true },
    appType: "custom",
  });

  try {
    const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
    const appHtml = render("/");

    const before = fs.readFileSync(distIndex, "utf8");
    const html = replaceRootInner(before, appHtml);
    fs.writeFileSync(distIndex, html);

    const hasLcp = html.includes('id="lh-lcp-h1"');
    const hasLov = html.includes("data-lov-");
    console.log(
      `[prerender] Injected / into dist/index.html (${appHtml.length.toLocaleString()} chars, file ${(html.length / 1024).toFixed(1)} KiB, lh-lcp-h1=${hasLcp}, data-lov=${hasLov})`,
    );
    if (!hasLcp) {
      throw new Error('Prerender output missing id="lh-lcp-h1" — aborting');
    }
    if (hasLov) {
      throw new Error("Prerender HTML contains lovable-tagger attrs — use mode:production");
    }
  } finally {
    await vite.close();
  }
}

main().catch((err) => {
  console.error("[prerender] failed:", err);
  process.exit(1);
});
