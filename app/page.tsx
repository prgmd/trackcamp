import fs from "fs";
import path from "path";
import matter from "gray-matter";
import CategoryFilter from "./components/CategoryFilter";

interface PostMeta {
  title: string;
  date: string;
  slug: string;
  description: string;
  thumbnail: string;
  category: string;
}

function getPosts(): PostMeta[] {
  const postsDir = path.join(process.cwd(), "posts");
  const files = fs.readdirSync(postsDir);
  return files.map((file) => {
    const filePath = path.join(postsDir, file);
    const { data } = matter(fs.readFileSync(filePath, "utf-8"));
    const category = (data.category === "Album Reviews" || data.category === "ALBUM REVIEW") ? "REVIEW" : data.category;
    return {
      title: data.title,
      date: data.date,
      slug: file.replace(/\.md$/, ""),
      description: data.description || "",
      thumbnail: data.thumbnail || "/sample.jpg",
      category: category || "Other",
    };
  }).sort((a, b) => b.date.localeCompare(a.date));
}

export default function Home() {
  const posts = getPosts();
  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];

  return (
    <div className="min-h-screen bg-[#111] text-white py-12 px-4">
      <h1 className="text-5xl font-extrabold mb-8 tracking-tight text-center">trackcamp</h1>
      <CategoryFilter categories={categories} posts={posts} />
    </div>
  );
}
