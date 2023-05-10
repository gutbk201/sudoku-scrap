import { readdir, writeFile, readFile } from "node:fs/promises";
import { KillerDifficulty, folderSudoku, folderKiller } from "./constant";
interface IsudokuCache {
  easy: number;
  normal: number;
  hard: number;
  evil: number;
  id: number;
}
//example sudoku-cache.json
// {
//     "easy": 1,
//     "normal": 2,
//     "hard":5,
//     "evil": 6,
//     "sudoku":1
// }
type IkillerCache = typeof KillerDifficulty & { id: number };
const cachePath = {
  sudoku: "sudoku-cache.json",
  killer: "killer-cache.json",
};
export async function countFiles(type: "sudoku" | "killer") {
  const folder = type === "sudoku" ? folderSudoku : folderKiller;
  const files = await readdir(folder);
  return files.length;
}
// function makeDate(timestamp: number): Date;
export async function readJson(type: "sudoku"): Promise<IsudokuCache>;
export async function readJson(type: "killer"): Promise<IkillerCache>;
export async function readJson(type: "sudoku" | "killer") {
  let anyJson = {};
  let res;
  try {
    res = await readFile(cachePath[type], { encoding: "utf8" });
  } catch (err) {
    console.log("res = ", res);
    throw Error("res is Not Json");
  }
  if (typeof res !== "string") {
    console.log(typeof res, res);
    throw Error("read file fail, not string");
  }
  try {
    anyJson = JSON.parse(res);
  } catch (err) {
    console.log("res = ", res);
    throw Error("res is Not Json");
  }
  if (type === "sudoku") {
    if (!("id" in anyJson)) {
      console.log(anyJson);
      throw Error("Wrong sudoku cache format");
    }
    return anyJson as IsudokuCache;
  }
  if (type === "killer") {
    if (!("id" in anyJson)) {
      console.log(anyJson);
      throw Error("Wrong killer cache format");
    }
    return anyJson as IkillerCache;
  }
}
export async function saveJson(
  type: "sudoku" | "killer",
  id: string | number,
  key: string | number
) {
  const oldJson =
    type === "sudoku" ? await readJson(type) : await readJson(type);
  const json = JSON.stringify({ ...oldJson, [key]: id });
  try {
    await writeFile(cachePath[type], json);
  } catch (err) {
    console.log(err);
  }
}
