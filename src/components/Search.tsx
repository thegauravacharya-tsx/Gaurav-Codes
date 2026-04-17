"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { Search as SearchIcon, PlayCircle } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

// Define the shape of our lightweight search data
type SearchVideo = {
  id: string;
  title: string;
  slug: string;
  description: string;
};

export default function Search() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState<SearchVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Keyboard Shortcut Listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // 2. Fetch the Search Index on Mount
  useEffect(() => {
    async function fetchSearchIndex() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/search");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setVideos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSearchIndex();
  }, []);

  // 3. Initialize Fuse.js for Fuzzy Matching
  const fuse = useMemo(
    () =>
      new Fuse(videos, {
        keys: ["title", "description"], // Fields to search
        threshold: 0.4, // 0.0 is perfect match, 1.0 matches anything (0.4 allows typos)
        includeScore: true,
      }),
    [videos]
  );

  // 4. Compute Results
  // If no query, show the most recent videos. Otherwise, show Fuse.js results.
  const results = query
    ? fuse.search(query).map((result) => result.item)
    : videos.slice(0, 5); // Show top 5 by default

  // 5. Handle Navigation
  const handleSelect = (slug: string) => {
    setOpen(false); // Close modal
    router.push(`/video/${slug}`); // Instantly navigate
  };

  return (
    <>
      {/* Trigger Button (Looks like an input) */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-between w-full h-9 px-3 text-sm text-gray-400 bg-gray-900/50 border border-gray-800 rounded-md hover:bg-gray-800 hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="flex items-center gap-2">
          <SearchIcon className="w-4 h-4" />
          <span>Search masterclasses...</span>
        </span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 font-mono text-[10px] font-medium text-gray-500 bg-gray-950 border border-gray-800 rounded">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Command Palette Modal */}
      {/* shouldFilter={false} disables default exact-match so our Fuse.js logic works */}
      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <CommandInput
          placeholder="Type 'automation' or 'nextjs'..."
          value={query}
          onValueChange={setQuery}
        />
        {/* --- OUR TAILWIND FIX IS HERE: max-h-75 --- */}
        <CommandList className="max-h-75 overflow-y-auto">
          {isLoading && <div className="p-4 text-sm text-center text-gray-500">Loading index...</div>}
          {!isLoading && results.length === 0 && (
            <CommandEmpty>No masterclasses found.</CommandEmpty>
          )}

          {!isLoading && results.length > 0 && (
            <CommandGroup heading={query ? "Search Results" : "Recent Masterclasses"}>
              {results.map((video) => (
                <CommandItem
                  key={video.id}
                  value={video.slug}
                  onSelect={() => handleSelect(video.slug)}
                  className="flex items-center gap-3 py-3 cursor-pointer aria-selected:bg-blue-500/10 aria-selected:text-blue-500"
                >
                  <PlayCircle className="w-5 h-5 text-gray-500 shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-200">{video.title}</span>
                    <span className="text-xs text-gray-500 line-clamp-1">
                      {video.description}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}