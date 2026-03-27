import { mockURLs } from "./mockURLs.ts";

interface URLCheckResult {
  url: string;
  isFile: boolean;
  isFolder: boolean;
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

// TODO: Implement URL checking logic
// 1. Check if URL exists in the mockURLs array.
// 2. Check if url is a file path or a folder path.
// 3. Return a promise that resolves with the URL and its status (valid or invalid)
export function urlChecker(url: string): Promise<URLCheckResult> {
  const urlSet = new Set(mockURLs);
  console.log("URL Set: ", urlSet);

  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    console.log(`Checking URL: ${urlObj}`);

    if (!urlSet.has(url)) {
      return reject({ url, isFile: false, isFolder: false });
    }

    resolve({ url, isFile: isFile(urlObj.pathname), isFolder: isDir(urlObj.pathname) });
  });
}

// async function main() {
//   try {
//     const response: URLCheckResult = await urlChecker("http://example.com/maybe.someone.did.this/");
//     console.log(response);
//   } catch (error) {
//     console.error(error);
//   }
// }

// main();
