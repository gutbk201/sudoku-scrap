import { Difficulty } from '~/utils/constant';
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type NextPage } from "next";
import { useState } from 'react';
import { IRawDifficulty } from '~/utils/types';

export function downloadBase64(name: string, url: string) {
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${name}.png`); //or any other extension
  document.body.appendChild(link);
  link.click();
}
const Home: NextPage = () => {
  const [fields, setFields] = useState({ times: 12 });
  const countApi = async () => {
    const res = await fetch('api/sudoku')
    return res.json()
  }
  const countRes = useQuery(['sudoku'], countApi)
  const apis = useApis(
    {
      params: { type: 'classic', times: fields.times, diff: Difficulty.normal },
      onDownloadSuccess: (data) => {
        const { base64, fileName } = data || {};
        downloadBase64(fileName, base64)
        countRes.refetch();
      },
      onGrabSuccess: () => {
        countRes.refetch();
      }
    },
  );
  const onGrab = () => {
    if (apis.grabSudoku.isLoading) return;
    apis.grabSudoku.mutate();
  }
  const onDownload = () => {
    apis.download.mutate();
  }
  const imageUrl = apis.download.data?.base64
  const enableBtnGrab = apis.grabSudoku.isIdle || apis.grabSudoku.isSuccess;
  return (
    <main className="m-2">
      <div>Sudoku Graber</div>
      <input name="times" type="number" min="6" step="6" value={fields.times} onChange={e => setFields(f => ({ ...f, times: Number(e.target.value) }))} />
      <button onClick={onGrab} className={`opacity-${enableBtnGrab ? 100 : 50} p-2 m-2 border-2 border-black`}>Grab</button>
      <button onClick={onDownload} className="p-2 m-2 border-2 border-black">Download</button>
      {apis.grabSudoku.isLoading && <div>Loading...</div>}
      <div>Count: {countRes.data?.count || ""}</div>
      <div className="bg-slate-200">
        {imageUrl && <img src={imageUrl} />}
      </div>
    </main>
  );
};
function useApis(p:
  {
    params: { times: number, diff: IRawDifficulty, type: 'classic' }
    onDownloadSuccess: ((data: any, variables: void, context: unknown) => unknown) | undefined,
    onGrabSuccess: ((data: any, variables: void, context: unknown) => unknown) | undefined,
  }
) {
  const { params } = p;
  const apis = {
    // grabSudoku: useMutation({
    //   mutationFn: () => fetch('api/grabSudokus').then(r => r.json()),
    //   onSuccess: p.onGrabSuccess
    // }),
    grabSudoku: useMutation({
      mutationFn: () => axios.post('api/sudoku', { type: params.type, times: params.times, diff: params.diff }),
      onSuccess: p.onGrabSuccess
    }),
    download: useMutation({
      mutationFn: () => fetch('api/download').then(r => r.json()),
      onSuccess: p.onDownloadSuccess
    })
  }
  return apis
}
export default Home;
