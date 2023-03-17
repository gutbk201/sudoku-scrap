import { RawDifficulty } from './constant';
import * as fs from 'fs';
interface Icache {
    easy: number;
    normal: number;
    hard: number;
    evil: number;
}
//example cache.json
// {
//     "easy": 1,
//     "normal": 2,
//     "hard":5,
//     "evil": 6
// }
const cacheFile = "cache.json";
export async function readJson() {
    const p = new Promise(r => {
        fs.readFile(cacheFile, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            r(data)
        });
    })
    let anyJson = {};
    const res = await p;
    if (typeof res === "string") {
        try {
            anyJson = JSON.parse(res);
        } catch (err) {
            console.log("res = ", res)
            throw Error('res is Not Json')
        }
    }
    if (!('easy' in anyJson)) {
        console.log(anyJson)
        throw Error('Wrong cache format')
    }
    const json = anyJson as {
        easy: number,
        normal: number,
        hard: number,
        evil: number,
    }
    return json
}
export async function saveJson(id: string | number, diff: keyof typeof RawDifficulty) {
    const oldJson = await readJson();
    const json = JSON.stringify({ ...oldJson, [diff]: id })
    try {
        await fs.writeFile(cacheFile, json, () => { });
    } catch (err) {
        console.log(err);
    }
}
export function delay(second: number) {
    return new Promise(r => setTimeout(r, second * 1000))
}