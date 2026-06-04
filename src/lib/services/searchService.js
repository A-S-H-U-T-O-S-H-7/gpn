import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

// Search across all content types
export const searchAllContent = async (searchTerm, maxResults = 20) => {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return { success: true, results: { news: [], videos: [], blogs: [] }, total: 0 };
  }

  const searchTermLower = searchTerm.toLowerCase().trim();
  
  try {
    // Search News
    const newsResults = await searchNews(searchTermLower, maxResults);
    
    // Search Videos
    const videoResults = await searchVideos(searchTermLower, maxResults);
    
    // Search Blogs
    const blogResults = await searchBlogs(searchTermLower, maxResults);
    
    const results = {
      news: newsResults,
      videos: videoResults,
      blogs: blogResults,
    };
    
    const total = newsResults.length + videoResults.length + blogResults.length;
    
    return { success: true, results, total };
  } catch (error) {
    console.error('Error searching content:', error);
    return { success: false, error: error.message, results: { news: [], videos: [], blogs: [] }, total: 0 };
  }
};

// Search News
export const searchNews = async (searchTerm, maxResults = 20) => {
  try {
    const newsRef = collection(db, 'news');
    const snapshot = await getDocs(newsRef);
    
    const results = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.status === 'published') {
        const title = (data.title || '').toLowerCase();
        const content = (data.content || '').toLowerCase();
        const excerpt = (data.excerpt || '').toLowerCase();
        
        if (title.includes(searchTerm) || content.includes(searchTerm) || excerpt.includes(searchTerm)) {
          results.push({
            id: doc.id,
            type: 'news',
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt || data.content?.substring(0, 160)?.replace(/<[^>]*>/g, ''),
            image: data.image,
            category: data.category,
            date: data.publishedAt?.toDate?.() || data.createdAt?.toDate?.(),
            views: data.views || 0,
          });
        }
      }
    });
    
    return results.slice(0, maxResults);
  } catch (error) {
    console.error('Error searching news:', error);
    return [];
  }
};

// Search Videos
export const searchVideos = async (searchTerm, maxResults = 20) => {
  try {
    const videosRef = collection(db, 'videos');
    const snapshot = await getDocs(videosRef);
    
    const results = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.status === 'published') {
        const title = (data.title || '').toLowerCase();
        const description = (data.description || '').toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
          results.push({
            id: doc.id,
            type: 'video',
            title: data.title,
            slug: data.slug,
            description: data.description?.substring(0, 160)?.replace(/<[^>]*>/g, ''),
            thumbnail: data.thumbnail,
            category: data.category,
            date: data.publishedAt?.toDate?.() || data.createdAt?.toDate?.(),
            views: data.views || 0,
            duration: data.duration,
          });
        }
      }
    });
    
    return results.slice(0, maxResults);
  } catch (error) {
    console.error('Error searching videos:', error);
    return [];
  }
};

// Search Blogs
export const searchBlogs = async (searchTerm, maxResults = 20) => {
  try {
    const blogsRef = collection(db, 'blogs');
    const snapshot = await getDocs(blogsRef);
    
    const results = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.status === 'published') {
        const title = (data.title || '').toLowerCase();
        const content = (data.content || '').toLowerCase();
        const excerpt = (data.excerpt || '').toLowerCase();
        
        if (title.includes(searchTerm) || content.includes(searchTerm) || excerpt.includes(searchTerm)) {
          results.push({
            id: doc.id,
            type: 'blog',
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt || data.content?.substring(0, 160)?.replace(/<[^>]*>/g, ''),
            image: data.image,
            category: data.category,
            date: data.publishedAt?.toDate?.() || data.createdAt?.toDate?.(),
            views: data.views || 0,
            readTime: Math.ceil((data.content?.length || 0) / 1000),
          });
        }
      }
    });
    
    return results.slice(0, maxResults);
  } catch (error) {
    console.error('Error searching blogs:', error);
    return [];
  }
};

// Quick search for navbar (returns limited results)
export const quickSearch = async (searchTerm, maxResults = 5) => {
  const result = await searchAllContent(searchTerm, maxResults);
  if (result.success) {
    // Combine and return top results
    const allResults = [
      ...result.results.news.slice(0, 3),
      ...result.results.videos.slice(0, 3),
      ...result.results.blogs.slice(0, 3),
    ].slice(0, maxResults);
    
    return { success: true, results: allResults };
  }
  return { success: false, results: [] };
};