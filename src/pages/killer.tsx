import { KillerDifficulty } from "~/utils/constant";
import { IRawKillerDifficulty } from "~/utils/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type NextPage } from "next";
import { useForm, SubmitHandler } from "react-hook-form";
import { ReactNode, useEffect } from "react";
import { downloadBase64, objectEntries } from "~/utils/helper";

type Iinputs = {
  times: number;
  diff: IRawKillerDifficulty;
};
const endpoint = "api/killer";
const Killer: NextPage = () => {
  const { register, handleSubmit, getValues, watch } = useForm({
    defaultValues: {
      diff: KillerDifficulty[2],
      times: 10,
    },
  });
  const onGrab: SubmitHandler<Iinputs> = (data) => {
    if (isFetching) return;
    apis.grabKiller.mutate(data);
  };
  const diff = watch('diff');
  const countApi = async () => {
    const url = new URL(`${window.location.href}${endpoint}`)
    const params = { diff: getValues().diff }
    url.search = new URLSearchParams(params as any).toString();
    const res = await fetch(url);
    return res.json();
  };
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

  const countRes = useQuery(["killer", diff], countApi, {
    refetchInterval: 1000 * 30,
    // enabled: apis.grabKiller.isLoading,
  });
  useEffect(() => {
    countRes.refetch();
  }, []);
  const onDownload = () => {
    apis.download.mutate({ diff: getValues().diff });
  };
  const imageUrl = apis.download.data?.base64;
  const enableBtnGrab = apis.grabKiller.isIdle || apis.grabKiller.isSuccess;
  function LabelInput(p: { label: string; input: ReactNode }) {
    return (
      <div className="flex justify-between">
        <label className="max-w-2/5 flex-1 overflow-auto">{p.label}</label>
        <span className="max-w-2/5 flex-1 overflow-auto">{p.input}</span>
      </div>
    );
  }
  const isFetching = apis.grabKiller.isLoading || apis.download.isLoading;
  return (
    <main className="m-2">
      <div className="text-lg	">Killer Graber</div>
      <div className="m-auto flex w-80 flex-col	gap-y-2 border-2 border-solid p-4">
        <form onSubmit={handleSubmit(onGrab)}>
          <LabelInput
            label="Difficulty"
            input={
              <select {...register("diff")} className="w-full">
                {objectEntries(KillerDifficulty).map(([diff, value]) => (
                  <option key={value} value={value}>
                    {diff}
                  </option>
                ))}
              </select>
            }
          />
          {apis.grabKiller.isLoading && <div>Loading...</div>}
          <div>Count: {countRes.data?.count ?? ""}</div>
          <Button
            text="Grab"
            onClick={() => { }}
            disabled={!enableBtnGrab}
            className={`w-full opacity-${enableBtnGrab ? 100 : 50}`}
          />
        </form>
        {apis.grabKiller.isIdle}
        {apis.grabKiller.isSuccess}
        <Button text="Download" onClick={onDownload} disabled={isFetching} />
      </div>
      <div className="bg-slate-200">{imageUrl && <img src={imageUrl} />}</div>
    </main>
  );
};
function Button(p: {
  onClick: any;
  text: string;
  disabled: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={p.onClick}
      className={`mb-2 border-2 border-black p-2 ${p.className}`}
      disabled={p.disabled}
    >
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
    grabKiller: useMutation<any, any, any>({
      mutationFn: (params: {
        times: number;
        diff: keyof typeof KillerDifficulty;
      }) => axios.post(endpoint, params),
      onSuccess: p.onGrabSuccess,
    }),
    download: useMutation<any, any, any>({
      mutationFn: async (params: { diff: keyof typeof KillerDifficulty }) => {
        const res = await axios.post<any, any>("api/download", {
          type: "killer",
          diff: params.diff,
        });
        return res.data;
      },
      onSuccess: p.onDownloadSuccess,
    }),
  };
  return apis;
}
export default Killer;
