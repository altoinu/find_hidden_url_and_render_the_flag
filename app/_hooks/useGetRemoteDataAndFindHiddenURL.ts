import useFetch from "./useFetch";
import { useEffect, useState } from "react";

function isJSON(data: JSON | string): boolean {
  if (typeof data === "string") {
    try {
      JSON.parse(data);
      return true;
    } catch {
      return false;
    }
  } else {
    return true;
  }
}

/**
 * Checks to see if specified HTML element node matches the pattern.
 * @param node HTML element node to check
 * @returns RegExpMatchArray if match, otherwise null
 */
function isPatternMatch(node: Element): RegExpMatchArray | null {
  const htmlString = node.outerHTML;

  // Regular expression to match pattern
  // <code> with data-class="23...." at top
  // <div> with data-tag="...93" as a child
  // <span> with data-id="...21..." as child under it
  // <i> with "char" as one of class
  const pattern = new RegExp(
    `<code .*data-class="23.*".*>` +
      `.*` +
      `<div .*data-tag=".*93".*>` +
      `.*` +
      `<span .*data-id=".*21.*".*>` +
      `.*` +
      `(<i .*class=".*\s*char\s*.*">` +
      `.*` +
      `</i>)` +
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
/**
 * Parse HTML then find child node inside body that matchces pattern specified
 * in isPatternMatch function.
 * @param htmlText HTML document in string
 * @returns Array of RegExpMatchArray's
 */
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

function getValue(htmlElement: string): string | null {
  const parser = new DOMParser();
  const document = parser.parseFromString(htmlElement, "text/html");
  const element = document.body.firstChild as HTMLElement;

  return element.getAttribute("value");
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

  const [htmldata, setHTMLData] = useState<string>();
  const [hiddenURL, setHiddenURL] = useState<string>();

  useEffect(() => {
    if (fetchData) {
      if (fetchData instanceof Blob) {
        (async () => {
          const fetchDataText = await fetchData.text();
          setHTMLData(fetchDataText);
        })();
      } else if (isJSON(fetchData)) {
        setHTMLData(JSON.stringify(fetchData));
      } else {
        setHTMLData(fetchData as string);
      }
    }
  }, [fetchData]);

  useEffect(() => {
    if (htmldata) {
      const matchedChars = parseHTML(htmldata);

      if (matchedChars) {
        let hiddenURL = "";

        matchedChars.forEach((match) => {
          if (match.length > 1) {
            hiddenURL += getValue(match[1]) || "";
          }
        });

        setHiddenURL(hiddenURL);
      }
    }
  }, [htmldata]);

  return { fetch, fetchStatus, hiddenURL };
}
