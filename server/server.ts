import { mockURLs } from "./mockURLs.ts";

const urlSet = new Set(mockURLs);

export interface URLCheckResult {
  url: string;
  status: "found" | "not_found" | "error";
  isFile?: boolean;
  isFolder?: boolean;
  error?: string;
}
function isFile(pathname: string): boolean {
  const lastSegment = pathname.split("/").pop();
  if (lastSegment && lastSegment.indexOf(".") > -1) {
    return true;
  }
  return false;
}

function isDir(pathname: string): boolean {
  return !isFile(pathname);
}

function throttle(cb: (url: string) => Promise<URLCheckResult>, delay = 1000): (url: string) => Promise<URLCheckResult> | undefined {
  let shouldWait = false;
  let waitingArgs: string | null = null;
  let waitingResolve: ((value: URLCheckResult) => void) | null = null;
  let waitingReject: ((reason: URLCheckResult) => void) | null = null;

  const timerFunc = () => {
    console.log("Inside timerFunc, shouldWait : ", shouldWait, "waitingArgs : ", waitingArgs);
    if (waitingArgs === null) {
      shouldWait = false;
    } else {
      cb(waitingArgs).then(waitingResolve!).catch(waitingReject!);
      waitingArgs = null;
      waitingResolve = null;
      waitingReject = null;
      waitingArgs = null;
      setTimeout(timerFunc, delay);
    }
  };

  return (url: string): Promise<URLCheckResult> | undefined => {
    console.log("Inside throttled function, shouldWait : ", shouldWait, "url : ", url);
    if (shouldWait) {
      waitingArgs = url;
      return new Promise((resolve, reject) => {
        waitingResolve = resolve;
        waitingReject = reject;
      });
    }

    shouldWait = true;
    setTimeout(timerFunc, delay);
    return cb(url);
  };
}

// TODO: Implement URL checking logic
// 1. Check if URL exists in the mockURLs array.
// 2. Check if url is a file path or a folder path.
// 3. Return a promise that resolves with the URL and its status (valid or invalid)
const throttledCheck = throttle((url: string): Promise<URLCheckResult> => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url.trim());
    console.log(`Checking URL: ${urlObj}`);

    if (!urlSet.has(url)) {
      return reject({ url, status: "not_found", isFile: false, isFolder: false });
    }

    const isFileResult = isFile(urlObj.pathname);
    const isFolderResult = isDir(urlObj.pathname);

    console.log({ isFileResult, isFolderResult });
    resolve({ url, status: "found", isFile: isFileResult, isFolder: isFolderResult });
  });
}, 1000);

export function getURLStatus(url: string): Promise<URLCheckResult> {
  const result = throttledCheck(url);
  console.log({ result });
  if (!result) {
    return Promise.reject({ url, status: "error", error: "Throttled, try again later" });
  }
  return result;
}

// async function main() {
//   try {
//     const response: URLCheckResult = await getURLStatus("http://example.com/maybe.someone.did.this/");
//     console.log(response);
//   } catch (error) {
//     console.error(error);
//   }
// }

// main();
