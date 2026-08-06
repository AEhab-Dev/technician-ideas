
  import type { Metadata } from "next";
  import YouTubePlayer from "@/components/blog/YouTubePlayer";
  import BlogFeed from "@/components/blog/BlogFeed";
  import { getAllPostsMeta } from "@/lib/blog";
  import { api } from "@/lib/api";

  export const metadata: Metadata = {
    title: "Blog",
    description:
      "Latest updates, articles, and videos from Technician Ideas photography collective.",
  };

  // Revalidate this page every 5 minutes so YouTube ID updates appear quickly
  export const revalidate = 300;

  export default async function BlogPage() {
    const posts = getAllPostsMeta();

    // Fetch YouTube video ID from backend — fallback gracefully if API is down
    let videoId = "";
    try {
      const config = await api.getYoutubeVideoId();
      videoId = config.youtube_video_id;
    } catch {
      // API unavailable — player will show fallback statevideoId = "";
    }

    return (
      <div className="min-h-screen bg-background pt-20 md:pt-24">

        {/* YouTube pinned section */}
        <section
          className="section-padding pb-0"
          aria-labelledby="video-heading"
        >
          <div className="content-width">
            <div className="mb-6">
              <p className="font-display text-xs font-semibold tracking-widest uppercase text-gold mb-2">
                Latest Video
              </p>
              <h1
                id="video-heading"
                className="font-display font-bold text-brand-white"
              >
                Watch &<span className="text-gold-gradient">Learn</span>
              </h1>
            </div>

            <YouTubePlayer videoId={videoId} />
          </div>
        </section>

        {/* Gold divider */}
        <div className="content-width px-4 sm:px-6 lg:px-8 mt-16">
          <div className="divider-gold" aria-hidden="true" />
        </div>

        {/* Blog feed */}
        <section
          className="section-padding"
          aria-labelledby="blog-heading"
        >
          <div className="content-width">
            <div className="mb-10">
              <p className="font-display text-xs font-semibold tracking-widest uppercase text-gold mb-2">
                From the Collective
              </p>
              <h2
                id="blog-heading"
                className="font-display font-bold text-brand-white"
              >
                Articles &{" "}
                <span className="text-gold-gradient">Updates</span>
              </h2>
            </div>

            <BlogFeed posts={posts} />
          </div>
        </section>
      </div>
    );
  }
