
  import Link from "next/link";
  import Image from "next/image";
  import { BlogPostMeta } from "@/types";

  interface BlogCardProps {
    post: BlogPostMeta;
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  export default function BlogCard({ post }: BlogCardProps) {
    return (
      <article className="card-dark group flex flex-col overflow-hidden">
        {/* Cover image */}
        <Link
          href={`/blog/${post.slug}`}
          className="block relative w-full aspect-[16/9] overflow-hidden bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold
  focus-visible:ring-inset"
          tabIndex={-1}
          aria-hidden="true"
        >
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={`Cover image for: ${post.title}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
          ) : (
            // Placeholder when no cover image
            <div className="w-full h-full bg-background-elevated flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2a2a2a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}{/* Gradient overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-background-card/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-hidden="true"
          />
        </Link>

        {/* Content */}
        <div className="flex flex-col gap-3p-5 flex-1">
          {/* Meta row */}
          <div className="flex items-center gap-3text-xs text-silver-dark font-sans">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} min read</span>
          </div>

          {/* Title */}
          <h3 className="font-display font-semibold text-base text-brand-white leading-snug group-hover:text-gold transition-colors duration-200"><Link
              href={`/blog/${post.slug}`}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
            >
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-silver text-sm leading-relaxed line-clamp-3 flex-1">
            {post.excerpt}
          </p>

          {/* Footer row */}
          <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
            <span className="text-xs text-silver-dark font-sans">
              By {post.author}
            </span>
            <Link
              href={`/blog/${post.slug}`}
              className="flex items-center gap-1.5 text-xs font-medium font-sans text-gold hover:text-gold-light transition-colors duration-200 focus-visible:outline-none
  focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
              aria-label={`Read full post: ${post.title}`}
            >
              Read more<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" 
  aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </article>
    );
  }
