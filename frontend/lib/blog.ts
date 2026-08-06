
  import fs from "fs";
  import path from "path";
  import matter from "gray-matter";
  import { BlogPost, BlogPostMeta } from "@/types";

  const BLOG_DIR = path.join(process.cwd(), "content", "blog");

  // ─── Read all posts metadata (for feed listing) ───────────────────────────────
  export function getAllPostsMeta(): BlogPostMeta[] {
    if (!fs.existsSync(BLOG_DIR)) return [];

    const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

    const posts = files.map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
      const { data } = matter(raw);

      return {
        slug,
        title: data.title ?? "Untitled",
        excerpt: data.excerpt ?? "",
        date: data.date ?? new Date().toISOString(),
        author: data.author ?? "Technician Ideas",
        coverImage: data.coverImage ?? undefined,
        readingTime: data.readingTime ?? estimateReadingTime(raw),} satisfies BlogPostMeta;
    });

    // Sort newest first
    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  // ─── Read single post (for individual post page) ──────────────────────────────
  export function getPostBySlug(slug: string): BlogPost | null {
    const filePath = path.join(BLOG_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) return null;

    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    return {
      slug,
      title: data.title ?? "Untitled",
      excerpt: data.excerpt ?? "",
      date: data.date ?? new Date().toISOString(),
      author: data.author ?? "Technician Ideas",
      coverImage: data.coverImage ?? undefined,
      readingTime: data.readingTime ?? estimateReadingTime(content),
      content,
    };
  }

  // ─── Get all slugs (for generateStaticParams) ─────────────────────────────────
  export function getAllSlugs(): string[] {
    if (!fs.existsSync(BLOG_DIR)) return [];
    return fs
      .readdirSync(BLOG_DIR)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""));
  }

  // ─── Estimate reading time from raw content ───────────────────────────────────
  function estimateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }
