// src/db/schema.ts
import { pgTable, text, timestamp, uuid, jsonb, uniqueIndex } from "drizzle-orm/pg-core";

export const videos = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  youtubeId: text("youtube_id").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(), // Pro-tip implementation
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    slugIdx: uniqueIndex("slug_idx").on(table.slug),
  };
});

export const breakdowns = pgTable("breakdowns", {
  id: uuid("id").primaryKey().defaultRandom(),
  videoId: uuid("video_id").references(() => videos.id, { onDelete: 'cascade' }).notNull(),
  summary: text("summary").notNull(),
  // Type-casting JSONB for strict TypeScript safety
  takeaways: jsonb("takeaways").$type<string[]>().notNull(),
  timestamps: jsonb("timestamps").$type<{ time: string; label: string }[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const newsletter = pgTable("newsletter", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}); 