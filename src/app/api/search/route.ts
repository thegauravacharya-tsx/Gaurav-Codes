// src/app/api/search/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { videos } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    // Fetch a lightweight index: only id, title, slug, and description
    const searchIndex = await db
      .select({
        id: videos.id,
        title: videos.title,
        slug: videos.slug,
        description: videos.description,
      })
      .from(videos)
      .orderBy(desc(videos.createdAt));

    return NextResponse.json(searchIndex);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Failed to fetch search index" }, { status: 500 });
  }
}