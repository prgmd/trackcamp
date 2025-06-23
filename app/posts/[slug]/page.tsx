import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import { notFound } from "next/navigation";

// 이 부분은 문제가 없으며 아주 잘 작성하셨습니다.
export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), "posts");
  const files = fs.readdirSync(postsDir);
  return files.map((file) => ({ slug: file.replace(/\.md$/, "") }));
}

// PostPage 컴포넌트 수정
export default async function PostPage(props: any) {
  const { params } = await props;
  const { slug } = params;

  const filePath = path.join(process.cwd(), "posts", `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return notFound();
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const processedContent = await remark().use(gfm).use(html).process(content);
  const contentHtml = processedContent.toString();

  return (
    <div className="min-h-screen bg-[#111] text-white py-16 px-4">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{data.title}</h1>
          <div className="text-sm text-white/60">{data.date}</div>
        </header>
        <div 
          className="prose prose-invert prose-lg max-w-none text-justify
                     prose-headings:text-white prose-p:text-white/90 prose-p:mb-8
                     prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                     prose-strong:text-white prose-em:text-white/80
                     prose-blockquote:border-l-blue-400 prose-blockquote:bg-white/5
                     prose-code:text-green-400 prose-pre:bg-gray-800
                     prose-li:text-white/90 prose-ol:text-white/90 prose-ul:text-white/90"
          dangerouslySetInnerHTML={{ __html: contentHtml }} 
        />
        <style jsx>{`
          .prose p {
            margin-bottom: 2rem !important;
            line-height: 1.8;
          }
          .prose p:last-child {
            margin-bottom: 0 !important;
          }
        `}</style>
      </article>
    </div>
  );
}