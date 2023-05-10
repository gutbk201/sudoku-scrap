import { readdir, rename } from "node:fs/promises";
import mergeImages from "merge-images";
const { createCanvas, Canvas, Image } = require("canvas");
import { NextApiResponse, NextApiRequest } from "next";
import { readJson, saveJson } from "~/utils/server-helper";
import { folderKiller, folderSudoku, folderUsed } from "~/utils/constant";
import { IRawKillerDifficulty } from "~/utils/types";
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // const bodyParams = _req.body as { type: "sudoku" | "killer" };
  // const type = bodyParams?.type || "sudoku";
  const { type = "sudoku", ...rest } = _req.body;
  const { base64, fileName } =
    type === "sudoku" ? await mergeSudoku() : await mergeKiller(rest?.diff);

  return res.status(200).json({ done: "yes", base64, fileName });
}
function nameToBase64(name: string) {
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext("2d");
  ctx.font = "16px Impact";
  ctx.fillText(name, 15, 20);
  return canvas.toDataURL();
}
const folders = { sudoku: folderSudoku, killer: folderKiller };
async function mergeSudoku() {
  const type = "sudoku";
  const theFolder = folders[type];
  const dirRes = await readdir(theFolder);
  const targetPaths = dirRes
    .slice()
    .sort((a, b) => {
      const idA = Number(a.match(/\d+/));
      const idB = Number(b.match(/\d+/));
      return idA - idB;
    })
    .slice(0, 6);
  const gap = 40;
  const sizeLength = 300;
  const cache = await readJson(type);
  const diff = (dirRes[0]?.match(/^[^-]*/g) || [""])[0];
  const shortName = `${diff.slice(0, 1).toUpperCase()}-${cache.id}`;
  const nameBase64 = nameToBase64(shortName);
  const imagePaths = targetPaths
    .map((p, i) => {
      const xx = i % 3;
      const yy = i % 2;
      const x = sizeLength * xx + gap * (xx + 1);
      const y = sizeLength * yy + gap * (yy + 1);
      return { src: `${theFolder}/${p}`, x, y };
    })
    .concat({ src: nameBase64, x: 0, y: 0 });
  const margeCofig = {
    Canvas,
    Image: Image,
    width: sizeLength * 3 + 4 * gap,
    height: sizeLength * 2 + 3 * gap,
  };
  const base64 = await mergeImages(imagePaths, margeCofig);
  const fileName = `${type}-${diff}-${cache.id}`;
  saveJson(type, cache.id + 1, type);
  targetPaths.forEach((name) =>
    rename(`${theFolder}/${name}`, `${folderUsed}/${type}/${name}`)
  );
  return { base64, fileName };
}
async function mergeKiller(diff: IRawKillerDifficulty) {
  const type = "killer";
  const theFolder = folders[type];
  const dirRes = await readdir(theFolder);
  const targetPaths = dirRes
    .slice()
    .sort((a, b) => {
      const idA = Number(a.match(/\d+/));
      const idB = Number(b.match(/\d+/));
      return idA - idB;
    })
    .slice(0, 6);
  const gap = 40;
  const sizeLength = 450;
  const cache = await readJson(type);
  const shortName = `D${diff}-${cache.id}`;
  const nameBase64 = nameToBase64(shortName);
  const imagePaths = targetPaths
    .map((p, i) => {
      const xx = i % 3;
      const yy = i % 2;
      const x = sizeLength * xx + gap * (xx + 1);
      const y = sizeLength * yy + gap * (yy + 1);
      return { src: `${theFolder}/${p}`, x, y };
    })
    .concat({ src: nameBase64, x: 0, y: 0 });
  const margeCofig = {
    Canvas,
    Image: Image,
    width: sizeLength * 3 + 4 * gap,
    height: sizeLength * 2 + 3 * gap,
  };
  const base64 = await mergeImages(imagePaths, margeCofig);
  const fileName = `${type}-${diff}-${cache.id}`;
  saveJson(type, cache.id + 1, type);
  targetPaths.forEach((name) =>
    rename(`${theFolder}/${name}`, `${folderUsed}/${type}/${name}`)
  );
  return { base64, fileName };
}
