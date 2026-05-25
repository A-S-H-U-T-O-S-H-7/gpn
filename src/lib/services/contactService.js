import { db } from '@/lib/firebase/config';
import { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { logActivity, ActivityActions, ActivityEntityTypes } from './activityLogService';

const CONTACT_COLLECTION = 'contact_messages';
const ITEMS_PER_PAGE = 10;

// Submit contact form
export const submitContactForm = async (formData) => {
  try {
    const contactRef = await addDoc(collection(db, CONTACT_COLLECTION), {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      subject: formData.subject || 'General Inquiry',
      status: 'unread', // unread, read, replied
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true, id: contactRef.id };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, error: error.message };
  }
};

// Get all contact messages (admin)
export const getContactMessages = async (page = 1, searchTerm = '', statusFilter = 'all') => {
  try {
    const contactsRef = collection(db, CONTACT_COLLECTION);
    let constraints = [orderBy('createdAt', 'desc')];
    
    const q = query(contactsRef, ...constraints);
    const snapshot = await getDocs(q);
    
    let messages = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        message: data.message || '',
        subject: data.subject || '',
        status: data.status || 'unread',
        createdAt: data.createdAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null,
      });
    });
    
    // Apply status filter
    if (statusFilter !== 'all') {
      messages = messages.filter(msg => msg.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      messages = messages.filter(msg => 
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Pagination
    const totalItems = messages.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedMessages = messages.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    
    return {
      success: true,
      messages: paginatedMessages,
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error('Error getting contact messages:', error);
    return { success: false, error: error.message, messages: [], totalPages: 1, totalItems: 0 };
  }
};

// Get single contact message
export const getContactMessageById = async (messageId) => {
  try {
    const messageRef = doc(db, CONTACT_COLLECTION, messageId);
    const messageSnap = await getDoc(messageRef);
    
    if (!messageSnap.exists()) {
      return { success: false, error: 'Message not found' };
    }
    
    const data = messageSnap.data();
    return {
      success: true,
      message: {
        id: messageSnap.id,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        message: data.message || '',
        subject: data.subject || '',
        status: data.status || 'unread',
        createdAt: data.createdAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null,
      }
    };
  } catch (error) {
    console.error('Error getting contact message:', error);
    return { success: false, error: error.message };
  }
};

// Update message status
export const updateMessageStatus = async (messageId, status, adminData) => {
  try {
    const messageRef = doc(db, CONTACT_COLLECTION, messageId);
    await updateDoc(messageRef, {
      status: status,
      updatedAt: serverTimestamp(),
    });
    
    await logActivity({
      action: ActivityActions.UPDATE,
      entityType: ActivityEntityTypes.CONTACT,
      entityId: messageId,
      entityTitle: 'Contact Message',
      details: `Marked message as ${status}`,
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating message status:', error);
    return { success: false, error: error.message };
  }
};

// Delete contact message
export const deleteContactMessage = async (messageId, adminData) => {
  try {
    await deleteDoc(doc(db, CONTACT_COLLECTION, messageId));
    
    await logActivity({
      action: ActivityActions.DELETE,
      entityType: ActivityEntityTypes.CONTACT,
      entityId: messageId,
      entityTitle: 'Contact Message',
      details: 'Deleted contact message',
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return { success: false, error: error.message };
  }
};

// Get message statistics
export const getMessageStats = async () => {
  try {
    const contactsRef = collection(db, CONTACT_COLLECTION);
    const snapshot = await getDocs(contactsRef);
    
    let total = 0;
    let unread = 0;
    let read = 0;
    let replied = 0;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      total++;
      if (data.status === 'unread') unread++;
      if (data.status === 'read') read++;
      if (data.status === 'replied') replied++;
    });
    
    return {
      success: true,
      stats: { total, unread, read, replied }
    };
  } catch (error) {
    console.error('Error getting message stats:', error);
    return { success: false, stats: { total: 0, unread: 0, read: 0, replied: 0 } };
  }
};