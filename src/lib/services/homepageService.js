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

// Get Editor's Picks (latest 3 from both news and videos)
export const getEditorsPicks = async (limitCount = 3) => {
  try {
    // Fetch from news
    const newsQuery = query(
      collection(db, 'news'),
      where('status', '==', 'published'),
      where('isEditorPick', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const newsSnapshot = await getDocs(newsQuery);
    
    // Fetch from videos
    const videosQuery = query(
      collection(db, 'videos'),
      where('status', '==', 'published'),
      where('isEditorPick', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const videosSnapshot = await getDocs(videosQuery);
    
    // Combine
    let items = [];
    
    newsSnapshot.forEach(doc => {
      const data = doc.data();
      items.push({
        id: doc.id,
        type: 'news',
        title: data.title,
        description: data.excerpt || data.content?.substring(0, 100).replace(/<[^>]*>/g, ''),
        category: data.category || 'News',
        timeAgo: getTimeAgo(data.createdAt?.toDate()),
        image: data.image,
        slug: data.slug,
        views: data.views || 0,
        createdAt: data.createdAt?.toDate()
      });
    });
    
    videosSnapshot.forEach(doc => {
      const data = doc.data();
      items.push({
        id: doc.id,
        type: 'video',
        title: data.title,
        description: data.description,
        category: data.category || 'Video',
        timeAgo: getTimeAgo(data.createdAt?.toDate()),
        image: data.thumbnail,
        slug: data.slug,
        views: data.views || 0,
        createdAt: data.createdAt?.toDate(),
        duration: data.duration,
        videoId: data.videoId
      });
    });
    
    // Sort by createdAt and take latest
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const latestPicks = items.slice(0, limitCount);
    
    return { success: true, data: latestPicks };
  } catch (error) {
    console.error('Error getting editors picks:', error);
    return { success: false, data: [] };
  }
};

// Get Most Watched (top 5 by views from both news and videos)
export const getMostWatched = async (limitCount = 5) => {
  try {
    // Fetch from news
    const newsQuery = query(
      collection(db, 'news'),
      where('status', '==', 'published'),
      orderBy('views', 'desc'),
      limit(limitCount)
    );
    const newsSnapshot = await getDocs(newsQuery);
    
    // Fetch from videos
    const videosQuery = query(
      collection(db, 'videos'),
      where('status', '==', 'published'),
      orderBy('views', 'desc'),
      limit(limitCount)
    );
    const videosSnapshot = await getDocs(videosQuery);
    
    // Combine
    let items = [];
    
    newsSnapshot.forEach(doc => {
      const data = doc.data();
      items.push({
        id: doc.id,
        type: 'news',
        title: data.title,
        views: data.views || 0,
        timeAgo: getTimeAgo(data.createdAt?.toDate()),
        image: data.image,
        slug: data.slug,
        createdAt: data.createdAt?.toDate()
      });
    });
    
    videosSnapshot.forEach(doc => {
      const data = doc.data();
      items.push({
        id: doc.id,
        type: 'video',
        title: data.title,
        views: data.views || 0,
        timeAgo: getTimeAgo(data.createdAt?.toDate()),
        image: data.thumbnail,
        slug: data.slug,
        createdAt: data.createdAt?.toDate(),
        duration: data.duration,
        videoId: data.videoId
      });
    });
    
    // Sort by views and take top
    items.sort((a, b) => b.views - a.views);
    const topWatched = items.slice(0, limitCount);
    
    // Add rank numbers
    const rankedItems = topWatched.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
    
    return { success: true, data: rankedItems };
  } catch (error) {
    console.error('Error getting most watched:', error);
    return { success: false, data: [] };
  }
};

// Increment news view count
export const incrementNewsView = async (newsId) => {
  try {
    const newsRef = doc(db, 'news', newsId);
    await updateDoc(newsRef, {
      views: increment(1)
    });
    return { success: true };
  } catch (error) {
    console.error('Error incrementing news view:', error);
    return { success: false };
  }
};

// Increment video view count
export const incrementVideoView = async (videoId) => {
  try {
    const videoRef = doc(db, 'videos', videoId);
    await updateDoc(videoRef, {
      views: increment(1)
    });
    return { success: true };
  } catch (error) {
    console.error('Error incrementing video view:', error);
    return { success: false };
  }
};