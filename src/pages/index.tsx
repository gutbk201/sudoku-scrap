import { Difficulty, RawDifficulty } from "~/utils/constant";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type NextPage } from "next";
import { IRawDifficulty } from "~/utils/types";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { ReactNode, useEffect, useState } from "react";
export function objectEntries<
  T extends Record<PropertyKey, unknown>,
  K extends keyof T,
  V extends T[K]
>(o: T) {
  return Object.entries(o) as [K, V][];
}
type Iinputs = {
  // type: string,
  times: number;
  diff: IRawDifficulty;
};
export function downloadBase64(name: string, url: string) {
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${name}.png`); //or any other extension
  document.body.appendChild(link);
  link.click();
}

// Define the endpoint URL
const endpoint = "/api/sudoku";
const sseEndpoint = "/api/sse";
const Home: NextPage = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      diff: Difficulty.normal,
      times: 12,
    },
  });
  const onGrab: SubmitHandler<Iinputs> = (data) => {
    if (apis.grabSudoku.isLoading) return;
    const params = { type: "classic", ...data };
    apis.grabSudoku.mutate(params);
  };
  const countApi = async () => {
    const res = await fetch("api/sudoku");
    return res.json();
  };
  const countRes = useQuery(["sudoku"], countApi);
  const apis = useApis({
    onDownloadSuccess: (data) => {
      const { base64, fileName } = data || {};
      downloadBase64(fileName, base64);
      countRes.refetch();
    },
    onGrabSuccess: () => {
      countRes.refetch();
    },
  });
  const onDownload = () => {
    apis.download.mutate();
  };
  // useEffect(() => {
  //   const eventSource = new EventSource(sseEndpoint);
  //   eventSource.onmessage = (event) => {
  //     const value = parseInt(event.data);
  //     console.log(value, event);
  //     if (value === 0) eventSource.close();
  //   };
  //   // eventSource.
  //   return () => {
  //     eventSource.close();
  //   };
  // }, []);

  const onTest = async () => {
    const eventSource = new EventSource(sseEndpoint);
    eventSource.onmessage = (event) => {
      const value = parseInt(event.data);
      console.log(value, event);
      if (value === 0) eventSource.close();
    };
  };
  const imageUrl = apis.download.data?.base64;
  const enableBtnGrab = apis.grabSudoku.isIdle || apis.grabSudoku.isSuccess;
  function LabelInput(p: { label: string; input: ReactNode }) {
    return (
      <div className="flex justify-between">
        <label className="max-w-2/5 flex-1 overflow-auto">{p.label}</label>
        <span className="max-w-2/5 flex-1 overflow-auto">{p.input}</span>
      </div>
    );
  }
  return (
    <main className="m-2">
      <div>Sudoku Graber</div>
      <Button text="Test" onClick={onTest} />
      <form
        onSubmit={handleSubmit(onGrab)}
        className="flex w-80 flex-col gap-y-2	border-2 border-solid p-4"
      >
        <LabelInput
          label="Times"
          input={
            <input
              type="number"
              step="6"
              min="6"
              {...register("times", { required: true })}
              className="w-full"
            />
          }
        />
        <LabelInput
          label="Difficulty"
          input={
            <select {...register("diff")} className="w-full">
              {objectEntries(RawDifficulty).map(([diff, value]) => (
                <option key={value} value={value}>
                  {diff}
                </option>
              ))}
            </select>
          }
        />
        {apis.grabSudoku.isLoading && <div>Loading...</div>}
        <div>Count: {countRes.data?.count || ""}</div>
        <input
          type="submit"
          className={`m-2 border-2 border-black p-2 opacity-${
            enableBtnGrab ? 100 : 50
          }`}
          value="Grab"
        />
        <Button text="Download" onClick={onDownload} />
      </form>
      <div className="bg-slate-200">{imageUrl && <img src={imageUrl} />}</div>
    </main>
  );
};
function Button(p: { onClick: any; text: string }) {
  return (
    <button onClick={p.onClick} className="m-2 border-2 border-black p-2">
      {p.text}
    </button>
  );
}

function useApis(p: {
  onDownloadSuccess:
    | ((data: any, variables: void, context: unknown) => unknown)
    | undefined;
  onGrabSuccess:
    | ((data: any, variables: void, context: unknown) => unknown)
    | undefined;
}) {
  const apis = {
    grabSudoku: useMutation<any, any, any>({
      mutationFn: (params: {
        times: number;
        diff: IRawDifficulty;
        type: "classic";
      }) => axios.post("api/sudoku", params),
      onSuccess: p.onGrabSuccess,
    }),
    download: useMutation({
      mutationFn: () => fetch("api/download").then((r) => r.json()),
      onSuccess: p.onDownloadSuccess,
    }),
  };
  return apis;
}
export default Home;
