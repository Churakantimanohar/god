const firebaseConfig = {
  apiKey: "AIzaSyC_-5PjmhOwgvljFFGu4H0dnMweHAmEpJs",
  authDomain: "reddy-syouthassociation.firebaseapp.com",
  projectId: "reddy-syouthassociation",
  storageBucket: "reddy-syouthassociation.firebasestorage.app",
  messagingSenderId: "570084180770",
  appId: "1:570084180770:web:ba45095db01541531b9b7b",
  measurementId: "G-JWJ9YGDHD2",
};

if (typeof window !== "undefined") {
  window.firebaseConfig = firebaseConfig;
  window.__ganapathiFirebaseReady =
    Boolean(firebaseConfig.projectId) &&
    firebaseConfig.projectId !== "YOUR_PROJECT_ID";
}

function isFirebaseConfigured() {
  return Boolean(
    typeof window !== "undefined" &&
    window.firebaseConfig &&
    window.firebaseConfig.projectId &&
    window.firebaseConfig.projectId !== "YOUR_PROJECT_ID",
  );
}

function getFirebaseApp() {
  if (!isFirebaseConfigured()) return null;
  if (typeof window === "undefined") return null;

  if (typeof firebase !== "undefined") {
    if (!firebase.apps || firebase.apps.length === 0) {
      firebase.initializeApp(window.firebaseConfig);
    }
    window.__ganapathiFirebaseApp = firebase.app();
    return window.__ganapathiFirebaseApp;
  }

  return null;
}

function getFirestoreDb() {
  const app = getFirebaseApp();
  if (!app || typeof firebase === "undefined" || !firebase.firestore)
    return null;
  return firebase.firestore();
}

function getAuthInstance() {
  const app = getFirebaseApp();
  if (!app || typeof firebase === "undefined" || !firebase.auth) return null;
  return firebase.auth();
}

async function getUserRoleFromFirestore(uid) {
  if (!uid) return "public";
  const db = getFirestoreDb();
  if (!db) return "public";

  try {
    const snap = await db.collection("users").doc(uid).get();
    if (!snap.exists) return "public";
    const role = (snap.data().role || "public").toLowerCase();
    return ["admin", "committee", "public"].includes(role) ? role : "public";
  } catch (error) {
    return "public";
  }
}

async function ensureUserProfileInFirestore(user) {
  if (!user || !user.uid) return "public";
  const db = getFirestoreDb();
  if (!db) return "public";

  const userRef = db.collection("users").doc(user.uid);
  const current = await userRef.get();

  if (!current.exists) {
    await userRef.set(
      {
        uid: user.uid,
        name: user.displayName || "Community User",
        email: user.email || "",
        role: "public",
        active: true,
        createdAt: new Date().toISOString(),
      },
      { merge: true },
    );
  }

  return getUserRoleFromFirestore(user.uid);
}

function subscribeToLiveData(callback) {
  if (typeof window === "undefined") return () => {};

  const handleCustomEvent = () => {
    if (typeof callback === "function") callback();
  };

  window.addEventListener("ganapathi-data-changed", handleCustomEvent);

  if (typeof window !== "undefined" && window.addEventListener) {
    const handleStorage = (event) => {
      if (event && event.key && event.key !== STORAGE_KEY) return;
      handleCustomEvent();
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("ganapathi-data-changed", handleCustomEvent);
      window.removeEventListener("storage", handleStorage);
    };
  }

  return () => {
    window.removeEventListener("ganapathi-data-changed", handleCustomEvent);
  };
}
