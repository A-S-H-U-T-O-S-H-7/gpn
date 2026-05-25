import { db } from '@/lib/firebase/config';
import { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { logActivity, ActivityActions, ActivityEntityTypes } from './activityLogService';

const ADVERTISE_COLLECTION = 'advertise_inquiries';
const ITEMS_PER_PAGE = 10;

// Submit advertise inquiry
export const submitAdvertiseInquiry = async (formData) => {
  try {
    const inquiryRef = await addDoc(collection(db, ADVERTISE_COLLECTION), {
      companyName: formData.companyName,
      contactPerson: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      website: formData.website || '',
      adType: formData.adType,
      budget: formData.budget,
      duration: formData.duration,
      message: formData.message,
      status: 'pending', // pending, contacted, approved, rejected
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true, id: inquiryRef.id };
  } catch (error) {
    console.error('Error submitting advertise inquiry:', error);
    return { success: false, error: error.message };
  }
};

// Get all advertise inquiries (admin)
export const getAdvertiseInquiries = async (page = 1, searchTerm = '', statusFilter = 'all') => {
  try {
    const inquiriesRef = collection(db, ADVERTISE_COLLECTION);
    let constraints = [orderBy('createdAt', 'desc')];
    
    const q = query(inquiriesRef, ...constraints);
    const snapshot = await getDocs(q);
    
    let inquiries = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      inquiries.push({
        id: doc.id,
        companyName: data.companyName || '',
        contactPerson: data.contactPerson || '',
        email: data.email || '',
        phone: data.phone || '',
        website: data.website || '',
        adType: data.adType || '',
        budget: data.budget || '',
        duration: data.duration || '',
        message: data.message || '',
        status: data.status || 'pending',
        createdAt: data.createdAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null,
      });
    });
    
    // Apply status filter
    if (statusFilter !== 'all') {
      inquiries = inquiries.filter(inq => inq.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      inquiries = inquiries.filter(inq => 
        inq.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inq.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inq.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Pagination
    const totalItems = inquiries.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedInquiries = inquiries.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    
    return {
      success: true,
      inquiries: paginatedInquiries,
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error('Error getting advertise inquiries:', error);
    return { success: false, error: error.message, inquiries: [], totalPages: 1, totalItems: 0 };
  }
};

// Update inquiry status
export const updateInquiryStatus = async (inquiryId, status, adminData) => {
  try {
    const inquiryRef = doc(db, ADVERTISE_COLLECTION, inquiryId);
    await updateDoc(inquiryRef, {
      status: status,
      updatedAt: serverTimestamp(),
    });
    
    await logActivity({
      action: ActivityActions.UPDATE,
      entityType: ActivityEntityTypes.ADVERTISE,
      entityId: inquiryId,
      entityTitle: 'Advertise Inquiry',
      details: `Updated inquiry status to ${status}`,
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    return { success: false, error: error.message };
  }
};

// Delete advertise inquiry
export const deleteAdvertiseInquiry = async (inquiryId, adminData) => {
  try {
    await deleteDoc(doc(db, ADVERTISE_COLLECTION, inquiryId));
    
    await logActivity({
      action: ActivityActions.DELETE,
      entityType: ActivityEntityTypes.ADVERTISE,
      entityId: inquiryId,
      entityTitle: 'Advertise Inquiry',
      details: 'Deleted advertise inquiry',
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting advertise inquiry:', error);
    return { success: false, error: error.message };
  }
};

// Get inquiry statistics
export const getInquiryStats = async () => {
  try {
    const inquiriesRef = collection(db, ADVERTISE_COLLECTION);
    const snapshot = await getDocs(inquiriesRef);
    
    let total = 0;
    let pending = 0;
    let contacted = 0;
    let approved = 0;
    let rejected = 0;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      total++;
      if (data.status === 'pending') pending++;
      if (data.status === 'contacted') contacted++;
      if (data.status === 'approved') approved++;
      if (data.status === 'rejected') rejected++;
    });
    
    return {
      success: true,
      stats: { total, pending, contacted, approved, rejected }
    };
  } catch (error) {
    console.error('Error getting inquiry stats:', error);
    return { success: false, stats: { total: 0, pending: 0, contacted: 0, approved: 0, rejected: 0 } };
  }
};