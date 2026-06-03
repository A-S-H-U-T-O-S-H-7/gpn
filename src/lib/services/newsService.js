import { db, storage } from '@/lib/firebase/config';
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
  serverTimestamp,
  increment,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { logActivity, ActivityActions, ActivityEntityTypes } from './activityLogService';

const NEWS_COLLECTION = 'news';
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

// Upload image
const uploadImage = async (file, fileName) => {
  if (!file) return null;
  
  try {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes((file.type || '').toLowerCase())) {
      throw new Error('Only JPEG, PNG, WebP, and GIF images are allowed');
    }

    const maxFileSize = 5 * 1024 * 1024;
    if (file.size > maxFileSize) {
      throw new Error('Image size must be less than 5MB');
    }

    const timestamp = Date.now();
    const extension = (file.name || 'jpg').split('.').pop().toLowerCase();
    const safeFileName = `${fileName}_${timestamp}.${extension}`;
    const storageRef = ref(storage, `news/images/${safeFileName}`);

    const uploadResult = await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(uploadResult.ref);
    
    return imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Delete image
const deleteImage = async (imageUrl) => {
  if (!imageUrl) return;
  
  try {
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

// Set news as hero (removes hero from other news and videos)
const setNewsAsHero = async (newsId, adminData) => {
  try {
    const batch = writeBatch(db);
    
    // Remove hero flag from all news
    const newsQuery = query(collection(db, NEWS_COLLECTION), where('isHero', '==', true));
    const newsSnapshot = await getDocs(newsQuery);
    newsSnapshot.forEach(doc => {
      batch.update(doc.ref, { isHero: false });
    });
    
    // Remove hero flag from all videos
    const videosQuery = query(collection(db, 'videos'), where('isHero', '==', true));
    const videosSnapshot = await getDocs(videosQuery);
    videosSnapshot.forEach(doc => {
      batch.update(doc.ref, { isHero: false });
    });
    
    // Set hero flag on the selected news
    const newsRef = doc(db, NEWS_COLLECTION, newsId);
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
    console.error('Error setting news as hero:', error);
    return { success: false, error: error.message };
  }
};

// Create news
export const createNews = async (newsData, imageFile, adminData) => {
  try {
    let imageUrl = null;
    
    if (imageFile) {
      const fileName = generateSlug(newsData.title);
      imageUrl = await uploadImage(imageFile, fileName);
    }
    
    const newsRef = await addDoc(collection(db, NEWS_COLLECTION), {
      title: newsData.title,
      slug: newsData.url || generateSlug(newsData.title),
      content: newsData.content,
      excerpt: newsData.excerpt || newsData.content?.substring(0, 150).replace(/<[^>]*>/g, '') || '',
      category: newsData.category || 'general',
      tags: newsData.tags || [],
      metatitle: newsData.metatitle,
      metadesc: newsData.metadesc,
      metakeywords: newsData.metakeywords || '',
      status: newsData.status,
      image: imageUrl,
      isBreaking: newsData.isBreaking || false,
      isEditorPick: newsData.isEditorPick || false,
      isTrending: newsData.isTrending || false,
      isHero: newsData.isHero || false,  // ← ADD THIS
      editorPickOrder: newsData.isEditorPick ? (newsData.editorPickOrder || 0) : 0,
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: newsData.status === 'published' ? serverTimestamp() : null,
    });
    
    // If this news is marked as hero, set it as hero (removes from others)
    if (newsData.isHero && newsRef.id) {
      await setNewsAsHero(newsRef.id, adminData);
    }
    
    // Log activity
    await logActivity({
      action: ActivityActions.CREATE,
      entityType: ActivityEntityTypes.NEWS,
      entityId: newsRef.id,
      entityTitle: newsData.title,
      details: `Created news article: ${newsData.title}`,
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true, id: newsRef.id };
  } catch (error) {
    console.error('Error creating news:', error);
    return { success: false, error: error.message };
  }
};

// Update news
export const updateNews = async (newsId, newsData, imageFile, existingImageUrl, oldNewsData, adminData) => {
  try {
    let imageUrl = existingImageUrl;
    
    if (imageFile) {
      if (existingImageUrl) {
        await deleteImage(existingImageUrl);
      }
      const fileName = generateSlug(newsData.title);
      imageUrl = await uploadImage(imageFile, fileName);
    }
    
    // Log specific changes
    if (oldNewsData.isBreaking !== newsData.isBreaking) {
      await logActivity({
        action: newsData.isBreaking ? ActivityActions.BREAKING_ON : ActivityActions.BREAKING_OFF,
        entityType: ActivityEntityTypes.NEWS,
        entityId: newsId,
        entityTitle: newsData.title,
        details: `${newsData.isBreaking ? 'Marked as' : 'Removed from'} Breaking News`,
        adminId: adminData.id,
        adminName: adminData.name,
        adminRole: adminData.role,
      });
    }
    
    if (oldNewsData.isEditorPick !== newsData.isEditorPick) {
      await logActivity({
        action: newsData.isEditorPick ? ActivityActions.EDITOR_PICK_ON : ActivityActions.EDITOR_PICK_OFF,
        entityType: ActivityEntityTypes.NEWS,
        entityId: newsId,
        entityTitle: newsData.title,
        details: `${newsData.isEditorPick ? 'Added to' : 'Removed from'} Editor's Pick`,
        adminId: adminData.id,
        adminName: adminData.name,
        adminRole: adminData.role,
      });
    }
    
    if (oldNewsData.isTrending !== newsData.isTrending) {
      await logActivity({
        action: newsData.isTrending ? ActivityActions.TRENDING_ON : ActivityActions.TRENDING_OFF,
        entityType: ActivityEntityTypes.NEWS,
        entityId: newsId,
        entityTitle: newsData.title,
        details: `${newsData.isTrending ? 'Marked as' : 'Removed from'} Trending`,
        adminId: adminData.id,
        adminName: adminData.name,
        adminRole: adminData.role,
      });
    }
    
    if (oldNewsData.status !== newsData.status) {
      await logActivity({
        action: newsData.status === 'published' ? ActivityActions.PUBLISH : ActivityActions.UNPUBLISH,
        entityType: ActivityEntityTypes.NEWS,
        entityId: newsId,
        entityTitle: newsData.title,
        details: `Changed status from ${oldNewsData.status} to ${newsData.status}`,
        adminId: adminData.id,
        adminName: adminData.name,
        adminRole: adminData.role,
      });
    }
    
    const newsRef = doc(db, NEWS_COLLECTION, newsId);
    const updateData = {
      title: newsData.title,
      slug: newsData.url || generateSlug(newsData.title),
      content: newsData.content,
      excerpt: newsData.excerpt || newsData.content?.substring(0, 150).replace(/<[^>]*>/g, '') || '',
      category: newsData.category || 'general',
      tags: newsData.tags || [],
      metatitle: newsData.metatitle,
      metadesc: newsData.metadesc,
      metakeywords: newsData.metakeywords || '',
      status: newsData.status,
      isBreaking: newsData.isBreaking || false,
      isEditorPick: newsData.isEditorPick || false,
      isTrending: newsData.isTrending || false,
      isHero: newsData.isHero || false,  // ← ADD THIS
      editorPickOrder: newsData.isEditorPick ? (newsData.editorPickOrder || 0) : 0,
      updatedAt: serverTimestamp(),
    };
    
    if (imageUrl) {
      updateData.image = imageUrl;
    }
    
    if (newsData.status === 'published' && !existingImageUrl) {
      updateData.publishedAt = serverTimestamp();
    }
    
    await updateDoc(newsRef, updateData);
    
    // If this news is marked as hero, set it as hero (removes from others)
    if (newsData.isHero && newsId) {
      await setNewsAsHero(newsId, adminData);
    }
    
    // Log general update
    if (oldNewsData.title !== newsData.title || oldNewsData.content !== newsData.content) {
      await logActivity({
        action: ActivityActions.UPDATE,
        entityType: ActivityEntityTypes.NEWS,
        entityId: newsId,
        entityTitle: newsData.title,
        details: `Updated news article: ${newsData.title}`,
        adminId: adminData.id,
        adminName: adminData.name,
        adminRole: adminData.role,
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating news:', error);
    return { success: false, error: error.message };
  }
};

// Delete news
export const deleteNews = async (newsId, newsTitle, imageUrl, adminData) => {
  try {
    if (imageUrl) {
      await deleteImage(imageUrl);
    }
    
    await deleteDoc(doc(db, NEWS_COLLECTION, newsId));
    
    await logActivity({
      action: ActivityActions.DELETE,
      entityType: ActivityEntityTypes.NEWS,
      entityId: newsId,
      entityTitle: newsTitle,
      details: `Deleted news article: ${newsTitle}`,
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting news:', error);
    return { success: false, error: error.message };
  }
};

// Get news by ID
export const getNewsById = async (newsId) => {
  try {
    const newsRef = doc(db, NEWS_COLLECTION, newsId);
    const newsSnap = await getDoc(newsRef);
    
    if (!newsSnap.exists()) {
      return { success: false, error: 'News not found' };
    }
    
    const data = newsSnap.data();
    return {
      success: true,
      news: {
        id: newsSnap.id,
        title: data.title || '',
        slug: data.slug || '',
        url: data.slug || '',
        content: data.content || '',
        category: data.category || 'general',
        tags: data.tags || [],
        metatitle: data.metatitle || '',
        metadesc: data.metadesc || '',
        metakeywords: data.metakeywords || '',
        status: data.status || 'draft',
        image: data.image || null,
        excerpt: data.excerpt || '',
        isBreaking: data.isBreaking || false,
        isEditorPick: data.isEditorPick || false,
        isTrending: data.isTrending || false,
        isHero: data.isHero || false,  // ← ADD THIS
        editorPickOrder: data.editorPickOrder || 0,
        views: data.views || 0,
        createdAt: data.createdAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null,
        publishedAt: data.publishedAt?.toDate?.() || null,
      }
    };
  } catch (error) {
    console.error('Error getting news:', error);
    return { success: false, error: error.message };
  }
};

// Get all news
export const getNews = async (page = 1, searchTerm = '', statusFilter = 'all', typeFilter = 'all') => {
  try {
    const newsRef = collection(db, NEWS_COLLECTION);
    let constraints = [orderBy('createdAt', 'desc')];
    
    if (statusFilter !== 'all') {
      constraints.push(where('status', '==', statusFilter));
    }
    
    constraints.push(limit(100));
    
    const q = query(newsRef, ...constraints);
    const snapshot = await getDocs(q);
    
    let news = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      news.push({
        id: doc.id,
        title: data.title || '',
        excerpt: data.excerpt || '',
        category: data.category || 'general',
        status: data.status || 'draft',
        image: data.image || null,
        isBreaking: data.isBreaking || false,
        isEditorPick: data.isEditorPick || false,
        isTrending: data.isTrending || false,
        isHero: data.isHero || false,  // ← ADD THIS
        views: data.views || 0,
        createdAt: data.createdAt?.toDate?.() || null,
        publishedAt: data.publishedAt?.toDate?.() || null,
      });
    });
    
    // Apply type filter
    if (typeFilter !== 'all') {
      if (typeFilter === 'breaking') {
        news = news.filter(item => item.isBreaking === true);
      } else if (typeFilter === 'trending') {
        news = news.filter(item => item.isTrending === true);
      } else if (typeFilter === 'editor_pick') {
        news = news.filter(item => item.isEditorPick === true);
      } else if (typeFilter === 'hero') {  // ← ADD THIS
        news = news.filter(item => item.isHero === true);
      }
    }
    
    // Apply search filter
    if (searchTerm) {
      news = news.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Pagination
    const totalItems = news.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedNews = news.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    
    return {
      success: true,
      news: paginatedNews,
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error('Error getting news:', error);
    return { success: false, error: error.message, news: [], totalPages: 1, totalItems: 0 };
  }
};

// Increment news view count
export const incrementNewsView = async (newsId) => {
  try {
    const newsRef = doc(db, NEWS_COLLECTION, newsId);
    await updateDoc(newsRef, {
      views: increment(1)
    });
    return { success: true };
  } catch (error) {
    console.error('Error incrementing view:', error);
    return { success: false, error: error.message };
  }
};

// Get news by slug
export const getNewsBySlug = async (slug) => {
  try {
    const newsRef = collection(db, NEWS_COLLECTION);
    const q = query(newsRef, where('slug', '==', slug), where('status', '==', 'published'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: false, error: 'News not found' };
    }
    
    const newsDoc = querySnapshot.docs[0];
    const data = newsDoc.data();
    
    return {
      success: true,
      news: {
        id: newsDoc.id,
        title: data.title || '',
        slug: data.slug || '',
        content: data.content || '',
        excerpt: data.excerpt || '',
        category: data.category || '',
        image: data.image || null,
        views: data.views || 0,
        createdAt: data.createdAt?.toDate?.() || null,
        publishedAt: data.publishedAt?.toDate?.() || null,
      }
    };
  } catch (error) {
    console.error('Error getting news by slug:', error);
    return { success: false, error: error.message };
  }
};

// Get news by category slug
export const getNewsByCategory = async (categorySlug, page = 1, itemsPerPage = 12) => {
  try {
    const newsRef = collection(db, NEWS_COLLECTION);
    let constraints = [
      where('status', '==', 'published'),
      where('category', '==', categorySlug),
      orderBy('createdAt', 'desc'),
      limit(itemsPerPage)
    ];
    
    const q = query(newsRef, ...constraints);
    const snapshot = await getDocs(q);
    
    const news = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      news.push({
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        image: data.image || null,
        views: data.views || 0,
        createdAt: data.createdAt?.toDate?.() || null,
        publishedAt: data.publishedAt?.toDate?.() || null,
      });
    });
    
    return { success: true, news };
  } catch (error) {
    console.error('Error getting news by category:', error);
    return { success: false, error: error.message, news: [] };
  }
};

export const getBreakingNews = async (maxlimit = 10) => {
  try {
    const newsRef = collection(db, NEWS_COLLECTION);
    const q = query(
      newsRef,
      where('status', '==', 'published'),
      where('isBreaking', '==', true),
      orderBy('publishedAt', 'desc'),
      limit(maxlimit)
    );
    const snapshot = await getDocs(q);
    
    const news = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      news.push({
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        publishedAt: data.publishedAt?.toDate?.() || null,
      });
    });
    
    return { success: true, news };
  } catch (error) {
    console.error('Error getting breaking news:', error);
    return { success: false, error: error.message, news: [] };
  }
};
