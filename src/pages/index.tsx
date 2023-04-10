import { useMutation } from "@tanstack/react-query";
import { type NextPage } from "next";

export function downloadBase64(name: string, url: string) {
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${name}.png`); //or any other extension
  document.body.appendChild(link);
  link.click();
}
const Home: NextPage = () => {
  const apis = useApis(
    {
      onDownloadSuccess: (data) => {
        const { base64, fileName } = data || {};
        downloadBase64(fileName, base64)
      }
    }
  );
  const onGrab = () => {
    apis.grabSudoku.mutate();
  }
  const onDownload = () => {
    apis.download.mutate();
  }
  const imageUrl = apis.download.data?.base64
  const showBtnGrab = apis.grabSudoku.isIdle || apis.grabSudoku.isSuccess;
  return (
    <main className="m-2">
      <div>Sudoku Graber</div>
      {showBtnGrab && <button onClick={onGrab} className="p-2 m-2 border-2 border-black">Grab</button>}
      <button onClick={onDownload} className="p-2 m-2 border-2 border-black">Download</button>
      <div>
        {apis.grabSudoku.isLoading && "loading"}
        <div>Count: {apis.grabSudoku.isSuccess && apis.grabSudoku.data?.count || ""}</div>
      </div>
      <div className="bg-slate-200">
        {imageUrl && <img src={imageUrl} />}
      </div>
    </main>
  );
};
function useApis(p: { onDownloadSuccess: ((data: any, variables: void, context: unknown) => unknown) | undefined }) {
  const apis = {
    grabSudoku: useMutation({
      mutationFn: () => fetch('api/grabSudokus').then(r => r.json()),
    }),
    download: useMutation({
      mutationFn: () => fetch('api/download').then(r => r.json()),
      onSuccess: p.onDownloadSuccess
    })
  }
  return apis
}
export default Home;
