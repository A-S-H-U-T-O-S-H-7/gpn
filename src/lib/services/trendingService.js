import { db } from '@/lib/firebase/config';
import { collection, query, where, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';

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

// Get trending items (news + videos)
export const getTrendingItems = async (page = 1, itemsPerPage = 6) => {
  try {
    // Fetch trending news
    const newsQuery = query(
      collection(db, 'news'),
      where('status', '==', 'published'),
      where('isTrending', '==', true),
      orderBy('views', 'desc'),
      limit(itemsPerPage * 2)
    );
    const newsSnapshot = await getDocs(newsQuery);
    
    // Fetch trending videos
    const videosQuery = query(
      collection(db, 'videos'),
      where('status', '==', 'published'),
      where('isTrending', '==', true),
      orderBy('views', 'desc'),
      limit(itemsPerPage * 2)
    );
    const videosSnapshot = await getDocs(videosQuery);
    
    // Combine items
    let items = [];
    
    newsSnapshot.forEach(doc => {
      const data = doc.data();
      items.push({
        id: doc.id,
        type: 'news',
        title: data.title,
        slug: data.slug,
        category: data.category,
        views: data.views || 0,
        formattedViews: formatViews(data.views),
        timeAgo: getTimeAgo(data.createdAt?.toDate()),
        image: data.image,
        createdAt: data.createdAt?.toDate(),
        isTrending: data.isTrending
      });
    });
    
    videosSnapshot.forEach(doc => {
      const data = doc.data();
      items.push({
        id: doc.id,
        type: 'video',
        title: data.title,
        slug: data.slug,
        category: data.category,
        views: data.views || 0,
        formattedViews: formatViews(data.views),
        timeAgo: getTimeAgo(data.createdAt?.toDate()),
        image: data.thumbnail,
        createdAt: data.createdAt?.toDate(),
        duration: data.duration,
        isTrending: data.isTrending
      });
    });
    
    // Sort by views (highest first)
    items.sort((a, b) => b.views - a.views);
    
    // Pagination
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);
    const hasMore = startIndex + itemsPerPage < items.length;
    
    return { success: true, items: paginatedItems, hasMore, total: items.length };
  } catch (error) {
    console.error('Error getting trending items:', error);
    return { success: false, error: error.message, items: [], hasMore: false, total: 0 };
  }
};

// Load more trending items (for infinite scroll)
export const getMoreTrendingItems = async (lastItem, itemsPerPage = 6) => {
  // For now, we'll use the same method since we're doing client-side pagination
  // In production, implement cursor-based pagination
  try {
    const result = await getTrendingItems(1, 100);
    return result;
  } catch (error) {
    console.error('Error getting more trending items:', error);
    return { success: false, items: [], hasMore: false };
  }
};