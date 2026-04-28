"use client";
import { useState } from "react";
import { useTranslation } from "../lib/useTranslation";

export default function Community() {
  const { t } = useTranslation();
  
  const initialPosts = [
    {
      id: 1,
      author: "Ramesh Patel",
      location: "Gujarat",
      time: "2h ago",
      content: t("Has anyone tried the new drought-resistant wheat variety? My field is getting very dry and I need advice on irrigation timing."),
      likes: 24,
      comments: 5,
      isLiked: false,
    },
    {
      id: 2,
      author: "Suresh Kumar",
      location: "Punjab",
      time: "5h ago",
      content: t("Mandi rates for mustard are looking good today. Sold my harvest at ₹5200/quintal. Don't wait too long if you have stock!"),
      likes: 89,
      comments: 12,
      isLiked: true,
    },
    {
      id: 3,
      author: "Priya Sharma",
      location: "Maharashtra",
      time: "1d ago",
      content: t("I'm seeing yellow spots on my tomato leaves. The Agrocult Plant Doctor AI said it's Early Blight. Can someone recommend a good organic fungicide?"),
      likes: 45,
      comments: 18,
      isLiked: false,
    }
  ];

  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState("");

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: Date.now(),
      author: t("You"),
      location: localStorage.getItem("userCity") || t("Unknown Location"),
      time: t("Just now"),
      content: newPost,
      likes: 0,
      comments: 0,
      isLiked: false,
    };
    setPosts([post, ...posts]);
    setNewPost("");
  };

  const toggleLike = (id: number) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div>
        <h2 className="text-3xl font-extrabold text-green-900 tracking-tight">{t("Kisan Sabha")}</h2>
        <p className="text-gray-600 mt-1">
          {t("Connect with thousands of farmers. Share tips, ask questions, and grow together.")}
        </p>
      </div>

      {/* CREATE POST */}
      <div className="card p-5 shadow-sm border-slate-200">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-700 font-bold">
            Y
          </div>
          <div className="flex-1 space-y-3">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder={t("What's happening on your farm? Ask the community...")}
              className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none"
              rows={3}
            />
            <div className="flex justify-between items-center">
              <button className="text-gray-500 hover:text-green-600 transition flex items-center gap-1 text-sm font-semibold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                {t("Add Photo")}
              </button>
              <button 
                onClick={handlePost}
                disabled={!newPost.trim()}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-bold text-sm transition disabled:opacity-50"
              >
                {t("Post")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* POSTS FEED */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="card p-5 shadow-sm border-slate-200 transition hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 leading-tight">{post.author}</h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {post.location} • {post.time}
                  </p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path></svg>
              </button>
            </div>
            
            <p className="text-gray-800 text-sm mb-4 leading-relaxed">
              {post.content}
            </p>
            
            <div className="flex items-center gap-6 border-t border-gray-100 pt-3">
              <button 
                onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-1.5 text-sm font-semibold transition ${post.isLiked ? 'text-green-600' : 'text-gray-500 hover:text-green-600'}`}
              >
                <svg className="w-5 h-5" fill={post.isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.514"></path></svg>
                {post.likes} {t("Helpful")}
              </button>
              <button className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-blue-600 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                {post.comments} {t("Replies")}
              </button>
              <button className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-amber-600 transition ml-auto">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
                {t("Translate")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
