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
  serverTimestamp
} from 'firebase/firestore';
import { logActivity, ActivityActions, ActivityEntityTypes } from './activityLogService';

const CATEGORIES_COLLECTION = 'categories';

// Available icons for categories
export const categoryIcons = [
  { value: 'Globe', label: '🌍 Globe', icon: '🌍' },
  { value: 'Landmark', label: '🏛️ Landmark', icon: '🏛️' },
  { value: 'Briefcase', label: '💼 Briefcase', icon: '💼' },
  { value: 'Cpu', label: '💻 Cpu', icon: '💻' },
  { value: 'Trophy', label: '🏆 Trophy', icon: '🏆' },
  { value: 'Clapperboard', label: '🎬 Clapperboard', icon: '🎬' },
  { value: 'GraduationCap', label: '🎓 Graduation', icon: '🎓' },
  { value: 'Heart', label: '❤️ Health', icon: '❤️' },
  { value: 'Leaf', label: '🌿 Lifestyle', icon: '🌿' },
  { value: 'Apple', label: '🍎 Food', icon: '🍎' },
  { value: 'Car', label: '🚗 Automotive', icon: '🚗' },
  { value: 'Rocket', label: '🚀 Space', icon: '🚀' },
];

// Get icon emoji by value
export const getIconEmoji = (iconValue) => {
  const icon = categoryIcons.find(i => i.value === iconValue);
  return icon?.icon || '📁';
};

// Get all categories (active ones)
export const getActiveCategories = async () => {
  try {
    const categoriesRef = collection(db, CATEGORIES_COLLECTION);
    const q = query(
      categoriesRef, 
      where('status', '==', 'active'),
      orderBy('order', 'asc'),
      orderBy('name', 'asc')
    );
    const snapshot = await getDocs(q);
    
    const categories = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      categories.push({
        id: doc.id,
        name: data.name || '',
        slug: data.slug || '',
        description: data.description || '',
        icon: data.icon || 'FolderOpen',
        iconEmoji: data.iconEmoji || getIconEmoji(data.icon),
        color: data.color || '#ff2b2b',
        order: data.order || 0,
        status: data.status || 'active',
        featured: data.featured || false,
      });
    });
    
    return { success: true, categories };
  } catch (error) {
    console.error('Error getting active categories:', error);
    return { success: false, error: error.message, categories: [] };
  }
};

// Get all categories (including inactive)
export const getCategories = async () => {
  try {
    const categoriesRef = collection(db, CATEGORIES_COLLECTION);
    const q = query(categoriesRef, orderBy('order', 'asc'), orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    
    const categories = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      categories.push({
        id: doc.id,
        name: data.name || '',
        slug: data.slug || '',
        description: data.description || '',
        icon: data.icon || 'FolderOpen',
        iconEmoji: data.iconEmoji || getIconEmoji(data.icon),
        color: data.color || '#ff2b2b',
        order: data.order || 0,
        status: data.status || 'active',
        featured: data.featured || false,
        createdAt: data.createdAt?.toDate?.() || null,
      });
    });
    
    return { success: true, categories };
  } catch (error) {
    console.error('Error getting categories:', error);
    return { success: false, error: error.message, categories: [] };
  }
};

// Get category by ID
export const getCategoryById = async (categoryId) => {
  try {
    const categoryRef = doc(db, CATEGORIES_COLLECTION, categoryId);
    const categorySnap = await getDoc(categoryRef);
    
    if (!categorySnap.exists()) {
      return { success: false, error: 'Category not found' };
    }
    
    const data = categorySnap.data();
    return {
      success: true,
      category: {
        id: categorySnap.id,
        name: data.name || '',
        slug: data.slug || '',
        description: data.description || '',
        icon: data.icon || 'FolderOpen',
        iconEmoji: data.iconEmoji || getIconEmoji(data.icon),
        color: data.color || '#ff2b2b',
        order: data.order || 0,
        status: data.status || 'active',
        featured: data.featured || false,
      }
    };
  } catch (error) {
    console.error('Error getting category:', error);
    return { success: false, error: error.message };
  }
};

// Create category
export const createCategory = async (categoryData, adminData) => {
  try {
    // Check if slug already exists
    const slugQuery = query(
      collection(db, CATEGORIES_COLLECTION), 
      where('slug', '==', categoryData.slug)
    );
    const slugSnapshot = await getDocs(slugQuery);
    
    if (!slugSnapshot.empty) {
      return { success: false, error: 'Category slug already exists' };
    }
    
    const categoryRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description || '',
      icon: categoryData.icon || 'FolderOpen',
      iconEmoji: getIconEmoji(categoryData.icon),
      color: categoryData.color || '#ff2b2b',
      order: categoryData.order || 0,
      status: categoryData.status || 'active',
      featured: categoryData.featured || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    // Log activity
    await logActivity({
      action: ActivityActions.CREATE,
      entityType: ActivityEntityTypes.CATEGORY,
      entityId: categoryRef.id,
      entityTitle: categoryData.name,
      details: `Created category: ${categoryData.name}`,
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true, id: categoryRef.id };
  } catch (error) {
    console.error('Error creating category:', error);
    return { success: false, error: error.message };
  }
};

// Update category
export const updateCategory = async (categoryId, categoryData, oldCategoryData, adminData) => {
  try {
    // Check if slug already exists (excluding current)
    const slugQuery = query(
      collection(db, CATEGORIES_COLLECTION), 
      where('slug', '==', categoryData.slug)
    );
    const slugSnapshot = await getDocs(slugQuery);
    
    if (!slugSnapshot.empty && slugSnapshot.docs[0].id !== categoryId) {
      return { success: false, error: 'Category slug already exists' };
    }
    
    const categoryRef = doc(db, CATEGORIES_COLLECTION, categoryId);
    const updateData = {
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description || '',
      icon: categoryData.icon || 'FolderOpen',
      iconEmoji: getIconEmoji(categoryData.icon),
      color: categoryData.color || '#ff2b2b',
      order: categoryData.order || 0,
      status: categoryData.status || 'active',
      featured: categoryData.featured || false,
      updatedAt: serverTimestamp(),
    };
    
    await updateDoc(categoryRef, updateData);
    
    // Log activity
    await logActivity({
      action: ActivityActions.UPDATE,
      entityType: ActivityEntityTypes.CATEGORY,
      entityId: categoryId,
      entityTitle: categoryData.name,
      details: `Updated category: ${categoryData.name}`,
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, error: error.message };
  }
};

// Delete category
export const deleteCategory = async (categoryId, categoryName, adminData) => {
  try {
    await deleteDoc(doc(db, CATEGORIES_COLLECTION, categoryId));
    
    await logActivity({
      action: ActivityActions.DELETE,
      entityType: ActivityEntityTypes.CATEGORY,
      entityId: categoryId,
      entityTitle: categoryName,
      details: `Deleted category: ${categoryName}`,
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: error.message };
  }
};

// Generate slug from name
export const generateCategorySlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};