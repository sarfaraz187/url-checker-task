import { Input } from "@/components/ui/input";
import "@/App.css";

function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <Input className="w-full max-w-md" placeholder="Enter URL..." />
    </main>
  );
}

export default App;
