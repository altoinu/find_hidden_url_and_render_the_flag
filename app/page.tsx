"use client";

import { FetchStatus } from "./_hooks/useFetch";
import useGetRemoteDataAndFindHiddenURL from "./_hooks/useGetRemoteDataAndFindHiddenURL";
import { useEffect } from "react";

export default function Home() {
  const { fetch, fetchStatus, hiddenURL } = useGetRemoteDataAndFindHiddenURL();

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {fetchStatus === FetchStatus.Pending && "Loading..."}
      {hiddenURL && "Hidden URL: " + hiddenURL}
    </div>
  );
}
