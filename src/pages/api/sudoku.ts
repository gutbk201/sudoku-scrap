import { Difficulty, baseUrl, folderGrab } from '~/utils/constant';
import playwright from 'playwright'
import { NextApiResponse, NextApiRequest } from 'next'
import { countFiles, readJson, saveJson, delay } from '~/utils/helper'
import { IRawDifficulty } from '~/utils/types';

export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse<{ done: 'yes' | 'no', count?: number }>
) {
    if (_req.method === 'GET') return res.status(200).json({ done: 'yes', count: await countFiles() })
    if (_req.method === 'POST') return grabSudoku(_req, res);
    return res.status(200).json({ done: 'no' })
}
async function grabSudoku(
    _req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const bodyParams = _req.body as { times: number, diff: IRawDifficulty }
    const actionTries = Number(bodyParams?.times || 12);
    const diffIndex = bodyParams?.diff || Difficulty.normal;
    const browser = await playwright.chromium.launch({
        headless: true // Show the browser. 
    });
    const page = await browser.newPage();
    const diffName = Difficulty[diffIndex];
    const json = await readJson()
    let currentId = json[diffName];
    const delaySecond = 0.5;
    await takeManyScreenshot(actionTries)
    const count = await countFiles();
    return res.status(200).json({ done: 'yes', count })
    async function takeManyScreenshot(times: number, cur = 0) {
        if (cur === times) return console.log('done', new Date().toLocaleTimeString());
        console.log(`handling batch ${cur + 1}/${times}`)
        await delay(delaySecond);
        await takeScreenshot(currentId++);
        await saveJson(currentId, diffName);
        await takeManyScreenshot(times, cur + 1);
        return true
    }
    async function takeScreenshot(_id: number) {
        const id = String(_id);
        let urlObj = new URL(baseUrl);
        urlObj.searchParams.set('level', diffIndex)
        urlObj.searchParams.set('set_id', id)
        const url = urlObj.toString();
        const filePath = `${folderGrab}/${diffName}-${id}.png`;
        await page.goto(url);
        await page.locator("#puzzle_grid").screenshot({ path: filePath });
    }
}