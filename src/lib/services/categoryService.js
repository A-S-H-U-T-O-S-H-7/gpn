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
  { value: 'Globe', label: '🌍 Globe', icon: 'Globe' },
  { value: 'Landmark', label: '🏛️ Landmark', icon: 'Landmark' },
  { value: 'Briefcase', label: '💼 Briefcase', icon: 'Briefcase' },
  { value: 'Cpu', label: '💻 Cpu', icon: 'Cpu' },
  { value: 'Trophy', label: '🏆 Trophy', icon: 'Trophy' },
  { value: 'Clapperboard', label: '🎬 Clapperboard', icon: 'Clapperboard' },
  { value: 'GraduationCap', label: '🎓 Graduation', icon: 'GraduationCap' },
  { value: 'Heart', label: '❤️ Health', icon: 'Heart' },
  { value: 'Leaf', label: '🌿 Lifestyle', icon: 'Leaf' },
  { value: 'Apple', label: '🍎 Food', icon: 'Apple' },
  { value: 'Car', label: '🚗 Automotive', icon: 'Car' },
  { value: 'Rocket', label: '🚀 Space', icon: 'Rocket' },
];

// Import icons for mapping
import { 
  Globe, Landmark, Briefcase, Cpu, Trophy, Clapperboard,
  GraduationCap, Heart, Leaf, Apple, Car, Rocket 
} from 'lucide-react';

// Map icon string to component
export const getIconComponent = (iconName) => {
  const iconMap = {
    Globe, Landmark, Briefcase, Cpu, Trophy, Clapperboard,
    GraduationCap, Heart, Leaf, Apple, Car, Rocket
  };
  return iconMap[iconName] || Globe;
};

// Get all categories
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
        icon: data.icon || 'Globe',
        iconColor: data.iconColor || '#ff2b2b',
        backgroundColor: data.backgroundColor || '#ff2b2b',
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

// Get active categories (for homepage)
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
        icon: data.icon || 'Globe',
        iconColor: data.iconColor || '#ff2b2b',
        backgroundColor: data.backgroundColor || '#ff2b2b',
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

// Get category by slug
export const getCategoryBySlug = async (slug) => {
  try {
    const categoriesRef = collection(db, CATEGORIES_COLLECTION);
    const q = query(categoriesRef, where('slug', '==', slug), where('status', '==', 'active'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return { success: false, error: 'Category not found' };
    }
    
    const docSnap = snapshot.docs[0];
    const data = docSnap.data();
    
    return {
      success: true,
      category: {
        id: docSnap.id,
        name: data.name || '',
        slug: data.slug || '',
        description: data.description || '',
        icon: data.icon || 'Globe',
        iconColor: data.iconColor || '#ff2b2b',
        backgroundColor: data.backgroundColor || '#ff2b2b',
      }
    };
  } catch (error) {
    console.error('Error getting category by slug:', error);
    return { success: false, error: error.message };
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
        icon: data.icon || 'Globe',
        iconColor: data.iconColor || '#ff2b2b',
        backgroundColor: data.backgroundColor || '#ff2b2b',
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
      icon: categoryData.icon || 'Globe',
      iconColor: categoryData.iconColor || '#ff2b2b',
      backgroundColor: categoryData.backgroundColor || '#ff2b2b',
      order: categoryData.order || 0,
      status: categoryData.status || 'active',
      featured: categoryData.featured || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
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
      icon: categoryData.icon || 'Globe',
      iconColor: categoryData.iconColor || '#ff2b2b',
      backgroundColor: categoryData.backgroundColor || '#ff2b2b',
      order: categoryData.order || 0,
      status: categoryData.status || 'active',
      featured: categoryData.featured || false,
      updatedAt: serverTimestamp(),
    };
    
    await updateDoc(categoryRef, updateData);
    
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