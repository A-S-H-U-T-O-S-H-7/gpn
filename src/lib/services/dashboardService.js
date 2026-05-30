import { db } from "@/lib/firebase/config";
import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { getRecentActivities } from "./activityLogService";

const COLLECTIONS = {
  news: "news",
  blogs: "blogs",
  videos: "videos",
  users: "users",
  subscribers: "subscribers",
  contacts: "contact_messages",
};

const emptyStats = {
  totalNews: 0,
  publishedNews: 0,
  totalBlogs: 0,
  publishedBlogs: 0,
  totalVideos: 0,
  publishedVideos: 0,
  totalUsers: 0,
  activeUsers: 0,
  subscribers: 0,
  unreadMessages: 0,
  totalViews: 0,
  breakingNews: 0,
};

const countCollection = async (collectionName, filters = []) => {
  const collectionRef = collection(db, collectionName);
  const countQuery = filters.length ? query(collectionRef, ...filters) : collectionRef;
  const snapshot = await getCountFromServer(countQuery);
  return snapshot.data().count || 0;
};

const toDate = (value) => value?.toDate?.() || value || null;

const getRecentFromCollection = async (collectionName, mapItem, maxItems = 5) => {
  try {
    const recentQuery = query(collection(db, collectionName), orderBy("createdAt", "desc"), limit(maxItems));
    const snapshot = await getDocs(recentQuery);
    return snapshot.docs.map((doc) => mapItem(doc.id, doc.data()));
  } catch (error) {
    console.error(`Error getting recent ${collectionName}:`, error);
    return [];
  }
};

const sumViews = async (collectionName) => {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.docs.reduce((total, doc) => total + (Number(doc.data().views) || 0), 0);
  } catch (error) {
    console.error(`Error summing views for ${collectionName}:`, error);
    return 0;
  }
};

export const getDashboardData = async () => {
  try {
    const [
      totalNews,
      publishedNews,
      breakingNews,
      totalBlogs,
      publishedBlogs,
      totalVideos,
      publishedVideos,
      totalUsers,
      activeUsers,
      subscribers,
      unreadMessages,
      newsViews,
      blogViews,
      videoViews,
      recentNews,
      recentBlogs,
      recentVideos,
      recentUsers,
      recentMessages,
      recentActivities,
    ] = await Promise.all([
      countCollection(COLLECTIONS.news),
      countCollection(COLLECTIONS.news, [where("status", "==", "published")]),
      countCollection(COLLECTIONS.news, [where("isBreaking", "==", true)]),
      countCollection(COLLECTIONS.blogs),
      countCollection(COLLECTIONS.blogs, [where("status", "==", "published")]),
      countCollection(COLLECTIONS.videos),
      countCollection(COLLECTIONS.videos, [where("status", "==", "published")]),
      countCollection(COLLECTIONS.users),
      countCollection(COLLECTIONS.users, [where("status", "==", "active")]),
      countCollection(COLLECTIONS.subscribers, [where("status", "==", "active")]),
      countCollection(COLLECTIONS.contacts, [where("status", "==", "unread")]),
      sumViews(COLLECTIONS.news),
      sumViews(COLLECTIONS.blogs),
      sumViews(COLLECTIONS.videos),
      getRecentFromCollection(COLLECTIONS.news, (id, data) => ({
        id,
        type: "News",
        title: data.title || "Untitled news",
        status: data.status || "draft",
        views: data.views || 0,
        date: toDate(data.createdAt),
      })),
      getRecentFromCollection(COLLECTIONS.blogs, (id, data) => ({
        id,
        type: "Blog",
        title: data.title || "Untitled blog",
        status: data.status || "draft",
        views: data.views || 0,
        date: toDate(data.createdAt),
      })),
      getRecentFromCollection(COLLECTIONS.videos, (id, data) => ({
        id,
        type: "Video",
        title: data.title || "Untitled video",
        status: data.status || "draft",
        views: data.views || 0,
        date: toDate(data.createdAt),
      })),
      getRecentFromCollection(COLLECTIONS.users, (id, data) => ({
        id,
        name: data.name || data.email?.split("@")[0] || "User",
        email: data.email || "",
        status: data.status || "active",
        date: toDate(data.createdAt),
      })),
      getRecentFromCollection(COLLECTIONS.contacts, (id, data) => ({
        id,
        name: data.name || "Visitor",
        subject: data.subject || "Contact message",
        status: data.status || "unread",
        date: toDate(data.createdAt),
      })),
      getRecentActivities(6),
    ]);

    return {
      success: true,
      stats: {
        totalNews,
        publishedNews,
        breakingNews,
        totalBlogs,
        publishedBlogs,
        totalVideos,
        publishedVideos,
        totalUsers,
        activeUsers,
        subscribers,
        unreadMessages,
        totalViews: newsViews + blogViews + videoViews,
      },
      recentContent: [...recentNews, ...recentBlogs, ...recentVideos]
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        .slice(0, 8),
      recentUsers,
      recentMessages,
      recentActivities: recentActivities.logs || [],
    };
  } catch (error) {
    console.error("Error getting dashboard data:", error);
    return {
      success: false,
      error: error.message,
      stats: emptyStats,
      recentContent: [],
      recentUsers: [],
      recentMessages: [],
      recentActivities: [],
    };
  }
};
