import { readdir, writeFile, readFile } from 'node:fs/promises';
import { RawDifficulty } from './constant';
import * as fs from 'fs';
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
//      "sudoku":1
// }
const cachePath = "cache.json";
export async function countFiles() {
    const files = await readdir('tmp')
    return files.length
}
export async function readJson() {
    let anyJson = {};
    let res;
    try {
        res = await readFile(cachePath, { encoding: 'utf8' });
    } catch (err) {
        console.log("res = ", res)
        throw Error('res is Not Json')
    }
    // const res = await readFile(cachePath, { encoding: 'utf8' });
    if (typeof res !== "string") {
        console.log(typeof res, res)
        throw Error("read file fail, not string")
    }
    try {
        anyJson = JSON.parse(res);
    } catch (err) {
        console.log("res = ", res)
        throw Error('res is Not Json')
    }
    if (!('easy' in anyJson)) {
        console.log(anyJson)
        throw Error('Wrong cache format')
    }
    const json = anyJson as Icache
    return json
}
export async function saveJson(id: string | number, diff: keyof typeof RawDifficulty) {
    const oldJson = await readJson();
    const json = JSON.stringify({ ...oldJson, [diff]: id })
    try {
        await writeFile(cachePath, json);
    } catch (err) {
        console.log(err);
    }
}
export function delay(second: number) {
    return new Promise(r => setTimeout(r, second * 1000))
}
export function downloadBase64(name: string, url: string) {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${name}.png`); //or any other extension
    document.body.appendChild(link);
    link.click();
}
export function some() {
    return 'some'
}