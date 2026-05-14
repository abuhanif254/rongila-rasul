import { auth, db } from "./firebase";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();

// Sign in with Google
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user exists in Firestore, if not create with default role 'reader'
    const userDocRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        role: "reader", // Default role
        createdAt: serverTimestamp(),
      });
    }

    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Sign out
export const logout = () => signOut(auth);

// Get User Role from Firestore
export const getUserRole = async (uid) => {
  try {
    const userDocRef = doc(db, "users", uid);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      return userSnap.data().role;
    }
    return "reader";
  } catch (error) {
    console.error("Error getting user role:", error);
    return "reader";
  }
};

// Subscribe to Auth Changes
export const subscribeToAuth = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const role = await getUserRole(user.uid);
      callback({ ...user, role });
    } else {
      callback(null);
    }
  });
};
