import { Difficulty, baseUrl } from '~/utils/constant';
import { countFiles, readJson, saveJson, delay } from '~/utils/helper'
import { NextApiResponse, NextApiRequest } from 'next'
import playwright from 'playwright'

const actionTries = 2;
const diffIndex = Difficulty.normal
export default async function handler(
    _req: NextApiRequest,
    //   res: NextApiResponse<Person[]>
    res: NextApiResponse<any>
) {
    const browser = await playwright.chromium.launch({
        headless: true // Show the browser. 
    });
    const page = await browser.newPage();
    //grab 10*12 sudokus and stop
    //return numbers
    // if (await countFiles() >= 6) {
    //     //return merge 1 image
    //     console.log('will merge into 1 image')
    // } else {
    // await takeManyScreenshot(12);

    //     //return grab 12 image and check again
    // }

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
        const filePath = `tmp/${diffName}-${id}.png`;
        await page.goto(url);
        await page.locator("#puzzle_grid").screenshot({ path: filePath });
    }
}