import { db } from '@/lib/firebase/config';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

// Helper function to get time ago
function getTimeAgo(date) {
  if (!date) return 'Recently';
  const seconds = Math.floor((new Date() - date) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      if (unit === 'day' && interval === 1) return 'Yesterday';
      if (unit === 'day') return `${interval} days ago`;
      if (unit === 'hour') return `${interval} hour${interval > 1 ? 's' : ''} ago`;
      if (unit === 'minute') return `${interval} minute${interval > 1 ? 's' : ''} ago`;
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
}

// Format views
function formatViews(views) {
  if (!views) return '0';
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
  return views.toString();
}

// Get trending items (news + videos) - ORDERED BY LATEST FIRST (updatedAt/publishedAt)
export const getTrendingItems = async (page = 1, itemsPerPage = 8) => {
  try {
    // Fetch trending news - order by updatedAt DESC (latest first)
    const newsQuery = query(
      collection(db, 'news'),
      where('status', '==', 'published'),
      where('isTrending', '==', true),
      orderBy('updatedAt', 'desc'),
      limit(50) // Get more to allow combining
    );
    const newsSnapshot = await getDocs(newsQuery);
    
    // Fetch trending videos - order by updatedAt DESC (latest first)
    const videosQuery = query(
      collection(db, 'videos'),
      where('status', '==', 'published'),
      where('isTrending', '==', true),
      orderBy('updatedAt', 'desc'),
      limit(50)
    );
    const videosSnapshot = await getDocs(videosQuery);
    
    // Combine items
    let items = [];
    
    newsSnapshot.forEach(doc => {
      const data = doc.data();
      // Get the most recent date (updatedAt or publishedAt or createdAt)
      const date = data.updatedAt?.toDate() || data.publishedAt?.toDate() || data.createdAt?.toDate();
      
      items.push({
        id: doc.id,
        type: 'news',
        title: data.title,
        slug: data.slug,
        category: data.category,
        views: data.views || 0,
        formattedViews: formatViews(data.views),
        timeAgo: getTimeAgo(date),
        image: data.image,
        date: date,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        isTrending: data.isTrending
      });
    });
    
    videosSnapshot.forEach(doc => {
      const data = doc.data();
      // Skip shorts/reels from trending section (only standard videos)
      const videoType = data.videoType || 'standard';
      if (videoType === 'standard') {
        // Get the most recent date (updatedAt or publishedAt or createdAt)
        const date = data.updatedAt?.toDate() || data.publishedAt?.toDate() || data.createdAt?.toDate();
        
        items.push({
          id: doc.id,
          type: 'video',
          title: data.title,
          slug: data.slug,
          category: data.category,
          views: data.views || 0,
          formattedViews: formatViews(data.views),
          timeAgo: getTimeAgo(date),
          image: data.thumbnail,
          duration: data.duration,
          date: date,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          isTrending: data.isTrending
        });
      }
    });
    
    // Sort by date (newest first) - THIS IS THE KEY CHANGE
    items.sort((a, b) => b.date - a.date);
    
    // Pagination
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);
    const hasMore = startIndex + itemsPerPage < items.length;
    
    return { 
      success: true, 
      items: paginatedItems, 
      hasMore, 
      total: items.length 
    };
  } catch (error) {
    console.error('Error getting trending items:', error);
    return { success: false, error: error.message, items: [], hasMore: false, total: 0 };
  }
};

// Alternative: Get trending items by trending score (views + recency combined)
export const getTrendingItemsByScore = async (page = 1, itemsPerPage = 8) => {
  try {
    // Fetch trending news
    const newsQuery = query(
      collection(db, 'news'),
      where('status', '==', 'published'),
      where('isTrending', '==', true),
      orderBy('updatedAt', 'desc'),
      limit(50)
    );
    const newsSnapshot = await getDocs(newsQuery);
    
    // Fetch trending videos
    const videosQuery = query(
      collection(db, 'videos'),
      where('status', '==', 'published'),
      where('isTrending', '==', true),
      orderBy('updatedAt', 'desc'),
      limit(50)
    );
    const videosSnapshot = await getDocs(videosQuery);
    
    let items = [];
    
    newsSnapshot.forEach(doc => {
      const data = doc.data();
      const date = data.updatedAt?.toDate() || data.publishedAt?.toDate() || data.createdAt?.toDate() || new Date();
      const daysOld = Math.max(0.1, (new Date() - date) / (1000 * 60 * 60 * 24));
      const views = data.views || 0;
      // Trending score = views / days old (newer + high views = higher score)
      const trendingScore = views / daysOld;
      
      items.push({
        id: doc.id,
        type: 'news',
        title: data.title,
        slug: data.slug,
        category: data.category,
        views: views,
        formattedViews: formatViews(views),
        timeAgo: getTimeAgo(date),
        image: data.image,
        date: date,
        trendingScore: trendingScore,
      });
    });
    
    videosSnapshot.forEach(doc => {
      const data = doc.data();
      const videoType = data.videoType || 'standard';
      if (videoType === 'standard') {
        const date = data.updatedAt?.toDate() || data.publishedAt?.toDate() || data.createdAt?.toDate() || new Date();
        const daysOld = Math.max(0.1, (new Date() - date) / (1000 * 60 * 60 * 24));
        const views = data.views || 0;
        const trendingScore = views / daysOld;
        
        items.push({
          id: doc.id,
          type: 'video',
          title: data.title,
          slug: data.slug,
          category: data.category,
          views: views,
          formattedViews: formatViews(views),
          timeAgo: getTimeAgo(date),
          image: data.thumbnail,
          duration: data.duration,
          date: date,
          trendingScore: trendingScore,
        });
      }
    });
    
    // Sort by trending score (highest first)
    items.sort((a, b) => b.trendingScore - a.trendingScore);
    
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);
    const hasMore = startIndex + itemsPerPage < items.length;
    
    return { 
      success: true, 
      items: paginatedItems, 
      hasMore, 
      total: items.length 
    };
  } catch (error) {
    console.error('Error getting trending items by score:', error);
    return { success: false, error: error.message, items: [], hasMore: false, total: 0 };
  }
};

// Load more trending items (for infinite scroll)
export const getMoreTrendingItems = async (page, itemsPerPage = 8) => {
  try {
    return await getTrendingItems(page, itemsPerPage);
  } catch (error) {
    console.error('Error getting more trending items:', error);
    return { success: false, items: [], hasMore: false };
  }
};