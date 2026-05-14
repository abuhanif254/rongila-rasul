import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

// Collection reference
const newsCollection = collection(db, "news");

// Get all news
export async function getAllNews() {
  try {
    const querySnapshot = await getDocs(newsCollection);
    const news = [];
    querySnapshot.forEach((doc) => {
      news.push({ id: doc.id, ...doc.data() });
    });
    return news;
  } catch (error) {
    console.error("Error getting news:", error);
    throw error;
  }
}

// Get single news by ID
export async function getNewsById(id) {
  try {
    const docRef = doc(db, "news", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting news by ID:", error);
    throw error;
  }
}

// Get news by category
export async function getNewsByCategory(category) {
  try {
    const q = query(newsCollection, where("category", "==", category));
    const querySnapshot = await getDocs(q);
    const news = [];
    querySnapshot.forEach((doc) => {
      news.push({ id: doc.id, ...doc.data() });
    });
    return news;
  } catch (error) {
    console.error("Error getting news by category:", error);
    throw error;
  }
}

// Create new news
export async function createNews(newsData) {
  try {
    console.log("🔥 Firestore: Starting createNews...");
    console.log("📦 Data to save:", newsData);
    
    const docRef = await addDoc(newsCollection, {
      ...newsData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    console.log("✅ Firestore: Document created with ID:", docRef.id);
    return { id: docRef.id, ...newsData };
  } catch (error) {
    console.error("❌ Firestore createNews error:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    throw error;
  }
}

// Update news
export async function updateNews(id, newsData) {
  try {
    const docRef = doc(db, "news", id);
    await updateDoc(docRef, {
      ...newsData,
      updatedAt: serverTimestamp(),
    });
    return { id, ...newsData };
  } catch (error) {
    console.error("Error updating news:", error);
    throw error;
  }
}

// Delete news
export async function deleteNews(id) {
  try {
    const docRef = doc(db, "news", id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting news:", error);
    throw error;
  }
}

// Get all categories (unique from news)
export async function getAllCategories() {
  try {
    const news = await getAllNews();
    const categories = [...new Set(news.map((item) => item.category))];
    return categories;
  } catch (error) {
    console.error("Error getting categories:", error);
    throw error;
  }
}
// Save contact form messages
export const saveContactMessage = async (messageData) => {
  try {
    const docRef = await addDoc(collection(db, "messages"), {
      ...messageData,
      timestamp: new Date().toISOString(),
      status: "unread"
    });
    return { status: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
};
// Get all messages
export const getAllMessages = async () => {
  try {
    const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting messages:", error);
    throw error;
  }
};

// Update message status (e.g., mark as read)
export const updateMessageStatus = async (id, status) => {
  try {
    const docRef = doc(db, "messages", id);
    await updateDoc(docRef, { status });
    return { status: true };
  } catch (error) {
    console.error("Error updating message:", error);
    throw error;
  }
};

// Delete a message
export const deleteMessage = async (id) => {
  try {
    await deleteDoc(doc(db, "messages", id));
    return { status: true };
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};

// Newsletter Subscription
export const subscribeToNewsletter = async (email) => {
  try {
    const q = query(collection(db, "subscribers"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return { status: "exists", message: "You are already subscribed!" };
    }

    await addDoc(collection(db, "subscribers"), {
      email,
      subscribedAt: new Date().toISOString(),
      status: "active"
    });
    return { status: "success", message: "Subscribed successfully!" };
  } catch (error) {
    console.error("Error subscribing:", error);
    throw error;
  }
};

// Get all subscribers
export const getAllSubscribers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "subscribers"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting subscribers:", error);
    throw error;
  }
};

// CATEGORIES MANAGEMENT
export const getCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "categories"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting categories:", error);
    throw error;
  }
};

export const saveCategory = async (categoryData) => {
  try {
    const docRef = await addDoc(collection(db, "categories"), categoryData);
    return { id: docRef.id, ...categoryData };
  } catch (error) {
    console.error("Error saving category:", error);
    throw error;
  }
};

export const updateCategoryFirestore = async (id, categoryData) => {
  try {
    const docRef = doc(db, "categories", id);
    await updateDoc(docRef, categoryData);
    return { id, ...categoryData };
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategoryFirestore = async (id) => {
  try {
    await deleteDoc(doc(db, "categories", id));
    return { status: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
