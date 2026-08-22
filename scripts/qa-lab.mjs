import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

mkdirSync("/workspace/screenshots", { recursive: true });
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});

await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.getByRole("button", { name: /2017 Toyota Corolla/ }).click();
await page.waitForURL("**/lab");
await page.waitForTimeout(500);
await page.screenshot({ path: "/workspace/screenshots/lab-corolla.png" });

await page.getByRole("button", { name: "Scan", exact: true }).click();
await page.waitForTimeout(200);
await page.getByRole("button", { name: "START" }).click();
await page.waitForTimeout(900);
await page.screenshot({ path: "/workspace/screenshots/lab-cranking.png" });

const body = await page.locator("body").innerText();
console.log("DURING_CRANK", {
  hasLoss: body.includes("LOSS"),
  hasRpmZero: /RPM\s*0/.test(body),
  running: body.includes("RUNNING"),
  stopped: body.includes("STOPPED") || body.includes("CRANKING"),
});

await page.getByRole("button", { name: "Parts", exact: true }).click();
await page.getByRole("button", { name: "Replace" }).first().click();
await page.getByRole("button", { name: "Install anyway" }).click();
await page.waitForTimeout(400);
await page.getByRole("button", { name: "START" }).click();
await page.waitForTimeout(1500);
await page.screenshot({ path: "/workspace/screenshots/lab-after-ckp.png" });
const after = await page.locator("body").innerText();
console.log("AFTER_REPAIR", {
  running: after.includes("RUNNING"),
  sync: after.includes("SYNC"),
  rpm: (after.match(/RPM\s+([0-9.]+)/) || [])[1],
});

await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(300);
await page.screenshot({ path: "/workspace/screenshots/lab-mobile.png" });

await page.setViewportSize({ width: 1280, height: 800 });
await page.goto("http://127.0.0.1:8080/creator");
await page.screenshot({ path: "/workspace/screenshots/creator.png" });
await page.goto("http://127.0.0.1:8080/profile");
await page.screenshot({ path: "/workspace/screenshots/profile.png" });

await browser.close();
if (errors.length) {
  console.error("ERRORS", errors);
  process.exit(1);
}
console.log("OK");
