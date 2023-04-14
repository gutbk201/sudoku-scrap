import { NextApiResponse, NextApiRequest } from "next";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<{ done: "yes" | "no"; count?: number }>
) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Content-Encoding": "none", // important for calling everyone second
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  countdown(res, 5);

  function countdown(res: NextApiResponse, count: number) {
    console.log({ count });
    res.write("data: " + count + "\n\n");
    if (count) setTimeout(() => countdown(res, count - 1), 1000);
    else res.end();
  }
}
