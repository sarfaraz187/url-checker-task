import { Input } from "@/components/ui/input";
import "@/App.css";
import { useState } from "react";
import { getURLStatus } from "../server/server.ts";
import type { URLCheckResult } from "../server/server.ts";

function App() {
  const [urlObj, setUrlObj] = useState<{ url: string; isValid: boolean }>({ url: "", isValid: true });
  const [urlCheckResult, setUrlCheckResult] = useState<null | URLCheckResult>(null);

  const fetchURLStatus = async (url: string) => {
    try {
      const result = await getURLStatus(url);
      console.log({ result });
      setUrlCheckResult(result);
    } catch (error) {
      console.log({ error });
      setUrlCheckResult(error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const isValid = value.length === 0 || value.startsWith("http://") || value.startsWith("https://");

    setUrlObj({ url: value, isValid });
    if (isValid && value.length > 0) {
      fetchURLStatus(value);
    }
  };

  return (
    <main className="flex flex-col gap-4 p-4 mx-22">
      <h1 className="flex justify-center">
        <b>URL Checker</b>
      </h1>

      <Input className="" placeholder="Enter URL..." onChange={handleInputChange} value={urlObj.url} />

      {/* Result block */}
      {urlObj.isValid && urlCheckResult && (
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
      {!urlCheckResult && urlObj.isValid && urlObj.url.length > 0 && <div className="text-gray-500 flex justify-start items-start pl-2">Checking URL...</div>}

      {!urlObj.isValid && <div className="text-red-500 flex justify-start items-start">Please enter a valid URL.</div>}
    </main>
  );
}

export default App;
