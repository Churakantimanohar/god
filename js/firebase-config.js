const firebaseConfig = {
  apiKey: "AIzaSyC_-5PjmhOwgvljFFGu4H0dnMweHAmEpJs",
  authDomain: "reddy-syouthassociation.firebaseapp.com",
  projectId: "reddy-syouthassociation",
  storageBucket: "reddy-syouthassociation.firebasestorage.app",
  messagingSenderId: "570084180770",
  appId: "1:570084180770:web:ba45095db01541531b9b7b",
  measurementId: "G-JWJ9YGDHD2",
};

const AUTHORIZED_ADMIN_EMAILS = [
  "admin@ganapathiseva.com",
  "ganapathiadmin@gmail.com",
  "churakantimanohar@gmail.com",
  
];

if (typeof window !== "undefined") {
  window.firebaseConfig = firebaseConfig;
  window.__ganapathiFirebaseReady =
    Boolean(firebaseConfig.projectId) &&
    firebaseConfig.projectId !== "YOUR_PROJECT_ID";
  window.AUTHORIZED_ADMIN_EMAILS = AUTHORIZED_ADMIN_EMAILS;
}

function getAuthorizedAdminEmails() {
  const configured = Array.isArray(window?.AUTHORIZED_ADMIN_EMAILS)
    ? window.AUTHORIZED_ADMIN_EMAILS
    : [];
  return [
    ...new Set(
      [...AUTHORIZED_ADMIN_EMAILS, ...configured]
        .map((value) => String(value).trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
}

function isAuthorizedAdminEmail(email) {
  if (!email) return false;
  return getAuthorizedAdminEmails().includes(
    String(email).trim().toLowerCase(),
  );
}

function normalizeRoleName(value) {
  const role = String(value || "public")
    .trim()
    .toLowerCase();
  return ["admin", "committee", "public"].includes(role) ? role : "public";
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

    const data = snap.data() || {};
    const role = normalizeRoleName(data.role);
    const email = String(data.email || "")
      .trim()
      .toLowerCase();

    if (role === "admin" && !isAuthorizedAdminEmail(email)) {
      return "public";
    }

    if (role === "committee" || role === "public" || role === "admin") {
      return role;
    }

    return "public";
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
  const email = String(user.email || "")
    .trim()
    .toLowerCase();
  const role = isAuthorizedAdminEmail(email) ? "admin" : "public";

  if (!current.exists) {
    await userRef.set(
      {
        uid: user.uid,
        name: user.displayName || "Community User",
        email,
        role,
        active: true,
        createdAt: new Date().toISOString(),
      },
      { merge: true },
    );
    return role;
  }

  const data = current.data() || {};
  const storedRole = normalizeRoleName(data.role);
  const safeRole =
    storedRole === "admin" &&
    !isAuthorizedAdminEmail(String(data.email || email))
      ? "public"
      : storedRole;

  const resolvedRole =
    role === "admin" || safeRole === "admin" ? "admin" : "public";

  if (
    safeRole !== storedRole ||
    data.email !== email ||
    data.name !== (user.displayName || data.name || "Community User")
  ) {
    await userRef.set(
      {
        uid: user.uid,
        name: user.displayName || data.name || "Community User",
        email,
        role: resolvedRole,
        active: true,
        updatedAt: new Date().toISOString(),
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
