import { db } from '@/lib/firebase/config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  increment,
  writeBatch
} from 'firebase/firestore';
import { logActivity, ActivityActions, ActivityEntityTypes } from './activityLogService';
import { getActiveCategories } from './categoryService';

const VIDEOS_COLLECTION = 'videos';
const ITEMS_PER_PAGE = 10;

// Generate slug from title
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Extract YouTube ID from URL
export const getYouTubeId = (url) => {
  if (!url) return null;
  
  // Handle youtu.be format
  if (url.includes('youtu.be/')) {
    const match = url.match(/youtu\.be\/([^?&]+)/);
    return match ? match[1] : null;
  }
  
  // Handle youtube.com/shorts/ format
  if (url.includes('/shorts/')) {
    const match = url.match(/\/shorts\/([^?&]+)/);
    return match ? match[1] : null;
  }
  
  // Handle standard youtube.com/watch?v= format
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Get YouTube thumbnail URL
export const getYouTubeThumbnail = (videoId) => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

// Set video as hero (removes hero from other videos and news)
const setVideoAsHero = async (videoId, adminData) => {
  try {
    const batch = writeBatch(db);
    
    // Remove hero flag from all videos ONLY (not news)
    const videosQuery = query(collection(db, VIDEOS_COLLECTION), where('isHero', '==', true));
    const videosSnapshot = await getDocs(videosQuery);
    videosSnapshot.forEach(doc => {
      batch.update(doc.ref, { isHero: false });
    });
    
    
    // Set hero flag on the selected video
    const videoRef = doc(db, VIDEOS_COLLECTION, videoId);
    batch.update(videoRef, { isHero: true });
    
    await batch.commit();
    
    await logActivity({
      action: ActivityActions.UPDATE,
      entityType: ActivityEntityTypes.VIDEO,
      entityId: videoId,
      entityTitle: 'Hero Video',
      details: `Set as Hero Video on homepage`,
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error setting video as hero:', error);
    return { success: false, error: error.message };
  }
};

// Create video
export const createVideo = async (videoData, adminData) => {
  try { 
    const videoId = getYouTubeId(videoData.youtubeUrl);
    
    const videoRef = await addDoc(collection(db, VIDEOS_COLLECTION), {
      title: videoData.title,
      slug: videoData.url || generateSlug(videoData.title),
      youtubeUrl: videoData.youtubeUrl,
      videoId: videoId,
      thumbnail: videoId ? getYouTubeThumbnail(videoId) : null,
      duration: videoData.duration || '',
      category: videoData.category || '',
      tags: videoData.tags || [],
      description: videoData.description || '',
      metatitle: videoData.metatitle || videoData.title,
      metadesc: videoData.metadesc || videoData.description?.substring(0, 160) || '',
      metakeywords: videoData.metakeywords || '',
      status: videoData.status,
      isFeatured: videoData.isFeatured || false,
      isEditorPick: videoData.isEditorPick || false,
      isTrending: videoData.isTrending || false,
      isHero: videoData.isHero || false,  // ← ADD THIS
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: videoData.status === 'published' ? serverTimestamp() : null,
    });
    
    // If this video is marked as hero, set it as hero (removes from others)
    if (videoData.isHero && videoRef.id) {
      await setVideoAsHero(videoRef.id, adminData);
    }
    
    await logActivity({
      action: ActivityActions.CREATE,
      entityType: ActivityEntityTypes.VIDEO,
      entityId: videoRef.id,
      entityTitle: videoData.title,
      details: `Created video: ${videoData.title}`,
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true, id: videoRef.id };
  } catch (error) {
    console.error('Error creating video:', error);
    return { success: false, error: error.message };
  }
};

// Update video
export const updateVideo = async (videoId, videoData, oldVideoData, adminData) => {
  try {
    const videoId_new = getYouTubeId(videoData.youtubeUrl);
    
    const videoRef = doc(db, VIDEOS_COLLECTION, videoId);
    const updateData = {
      title: videoData.title,
      slug: videoData.url || generateSlug(videoData.title),
      youtubeUrl: videoData.youtubeUrl,
      videoId: videoId_new,
      thumbnail: videoId_new ? getYouTubeThumbnail(videoId_new) : null,
      duration: videoData.duration || '',
      category: videoData.category || '',
      tags: videoData.tags || [],
      description: videoData.description || '',
      metatitle: videoData.metatitle || videoData.title,
      metadesc: videoData.metadesc || videoData.description?.substring(0, 160) || '',
      metakeywords: videoData.metakeywords || '',
      status: videoData.status,
      isFeatured: videoData.isFeatured || false,
      isEditorPick: videoData.isEditorPick || false,
      isTrending: videoData.isTrending || false,
      isHero: videoData.isHero || false,  
      updatedAt: serverTimestamp(),
    };
    
    if (videoData.status === 'published' && oldVideoData.status !== 'published') {
      updateData.publishedAt = serverTimestamp();
    }
    
    await updateDoc(videoRef, updateData);
    
    // If this video is marked as hero, set it as hero (removes from others)
    if (videoData.isHero && videoId) {
      await setVideoAsHero(videoId, adminData);
    }
    
    // Log specific changes
    if (oldVideoData.isFeatured !== videoData.isFeatured) {
      await logActivity({
        action: videoData.isFeatured ? ActivityActions.EDITOR_PICK_ON : ActivityActions.EDITOR_PICK_OFF,
        entityType: ActivityEntityTypes.VIDEO,
        entityId: videoId,
        entityTitle: videoData.title,
        details: `${videoData.isFeatured ? 'Added to' : 'Removed from'} Featured Videos`,
        adminId: adminData.id,
        adminName: adminData.name,
        adminRole: adminData.role,
      });
    }
    
    if (oldVideoData.isEditorPick !== videoData.isEditorPick) {
      await logActivity({
        action: videoData.isEditorPick ? ActivityActions.EDITOR_PICK_ON : ActivityActions.EDITOR_PICK_OFF,
        entityType: ActivityEntityTypes.VIDEO,
        entityId: videoId,
        entityTitle: videoData.title,
        details: `${videoData.isEditorPick ? 'Added to' : 'Removed from'} Editor's Pick`,
        adminId: adminData.id,
        adminName: adminData.name,
        adminRole: adminData.role,
      });
    }
    
    if (oldVideoData.isTrending !== videoData.isTrending) {
      await logActivity({
        action: videoData.isTrending ? ActivityActions.TRENDING_ON : ActivityActions.TRENDING_OFF,
        entityType: ActivityEntityTypes.VIDEO,
        entityId: videoId,
        entityTitle: videoData.title,
        details: `${videoData.isTrending ? 'Marked as' : 'Removed from'} Trending`,
        adminId: adminData.id,
        adminName: adminData.name,
        adminRole: adminData.role,
      });
    }
    
    if (oldVideoData.status !== videoData.status) {
      await logActivity({
        action: videoData.status === 'published' ? ActivityActions.PUBLISH : ActivityActions.UNPUBLISH,
        entityType: ActivityEntityTypes.VIDEO,
        entityId: videoId,
        entityTitle: videoData.title,
        details: `Changed status from ${oldVideoData.status} to ${videoData.status}`,
        adminId: adminData.id,
        adminName: adminData.name,
        adminRole: adminData.role,
      });
    }
    
    await logActivity({
      action: ActivityActions.UPDATE,
      entityType: ActivityEntityTypes.VIDEO,
      entityId: videoId,
      entityTitle: videoData.title,
      details: `Updated video: ${videoData.title}`,
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating video:', error);
    return { success: false, error: error.message };
  }
};

// Delete video
export const deleteVideo = async (videoId, videoTitle, adminData) => {
  try {
    await deleteDoc(doc(db, VIDEOS_COLLECTION, videoId));
    
    await logActivity({
      action: ActivityActions.DELETE,
      entityType: ActivityEntityTypes.VIDEO,
      entityId: videoId,
      entityTitle: videoTitle,
      details: `Deleted video: ${videoTitle}`,
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting video:', error);
    return { success: false, error: error.message };
  }
};

// Get video by ID
export const getVideoById = async (videoId) => {
  try {
    const videoRef = doc(db, VIDEOS_COLLECTION, videoId);
    const videoSnap = await getDoc(videoRef);
    
    if (!videoSnap.exists()) {
      return { success: false, error: 'Video not found' };
    }
    
    const data = videoSnap.data();
    return {
      success: true,
      video: {
        id: videoSnap.id,
        title: data.title || '',
        slug: data.slug || '',
        url: data.slug || '',
        youtubeUrl: data.youtubeUrl || '',
        videoId: data.videoId || '',
        thumbnail: data.thumbnail || '',
        duration: data.duration || '',
        category: data.category || '',
        tags: data.tags || [],
        description: data.description || '',
        metatitle: data.metatitle || '',
        metadesc: data.metadesc || '',
        metakeywords: data.metakeywords || '',
        status: data.status || 'draft',
        isFeatured: data.isFeatured || false,
        isEditorPick: data.isEditorPick || false,
        isTrending: data.isTrending || false,
        isHero: data.isHero || false,  // ← ADD THIS
        views: data.views || 0,
        createdAt: data.createdAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null,
        publishedAt: data.publishedAt?.toDate?.() || null,
      }
    };
  } catch (error) {
    console.error('Error getting video:', error);
    return { success: false, error: error.message };
  }
};

// Get all videos
export const getVideos = async (page = 1, searchTerm = '', statusFilter = 'all', featuredFilter = 'all') => {
  try {
    const videosRef = collection(db, VIDEOS_COLLECTION);
    let constraints = [orderBy('createdAt', 'desc'), limit(100)];
    
    if (statusFilter !== 'all') {
      constraints.unshift(where('status', '==', statusFilter));
    }
    
    const q = query(videosRef, ...constraints);
    const snapshot = await getDocs(q);
    
    let videos = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      videos.push({
        id: doc.id,
        title: data.title || '',
        videoId: data.videoId || '',
        thumbnail: data.thumbnail || '',
        duration: data.duration || '',
        category: data.category || '',
        status: data.status || 'draft',
        isFeatured: data.isFeatured || false,
        isEditorPick: data.isEditorPick || false,
        isTrending: data.isTrending || false,
        isHero: data.isHero || false,  // ← ADD THIS
        views: data.views || 0,
        createdAt: data.createdAt?.toDate?.() || null,
        publishedAt: data.publishedAt?.toDate?.() || null,
      });
    });
    
    // Apply featured filter
    if (featuredFilter !== 'all') {
      if (featuredFilter === 'featured') {
        videos = videos.filter(video => video.isFeatured === true);
      } else if (featuredFilter === 'editor_pick') {
        videos = videos.filter(video => video.isEditorPick === true);
      } else if (featuredFilter === 'trending') {
        videos = videos.filter(video => video.isTrending === true);
      } else if (featuredFilter === 'hero') {  // ← ADD THIS
        videos = videos.filter(video => video.isHero === true);
      }
    }
    
    // Apply search filter
    if (searchTerm) {
      videos = videos.filter(video => 
        video.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Pagination
    const totalItems = videos.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedVideos = videos.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    
    return {
      success: true,
      videos: paginatedVideos,
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error('Error getting videos:', error);
    return { success: false, error: error.message, videos: [], totalPages: 1, totalItems: 0 };
  }
};

// Get most watched videos (for homepage)
export const getMostWatchedVideos = async (limit = 5) => {
  try {
    const videosRef = collection(db, VIDEOS_COLLECTION);
    const q = query(
      videosRef, 
      where('status', '==', 'published'),
      orderBy('views', 'desc'),
      limit(limit)
    );
    const snapshot = await getDocs(q);
    
    const videos = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      videos.push({
        id: doc.id,
        title: data.title || '',
        videoId: data.videoId || '',
        thumbnail: data.thumbnail || '',
        duration: data.duration || '',
        views: data.views || 0,
      });
    });
    
    return { success: true, videos };
  } catch (error) {
    console.error('Error getting most watched videos:', error);
    return { success: false, videos: [] };
  }
};

// Get editor's pick videos (for homepage)
export const getEditorPickVideos = async (limit = 4) => {
  try {
    const videosRef = collection(db, VIDEOS_COLLECTION);
    const q = query(
      videosRef, 
      where('status', '==', 'published'),
      where('isEditorPick', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limit)
    );
    const snapshot = await getDocs(q);
    
    const videos = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      videos.push({
        id: doc.id,
        title: data.title || '',
        videoId: data.videoId || '',
        thumbnail: data.thumbnail || '',
        duration: data.duration || '',
        views: data.views || 0,
      });
    });
    
    return { success: true, videos };
  } catch (error) {
    console.error('Error getting editor pick videos:', error);
    return { success: false, videos: [] };
  }
};

// Get trending videos (for homepage)
export const getTrendingVideos = async (limit = 6) => {
  try {
    const videosRef = collection(db, VIDEOS_COLLECTION);
    const q = query(
      videosRef, 
      where('status', '==', 'published'),
      where('isTrending', '==', true),
      orderBy('views', 'desc'),
      limit(limit)
    );
    const snapshot = await getDocs(q);
    
    const videos = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      videos.push({
        id: doc.id,
        title: data.title || '',
        videoId: data.videoId || '',
        thumbnail: data.thumbnail || '',
        duration: data.duration || '',
        views: data.views || 0,
      });
    });
    
    return { success: true, videos };
  } catch (error) {
    console.error('Error getting trending videos:', error);
    return { success: false, videos: [] };
  }
};

// Get featured videos (for homepage)
export const getFeaturedVideos = async (maxItems = 8) => {
  try {
    const videosRef = collection(db, VIDEOS_COLLECTION);
    const q = query(
      videosRef, 
      where('status', '==', 'published'),
      where('isFeatured', '==', true),
      orderBy('createdAt', 'desc'),
      limit(maxItems)
    );
    const snapshot = await getDocs(q);
    
    const videos = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      videos.push({
        id: doc.id,
        title: data.title || '',
        videoId: data.videoId || '',
        thumbnail: data.thumbnail || '',
        duration: data.duration || '',
        views: data.views || 0,
      });
    });
    
    return { success: true, videos };
  } catch (error) {
    console.error('Error getting featured videos:', error);
    return { success: false, videos: [] };
  }
};

// Increment video view count
export const incrementVideoView = async (videoId) => {
  try {
    const videoRef = doc(db, VIDEOS_COLLECTION, videoId);
    await updateDoc(videoRef, {
      views: increment(1)
    });
    return { success: true };
  } catch (error) {
    console.error('Error incrementing view:', error);
    return { success: false, error: error.message };
  }
};

// Get video by slug
export const getVideoBySlug = async (slug) => {
  try {
    const videosRef = collection(db, VIDEOS_COLLECTION);
    const q = query(videosRef, where('slug', '==', slug), where('status', '==', 'published'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: false, error: 'Video not found' };
    }
    
    const videoDoc = querySnapshot.docs[0];
    const data = videoDoc.data();
    
    return {
      success: true,
      video: {
        id: videoDoc.id,
        title: data.title || '',
        slug: data.slug || '',
        description: data.description || '',
        category: data.category || '',
        thumbnail: data.thumbnail || '',
        videoId: data.videoId || '',
        duration: data.duration || '',
        views: data.views || 0,
        createdAt: data.createdAt?.toDate?.() || null,
        publishedAt: data.publishedAt?.toDate?.() || null,
      }
    };
  } catch (error) {
    console.error('Error getting video by slug:', error);
    return { success: false, error: error.message };
  }
};

// Get latest videos for homepage (with pagination)
export const getLatestVideos = async (page = 1, itemsPerPage = 20) => {
  try {
    const videosRef = collection(db, VIDEOS_COLLECTION);
    let constraints = [
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(itemsPerPage)
    ];
    
    const q = query(videosRef, ...constraints);
    const snapshot = await getDocs(q);
    
    const videos = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      videos.push({
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        duration: data.duration || '',
        views: data.views || 0,
        date: data.createdAt?.toDate() || new Date(),
        category: data.category || '',
        thumbnail: data.thumbnail || '',
        videoId: data.videoId || '',
        isTrending: data.isTrending || false,
      });
    });
    
    // Format date for display
    const formattedVideos = videos.map(video => ({
      ...video,
      formattedDate: getTimeAgo(video.date),
      formattedViews: formatViews(video.views),
    }));
    
    return { success: true, videos: formattedVideos, hasMore: videos.length === itemsPerPage };
  } catch (error) {
    console.error('Error getting latest videos:', error);
    return { success: false, videos: [], hasMore: false };
  }
};

