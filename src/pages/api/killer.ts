import { KillerDifficulty, killerBaseUrl, folderKiller } from "~/utils/constant";
import playwright from "playwright";
import { NextApiResponse, NextApiRequest } from "next";
import { countFiles, readJson, saveJson } from "~/utils/server-helper";
import { delay } from "~/utils/helper";

type IRawDifficulty = keyof typeof KillerDifficulty;
const type = 'killer';
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<{ done: "yes" | "no"; count?: number }>
) {
  if (_req.method === "GET")
    return res.status(200).json({ done: "yes", count: await countFiles(type) });
  if (_req.method === "POST") return grabKiller(_req, res);
  return res.status(200).json({ done: "no" });
}
async function grabKiller(_req: NextApiRequest, res: NextApiResponse<any>) {
  const bodyParams = _req.body as { times: number; diff: IRawDifficulty };
  const actionTries = Number(Math.floor(bodyParams?.times || 10));
  // //limit for killer is???
  const diffIndex = bodyParams?.diff || KillerDifficulty[2];
  const delaySecondEachTry = 5;
  const browser = await playwright.chromium.launch({
    headless: true, // Show the browser.
    timeout: 1000 * (delaySecondEachTry * actionTries + 10),
  });
  const page = await browser.newPage();
  const diffName = KillerDifficulty[diffIndex];
  const json = await readJson(type);
  let currentPage = json[diffName];
  await takeScreenshot(currentPage);
  await saveJson(type, currentPage + 1, diffName);
  const count = await countFiles(type);
  return res.status(200).json({ done: "yes", count });
  async function takeScreenshot(currentPage: string) {
    console.log('takeScreenshot runs', currentPage)
    let urlObj = new URL(killerBaseUrl);
    urlObj.searchParams.set("d", String(diffIndex));
    urlObj.searchParams.set("t", "2");// 2 === killer
    urlObj.searchParams.set("p", currentPage);
    const url = urlObj.toString();
    await page.goto(url);
    await page.locator("body").screenshot({ path: `tmp/debug-test.png` });
    const getScreensArray = new Array(10).fill(0).map((_, i) => {
      const id = (Number(currentPage) - 1) * 10 + i + 1
      const filePath = `${folderKiller}/diff${diffName}-${id}.png`;
      return page.locator('.puzzle-board').nth(i).screenshot({ path: filePath });
    })
    await Promise.all(getScreensArray);
    console.log('takeScreenshot end', currentPage)
  }
}
