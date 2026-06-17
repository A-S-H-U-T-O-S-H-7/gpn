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

const VIDEOS_COLLECTION = 'videos';
const ITEMS_PER_PAGE = 10;

// ==================== HELPER FUNCTIONS ====================

export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const getYouTubeId = (url) => {
  if (!url) return null;
  
  if (url.includes('youtu.be/')) {
    const match = url.match(/youtu\.be\/([^?&]+)/);
    return match ? match[1] : null;
  }
  
  if (url.includes('/shorts/')) {
    const match = url.match(/\/shorts\/([^?&]+)/);
    return match ? match[1] : null;
  }
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const getYouTubeThumbnail = (videoId) => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

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

// ==================== SET TOP 10 VIDEO ====================

const setVideoAsTop10 = async (videoId, adminData) => {
  try {
    const batch = writeBatch(db);
    
    const videosQuery = query(collection(db, VIDEOS_COLLECTION), where('isTop10', '==', true));
    const videosSnapshot = await getDocs(videosQuery);
    videosSnapshot.forEach(doc => {
      if (doc.id !== videoId) {
        batch.update(doc.ref, { isTop10: false });
      }
    });
    
    const videoRef = doc(db, VIDEOS_COLLECTION, videoId);
    batch.update(videoRef, { isTop10: true });
    
    await batch.commit();
    
    await logActivity({
      action: ActivityActions.UPDATE,
      entityType: ActivityEntityTypes.VIDEO,
      entityId: videoId,
      entityTitle: 'Top 10 News',
      details: `Set as Top 10 News on homepage`,
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error setting video as Top 10:', error);
    return { success: false, error: error.message };
  }
};

// ==================== SET HERO VIDEO ====================

const setVideoAsHero = async (videoId, adminData) => {
  try {
    const batch = writeBatch(db);
    
    const videosQuery = query(collection(db, VIDEOS_COLLECTION), where('isHero', '==', true));
    const videosSnapshot = await getDocs(videosQuery);
    videosSnapshot.forEach(doc => {
      batch.update(doc.ref, { isHero: false });
    });
    
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

// ==================== CREATE ====================

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
      videoType: videoData.videoType || 'standard',
      isFeatured: videoData.isFeatured || false,
      isEditorPick: videoData.isEditorPick || false,
      isTrending: videoData.isTrending || false,
      isHero: videoData.isHero || false,
      isTop10: videoData.isTop10 || false,
      publishDate: videoData.publishDate || new Date().toISOString().split('T')[0],
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: videoData.status === 'published' ? serverTimestamp() : null,
    });
    
    if (videoData.isHero && videoRef.id) {
      await setVideoAsHero(videoRef.id, adminData);
    }
    
    if (videoData.isTop10 && videoRef.id) {
      await setVideoAsTop10(videoRef.id, adminData);
    }
    
    await logActivity({
      action: ActivityActions.CREATE,
      entityType: ActivityEntityTypes.VIDEO,
      entityId: videoRef.id,
      entityTitle: videoData.title,
      details: `Created video: ${videoData.title} (Type: ${videoData.videoType || 'standard'})`,
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

// ==================== UPDATE ====================

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
      videoType: videoData.videoType || 'standard',
      isFeatured: videoData.isFeatured || false,
      isEditorPick: videoData.isEditorPick || false,
      isTrending: videoData.isTrending || false,
      isHero: videoData.isHero || false,
      isTop10: videoData.isTop10 || false,
      publishDate: videoData.publishDate || null,
      updatedAt: serverTimestamp(),
    };
    
    if (videoData.status === 'published' && oldVideoData.status !== 'published') {
      updateData.publishedAt = serverTimestamp();
    }
    
    await updateDoc(videoRef, updateData);
    
    if (videoData.isHero && videoId) {
      await setVideoAsHero(videoId, adminData);
    }
    
    if (videoData.isTop10 && videoId) {
      await setVideoAsTop10(videoId, adminData);
    }
    
    // Log changes
    if (oldVideoData.videoType !== videoData.videoType) {
      await logActivity({
        action: ActivityActions.UPDATE,
        entityType: ActivityEntityTypes.VIDEO,
        entityId: videoId,
        entityTitle: videoData.title,
        details: `Changed video type from ${oldVideoData.videoType} to ${videoData.videoType}`,
        adminId: adminData.id,
        adminName: adminData.name,
        adminRole: adminData.role,
      });
    }
    
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
    
    if (oldVideoData.isHero !== videoData.isHero) {
      await logActivity({
        action: videoData.isHero ? ActivityActions.HERO_ON : ActivityActions.HERO_OFF,
        entityType: ActivityEntityTypes.VIDEO,
        entityId: videoId,
        entityTitle: videoData.title,
        details: `${videoData.isHero ? 'Set as' : 'Removed from'} Hero`,
        adminId: adminData.id,
        adminName: adminData.name,
        adminRole: adminData.role,
      });
    }
    
    if (oldVideoData.isTop10 !== videoData.isTop10) {
      await logActivity({
        action: videoData.isTop10 ? ActivityActions.TOP10_ON : ActivityActions.TOP10_OFF,
        entityType: ActivityEntityTypes.VIDEO,
        entityId: videoId,
        entityTitle: videoData.title,
        details: `${videoData.isTop10 ? 'Set as' : 'Removed from'} Top 10 News`,
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

// ==================== DELETE ====================

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

// ==================== GET VIDEO BY ID ====================

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
        videoType: data.videoType || 'standard',
        isFeatured: data.isFeatured || false,
        isEditorPick: data.isEditorPick || false,
        isTrending: data.isTrending || false,
        isHero: data.isHero || false,
        isTop10: data.isTop10 || false,
        publishDate: data.publishDate || null,
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

// ==================== GET VIDEO BY SLUG ====================

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
        publishDate: data.publishDate || null,
        createdAt: data.createdAt?.toDate?.() || null,
        publishedAt: data.publishedAt?.toDate?.() || null,
      }
    };
  } catch (error) {
    console.error('Error getting video by slug:', error);
    return { success: false, error: error.message };
  }
};

// ==================== ADMIN: GET ALL VIDEOS ====================

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
        videoType: data.videoType || 'standard',
        isFeatured: data.isFeatured || false,
        isEditorPick: data.isEditorPick || false,
        isTrending: data.isTrending || false,
        isHero: data.isHero || false,
        isTop10: data.isTop10 || false,
        publishDate: data.publishDate || null,
        views: data.views || 0,
        createdAt: data.createdAt?.toDate?.() || null,
        publishedAt: data.publishedAt?.toDate?.() || null,
      });
    });
    
    if (featuredFilter !== 'all') {
      if (featuredFilter === 'featured') {
        videos = videos.filter(video => video.isFeatured === true);
      } else if (featuredFilter === 'editor_pick') {
        videos = videos.filter(video => video.isEditorPick === true);
      } else if (featuredFilter === 'trending') {
        videos = videos.filter(video => video.isTrending === true);
      } else if (featuredFilter === 'hero') {
        videos = videos.filter(video => video.isHero === true);
      } else if (featuredFilter === 'top10') {
        videos = videos.filter(video => video.isTop10 === true);
      }
    }
    
    if (searchTerm) {
      videos = videos.filter(video => 
        video.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
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

// ==================== HOMEPAGE: LATEST VIDEOS ====================

export const getLatestVideos = async (page = 1, itemsPerPage = 20) => {
  try {
    const videosRef = collection(db, VIDEOS_COLLECTION);
    const constraints = [
      where('status', '==', 'published'),
      orderBy('publishDate', 'desc'),
      limit(itemsPerPage)
    ];
    
    const q = query(videosRef, ...constraints);
    const snapshot = await getDocs(q);
    
    const videos = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      const videoType = data.videoType || 'standard';
      
      if (videoType === 'standard') {
        videos.push({
          id: doc.id,
          title: data.title || '',
          slug: data.slug || '',
          duration: data.duration || '',
          views: data.views || 0,
          date: data.publishDate ? new Date(data.publishDate) : (data.createdAt?.toDate() || new Date()),
          category: data.category || '',
          thumbnail: data.thumbnail || '',
          videoId: data.videoId || '',
          isTrending: data.isTrending || false,
          videoType: videoType,
        });
      }
    });
    
    const formattedVideos = videos.map(video => ({
      ...video,
      formattedDate: getTimeAgo(video.date),
      formattedViews: formatViews(video.views),
    }));
    
    return { 
      success: true, 
      videos: formattedVideos, 
      hasMore: videos.length === itemsPerPage 
    };
  } catch (error) {
    console.error('Error getting latest videos:', error);
    return { success: false, videos: [], hasMore: false };
  }
};