// Get more videos (for load more functionality)
export const getMoreVideos = async (lastDoc, itemsPerPage = 10) => {
  try {
    const videosRef = collection(db, VIDEOS_COLLECTION);
    const q = query(
      videosRef,
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      startAfter(lastDoc),
      limit(itemsPerPage)
    );
    const snapshot = await getDocs(q);
    
    const videos = [];
    let lastVisible = null;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      videos.push({
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        duration: data.duration || '',
        views: data.views || 0,
        date: data.createdAt?.toDate() || new Date(),
        category: data.category || '',
        thumbnail: data.thumbnail || '',
        videoId: data.videoId || '',
        isTrending: data.isTrending || false,
      });
      lastVisible = doc;
    });
    
    const formattedVideos = videos.map(video => ({
      ...video,
      formattedDate: getTimeAgo(video.date),
      formattedViews: formatViews(video.views),
    }));
    
    return { success: true, videos: formattedVideos, lastVisible, hasMore: videos.length === itemsPerPage };
  } catch (error) {
    console.error('Error getting more videos:', error);
    return { success: false, videos: [], hasMore: false };
  }
};

// Get videos by category slug
export const getVideosByCategory = async (categorySlug, page = 1, itemsPerPage = 12) => {
  try {
    const videosRef = collection(db, VIDEOS_COLLECTION);
    let constraints = [
      where('status', '==', 'published'),
      where('category', '==', categorySlug),
      orderBy('createdAt', 'desc'),
      limit(itemsPerPage)
    ];
    
    const q = query(videosRef, ...constraints);
    const snapshot = await getDocs(q);
    
    const videos = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      videos.push({
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        description: data.description || '',
        thumbnail: data.thumbnail || '',
        videoId: data.videoId || '',
        duration: data.duration || '',
        views: data.views || 0,
        createdAt: data.createdAt?.toDate?.() || null,
        publishedAt: data.publishedAt?.toDate?.() || null,
      });
    });
    
    return { success: true, videos };
  } catch (error) {
    console.error('Error getting videos by category:', error);
    return { success: false, error: error.message, videos: [] };
  }
};

// Helper functions
function getTimeAgo(date) {
  if (!date) return 'Recently';
  const seconds = Math.floor((new Date() - date) / 1000);
  const intervals = {
    year: 31536000, month: 2592000, week: 604800, day: 86400, hour: 3600, minute: 60
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

function formatViews(views) {
  if (!views) return '0';
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
  return views.toString();
}

export const getFeaturedVideosForHero = async (maxItems = 5) => {
  try {
    const videosRef = collection(db, VIDEOS_COLLECTION);
    const q = query(
      videosRef, 
      where('status', '==', 'published'),
      where('isFeatured', '==', true),
      orderBy('publishedAt', 'desc'),
      limit(maxItems) 
    );
    const snapshot = await getDocs(q);
    
    const videos = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      videos.push({
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        thumbnail: data.thumbnail || '',
        duration: data.duration || '',
        views: data.views || 0,
        videoId: data.videoId || '',
        publishedAt: data.publishedAt?.toDate?.() || new Date(),
      });
    });
    
    return { success: true, videos };
  } catch (error) {
    console.error('Error getting featured videos for hero:', error);
    return { success: false, error: error.message, videos: [] };
  }
};