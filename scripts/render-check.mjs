import puppeteer from "puppeteer";

const mode = process.argv[2] || "face";
const blink = process.argv[3] || "0";
const outFile = process.argv[4] || "scripts/render-check.png";

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
await page.setViewport({ width: 1000, height: 1000 });

const logs = [];
page.on("console", (msg) => logs.push(`[console:${msg.type()}] ${msg.text()}`));
page.on("pageerror", (err) => logs.push(`[pageerror] ${err.message}`));

await page.goto(`http://localhost:8842/viewer.html?mode=${mode}&blink=${blink}`, {
  waitUntil: "domcontentloaded",
  timeout: 30000,
});

await page.waitForFunction("window.__ready === true", { timeout: 20000 });
const error = await page.evaluate(() => window.__error);
if (error) console.log("MODEL LOAD ERROR:", error);
const headInfo = await page.evaluate(() => ({ found: window.__headFound, pos: window.__headPos }));
console.log("head bone:", JSON.stringify(headInfo));
const debugBox = await page.evaluate(() => window.__debugBox);
console.log("debug box:", JSON.stringify(debugBox));
const topNames = await page.evaluate(() => window.__topLevelNames);
console.log("top-level names:", JSON.stringify(topNames));
const meshCount = await page.evaluate(() => window.__meshCount);
console.log("mesh count:", meshCount);

await page.screenshot({ path: outFile });
console.log("saved", outFile);
logs.forEach((l) => console.log(l));

await browser.close();
