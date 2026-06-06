import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { logActivity, ActivityActions, ActivityEntityTypes } from './activityLogService';

// Get both hero items (one news, one video) for homepage carousel
export const getHeroItems = async () => {
  try {
    // Get hero news
    const newsQuery = query(
      collection(db, 'news'),
      where('status', '==', 'published'),
      where('isHero', '==', true)
    );
    const newsSnapshot = await getDocs(newsQuery);
    let heroNews = null;
    
    if (!newsSnapshot.empty) {
      const docSnap = newsSnapshot.docs[0];
      const data = docSnap.data();
      heroNews = {
        id: docSnap.id,
        type: 'news',
        title: data.title,
        slug: data.slug,
        description: data.excerpt || data.content?.substring(0, 150).replace(/<[^>]*>/g, ''),
        category: data.category,
        image: data.image,
        readTime: Math.ceil((data.content?.length || 0) / 1000),
        views: data.views || 0,
        createdAt: data.createdAt?.toDate?.()
      };
    }
    
    // Get hero video
    const videosQuery = query(
      collection(db, 'videos'),
      where('status', '==', 'published'),
      where('isHero', '==', true)
    );
    const videosSnapshot = await getDocs(videosQuery);
    let heroVideo = null;
    
    if (!videosSnapshot.empty) {
      const docSnap = videosSnapshot.docs[0];
      const data = docSnap.data();
      heroVideo = {
        id: docSnap.id,
        type: 'video',
        title: data.title,
        slug: data.slug,
        description: data.description,
        category: data.category,
        image: data.thumbnail,
        videoId: data.videoId,
        duration: data.duration,
        views: data.views || 0,
        createdAt: data.createdAt?.toDate?.()
      };
    }
    
    // Combine into array for carousel (news first, then video)
    const heroItems = [];
    if (heroNews) heroItems.push(heroNews);
    if (heroVideo) heroItems.push(heroVideo);
    
    return { success: true, heroItems };
  } catch (error) {
    console.error('Error getting hero items:', error);
    return { success: false, heroItems: [], error: error.message };
  }
};

// Get hero news only
export const getHeroNews = async () => {
  try {
    const q = query(
      collection(db, 'news'),
      where('status', '==', 'published'),
      where('isHero', '==', true)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return { success: true, hero: null };
    }
    
    const docSnap = snapshot.docs[0];
    const data = docSnap.data();
    return {
      success: true,
      hero: {
        id: docSnap.id,
        type: 'news',
        title: data.title,
        slug: data.slug,
        description: data.excerpt,
        category: data.category,
        image: data.image,
        readTime: Math.ceil((data.content?.length || 0) / 1000)
      }
    };
  } catch (error) {
    console.error('Error getting hero news:', error);
    return { success: false, hero: null, error: error.message };
  }
};

// Get hero video only
export const getHeroVideo = async () => {
  try {
    const q = query(
      collection(db, 'videos'),
      where('status', '==', 'published'),
      where('isHero', '==', true)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return { success: true, hero: null };
    }
    
    const docSnap = snapshot.docs[0];
    const data = docSnap.data();
    return {
      success: true,
      hero: {
        id: docSnap.id,
        type: 'video',
        title: data.title,
        slug: data.slug,
        description: data.description,
        category: data.category,
        image: data.thumbnail,
        videoId: data.videoId,
        duration: data.duration
      }
    };
  } catch (error) {
    console.error('Error getting hero video:', error);
    return { success: false, hero: null, error: error.message };
  }
};

// Set news as hero (removes hero from other news and videos)
export const setHeroNews = async (newsId, adminData) => {
  try {
    const batch = writeBatch(db);
    
    // Remove hero flag from all news ONLY
    const newsQuery = query(collection(db, 'news'), where('isHero', '==', true));
    const newsSnapshot = await getDocs(newsQuery);
    newsSnapshot.forEach(doc => {
      batch.update(doc.ref, { isHero: false });
    });
    
    
    // Set hero flag on the selected news
    const newsRef = doc(db, 'news', newsId);
    batch.update(newsRef, { isHero: true });
    
    await batch.commit();
    
    await logActivity({
      action: ActivityActions.UPDATE,
      entityType: ActivityEntityTypes.NEWS,
      entityId: newsId,
      entityTitle: 'Hero News',
      details: `Set as Hero News on homepage`,
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error setting hero news:', error);
    return { success: false, error: error.message };
  }
};

// Set video as hero (removes hero from other videos only)
export const setHeroVideo = async (videoId, adminData) => {
  try {
    const batch = writeBatch(db);
    
    // Remove hero flag from all videos ONLY
    const videosQuery = query(collection(db, 'videos'), where('isHero', '==', true));
    const videosSnapshot = await getDocs(videosQuery);
    videosSnapshot.forEach(doc => {
      batch.update(doc.ref, { isHero: false });
    });
    
    
    // Set hero flag on the selected video
    const videoRef = doc(db, 'videos', videoId);
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
    console.error('Error setting hero video:', error);
    return { success: false, error: error.message };
  }
};

// Remove hero from all items
export const removeAllHero = async () => {
  try {
    const batch = writeBatch(db);
    
    const newsQuery = query(collection(db, 'news'), where('isHero', '==', true));
    const newsSnapshot = await getDocs(newsQuery);
    newsSnapshot.forEach(doc => {
      batch.update(doc.ref, { isHero: false });
    });
    
    const videosQuery = query(collection(db, 'videos'), where('isHero', '==', true));
    const videosSnapshot = await getDocs(videosQuery);
    videosSnapshot.forEach(doc => {
      batch.update(doc.ref, { isHero: false });
    });
    
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error('Error removing all hero:', error);
    return { success: false, error: error.message };
  }
};