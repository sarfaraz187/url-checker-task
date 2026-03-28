import { mockURLs } from "./mockURLs.ts";

export interface URLCheckResult {
  url: string;
  isFile: boolean;
  isFolder: boolean;
  error?: {
    message: string;
  };
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

function throttle<Args extends unknown[]>(cb: (...args: Args) => void, delay = 1000): (...args: Args) => void {
  let shouldWait = false;
  let waitingArgs: Args | null = null;

  const timerFunc = () => {
    if (waitingArgs === null) {
      shouldWait = false;
    } else {
      cb(...waitingArgs);
      waitingArgs = null;
      setTimeout(timerFunc, delay);
    }
  };

  return (...args: Args): void => {
    if (shouldWait) {
      waitingArgs = args;
      return;
    }
    cb(...args);
    shouldWait = true;
    setTimeout(timerFunc, delay);
  };
}

// TODO: Implement URL checking logic
// 1. Check if URL exists in the mockURLs array.
// 2. Check if url is a file path or a folder path.
// 3. Return a promise that resolves with the URL and its status (valid or invalid)
const urlSet = new Set(mockURLs); // also move this out, no need to rebuild every call

const throttledCheck = throttle((url: string): Promise<URLCheckResult> => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    console.log(`Checking URL: ${urlObj}`);

    if (!urlSet.has(url)) {
      return reject({ url, isFile: false, isFolder: false });
    }

    resolve({ url, isFile: isFile(urlObj.pathname), isFolder: isDir(urlObj.pathname) });
  });
}, 1000);

export function getURLStatus(url: string): Promise<URLCheckResult> {
  return { url: url, isFile: false, isFolder: false };
  // return throttledCheck(url);
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