export const getMoreVideos = async (lastDoc, itemsPerPage = 10) => {
  try {
    const videosRef = collection(db, VIDEOS_COLLECTION);
    const q = query(
      videosRef,
      where('status', '==', 'published'),
      orderBy('publishDate', 'desc'),
      startAfter(lastDoc),
      limit(itemsPerPage)
    );
    const snapshot = await getDocs(q);
    
    const videos = [];
    let lastVisible = null;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const videoType = data.videoType || 'standard';
      
      if (videoType === 'standard') {
        videos.push({
          id: doc.id,
          title: data.title || '',
          slug: data.slug || '',
          duration: data.duration || '',
          views: data.views || 0,
          date: data.publishDate ? new Date(data.publishDate) : (data.createdAt?.toDate() || new Date()),
          category: data.category || '',
          thumbnail: data.thumbnail || '',
          videoId: data.videoId || '',
          isTrending: data.isTrending || false,
          videoType: videoType,
        });
        lastVisible = doc;
      }
    });
    
    const formattedVideos = videos.map(video => ({
      ...video,
      formattedDate: getTimeAgo(video.date),
      formattedViews: formatViews(video.views),
    }));
    
    return { 
      success: true, 
      videos: formattedVideos, 
      lastVisible, 
      hasMore: videos.length === itemsPerPage 
    };
  } catch (error) {
    console.error('Error getting more videos:', error);
    return { success: false, videos: [], hasMore: false };
  }
};

