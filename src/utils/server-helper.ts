import { readdir, writeFile, readFile } from "node:fs/promises";
import { SudokuRawDifficulty, folderGrab } from "./constant";
interface Icache {
  easy: number;
  normal: number;
  hard: number;
  evil: number;
  sudoku: number;
}
//example cache.json
// {
//     "easy": 1,
//     "normal": 2,
//     "hard":5,
//     "evil": 6,
//     "sudoku":1
// }
const cachePath = {
  sudoku: "sudoku-cache.json",
  killer: "killer-cache.json",
};
export async function countFiles() {
  const files = await readdir(folderGrab);
  return files.length;
}
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
  if (!("easy" in anyJson)) {
    console.log(anyJson);
    throw Error("Wrong cache format");
  }
  const json = anyJson as Icache;
  return json;
}
export async function saveJson(
  type: "sudoku" | "killer",
  id: string | number,
  key: keyof typeof SudokuRawDifficulty | "sudoku"
) {
  const oldJson = await readJson(type);
  const json = JSON.stringify({ ...oldJson, [key]: id });
  try {
    await writeFile(cachePath[type], json);
  } catch (err) {
    console.log(err);
  }
}
