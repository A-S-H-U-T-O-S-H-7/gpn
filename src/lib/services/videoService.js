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
  writeBatch,
  getCountFromServer,
  Timestamp
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
      likes: 0,
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
        likes: data.likes || 0,
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
        likes: data.likes || 0,
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

export const getVideos = async (page = 1, searchTerm = '', statusFilter = 'all', featuredFilter = 'all', videoTypeFilter = 'all') => {
  try {
    const videosRef = collection(db, VIDEOS_COLLECTION);
    let constraints = [orderBy('createdAt', 'desc')];
    
    if (statusFilter !== 'all') {
      constraints.unshift(where('status', '==', statusFilter));
    }
    
    if (videoTypeFilter !== 'all') {
      constraints.unshift(where('videoType', '==', videoTypeFilter));
    }
    
    // Get ALL documents (no limit)
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
        likes: data.likes || 0,
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
      } else if (featuredFilter === 'normal') {
        videos = videos.filter(video => 
          !video.isFeatured && 
          !video.isEditorPick && 
          !video.isTrending && 
          !video.isHero && 
          !video.isTop10
        );
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

// ==================== FIXED: HOMEPAGE LATEST VIDEOS ====================

// Map a Firestore doc to the shape used by the video cards
const toStandardVideo = (docSnap) => {
  const data = docSnap.data();
  const date = data.publishDate ? new Date(data.publishDate) : (data.createdAt?.toDate() || new Date());
  return {
    id: docSnap.id,
    title: data.title || '',
    slug: data.slug || '',
    duration: data.duration || '',
    views: data.views || 0,
    likes: data.likes || 0,
    date,
    category: data.category || '',
    thumbnail: data.thumbnail || '',
    videoId: data.videoId || '',
    isTrending: data.isTrending || false,
    videoType: data.videoType || 'standard',
    formattedDate: getTimeAgo(date),
    formattedViews: formatViews(data.views || 0),
    formattedLikes: formatViews(data.likes || 0),
  };
};

// Read published videos in pages and keep only standard ones (not shorts/reels),
// stopping as soon as we have `count` of them (+1 to know whether more exist).
// This replaces the old approach of downloading EVERY published video.
const fetchStandardVideos = async (count, afterDoc = null) => {
  const videosRef = collection(db, VIDEOS_COLLECTION);
  const batchSize = Math.max(count * 2, 20);
  const videos = [];
  const snaps = [];
  let cursor = afterDoc;
  let exhausted = false;

  while (videos.length <= count && !exhausted) {
    const constraints = [
      where('status', '==', 'published'),
      orderBy('publishDate', 'desc'),
    ];
    if (cursor) constraints.push(startAfter(cursor));
    constraints.push(limit(batchSize));

    const snapshot = await getDocs(query(videosRef, ...constraints));
    snapshot.docs.forEach((docSnap) => {
      if (videos.length > count) return;
      if ((docSnap.data().videoType || 'standard') === 'standard') {
        videos.push(toStandardVideo(docSnap));
        snaps.push(docSnap);
      }
    });

    exhausted = snapshot.docs.length < batchSize;
    cursor = snapshot.docs[snapshot.docs.length - 1] || cursor;
  }

  const hasMore = videos.length > count;
  return {
    videos: videos.slice(0, count),
    hasMore,
    lastDoc: snaps[Math.min(count, snaps.length) - 1] || null,
  };
};

// Total number of published standard videos, via cheap server-side counts
const countStandardVideos = async () => {
  const videosRef = collection(db, VIDEOS_COLLECTION);
  const [all, shorts] = await Promise.all([
    getCountFromServer(query(videosRef, where('status', '==', 'published'))),
    getCountFromServer(query(videosRef, where('status', '==', 'published'), where('videoType', 'in', ['short', 'reel']))),
  ]);
  return Math.max(0, all.data().count - shorts.data().count);
};

export const getLatestVideos = async (page = 1, itemsPerPage = 20) => {
  try {
    const skip = (page - 1) * itemsPerPage;
    const [result, totalVideos] = await Promise.all([
      fetchStandardVideos(skip + itemsPerPage),
      countStandardVideos().catch((error) => {
        console.error('Error counting videos:', error);
        return null;
      }),
    ]);

    const videos = result.videos.slice(skip);

    return {
      success: true,
      videos,
      hasMore: result.hasMore,
      totalVideos: totalVideos ?? result.videos.length,
      // Firestore cursor - pass it back to getMoreVideos()
      lastVisible: result.lastDoc,
    };
  } catch (error) {
    console.error('Error getting latest videos:', error);
    return { success: false, videos: [], hasMore: false, totalVideos: 0 };
  }
};

// ==================== GET MORE VIDEOS ====================

export const getMoreVideos = async (lastVideo, itemsPerPage = 12) => {
  try {
    // Accept either a Firestore snapshot (from getLatestVideos) or a video object / id
    let cursor = null;
    if (lastVideo && typeof lastVideo.data === 'function') {
      cursor = lastVideo;
    } else if (lastVideo) {
      const lastId = lastVideo.id || lastVideo;
      const snap = await getDoc(doc(db, VIDEOS_COLLECTION, lastId));
      cursor = snap.exists() ? snap : null;
    }

    const result = await fetchStandardVideos(itemsPerPage, cursor);

    return {
      success: true,
      videos: result.videos,
      hasMore: result.hasMore,
      lastVisible: result.lastDoc,
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
      orderBy('publishDate', 'desc'),
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
        likes: data.likes || 0,
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
      formattedLikes: formatViews(short.likes || 0),
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
      orderBy('publishDate', 'desc'),
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
          likes: data.likes || 0,
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
// ==================== BULK IMPORT FROM YOUTUBE ====================

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

// Which of these YouTube ids are already saved as videos on the site?
export const getExistingVideoIds = async (youtubeIds) => {
  const existing = new Set();
  const videosRef = collection(db, VIDEOS_COLLECTION);
  const groups = chunk([...new Set(youtubeIds)].filter(Boolean), 30);
  // 10 queries at a time
  for (const wave of chunk(groups, 10)) {
    const snapshots = await Promise.all(wave.map((ids) => getDocs(query(videosRef, where('videoId', 'in', ids)))));
    snapshots.forEach((snap) => snap.forEach((d) => existing.add(d.data().videoId)));
  }
  return existing;
};

const getExistingSlugs = async (slugs) => {
  const existing = new Set();
  const videosRef = collection(db, VIDEOS_COLLECTION);
  const groups = chunk([...new Set(slugs)].filter(Boolean), 30);
  for (const wave of chunk(groups, 10)) {
    const snapshots = await Promise.all(wave.map((part) => getDocs(query(videosRef, where('slug', 'in', part)))));
    snapshots.forEach((snap) => snap.forEach((d) => existing.add(d.data().slug)));
  }
  return existing;
};

// Slug from the title, max ~80 chars. The channel name ("Great Post News")
// is dropped since it's in almost every title. Hindi-only titles lose all
// their letters in generateSlug, so those fall back to "video-<youtube id>".
const importSlug = (title, videoId) => {
  const cleaned = (title || '').replace(/great\s*post\s*news|great\s*post|\bgpn\b/gi, ' ');
  let slug = generateSlug(cleaned);
  if (slug.length > 80) slug = slug.slice(0, 80).replace(/-[^-]*$/, '');
  slug = slug.replace(/^-+|-+$/g, '');
  const words = slug.split('-').filter((w) => /[a-z]/.test(w));
  return words.length >= 2 ? slug : `video-${videoId.toLowerCase()}`;
};

/**
 * Save many YouTube videos at once.
 * videos:  items from /api/youtube-import (videoId, title, description, tags,
 *          thumbnail, duration, publishDate, publishedAt, videoType, youtubeUrl)
 * options: { category, status }
 * Skips videos whose YouTube id already exists. Writes in Firestore batches
 * and logs one activity entry for the whole import.
 */
export const importYouTubeVideos = async (videos, options, adminData, onProgress) => {
  try {
    const { category = '', status = 'published' } = options || {};

    const existingIds = await getExistingVideoIds(videos.map((v) => v.videoId));
    const toImport = videos.filter((v) => !existingIds.has(v.videoId));

    // Make slugs unique against the database and within this import
    const baseSlugs = toImport.map((v) => importSlug(v.title, v.videoId));
    const takenSlugs = await getExistingSlugs(baseSlugs);
    const used = new Set();
    const slugs = baseSlugs.map((slug, i) => {
      let finalSlug = slug;
      if (takenSlugs.has(finalSlug) || used.has(finalSlug)) {
        finalSlug = `${slug}-${toImport[i].videoId.toLowerCase()}`;
      }
      used.add(finalSlug);
      return finalSlug;
    });

    let saved = 0;
    const groups = chunk(toImport.map((v, i) => ({ ...v, slug: slugs[i] })), 400);

    for (const group of groups) {
      const batch = writeBatch(db);
      group.forEach((v) => {
        const ytDate = v.publishedAt ? Timestamp.fromDate(new Date(v.publishedAt)) : serverTimestamp();
        const description = v.description || '';
        batch.set(doc(collection(db, VIDEOS_COLLECTION)), {
          title: v.title,
          slug: v.slug,
          youtubeUrl: v.youtubeUrl || `https://www.youtube.com/watch?v=${v.videoId}`,
          videoId: v.videoId,
          thumbnail: v.thumbnail || getYouTubeThumbnail(v.videoId),
          duration: v.duration || '',
          category,
          tags: v.tags || [],
          description,
          metatitle: v.title,
          metadesc: description.replace(/\s+/g, ' ').trim().substring(0, 160),
          metakeywords: (v.tags || []).join(', '),
          status,
          videoType: v.videoType || 'standard',
          isFeatured: false,
          isEditorPick: false,
          isTrending: false,
          isHero: false,
          isTop10: false,
          // Keep YouTube's original upload date so old videos sort as old
          publishDate: v.publishDate || new Date().toISOString().split('T')[0],
          views: 0,
          likes: 0,
          createdAt: ytDate,
          updatedAt: serverTimestamp(),
          publishedAt: status === 'published' ? ytDate : null,
          importedFrom: 'youtube',
          importedAt: serverTimestamp(),
        });
      });
      await batch.commit();
      saved += group.length;
      onProgress?.(saved, toImport.length);
    }

    if (saved > 0) {
      await logActivity({
        action: ActivityActions.CREATE,
        entityType: ActivityEntityTypes.VIDEO,
        entityId: 'youtube-import',
        entityTitle: `${saved} videos imported from YouTube`,
        details: `Imported ${saved} videos from YouTube (category: ${category || 'none'}, status: ${status})`,
        adminId: adminData?.id,
        adminName: adminData?.name,
        adminRole: adminData?.role,
      });
    }

    return { success: true, imported: saved, skipped: videos.length - toImport.length };
  } catch (error) {
    console.error('Error importing YouTube videos:', error);
    return { success: false, error: error.message };
  }
};
