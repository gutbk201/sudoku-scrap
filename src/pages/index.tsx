import { useMutation } from "@tanstack/react-query";
import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useState } from "react";

const Home: NextPage = () => {
  const [data, setData]=useState({});
  const apiPost = useMutation({
    mutationFn: () => fetch('api/one').then(r=>r.json()),
  })
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const onTest= ()=>{
    apiPost.mutate();
    // api.example.hello

    // fetch('api/one')
    // .then(response => response.json())
    // .then(setData);
  }
  return (
    <>
      <div>Hello World</div>
      <button onClick={onTest}>test</button>
      <div>
      {apiPost.isLoading && "loading"}
      {apiPost.isSuccess && 'done'}
      </div>
    </>
  );
};

export default Home;
