"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Eye, Heart, Share2, Bookmark, User, Tag } from "lucide-react";

// Mock blog data - In production, fetch from Firebase
const mockBlogs = {
  "future-of-digital-news-2025": {
    id: 1,
    slug: "future-of-digital-news-2025",
    title: "The Future of Digital News: What to Expect in 2025",
    description: "Explore how AI, video content, and personalized feeds are transforming the way we consume news.",
    content: `
      <p>The digital news landscape is evolving faster than ever before. As we look ahead to 2025, several key trends are shaping the future of how we consume and interact with news content.</p>
      
      <h2>The Rise of AI-Powered Personalization</h2>
      <p>Artificial intelligence is revolutionizing news curation. Algorithms are becoming sophisticated enough to understand individual preferences while maintaining editorial standards and avoiding echo chambers.</p>
      
      <h2>Video-First Approach</h2>
      <p>Short-form video content is dominating user engagement. News platforms are investing heavily in vertical video formats optimized for mobile consumption.</p>
      
      <h2>Trust and Verification</h2>
      <p>With misinformation on the rise, news platforms are implementing robust verification systems and blockchain technology to ensure content authenticity.</p>
      
      <h2>Interactive Storytelling</h2>
      <p>Immersive experiences through AR/VR and interactive graphics are becoming mainstream, allowing readers to engage with stories in new ways.</p>
      
      <p>The future of digital news is exciting, challenging, and full of opportunities for those who adapt quickly to changing consumer behaviors.</p>
    `,
    category: "Technology",
    date: "May 15, 2024",
    readTime: 5,
    views: "12.5K",
    likes: "892",
    author: "Rajesh Kumar",
    authorBio: "Senior Technology Journalist with 10+ years of experience covering digital trends and innovations.",
    tags: ["Digital News", "AI", "Future Trends"],
  },
  "how-to-build-news-platform": {
    id: 2,
    slug: "how-to-build-news-platform",
    title: "How to Build a Modern News Platform from Scratch",
    description: "Complete guide to building a scalable, video-first news platform with Next.js and Firebase.",
    content: `<p>Building a modern news platform requires careful planning and the right technology stack. This comprehensive guide will walk you through every step of the process.</p>
    <h2>Choosing the Right Tech Stack</h2>
    <p>Next.js with App Router provides the perfect foundation for a news platform. Its server-side rendering capabilities ensure fast load times and excellent SEO performance.</p>
    <h2>Database Design</h2>
    <p>Firebase offers real-time capabilities that are essential for breaking news. Firestore provides a scalable NoSQL database perfect for content management.</p>
    <h2>Video Integration</h2>
    <p>YouTube API integration allows seamless video embedding. Live streaming capabilities can be added using YouTube Live or custom RTMP solutions.</p>
    <h2>CMS for Editors</h2>
    <p>A custom admin dashboard enables content creators to publish, edit, and manage articles efficiently with role-based access control.</p>`,
    category: "Development",
    date: "May 12, 2024",
    readTime: 8,
    views: "8.3K",
    likes: "1.2K",
    author: "Priya Sharma",
    authorBio: "Full-stack developer and tech writer specializing in modern web architectures.",
    tags: ["Next.js", "Firebase", "Web Development"],
  },
  "journalism-ethics-ai-era": {
    id: 3,
    slug: "journalism-ethics-ai-era",
    title: "Journalism Ethics in the Age of AI",
    description: "Understanding the importance of ethical journalism when using AI tools for news generation.",
    content: `<p>As AI tools become more prevalent in newsrooms, journalists must navigate new ethical challenges while maintaining traditional standards of accuracy and fairness.</p>
    <h2>Transparency in AI Usage</h2>
    <p>News organizations should disclose when AI tools are used in content creation. Readers deserve to know how their news is being produced.</p>
    <h2>Avoiding Bias</h2>
    <p>AI models can perpetuate existing biases. Journalists must review AI-generated content carefully to ensure balanced reporting.</p>
    <h2>Fact-Checking Automation</h2>
    <p>While AI can assist with fact-checking, human verification remains essential for sensitive topics and breaking news.</p>`,
    category: "Opinion",
    date: "May 10, 2024",
    readTime: 6,
    views: "6.7K",
    likes: "567",
    author: "Amit Verma",
    authorBio: "Media ethics researcher and journalist with a focus on technology's impact on news.",
    tags: ["AI Ethics", "Journalism", "Media"],
  },
  "video-content-strategy-news": {
    id: 4,
    slug: "video-content-strategy-news",
    title: "Why Video Content is Dominating News Platforms",
    description: "Analyzing the shift from text-based to video-first news consumption and how to adapt.",
    content: `<p>Video content has become the primary format for news consumption, especially among younger audiences. Understanding this shift is crucial for modern news organizations.</p>
    <h2>The Rise of Short-Form Video</h2>
    <p>Platforms like TikTok and Instagram Reels have changed how people consume news. Bite-sized, engaging video clips are now the norm.</p>
    <h2>Live Streaming Growth</h2>
    <p>Live video creates a sense of urgency and authenticity that pre-recorded content cannot match. Breaking news coverage increasingly relies on live streams.</p>
    <h2>Production Strategies</h2>
    <p>Newsrooms are adapting by investing in vertical video production, mobile journalism tools, and faster editing workflows.</p>`,
    category: "Strategy",
    date: "May 8, 2024",
    readTime: 4,
    views: "15.2K",
    likes: "2.1K",
    author: "Neha Gupta",
    authorBio: "Digital media strategist helping news organizations transition to video-first approaches.",
    tags: ["Video Marketing", "Digital Strategy", "News Media"],
  },
  "seo-optimization-news-sites": {
    id: 5,
    slug: "seo-optimization-news-sites",
    title: "SEO Optimization for News Websites: Best Practices 2024",
    description: "Learn the latest SEO techniques to improve your news site's visibility and ranking.",
    content: `<p>News websites face unique SEO challenges due to time-sensitive content and high competition. This guide covers the latest best practices.</p>
    <h2>Core Web Vitals</h2>
    <p>Google prioritizes fast-loading pages. Optimize images, leverage caching, and minimize JavaScript to improve scores.</p>
    <h2>Schema Markup</h2>
    <p>Implement Article and NewsArticle schema to help search engines understand your content and display rich snippets.</p>
    <h2>Breaking News SEO</h2>
    <p>For time-sensitive stories, publish quickly, use clear headlines, and leverage Google News Publisher Center.</p>`,
    category: "SEO",
    date: "May 5, 2024",
    readTime: 7,
    views: "4.9K",
    likes: "445",
    author: "Vikram Singh",
    authorBio: "SEO specialist focused on news and publishing industry optimization strategies.",
    tags: ["SEO", "Google News", "Search Rankings"],
  },
  "mobile-first-news-design": {
    id: 6,
    slug: "mobile-first-news-design",
    title: "Mobile-First Design: Creating News Experiences for Smartphones",
    description: "Design principles and patterns for building exceptional mobile news experiences.",
    content: `<p>With over 60% of news consumption happening on mobile devices, mobile-first design is no longer optional—it's essential.</p>
    <h2>Touch-Friendly Interfaces</h2>
    <p>Buttons should be large enough for thumbs. Swipe gestures can enhance navigation for article browsing.</p>
    <h2>Readability Matters</h2>
    <p>Optimize font sizes for small screens, maintain adequate line spacing, and ensure sufficient contrast for outdoor reading.</p>
    <h2>Offline Support</h2>
    <p>Implement service workers to allow users to save articles for offline reading—especially valuable for commuters.</p>`,
    category: "Design",
    date: "May 3, 2024",
    readTime: 6,
    views: "7.8K",
    likes: "678",
    author: "Rajesh Kumar",
    authorBio: "UI/UX designer specializing in mobile-first news applications.",
    tags: ["Mobile Design", "UX", "Responsive Design"],
  },
};

