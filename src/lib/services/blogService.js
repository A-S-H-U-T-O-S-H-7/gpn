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

// ==================== HELPER FUNCTIONS ====================

// Generate slug from title
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Calculate read time from content
const calculateReadTime = (content) => {
  if (!content) return 5;
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).length;
  return Math.max(3, Math.ceil(words / 200));
};

// Format views for display
const formatViews = (views) => {
  if (!views) return '0';
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
  return views.toString();
};

// Upload image to Firebase Storage
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
    console.error('Error uploading image:', error);
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

// ==================== ADMIN FUNCTIONS ====================

// Create a new blog post
export const createBlog = async (blogData, imageFile) => {
  try {
    let imageUrl = null;
    
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
      category: blogData.category || 'General',
      author: blogData.author || 'GPN Editor',
      authorBio: blogData.authorBio || '',
      tags: blogData.tags || [],
      image: imageUrl,
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: blogData.status === 'published' ? serverTimestamp() : null,
    });
    
    blogsCache = null;
    
    return { success: true, id: blogRef.id };
  } catch (error) {
    console.error('Error creating blog:', error);
    return { success: false, error: error.message };
  }
};

// Update an existing blog post
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
      category: blogData.category || 'General',
      author: blogData.author || 'GPN Editor',
      authorBio: blogData.authorBio || '',
      tags: blogData.tags || [],
      updatedAt: serverTimestamp(),
    };
    
    if (imageUrl) {
      updateData.image = imageUrl;
    }
    
    if (blogData.status === 'published' && !existingImageUrl) {
      updateData.publishedAt = serverTimestamp();
    }
    
    await updateDoc(blogRef, updateData);
    
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
    
    blogsCache = null;
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting blog:', error);
    return { success: false, error: error.message };
  }
};

// Get a single blog post by ID (for admin)
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
        category: data.category || 'General',
        author: data.author || 'GPN Editor',
        authorBio: data.authorBio || '',
        tags: data.tags || [],
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

// Get all blogs for admin panel (with pagination, search, filter)
export const getBlogs = async (page = 1, searchTerm = '', statusFilter = 'all') => {
  try {
    const now = Date.now();
    if (page === 1 && !searchTerm && statusFilter === 'all' && blogsCache && (now - lastFetchTime) < CACHE_DURATION) {
      return blogsCache;
    }
    
    const blogsRef = collection(db, BLOGS_COLLECTION);
    let constraints = [orderBy('createdAt', 'desc')];
    
    if (statusFilter !== 'all') {
      constraints.push(where('status', '==', statusFilter));
    }
    
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
    
    if (searchTerm) {
      blogs = blogs.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
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

// ==================== FRONTEND FUNCTIONS ====================

// Get all published blogs for frontend (latest first)
export const getPublishedBlogs = async (page = 1, itemsPerPage = 8) => {
  try {
    const blogsRef = collection(db, BLOGS_COLLECTION);
    const constraints = [
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(itemsPerPage)
    ];
    
    const q = query(blogsRef, ...constraints);
    const snapshot = await getDocs(q);
    
    const blogs = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      const publishedDate = data.publishedAt?.toDate?.() || data.createdAt?.toDate?.() || new Date();
      
      blogs.push({
        id: doc.id,
        slug: data.slug || '',
        title: data.title || '',
        description: data.excerpt || data.content?.substring(0, 150)?.replace(/<[^>]*>/g, '') || '',
        date: publishedDate,
        formattedDate: publishedDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        readTime: calculateReadTime(data.content || ''),
        author: data.author || 'GPN Editor',
        category: data.category || 'General',
        image: data.image || null,
        views: data.views || 0,
        formattedViews: formatViews(data.views),
        content: data.content || '',
        tags: data.tags || [],
      });
    });
    
    return { success: true, blogs };
  } catch (error) {
    console.error('Error getting published blogs:', error);
    return { success: false, error: error.message, blogs: [] };
  }
};

// Get single blog by slug for frontend
export const getPublishedBlogBySlug = async (slug) => {
  try {
    const blogsRef = collection(db, BLOGS_COLLECTION);
    const q = query(
      blogsRef, 
      where('slug', '==', slug), 
      where('status', '==', 'published')
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return { success: false, error: 'Blog not found' };
    }
    
    const docSnap = snapshot.docs[0];
    const data = docSnap.data();
    const publishedDate = data.publishedAt?.toDate?.() || data.createdAt?.toDate?.() || new Date();
    
    return {
      success: true,
      blog: {
        id: docSnap.id,
        slug: data.slug || '',
        title: data.title || '',
        description: data.excerpt || data.content?.substring(0, 150)?.replace(/<[^>]*>/g, '') || '',
        content: data.content || '',
        category: data.category || 'General',
        date: publishedDate,
        formattedDate: publishedDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        readTime: calculateReadTime(data.content || ''),
        views: data.views || 0,
        formattedViews: formatViews(data.views),
        author: data.author || 'GPN Editor',
        authorBio: data.authorBio || "Expert journalist bringing you the latest insights from around the world.",
        tags: data.tags || [],
        image: data.image || null,
      }
    };
  } catch (error) {
    console.error('Error getting blog by slug:', error);
    return { success: false, error: error.message };
  }
};

// Get featured blogs for sidebar (most viewed)
export const getFeaturedBlogs = async (maxItems = 4) => {
  try {
    const blogsRef = collection(db, BLOGS_COLLECTION);
    const q = query(
      blogsRef,
      where('status', '==', 'published'),
      orderBy('views', 'desc'),
      limit(maxItems)
    );
    const snapshot = await getDocs(q);
    
    const blogs = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      const publishedDate = data.publishedAt?.toDate?.() || data.createdAt?.toDate?.() || new Date();
      
      blogs.push({
        id: doc.id,
        slug: data.slug || '',
        title: data.title || '',
        image: data.image || null,
        views: data.views || 0,
        formattedViews: formatViews(data.views),
        date: publishedDate,
        formattedDate: publishedDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        readTime: calculateReadTime(data.content || ''),
      });
    });
    
    return { success: true, blogs };
  } catch (error) {
    console.error('Error getting featured blogs:', error);
    return { success: false, blogs: [] };
  }
};

