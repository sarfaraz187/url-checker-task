import { Input } from "@/components/ui/input";
import "@/App.css";
import { useEffect, useState } from "react";
import { getURLStatus } from "../server/server.ts";
import type { URLCheckResult } from "../server/server.ts";

function App() {
  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [urlCheckResult, setUrlCheckResult] = useState<null | URLCheckResult>(null);

  useEffect(() => {
    console.clear();
    console.log("URL or validity changed: ", { url, isValidUrl });

    if (isValidUrl && url.length > 0) {
      const response = getURLStatus(url);
      response
        .then((result) => {
          console.log("URL Check Result: ", result);
          setUrlCheckResult(result);
        })
        .catch((error) => {
          console.log("Error checking URL: ", error);
          setUrlCheckResult(error);
        });
    }
  }, [isValidUrl, url]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setUrl(url);

    const isValid = url.startsWith("http://") || url.startsWith("https://");
    setIsValidUrl(url.length > 0 && isValid);
  };

  return (
    <main className="flex flex-col gap-4 p-4 mx-22">
      <h1 className="flex justify-center">
        <b>URL Checker</b>
      </h1>

      <Input className="" placeholder="Enter URL..." onChange={handleInputChange} value={url} />

      {/* Result block */}
      <>
        {isValidUrl && urlCheckResult && (
          <div className="flex flex-col items-start gap-2">
            <div>
              <b>URL:</b> {urlCheckResult.url}
            </div>
            <div>
              <b>Is File:</b> {urlCheckResult.isFile ? "Yes" : "No"}
            </div>
            <div>
              <b>Is Folder:</b> {urlCheckResult.isFolder ? "Yes" : "No"}
            </div>
          </div>
        )}

        {/* Loading message */}
        {!urlCheckResult && isValidUrl && url.length > 0 && <div className="text-gray-500 flex justify-start items-start pl-2">Checking URL...</div>}
      </>

      {!isValidUrl && (
        <>
          <div className="text-red-500 flex justify-start items-start">Please enter a valid URL.</div>{" "}
        </>
      )}
    </main>
  );
}

export default App;