// ==================== HOMEPAGE: SHORTS & REELS ====================

export const getLatestShorts = async (limitCount = 10, lastDoc = null) => {
  try {
    const videosRef = collection(db, VIDEOS_COLLECTION);
    let constraints = [
      where('status', '==', 'published'),
      where('videoType', 'in', ['short', 'reel']),
      orderBy('publishDate', 'desc'),  // ✅ FIXED: Now sorted by publishDate
      limit(limitCount)
    ];
    
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }
    
    const q = query(videosRef, ...constraints);
    const snapshot = await getDocs(q);
    
    const shorts = [];
    let lastVisible = null;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      shorts.push({
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        videoId: data.videoId || '',
        youtubeUrl: data.youtubeUrl || '',
        thumbnail: data.thumbnail || '',
        duration: data.duration || '',
        category: data.category || '',
        views: data.views || 0,
        videoType: data.videoType || 'short',
        date: data.publishDate ? new Date(data.publishDate) : (data.createdAt?.toDate() || new Date()),
        publishedAt: data.publishedAt?.toDate() || null,
      });
      lastVisible = doc;
    });
    
    const formattedShorts = shorts.map(short => ({
      ...short,
      formattedDate: getTimeAgo(short.date),
      formattedViews: formatViews(short.views),
    }));
    
    return { 
      success: true, 
      shorts: formattedShorts, 
      lastVisible,
      hasMore: snapshot.docs.length === limitCount
    };
  } catch (error) {
    console.error('Error getting latest shorts:', error);
    return { success: false, shorts: [], hasMore: false };
  }
};

export const getShortsWithNavigation = async (currentId, allShorts) => {
  try {
    const currentIndex = allShorts.findIndex(short => short.id === currentId);
    const prevShort = currentIndex > 0 ? allShorts[currentIndex - 1] : null;
    const nextShort = currentIndex < allShorts.length - 1 ? allShorts[currentIndex + 1] : null;
    
    return {
      success: true,
      current: allShorts[currentIndex],
      prev: prevShort,
      next: nextShort,
      currentIndex: currentIndex + 1,
      total: allShorts.length
    };
  } catch (error) {
    console.error('Error getting navigation:', error);
    return { success: false, error: error.message };
  }
};

