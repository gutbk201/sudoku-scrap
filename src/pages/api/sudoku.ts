import {
  SudokuDifficulty,
  sudokuBaseUrl,
  folderSudoku,
} from "~/utils/constant";
import playwright from "playwright";
import { NextApiResponse, NextApiRequest } from "next";
import { countFiles, readJson, saveJson } from "~/utils/server-helper";
import { delay } from "~/utils/helper";
import { IRawSudokuDifficulty } from "~/utils/types";

const type = "sudoku";
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<{ done: "yes" | "no"; count?: number }>
) {
  if (_req.method === "GET")
    return res.status(200).json({ done: "yes", count: await countFiles(type) });
  if (_req.method === "POST") return grabSudoku(_req, res);
  return res.status(200).json({ done: "no" });
}
async function grabSudoku(_req: NextApiRequest, res: NextApiResponse<any>) {
  const bodyParams = _req.body as { times: number; diff: IRawSudokuDifficulty };
  const actionTries = Number(bodyParams?.times || 12);
  //limit below 50 per hour
  const diffIndex = bodyParams?.diff || SudokuDifficulty.normal;
  const delaySecondEachTry = 120;
  const browser = await playwright.chromium.launch({
    headless: true, // Show the browser.
    timeout: 1000 * (delaySecondEachTry * actionTries + 10),
  });
  const page = await browser.newPage();
  const diffName = SudokuDifficulty[diffIndex];
  const json = await readJson(type);
  let currentId = json[diffName];
  await takeManyScreenshot(actionTries);
  const count = await countFiles(type);
  return res.status(200).json({ done: "yes", count });
  async function takeManyScreenshot(times: number, cur = 0) {
    if (cur === times)
      return console.log("done", new Date().toLocaleTimeString());
    console.log(`handling sudoku batch ${cur + 1}/${times}`);
    await delay(delaySecondEachTry);
    await takeScreenshot(currentId++);
    await saveJson(type, currentId, diffName);
    await takeManyScreenshot(times, cur + 1);
    return true;
  }
  async function takeScreenshot(_id: number) {
    const id = String(_id);
    let urlObj = new URL(sudokuBaseUrl);
    urlObj.searchParams.set("level", diffIndex);
    urlObj.searchParams.set("set_id", id);
    const url = urlObj.toString();
    const filePath = `${folderSudoku}/${diffName}-${id}.png`;
    await page.goto(url);
    await page.locator("body").screenshot({ path: `tmp/debug-test.png` });
    await page.locator("#puzzle_grid").screenshot({ path: filePath });
  }
}
