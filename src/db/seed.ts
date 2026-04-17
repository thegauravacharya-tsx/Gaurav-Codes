// src/db/seed.ts
import { db } from "./db";
import { videos, breakdowns } from "./schema";

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Insert Videos
  const insertedVideos = await db.insert(videos).values([
    {
      title: "Building an AI Logic Engine in Next.js 15",
      slug: "building-ai-logic-engine-nextjs",
      youtubeId: "dQw4w9WgXcQ", // Replace with real YouTube IDs
      thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      description: "Learn how to architect a server-first AI logic engine.",
    },
    {
      title: "PostgreSQL Database Automation with Neon & Supabase",
      slug: "postgres-database-automation",
      youtubeId: "M7lc1UVf-VE",
      thumbnailUrl: "https://img.youtube.com/vi/M7lc1UVf-VE/maxresdefault.jpg",
      description: "Automate your database workflows efficiently.",
    },
    {
      title: "Advanced Server Actions & Mutations",
      slug: "advanced-server-actions",
      youtubeId: "jNQXAC9IVRw",
      thumbnailUrl: "https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg",
      description: "Master data mutations in Next.js App Router.",
    }
  ]).returning();

  console.log(`✅ Inserted ${insertedVideos.length} videos.`);

  // 2. Insert Breakdowns for those videos
  for (const video of insertedVideos) {
    await db.insert(breakdowns).values({
      videoId: video.id,
      summary: `This is a highly detailed, SEO-optimized summary for ${video.title}. In this masterclass, we dive deep into the architectural decisions behind modern full-stack development.`,
      takeaways: [
        "Understand the core architecture.",
        "Implement secure, edge-ready functions.",
        "Bypass client-side hydration delays.",
      ],
      timestamps: [
        { time: "00:00", label: "Introduction" },
        { time: "05:30", label: "Core Concepts" },
        { time: "12:45", label: "Implementation & Code" },
      ]
    });
  }

  console.log("✅ Breakdowns inserted. Seeding complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});