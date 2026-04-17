// src/app/video/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db/db";
import { videos, breakdowns } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, CheckCircle2, PlayCircle, FileText } from "lucide-react";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// 1. Fetch Data Helper (Ensures we only query the DB once per request cycle)
async function getCompleteVideoData(slug: string) {
  // Perform an Inner Join to get Video + Breakdown in one query
  const result = await db
    .select({
      video: videos,
      breakdown: breakdowns,
    })
    .from(videos)
    .leftJoin(breakdowns, eq(videos.id, breakdowns.videoId))
    .where(eq(videos.slug, slug))
    .limit(1);

  return result[0]; // Returns undefined if not found
}

// 2. Generate Dynamic Metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getCompleteVideoData(resolvedParams.slug);
  
  if (!data) return { title: "Video Not Found" };

  return {
    title: `${data.video.title} | Gaurav Codes`,
    description: data.video.description,
    openGraph: {
      images: [data.video.thumbnailUrl],
    }
  };
}

// 3. Main Server Component
export default async function VideoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getCompleteVideoData(slug);

  // Trigger Next.js 404 page instantly if the slug doesn't exist in Supabase
  if (!data || !data.video) {
    notFound();
  }

  const { video, breakdown } = data;

  // JSON-LD Schema using LIVE data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.title,
    "description": video.description,
    "thumbnailUrl": [video.thumbnailUrl],
    "uploadDate": video.createdAt,
    "embedUrl": `https://www.youtube.com/embed/${video.youtubeId}`,
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-500">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="space-y-8">
        <header className="space-y-4">
          <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">
            Masterclass
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {video.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-gray-500" />
              <time dateTime={new Date(video.createdAt).toISOString()}>
                {new Date(video.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </time>
            </span>
          </div>
        </header>

        {/* Live YouTube Embed */}
        <figure className="w-full aspect-video bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          ></iframe>
        </figure>

        {/* Render Breakdown only if it exists in the database */}
        {breakdown ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-blue-500" />
                  Detailed Summary
                </h2>
                <div className="prose prose-invert prose-blue max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {breakdown.summary}
                </div>
              </section>

              <Separator className="bg-gray-800" />

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-blue-500" />
                  Key Takeaways
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {breakdown.takeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-gray-900/50 p-4 rounded-lg border border-gray-800/60">
                      <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm leading-relaxed">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className="lg:col-span-1 lg:sticky lg:top-24">
              <Card className="bg-gray-900/40 border-gray-800">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2 text-gray-100">
                    <PlayCircle className="h-5 w-5 text-blue-500" />
                    Interactive Timestamps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {breakdown.timestamps.map((ts, idx) => (
                      <button 
                        key={idx} 
                        className="w-full flex items-center gap-3 p-2 rounded hover:bg-blue-500/10 group transition-colors text-left"
                      >
                        <Badge variant="outline" className="bg-gray-950 border-gray-700 text-blue-400 group-hover:border-blue-500/50 font-mono w-16 justify-center">
                          {ts.time}
                        </Badge>
                        <span className="text-sm text-gray-400 group-hover:text-gray-200 truncate">
                          {ts.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        ) : (
          <div className="text-center p-12 bg-gray-900/40 border border-gray-800 rounded-xl">
            <p className="text-gray-400">Detailed breakdown coming soon.</p>
          </div>
        )}
      </article>
    </div>
  );
}