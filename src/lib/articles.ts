import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface ArticleMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readingTime: number;
}

export interface Article extends ArticleMeta {
  body: string;
}

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

function readingTimeFor(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export async function getArticles(): Promise<ArticleMeta[]> {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".mdx"));
  const items: ArticleMeta[] = files.map((file) => {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.mdx$/, "");
    return {
      slug,
      title: data.title || slug,
      excerpt: data.excerpt || "",
      date: data.date || "",
      author: data.author || "Cole Ashford",
      readingTime: readingTimeFor(content),
    };
  });
  return items.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getArticle(slug: string): Promise<Article | null> {
  const file = path.join(ARTICLES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title || slug,
    excerpt: data.excerpt || "",
    date: data.date || "",
    author: data.author || "Cole Ashford",
    readingTime: readingTimeFor(content),
    body: content,
  };
}
