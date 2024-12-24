"use client";

import { FetchStatus } from "./_hooks/useFetch";
import useGetRemoteDataAndFindHiddenURL from "./_hooks/useGetRemoteDataAndFindHiddenURL";
import { useEffect, useState } from "react";

export default function Home() {
  const { fetch, fetchStatus, hiddenURL } = useGetRemoteDataAndFindHiddenURL();
  const [displayChars, setDisplayChars] = useState<Array<string>>();
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (hiddenURL) {
      setDisplayChars(hiddenURL.split(""));
      setCurrentCharIndex(0);

      (async () => {
        for (let i = 0; i < hiddenURL.length; i++) {
          console.log("wait");
          await new Promise((resolve) => setTimeout(resolve, 500));

          setCurrentCharIndex(i + 1);
        }
        console.log("and done");
      })();
    }
  }, [hiddenURL]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {fetchStatus === FetchStatus.Pending && "Loading..."}
      {displayChars &&
        "Hidden URL: " + displayChars.slice(0, currentCharIndex).join("")}
      {displayChars && (
        <ul>
          {displayChars.slice(0, currentCharIndex).map((char, index) => {
            return <li key={index}>{char}</li>;
          })}
        </ul>
      )}
    </div>
  );
}
