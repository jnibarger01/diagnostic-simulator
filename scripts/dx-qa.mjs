import { chromium } from "playwright";

const base = process.argv[2] || "http://127.0.0.1:8080";
const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const fails = [];

function assert(cond, msg) {
  if (!cond) fails.push(msg);
  else console.log("OK", msg);
}

try {
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Load stall example/i }).click();
  await page.getByRole("button", { name: /Begin diagnosis/i }).click();
  await page.waitForURL(/\/session\//);
  await page.waitForTimeout(400);
  const body = await page.locator("body").innerText();
  assert(/Tundra/i.test(body), "Tundra in session");
  assert(/Crank|position|CKP|Power|Fuel/i.test(body), "system-level differential present");
  assert(/When the engine stalls/i.test(body) || /Next best/i.test(body), "next question or action present");

  const instant = page.getByRole("button", { name: /Shuts off instantly/i });
  if (await instant.count()) {
    await instant.click();
    await page.waitForTimeout(300);
    const after = await page.locator("body").innerText();
    assert(/Differential updated|Very High|High/i.test(after), "differential updates after answer");
    assert(/Fuel/i.test(after), "fuel remains on the board");
  } else {
    fails.push("instant-stall option not found");
  }

  await page.getByRole("button", { name: /^Tests$/ }).click();
  await page.waitForTimeout(200);
  const result = page.getByPlaceholder(/47 psi/i);
  if (await result.count()) {
    await result.fill("Fuel pressure stayed at 48 psi when it died.");
    await page.getByRole("button", { name: /File result/i }).click();
    await page.waitForTimeout(300);
    const afterTest = await page.locator("body").innerText();
    assert(/Fuel/i.test(afterTest), "fuel hypothesis still visible after pressure evidence");
    assert(/updated|Very Low|Low/i.test(afterTest), "ranking moved after fuel-pressure evidence");
  }

  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Load BSM example/i }).click();
  await page.getByRole("button", { name: /Begin diagnosis/i }).click();
  await page.waitForURL(/\/session\//);
  await page.waitForTimeout(400);
  const bsm = await page.locator("body").innerText();
  assert(/calibrat|mount|harness|sensor/i.test(bsm), "BSM differential is system-first not parts-cannon");
  assert(/initialized|calibrat|DTC/i.test(bsm), "asks about init/DTCs rather than another sensor");

  await page.goto(base + "/simulator", { waitUntil: "networkidle" });
  const sim = await page.locator("body").innerText();
  assert(/Corolla|RAV4|Tundra|Highlander|Camry/i.test(sim), "simulator cases listed");
} catch (e) {
  fails.push(String(e));
} finally {
  await browser.close();
}

if (fails.length) {
  console.error("FAIL\n" + fails.join("\n"));
  process.exit(1);
}
console.log("PASS");