// Get blogs by category
export const getBlogsByCategory = async (categorySlug, maxItems = 8) => {
  try {
    const blogsRef = collection(db, BLOGS_COLLECTION);
    const q = query(
      blogsRef,
      where('status', '==', 'published'),
      where('category', '==', categorySlug),
      orderBy('publishedAt', 'desc'),
      limit(maxItems)
    );
    const snapshot = await getDocs(q);
    
    const blogs = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      const publishedDate = data.publishedAt?.toDate?.() || data.createdAt?.toDate?.() || new Date();
      
      blogs.push({
        id: doc.id,
        slug: data.slug || '',
        title: data.title || '',
        description: data.excerpt || data.content?.substring(0, 100)?.replace(/<[^>]*>/g, '') || '',
        date: publishedDate,
        formattedDate: publishedDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        readTime: calculateReadTime(data.content || ''),
        image: data.image || null,
        views: data.views || 0,
      });
    });
    
    return { success: true, blogs };
  } catch (error) {
    console.error('Error getting blogs by category:', error);
    return { success: false, blogs: [] };
  }
};

// Get latest blogs (for homepage sections)
export const getLatestBlogs = async (maxItems = 6) => {
  try {
    const blogsRef = collection(db, BLOGS_COLLECTION);
    const q = query(
      blogsRef,
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(maxItems)
    );
    const snapshot = await getDocs(q);
    
    const blogs = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      const publishedDate = data.publishedAt?.toDate?.() || data.createdAt?.toDate?.() || new Date();
      
      blogs.push({
        id: doc.id,
        slug: data.slug || '',
        title: data.title || '',
        description: data.excerpt || '',
        date: publishedDate,
        readTime: calculateReadTime(data.content || ''),
        image: data.image || null,
        views: data.views || 0,
        category: data.category || 'General',
      });
    });
    
    return { success: true, blogs };
  } catch (error) {
    console.error('Error getting latest blogs:', error);
    return { success: false, blogs: [] };
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

// Search blogs by title
export const searchBlogs = async (searchTerm, maxItems = 20) => {
  try {
    const blogsRef = collection(db, BLOGS_COLLECTION);
    const q = query(
      blogsRef,
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(maxItems)
    );
    const snapshot = await getDocs(q);
    
    const blogs = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.title?.toLowerCase().includes(searchTerm.toLowerCase())) {
        const publishedDate = data.publishedAt?.toDate?.() || data.createdAt?.toDate?.() || new Date();
        blogs.push({
          id: doc.id,
          slug: data.slug || '',
          title: data.title || '',
          description: data.excerpt || '',
          date: publishedDate,
          readTime: calculateReadTime(data.content || ''),
          image: data.image || null,
        });
      }
    });
    
    return { success: true, blogs };
  } catch (error) {
    console.error('Error searching blogs:', error);
    return { success: false, blogs: [] };
  }
};