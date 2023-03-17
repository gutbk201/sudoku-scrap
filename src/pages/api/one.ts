import { NextApiResponse, NextApiRequest } from 'next'
import playwright from 'playwright'
// import { people } from '../../../data'
// import { Person } from '../../../interfaces'
export default async function handler(
    _req: NextApiRequest,
    //   res: NextApiResponse<Person[]>
    res: NextApiResponse<any>
) {
    const browser = await playwright.chromium.launch({
        headless: true // Show the browser. 
    });

    const page = await browser.newPage();
    await page.goto('https://books.toscrape.com/');
    // await page.locator("#puzzle_grid").screenshot({ path: "./a_picture.png" });
    await page.locator("body").screenshot({ path: "./a_picture.png" });
    // await page.waitForTimeout(1000); // wait for 1 seconds
    await browser.close();


    return res.status(200).json({ a: 1 })
}