import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, ArrowLeft, Share2, Bookmark, Sparkles } from 'lucide-react';

const BlogDetail = () => {
    const { slug } = useParams(); // URL theke slug nibe
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                // Apnar backend route onujayi hit korbe
                const res = await axios.get(`http://localhost:5000/api/admin/blogs/${slug}`);
                setBlog(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching blog:", err);
                setLoading(false);
            }
        };
        fetchBlogDetails();
        window.scrollTo(0, 0); // Page-er ekdom upore niye jabe load hole
    }, [slug]);

    if (loading) return <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center italic font-black uppercase tracking-widest text-red-600 animate-pulse">Loading Story...</div>;
    
    if (!blog) return <div className="min-h-screen flex items-center justify-center text-white">Story Not Found.</div>;

    return (
        <div className="bg-white dark:bg-[#050505] min-h-screen text-black dark:text-white pb-32 transition-colors duration-500">
            {/* --- Progress Bar (Optional) --- */}
            <div className="fixed top-0 left-0 w-full h-1 bg-zinc-100 dark:bg-zinc-900 z-50">
                <div className="h-full bg-red-600 animate-progress"></div>
            </div>

            {/* --- Navigation & Actions --- */}
            <nav className="max-w-4xl mx-auto px-6 pt-24 pb-12 flex items-center justify-between">
                <Link to="/" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-red-600 transition-all">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Back to Home
                </Link>
                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-full border border-zinc-100 dark:border-zinc-800 hover:bg-red-600 hover:text-white transition-all"><Share2 size={16}/></button>
                    <button className="p-2 rounded-full border border-zinc-100 dark:border-zinc-800 hover:bg-red-600 hover:text-white transition-all"><Bookmark size={16}/></button>
                </div>
            </nav>

            {/* --- Article Header --- */}
            <header className="max-w-4xl mx-auto px-6 space-y-8 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-[3px]">
                    <Sparkles size={12}/> Editorial
                </div>
                
                <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-tight">
                    {blog.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start text-[11px] font-black uppercase tracking-widest text-zinc-400 border-y border-zinc-100 dark:border-zinc-800 py-6">
                    <span className="flex items-center gap-2"><Calendar size={14} className="text-red-600"/> {new Date(blog.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                    <span className="flex items-center gap-2"><Clock size={14} className="text-red-600"/> 6 Minute Read</span>
                    <span className="text-zinc-200 dark:text-zinc-700">|</span>
                    <span className="text-red-600">By Admin</span>
                </div>
            </header>

            {/* --- Featured Image (Jodi thake) --- */}
            {blog.featured_image && (
                <div className="max-w-6xl mx-auto px-6 my-16">
                    <div className="aspect-video rounded-[40px] overflow-hidden border border-zinc-100 dark:border-zinc-800">
                        <img src={blog.featured_image} className="w-full h-full object-cover" alt={blog.title} />
                    </div>
                </div>
            )}

            {/* --- Article Content --- */}
            <article className="max-w-3xl mx-auto px-6">
                <div 
                    className="prose prose-zinc dark:prose-invert prose-lg max-w-none 
                    prose-headings:uppercase prose-headings:italic prose-headings:font-black prose-headings:tracking-tighter
                    prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-p:leading-relaxed
                    prose-strong:text-red-600 prose-blockquote:border-l-4 prose-blockquote:border-red-600 
                    prose-blockquote:italic prose-img:rounded-[30px]"
                    dangerouslySetInnerHTML={{ __html: blog.content }} 
                />
            </article>

            {/* --- Footer Signature --- */}
            <footer className="max-w-3xl mx-auto px-6 mt-20 pt-10 border-t border-zinc-100 dark:border-zinc-800 text-center">
                <div className="space-y-4">
                    <p className="text-xs font-black uppercase tracking-[4px] text-zinc-300">End of Transmission</p>
                    <div className="w-12 h-1 bg-red-600 mx-auto"></div>
                </div>
            </footer>
        </div>
    );
};

export default BlogDetail;