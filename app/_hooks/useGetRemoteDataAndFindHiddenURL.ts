import useFetch from "./useFetch";
import { useEffect, useState } from "react";

function isPatternMatch(node: Element): RegExpMatchArray | null {
  console.log("node:", node);
  const htmlString = node.outerHTML;
  console.log(htmlString);

  const pattern = new RegExp(
    `<code .*data-class="23.*".*>` +
      `.*` +
      `<div .*data-tag=".*93".*>` +
      `.*` +
      `<span .*data-id=".*21.*".*>` +
      `.*` +
      `(<i .*class=".*\s*char\s*.*">)` +
      `.*` +
      `</i>` +
      `.*` +
      `</span>` +
      `.*` +
      `</div>` +
      `.*` +
      `</code>`,
    "is",
  );

  return htmlString.match(pattern);
}

function parseHTML(htmlText: string): Array<RegExpMatchArray> {
  const parser = new DOMParser();

  const document = parser.parseFromString(htmlText, "text/html");

  const matchedChars = [];
  const nodes = document.body.children;
  for (let i = 0; i < nodes.length; i++) {
    const match = isPatternMatch(nodes[i]);

    if (match) matchedChars.push(match);
  }

  return matchedChars;
}

export default function useGetRemoteDataAndFindHiddenURL() {
  const {
    fetch,
    data: fetchData,
    fetchStatus,
  } = useFetch({
    method: "GET",
    url: "https://tns4lpgmziiypnxxzel5ss5nyu0nftol.lambda-url.us-east-1.on.aws/challenge",
  });

  const [data, setData] = useState<JSON | string>();

  useEffect(() => {
    if (fetchData) {
      if (fetchData instanceof Blob) {
        (async () => {
          const fetchDataText = await fetchData.text();

          setData(fetchDataText);

          const match = parseHTML(fetchDataText);
          console.log(match);
        })();
      } else {
        setData(fetchData);
      }
    }
  }, [fetchData, setData]);

  return { fetch, data, fetchStatus };
}
