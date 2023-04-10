import { writeFile } from 'node:fs/promises';
import mergeImages from 'merge-images';
// import { Canvas, Image } from 'canvas';
const { Canvas, Image } = require('canvas');
import { countFiles, readJson, saveJson, delay } from '~/utils/helper'
import { NextApiResponse, NextApiRequest } from 'next'

export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse<any>
) {
    //merge 6images
    // mergeImages
    const gap = 40;
    const imagesPath = [
        { src: 'tmp/normal-57.png', x: 0 + gap, y: 0 + gap },
        { src: 'tmp/normal-58.png', x: 300 + gap * 2, y: 0 + gap },
        { src: 'tmp/normal-59.png', x: 600 + gap * 3, y: 0 + gap },
        { src: 'tmp/normal-61.png', x: 0 + gap, y: 300 + gap * 2 },
        { src: 'tmp/normal-62.png', x: 300 + gap * 2, y: 300 + gap * 2 },
        { src: 'tmp/normal-63.png', x: 600 + gap * 3, y: 300 + gap * 2 },
    ];
    const margeCofig = {
        Canvas: Canvas,
        Image: Image,
        width: 900 + 4 * gap,
        height: 600 + 3 * gap
    }
    const base64 = await mergeImages(imagesPath, margeCofig);
    try {
        await writeFile('public/merged.png', base64);
    } catch (err) {
        console.log(err);
    }
    // fs.writeFileSync(file,base64Image);
    return res.status(200).json({ done: 'yes', base64 })
}
console.log('testing')