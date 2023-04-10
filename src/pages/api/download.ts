import { writeFile, readdir, rename } from 'node:fs/promises';
import mergeImages from 'merge-images';
const { Canvas, Image } = require('canvas');
import { NextApiResponse, NextApiRequest } from 'next'
import { readJson, saveJson } from '~/utils/helper';
import { folderGrab, folderUsed } from '~/utils/constant';

export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const dirRes = await readdir(folderGrab)
    const targetPaths = dirRes.slice().sort((a, b) => {
        const idA = Number(a.match(/\d+/));
        const idB = Number(b.match(/\d+/));
        return idA - idB
    }).slice(0, 6);
    if (targetPaths.length !== 6) return res.status(200).json({ done: 'no' })
    const gap = 40;
    const sizeLength = 300;
    const imagePaths = targetPaths.map((p, i) => {
        const xx = i % 3;
        const yy = i % 2;
        const x = sizeLength * xx + gap * (xx + 1);
        const y = 300 * yy + gap * (yy + 1);
        return { src: `${folderGrab}/${p}`, x, y }
    })
    const margeCofig = {
        Canvas: Canvas,
        Image: Image,
        width: sizeLength * 3 + 4 * gap,
        height: sizeLength * 2 + 3 * gap
    }
    const base64 = await mergeImages(imagePaths, margeCofig);
    const cache = await readJson();
    const diff = (dirRes[0]?.match(/^[^-]*/g) || [""])[0];
    const fileName = `sudoku-${diff}-${cache.sudoku}`;
    saveJson(cache.sudoku + 1, "sudoku");
    targetPaths.forEach((name) => rename(`${folderGrab}/${name}`, `${folderUsed}/${name}`))
    return res.status(200).json({ done: 'yes', base64, fileName })
}