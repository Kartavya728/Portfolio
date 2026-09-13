import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
  headless: "new",
  args: [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-webgl",
    "--ignore-gpu-blocklist",
    "--enable-unsafe-swiftshader",
    "--disable-gpu-sandbox",
    "--no-sandbox",
  ],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });

const logs = [];
page.on("console", (msg) => logs.push(`[console:${msg.type()}] ${msg.text()}`));
page.on("pageerror", (err) => logs.push(`[pageerror] ${err.message}`));
page.on("requestfailed", (req) =>
  logs.push(`[requestfailed] ${req.url()} ${req.failure()?.errorText}`)
);

await page.goto("http://localhost:5183/", { waitUntil: "domcontentloaded", timeout: 30000 });

// Give the character time to decrypt, load, compile, and start its intro animation.
// Poll the loading progress element instead of a fixed sleep.
for (let i = 0; i < 40; i++) {
  const progress = await page
    .evaluate(() => document.querySelector(".loading-percentage")?.textContent || document.body.innerText.match(/\d+%/)?.[0])
    .catch(() => null);
  console.log("progress check", i, progress);
  if (!progress) break;
  await new Promise((r) => setTimeout(r, 2000));
}
await new Promise((r) => setTimeout(r, 25000));

const canvasInfo = await page.evaluate(() => {
  const el = document.querySelector(".character-model canvas");
  if (!el) return null;
  const gl = el.getContext("webgl2") || el.getContext("webgl");
  return {
    width: el.width,
    height: el.height,
    hasContext: !!gl,
  };
});

console.log("Canvas info:", canvasInfo);
console.log("--- Logs ---");
logs.forEach((l) => console.log(l));

await page.screenshot({ path: "scripts/character-screenshot.png" });

await browser.close();
