// src/actions/engagement.ts
"use server";

import { db } from "@/db/db";
import { newsletter, requests } from "@/db/schema";
import { z } from "zod";

// Zod Validation Schemas
const emailSchema = z.string().email({ message: "Invalid email address" });
const topicSchema = z.string().min(3, { message: "Topic must be at least 3 characters" }).max(100);

export async function subscribeToNewsletter(email: string) {
  try {
    // 1. Validate input strictly on the server
    const validEmail = emailSchema.parse(email);

    // 2. Insert into Supabase
    await db.insert(newsletter)
      .values({ email: validEmail })
      .onConflictDoNothing({ target: newsletter.email });

    return { success: true, message: "Welcome to the inner circle! 🚀" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // FIX: Access the 'issues' array instead of 'errors'
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Something went wrong. Try again." };
  }
}

export async function submitTopicRequest(topic: string) {
  try {
    const validTopic = topicSchema.parse(topic);

    await db.insert(requests).values({ topic: validTopic });

    return { success: true, message: "Idea added to the board! ✨" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // FIX: Access the 'issues' array instead of 'errors'
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to submit request." };
  }
}