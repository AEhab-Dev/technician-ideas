
  import type { Metadata } from "next";
  import { notFound } from "next/navigation";
  import Image from "next/image";
  import Link from "next/link";
  import { getPostBySlug, getAllSlugs } from "@/lib/blog";
  import { MDXRemote } from "next-mdx-remote/rsc";

  interface Props {
    params: { slug: string };
  }

  export async function generateStaticParams() {
    return getAllSlugs().map((slug) => ({ slug }));
  }

  export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = getPostBySlug(params.slug);
    if (!post) return { title: "Post Not Found" };
    return {
      title: post.title,
      description: post.excerpt,
    };
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  export default function BlogPostPage({ params }: Props) {
    const post = getPostBySlug(params.slug);
    if (!post) notFound();

    return (
      <div className="min-h-screen bg-background pt-20 md:pt-24">
        <article className="section-padding">
          <div className="content-width max-w-3xl mx-auto">

            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-silver hover:text-gold transition-colors duration-200 mb-8focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-gold rounded-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Blog
            </Link>

            {/* Header */}
            <header className="mb-8">
              <h1 className="font-display font-bold text-brand-white mb-4 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center gap-3 text-sm text-silver-dark font-sans mb-6">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readingTime} min read</span>
                <span aria-hidden="true">·</span>
                <span>By {post.author}</span>
              </div>
              <div className="divider-gold" aria-hidden="true" />
            </header>

            {/* Cover image */}
            {post.coverImage && (
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-10border border-border">
                <Image
                  src={post.coverImage}
                  alt={`Cover image for: ${post.title}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"/>
              </div>
            )}

            {/* MDX content */}
            <div className="prose-ti">
              <MDXRemote source={post.content} />
            </div>

            {/* Bottom divider + back link */}
            <div className="mt-12 pt-8 border-t border-border">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium font-sans text-gold hover:text-gold-light transition-colors duration-200 focus-visible:outline-none
  focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                All Articles
              </Link>
            </div>
          </div>
        </article>
      </div>
    );
  }
