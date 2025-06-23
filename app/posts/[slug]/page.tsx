import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), "posts");
  const files = fs.readdirSync(postsDir);
  return files.map((file) => ({ slug: file.replace(/\.md$/, "") }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "posts", `${slug}.md`);
  if (!fs.existsSync(filePath)) return notFound();
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#111] text-white py-16 px-4">
      <article className="w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
        <div className="text-sm text-white/60 mb-8">{data.date}</div>
        <div className="prose prose-invert text-justify" style={{
          fontFamily: `'Apple SD Gothic Neo', sans-serif`,
          '--tw-prose-sub': '#aaa',
          '--tw-prose-sub-size': '0.85em',
          '--tw-prose-sub-align': 'center',
        } as React.CSSProperties} dangerouslySetInnerHTML={{ __html: contentHtml }} />
        <style>{`
          .prose sub, .prose-invert sub {
            color: #aaa !important;
            display: block;
            text-align: center;
            font-size: 0.85em;
            margin-top: 0.5em;
          }
        `}</style>
      </article>
    </div>
  );
} 