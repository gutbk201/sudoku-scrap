import { useMutation } from "@tanstack/react-query";
import { type NextPage } from "next";

const Home: NextPage = () => {
  
const apis=useApis(
  {onDownloadSuccess:(data)=>{
    const base64=data?.base64;
    return base64
    // if(base64) window.open(base64);
  }}
);
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const onGrab= ()=>{
    apis.grabSudoku.mutate();
  }
  const onDownload= ()=>{
    apis.download.mutate();
  }
  const imageUrl= apis.download.data?.base64
  return (
    <main className="m-2">
      <div>Sudoku Graber</div>
      <button onClick={onGrab} className="p-2 border-2 border-black">Grab</button>
      <button onClick={onDownload} className="p-2 border-2 border-black">Download</button>
      <div>
      {apis.grabSudoku.isLoading && "loading"}
        <div>Count: {apis.grabSudoku.isSuccess && apis.grabSudoku.data?.count||0}</div>
      </div>
      {imageUrl && <img src={imageUrl}/>}
    </main>
  );
};
function useApis(p:{onDownloadSuccess:((data: any, variables: void, context: unknown) => unknown) | undefined}){
  const apis={
    grabSudoku:useMutation({
      mutationFn: () => fetch('api/grabSuokus').then(r=>r.json()),
    }),
    download:useMutation({
      mutationFn: () => fetch('api/download').then(r=>r.json()),
      onSuccess:p.onDownloadSuccess
    })
  }
  return apis
}
export default Home;
