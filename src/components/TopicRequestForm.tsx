// src/components/TopicRequestForm.tsx
"use client";

import { useState, useTransition } from "react";
import { submitTopicRequest } from "@/actions/engagement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, CheckCircle2, Loader2 } from "lucide-react";

export default function TopicRequestForm() {
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!topic) return;
    
    startTransition(async () => {
      const result = await submitTopicRequest(topic);
      setStatus(result);
      if (result.success) setTopic("");
    });
  };

  if (status?.success) {
    return (
      <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-md text-green-400 text-sm animate-in fade-in zoom-in duration-300">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <p>{status.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 mb-2">Have another idea?</p>
      <div className="flex gap-2">
        <Input 
          placeholder="Suggest a topic..." 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={isPending}
          className="bg-gray-900 border-gray-800 text-gray-200 focus-visible:ring-blue-500" 
        />
        <Button 
          onClick={handleSubmit} 
          disabled={isPending}
          className="bg-gray-800 hover:bg-gray-700 text-white shrink-0"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-blue-500" />}
        </Button>
      </div>
      {status?.success === false && (
        <p className="text-red-400 text-xs pl-1 animate-in fade-in">{status.error}</p>
      )}
    </div>
  );
}