import { KillerDifficulty, sudokuBaseUrl, folderGrab } from "~/utils/constant";
import playwright from "playwright";
import { NextApiResponse, NextApiRequest } from "next";
import { countFiles, readJson, saveJson } from "~/utils/server-helper";
import { delay } from "~/utils/helper";

type IRawDifficulty = keyof typeof KillerDifficulty;
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<{ done: "yes" | "no"; count?: number }>
) {
  if (_req.method === "GET")
    return res.status(200).json({ done: "yes", count: await countFiles() });
  if (_req.method === "POST") return grabKiller(_req, res);
  return res.status(200).json({ done: "no" });
}
async function grabKiller(_req: NextApiRequest, res: NextApiResponse<any>) {

}
