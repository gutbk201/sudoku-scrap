import { Difficulty, baseUrl } from '~/utils/constant';
import { readJson, saveJson, delay } from '~/utils/helper'
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



    // await page.goto('https://books.toscrape.com/');
    // await page.locator("body").screenshot({ path: "./a_picture.png" });
    // await browser.close();
    return res.status(200).json({ done: 'yes' })
}