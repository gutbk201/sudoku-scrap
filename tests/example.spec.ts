import { Difficulty, baseUrl } from '../constant';
import { test } from "@playwright/test";
import { readJson, saveJson, delay } from '../util'

const actionTries = 9;
const diffIndex = Difficulty.normal
test("take screenshot", async ({ page }) => {
  const diffName = Difficulty[diffIndex];
  const json = await readJson()
  let currentId = json[diffName];
  const delaySecond = 0;
  await takeManyScreenshot(actionTries)
  async function takeManyScreenshot(times: number, cur = 0) {
    console.log(`handling batch ${cur + 1}/${times}`)
    if (cur === times) return console.log('done', new Date().toLocaleTimeString());
    await takeScreenshot(currentId++);
    await saveJson(currentId, diffName);
    await delay(delaySecond);
    await takeManyScreenshot(times, cur + 1);
  }
  async function takeScreenshot(_id: number) {
    const id = String(_id);
    let urlObj = new URL(baseUrl);
    urlObj.searchParams.set('level', diffIndex)
    urlObj.searchParams.set('set_id', id)
    const url = urlObj.toString();
    const filePath = `screenshots/${diffName}/${id}.png`;
    await page.goto(url);
    await page.locator("#puzzle_grid").screenshot({ path: filePath });
  }
});
