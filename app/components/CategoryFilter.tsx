"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface PostMeta {
  title: string;
  date: string;
  slug: string;
  description: string;
  thumbnail: string;
  category: string;
}

export default function CategoryFilter({ categories, posts }: { categories: string[]; posts: PostMeta[] }) {
  const [selected, setSelected] = useState("All");
  const filtered = selected === "All" ? posts : posts.filter(p => p.category === selected);

  return (
    <>
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`px-4 py-2 rounded-full border transition-colors text-sm font-semibold ${selected === cat ? "bg-white text-black" : "border-white/20 hover:bg-white/10"}`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {filtered.map((post) => (
          <Link key={post.slug} href={`/posts/${post.slug}`} className="group block rounded-xl overflow-hidden bg-[#181818] shadow-lg hover:shadow-2xl transition-shadow border border-white/10">
            <div className="relative w-full h-48">
              <Image src={post.thumbnail} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-5 flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-blue-400 font-bold">{post.category}</span>
              <h2 className="text-xl font-bold group-hover:text-blue-400 transition-colors line-clamp-2">{post.title}</h2>
              <p className="text-sm text-white/70 line-clamp-2">{post.description}</p>
              <span className="text-xs text-white/40 mt-2">{post.date}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
} 