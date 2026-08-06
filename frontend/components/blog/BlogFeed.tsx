
  import BlogCard from "@/components/blog/BlogCard";
  import { BlogPostMeta } from "@/types";
  import { BlogCardSkeleton } from "@/components/ui/SkeletonLoader";

  interface BlogFeedProps {
    posts: BlogPostMeta[];
    loading?: boolean;
  }

  export default function BlogFeed({ posts, loading = false }: BlogFeedProps) {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (!posts.length) {
      return (
        <div className="flex flex-col items-center justify-center py-20gap-4 text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2a2a2a" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <p className="text-silver-dark text-sm font-sans">
            No posts published yet. Check back soon.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    );
  }
