// src/components/NewsletterForm.tsx
"use client";

import { useState, useTransition } from "react";
import { subscribeToNewsletter } from "@/actions/engagement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubscribe = () => {
    if (!email) return;
    
    // startTransition tells React this is a background update, unlocking the isPending state
    startTransition(async () => {
      const result = await subscribeToNewsletter(email);
      setStatus(result);
      if (result.success) setEmail(""); // Clear form on success
    });
  };

  if (status?.success) {
    return (
      <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md text-blue-400 text-sm animate-in fade-in zoom-in duration-300">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <p>{status.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input 
          type="email" 
          placeholder="Enter your email..." 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          className="bg-gray-900 border-gray-800 text-gray-200 focus-visible:ring-blue-500" 
        />
        <Button 
          onClick={handleSubscribe} 
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-500 text-white transition-all w-12 shrink-0 p-0 flex items-center justify-center"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
        </Button>
      </div>
      {status?.success === false && (
        <p className="text-red-400 text-xs pl-1 animate-in fade-in">{status.error}</p>
      )}
    </div>
  );
}