import { PlayCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-pulse">
      <PlayCircle className="h-12 w-12 text-blue-500 opacity-50" />
      <p className="text-gray-400 font-mono text-sm">Compiling data engine...</p>
    </div>
  );
}