// Get emoji based on category
const getCategoryEmoji = (category) => {
  const emojis = {
    "Technology": "💻",
    "Development": "🛠️",
    "Opinion": "💭",
    "Strategy": "🎯",
    "SEO": "📈",
    "Design": "🎨",
    "Business": "💼",
    "Default": "📰"
  };
  return emojis[category] || emojis.Default;
};

// Get gradient based on category
const getGradient = (category) => {
  const gradients = {
    "Technology": "from-blue-600 to-cyan-500",
    "Development": "from-gray-700 to-gray-600",
    "Opinion": "from-purple-600 to-pink-500",
    "Strategy": "from-emerald-600 to-teal-500",
    "SEO": "from-yellow-600 to-amber-500",
    "Design": "from-rose-600 to-pink-500",
    "Business": "from-indigo-600 to-blue-500",
    "Default": "from-red-600 to-orange-500"
  };
  return gradients[category] || gradients.Default;
};

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const blogData = mockBlogs[slug];
      if (blogData) {
        setBlog(blogData);
      }
      setIsLoading(false);
    }, 300);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ghee dark:bg-slate-900/50 flex items-center justify-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-3 h-3 bg-red rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-3 h-3 bg-red rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-ghee dark:bg-slate-900/50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Blog post not found</p>
          <Link href="/blogs" className="px-6 py-2 bg-red text-white rounded-lg hover:bg-red-600 transition-colors">
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const categoryEmoji = getCategoryEmoji(blog.category);
  const gradient = getGradient(blog.category);

  return (
    <div className="min-h-screen bg-ghee dark:bg-slate-900/50 pb-16">
      
      {/* Hero Section with Gradient + Emoji */}
      <div className={`relative h-[50vh] md:h-[55vh] overflow-hidden bg-gradient-to-br ${gradient}`}>
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "30px 30px"
        }} />
        
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-ghee dark:from-slate-900/50 via-transparent to-transparent z-10" />
        
        {/* Large Emoji Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <span className="text-[200px] md:text-[300px]">{categoryEmoji}</span>
        </div>

        <div className="relative z-20 h-full flex flex-col justify-end max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full flex items-center gap-1">
              <span>{categoryEmoji}</span>
              <span>{blog.category}</span>
            </span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {blog.readTime} min read
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                {blog.author.charAt(0)}
              </div>
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{blog.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{blog.views} views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 md:p-10">
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
                  isLiked ? "bg-red/10 text-red" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red/10"
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-red text-red" : ""}`} />
                <span className="text-sm">{blog.likes}</span>
              </button>
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-1.5 rounded-full transition-colors ${
                  isBookmarked ? "text-red" : "text-gray-400 hover:text-red"
                }`}
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-red/10 transition-colors">
              <Share2 className="w-4 h-4" />
              <span className="text-sm">Share</span>
            </button>
          </div>

          {/* Description/Summary */}
          <div className="mb-8 p-5 bg-red/5 rounded-xl border-l-4 border-red">
            <p className="text-gray-700 dark:text-gray-300 italic">
              {blog.description}
            </p>
          </div>

          {/* Main Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-red prose-strong:text-gray-900 dark:prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          <div className="mt-8 p-5 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-lg">
                {blog.author.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{blog.author}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{blog.authorBio}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-10 text-center">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red text-white rounded-full hover:bg-red-600 transition-colors shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all blogs
          </Link>
        </div>
      </div>
    </div>
  );
}