// ==================== HOMEPAGE: FEATURED SECTIONS ====================

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

export const getEditorPickVideos = async (limit = 4) => {
  try {
    const videosRef = collection(db, VIDEOS_COLLECTION);
    const q = query(
      videosRef, 
      where('status', '==', 'published'),
      where('isEditorPick', '==', true),
      orderBy('publishDate', 'desc'),  // ✅ FIXED: Now sorted by publishDate
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

export const getFeaturedVideos = async (maxItems = 8) => {
  try {
    const videosRef = collection(db, VIDEOS_COLLECTION);
    const q = query(
      videosRef, 
      where('status', '==', 'published'),
      where('isFeatured', '==', true),
      orderBy('publishDate', 'desc'),  // ✅ FIXED: Now sorted by publishDate
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

export const getFeaturedVideosForHero = async (maxItems = 5) => {
  try {
    const videosRef = collection(db, VIDEOS_COLLECTION);
    const q = query(
      videosRef, 
      where('status', '==', 'published'),
      where('isFeatured', '==', true),
      orderBy('publishDate', 'desc'),
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
        publishDate: data.publishDate || null,
        publishedAt: data.publishedAt?.toDate?.() || new Date(),
      });
    });
    
    return { success: true, videos };
  } catch (error) {
    console.error('Error getting featured videos for hero:', error);
    return { success: false, error: error.message, videos: [] };
  }
};

// ==================== VIDEO ACTIONS ====================

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

// ==================== CATEGORY VIDEOS ====================

export const getVideosByCategory = async (categorySlug, page = 1, itemsPerPage = 12) => {
  try {
    const videosRef = collection(db, VIDEOS_COLLECTION);
    const constraints = [
      where('status', '==', 'published'),
      where('category', '==', categorySlug),
      orderBy('publishDate', 'desc'),
      limit(itemsPerPage)
    ];
    
    const q = query(videosRef, ...constraints);
    const snapshot = await getDocs(q);
    
    const videos = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      const videoType = data.videoType || 'standard';
      
      if (videoType === 'standard') {
        videos.push({
          id: doc.id,
          title: data.title || '',
          slug: data.slug || '',
          description: data.description || '',
          thumbnail: data.thumbnail || '',
          videoId: data.videoId || '',
          duration: data.duration || '',
          views: data.views || 0,
          publishDate: data.publishDate || null,
          createdAt: data.createdAt?.toDate?.() || null,
          publishedAt: data.publishedAt?.toDate?.() || null,
        });
      }
    });
    
    return { success: true, videos };
  } catch (error) {
    console.error('Error getting videos by category:', error);
    return { success: false, error: error.message, videos: [] };
  }
};

// ==================== TOP 10 VIDEO ====================

export const getTop10Video = async () => {
  try {
    const videosRef = collection(db, VIDEOS_COLLECTION);
    const q = query(
      videosRef,
      where('isTop10', '==', true),
      where('status', '==', 'published'),
      orderBy('publishDate', 'desc'), 
      limit(1)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log("No Top 10 video found");
      return { success: false, video: null };
    }
    
    const doc = snapshot.docs[0];
    const data = doc.data();
    
    return {
      success: true,
      video: {
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        description: data.description || '',
        category: data.category || '',
        thumbnail: data.thumbnail || '',
        videoId: data.videoId || '',
        duration: data.duration || '',
        views: data.views || 0,
        isTop10: data.isTop10 || false,
        publishDate: data.publishDate || null,
        createdAt: data.createdAt?.toDate?.() || null,
        publishedAt: data.publishedAt?.toDate?.() || null,
        youtubeUrl: data.youtubeUrl || '',
        videoType: data.videoType || 'standard',
      }
    };
  } catch (error) {
    console.error("Error fetching Top 10 video:", error);
    return { success: false, video: null };
  }
};