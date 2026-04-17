// src/app/page.tsx
import Link from "next/link";
import { db } from "@/db/db";
import { videos } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlayCircle, Calendar, TrendingUp, Sparkles, Clock } from "lucide-react";

/**
 * Sidebar Component: Includes Upcoming Content and Community Polls
 * Kept logically separate to keep the main Home component clean.
 */
function EngagementSidebar() {
  return (
    <aside className="space-y-6">
      {/* Upcoming Videos Panel */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-gray-100">
            <Calendar className="h-5 w-5 text-blue-500" /> Upcoming Drops
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-l-2 border-blue-500 pl-4 space-y-1">
            <p className="text-sm font-medium text-gray-200">Stripe Webhooks Deep Dive</p>
            <p className="text-xs text-gray-400">Premieres Friday at 10 AM EST</p>
          </div>
          <div className="border-l-2 border-gray-700 pl-4 space-y-1 opacity-70">
            <p className="text-sm font-medium text-gray-200">React Compiler Explained</p>
            <p className="text-xs text-gray-400">In Production</p>
          </div>
        </CardContent>
      </Card>

      {/* Topic Poll Panel */}
      <Card className="bg-gradient-to-br from-gray-900 to-[#0a0a0a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-gray-100">
            <TrendingUp className="h-5 w-5 text-blue-500" /> Topic Poll
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-400">What should we build next?</p>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start border-gray-700 bg-transparent hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/50 transition-colors">
              Agentic AI Workflows
            </Button>
            <Button variant="outline" className="w-full justify-start border-gray-700 bg-transparent hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/50 transition-colors">
              WebRTC Video Calling
            </Button>
          </div>
          <div className="pt-4 mt-4 border-t border-gray-800 space-y-2">
            <p className="text-xs text-gray-400 mb-2">Have another idea?</p>
            <div className="flex gap-2">
              <Input 
                placeholder="Suggest a topic..." 
                className="bg-gray-900 border-gray-800 text-gray-200 focus-visible:ring-blue-500" 
              />
              <Button size="icon" className="bg-blue-600 hover:bg-blue-500 text-white shrink-0">
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}

export default async function Home() {
  /**
   * LIVE DATA FETCH
   * Next.js 15 Server Component: This runs on the server.
   * Pulls all videos from Supabase, ordered by most recent.
   */
  const latestVideos = await db.select().from(videos).orderBy(desc(videos.createdAt));

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="py-12 md:py-16 space-y-4">
        <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20 mb-4 px-3 py-1">
          Next.js 15 App Router Architecture
        </Badge>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1]">
          Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">AI Logic Engines</span> & Automation.
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
          The ultimate companion platform for Gaurav Codes. Explore high-performance source code, database architectures, and production-ready components.
        </p>
      </section>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Video Grid Area (Main Content) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-gray-100 flex items-center gap-2">
              <PlayCircle className="h-6 w-6 text-blue-500" /> Latest Masterclasses
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {latestVideos.length > 0 ? (
              latestVideos.map((video) => (
                <Card key={video.id} className="bg-gray-900/40 border-gray-800 hover:border-blue-500/50 transition-all duration-300 group flex flex-col overflow-hidden">
                  <Link href={`/video/${video.slug}`} className="flex flex-col h-full">
                    {/* Live YouTube Thumbnail from Database */}
                    <div className="aspect-video w-full bg-gray-800/50 relative overflow-hidden group-hover:opacity-90 transition-opacity">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={video.thumbnailUrl} 
                        alt={video.title} 
                        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                        <PlayCircle className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    
                    <CardHeader className="p-4 flex-grow">
                      <CardTitle className="text-base text-gray-100 leading-snug group-hover:text-blue-400 transition-colors line-clamp-2">
                        {video.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardFooter className="p-4 pt-0 text-sm text-gray-500 flex justify-between items-center">
                      <span className="flex items-center gap-1">
                        {new Date(video.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <Button variant="ghost" size="sm" className="h-8 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 px-0">
                        Watch
                      </Button>
                    </CardFooter>
                  </Link>
                </Card>
              ))
            ) : (
              /* Fallback state if database is empty */
              <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-800 rounded-xl">
                <p className="text-gray-500">No masterclasses found. Run your seed script to populate the database!</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="lg:col-span-1">
          <EngagementSidebar />
        </div>

      </div>
    </div>
  );
}