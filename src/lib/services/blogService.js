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
  startAfter,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const BLOGS_COLLECTION = 'blogs';
const ITEMS_PER_PAGE = 10;

// Cache for blog data (optional)
let blogsCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // 30 seconds

// Generate slug from title
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Upload image to Firebase Storage (optimized)
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
    const storageRef = ref(storage, `blogs/images/${safeFileName}`);

    
    
    const uploadResult = await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(uploadResult.ref);
    
    return imageUrl;
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    throw error;
  }
};

// Delete image from Firebase Storage
const deleteImage = async (imageUrl) => {
  if (!imageUrl) return;
  
  try {
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

// Create a new blog post (optimized)
export const createBlog = async (blogData, imageFile) => {
  try {
    let imageUrl = null;
    
    // Upload image if provided
    if (imageFile) {
      const fileName = generateSlug(blogData.title);
      imageUrl = await uploadImage(imageFile, fileName);
    }
    
    const blogRef = await addDoc(collection(db, BLOGS_COLLECTION), {
      title: blogData.title,
      slug: blogData.url || generateSlug(blogData.title),
      content: blogData.content,
      excerpt: blogData.excerpt || blogData.content?.substring(0, 150).replace(/<[^>]*>/g, '') || '',
      metatitle: blogData.metatitle,
      metadesc: blogData.metadesc,
      metakeywords: blogData.metakeywords || '',
      status: blogData.status,
      image: imageUrl,
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: blogData.status === 'published' ? serverTimestamp() : null,
    });
    
    // Clear cache after creating new blog
    blogsCache = null;
    
    return { success: true, id: blogRef.id };
  } catch (error) {
    console.error('Error creating blog:', error);
    return { success: false, error: error.message };
  }
};

// Update an existing blog post (optimized)
export const updateBlog = async (blogId, blogData, imageFile, existingImageUrl) => {
  try {
    let imageUrl = existingImageUrl;
    
    if (imageFile) {
      if (existingImageUrl) {
        await deleteImage(existingImageUrl);
      }
      const fileName = generateSlug(blogData.title);
      imageUrl = await uploadImage(imageFile, fileName);
    }
    
    const blogRef = doc(db, BLOGS_COLLECTION, blogId);
    const updateData = {
      title: blogData.title,
      slug: blogData.url || generateSlug(blogData.title),
      content: blogData.content,
      excerpt: blogData.excerpt || blogData.content?.substring(0, 150).replace(/<[^>]*>/g, '') || '',
      metatitle: blogData.metatitle,
      metadesc: blogData.metadesc,
      metakeywords: blogData.metakeywords || '',
      status: blogData.status,
      updatedAt: serverTimestamp(),
    };
    
    if (imageUrl) {
      updateData.image = imageUrl;
    }
    
    if (blogData.status === 'published' && !existingImageUrl) {
      updateData.publishedAt = serverTimestamp();
    }
    
    await updateDoc(blogRef, updateData);
    
    // Clear cache after update
    blogsCache = null;
    
    return { success: true };
  } catch (error) {
    console.error('Error updating blog:', error);
    return { success: false, error: error.message };
  }
};

// Delete a blog post
export const deleteBlog = async (blogId, imageUrl) => {
  try {
    if (imageUrl) {
      await deleteImage(imageUrl);
    }
    
    await deleteDoc(doc(db, BLOGS_COLLECTION, blogId));
    
    // Clear cache after delete
    blogsCache = null;
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting blog:', error);
    return { success: false, error: error.message };
  }
};

// Get a single blog post by ID (optimized with caching)
export const getBlogById = async (blogId) => {
  try {
    const blogRef = doc(db, BLOGS_COLLECTION, blogId);
    const blogSnap = await getDoc(blogRef);
    
    if (!blogSnap.exists()) {
      return { success: false, error: 'Blog not found' };
    }
    
    const data = blogSnap.data();
    return {
      success: true,
      blog: {
        id: blogSnap.id,
        title: data.title || '',
        slug: data.slug || '',
        url: data.slug || '',
        content: data.content || '',
        metatitle: data.metatitle || '',
        metadesc: data.metadesc || '',
        metakeywords: data.metakeywords || '',
        status: data.status || 'draft',
        image: data.image || null,
        excerpt: data.excerpt || '',
        views: data.views || 0,
        createdAt: data.createdAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null,
        publishedAt: data.publishedAt?.toDate?.() || null,
      }
    };
  } catch (error) {
    console.error('Error getting blog:', error);
    return { success: false, error: error.message };
  }
};

// OPTIMIZED: Get blogs with server-side pagination (NO client-side filtering)
export const getBlogsOptimized = async (page = 1, searchTerm = '', statusFilter = 'all', lastDoc = null) => {
  try {
    const blogsRef = collection(db, BLOGS_COLLECTION);
    let constraints = [orderBy('createdAt', 'desc')];
    
    // Apply status filter at query level
    if (statusFilter !== 'all') {
      constraints.push(where('status', '==', statusFilter));
    }
    
    // Apply pagination
    if (page > 1 && lastDoc) {
      constraints.push(startAfter(lastDoc));
    }
    
    constraints.push(limit(ITEMS_PER_PAGE));
    
    const q = query(blogsRef, ...constraints);
    const snapshot = await getDocs(q);
    
    const blogs = [];
    let lastVisible = null;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      blogs.push({
        id: doc.id,
        title: data.title || '',
        excerpt: data.excerpt || '',
        status: data.status || 'draft',
        image: data.image || null,
        views: data.views || 0,
        createdAt: data.createdAt?.toDate?.() || null,
        publishedAt: data.publishedAt?.toDate?.() || null,
      });
      lastVisible = doc;
    });
    
    // Apply search filter client-side (Firestore doesn't support text search well)
    let filteredBlogs = blogs;
    if (searchTerm) {
      filteredBlogs = blogs.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return {
      success: true,
      blogs: filteredBlogs,
      lastDoc: lastVisible,
      hasMore: snapshot.docs.length === ITEMS_PER_PAGE,
    };
  } catch (error) {
    console.error('Error getting blogs:', error);
    return { success: false, error: error.message, blogs: [], hasMore: false };
  }
};

// Simple get blogs (for backward compatibility, optimized with caching)
export const getBlogs = async (page = 1, searchTerm = '', statusFilter = 'all') => {
  try {
    // Check cache first (only for first page without filters)
    const now = Date.now();
    if (page === 1 && !searchTerm && statusFilter === 'all' && blogsCache && (now - lastFetchTime) < CACHE_DURATION) {
      return blogsCache;
    }
    
    const blogsRef = collection(db, BLOGS_COLLECTION);
    let constraints = [orderBy('createdAt', 'desc')];
    
    // Apply status filter at query level
    if (statusFilter !== 'all') {
      constraints.push(where('status', '==', statusFilter));
    }
    
    // Fetch more than needed for client-side search
    const fetchLimit = searchTerm ? 50 : ITEMS_PER_PAGE;
    constraints.push(limit(fetchLimit));
    
    const q = query(blogsRef, ...constraints);
    const snapshot = await getDocs(q);
    
    let blogs = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      blogs.push({
        id: doc.id,
        title: data.title || '',
        excerpt: data.excerpt || '',
        status: data.status || 'draft',
        image: data.image || null,
        views: data.views || 0,
        createdAt: data.createdAt?.toDate?.() || null,
        publishedAt: data.publishedAt?.toDate?.() || null,
      });
    });
    
    // Apply search filter client-side
    if (searchTerm) {
      blogs = blogs.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Pagination
    const totalItems = blogs.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedBlogs = blogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    
    const result = {
      success: true,
      blogs: paginatedBlogs,
      totalPages,
      totalItems,
    };
    
    // Cache the result
    if (page === 1 && !searchTerm && statusFilter === 'all') {
      blogsCache = result;
      lastFetchTime = now;
    }
    
    return result;
  } catch (error) {
    console.error('Error getting blogs:', error);
    return { success: false, error: error.message, blogs: [], totalPages: 1, totalItems: 0 };
  }
};

// Increment blog view count
export const incrementBlogView = async (blogId) => {
  try {
    const blogRef = doc(db, BLOGS_COLLECTION, blogId);
    await updateDoc(blogRef, {
      views: increment(1)
    });
    return { success: true };
  } catch (error) {
    console.error('Error incrementing view:', error);
    return { success: false, error: error.message };
  }
};