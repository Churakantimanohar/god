document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const loginPage = body && body.dataset.page === "login";
  const protectedPage = body && body.dataset.page === "protected";
  const adminPage = body && body.dataset.page === "admin";
  const committeePage = body && body.dataset.page === "committee";

  const isNestedPage =
    window.location.pathname.includes("/admin/") ||
    window.location.pathname.includes("/committee/");
  const loginUrl = isNestedPage ? "../login.html" : "login.html";
  const dashboardUrl = isNestedPage ? "../dashboard.html" : "dashboard.html";
  const adminDashboardUrl = isNestedPage
    ? "../admin/dashboard.html"
    : "admin/dashboard.html";
  const committeeDashboardUrl = isNestedPage
    ? "../committee/dashboard.html"
    : "committee/dashboard.html";

  async function redirectByRole(role) {
    const normalized = (role || "public").toLowerCase();
    if (normalized === "admin") {
      window.location.href = adminDashboardUrl;
      return;
    }
    if (normalized === "committee") {
      window.location.href = committeeDashboardUrl;
      return;
    }
    window.location.href = dashboardUrl;
  }

  async function handleAuthenticatedUser(user) {
    if (!user) {
      window.location.href = loginUrl;
      return;
    }

    const role = await ensureUserProfileInFirestore(user);
    if (loginPage) {
      await redirectByRole(role);
      return;
    }

    if (adminPage && role !== "admin") {
      showToast("Access denied.", "error");
      await redirectByRole(role);
      return;
    }

    if (committeePage && !["admin", "committee"].includes(role)) {
      showToast("Access denied.", "error");
      await redirectByRole(role);
      return;
    }
  }

  if (loginPage) {
    const form = document.getElementById("loginForm");
    const googleButton = document.getElementById("googleLoginButton");
    const registerForm = document.getElementById("registerForm");
    const forgotPasswordLink = document.getElementById("forgotPasswordLink");
    const createAccountButton = document.getElementById("createAccountButton");
    const loginSection = document.getElementById("loginSection");
    const registerSection = document.getElementById("registerSection");
    const auth = getAuthInstance();

    if (auth) {
      auth.onAuthStateChanged(async (user) => {
        if (!user) return;
        const role = await ensureUserProfileInFirestore(user);
        await redirectByRole(role);
      });
    }

    if (googleButton && auth && firebase.auth) {
      googleButton.addEventListener("click", async () => {
        try {
          const provider = new firebase.auth.GoogleAuthProvider();
          const result = await auth.signInWithPopup(provider);
          await handleAuthenticatedUser(result.user);
        } catch (error) {
          showToast(error.message || "Google sign-in failed.", "error");
        }
      });
    }

    if (form && auth) {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
          showToast("Please enter both email and password.", "error");
          return;
        }

        try {
          const result = await auth.signInWithEmailAndPassword(email, password);
          await handleAuthenticatedUser(result.user);
        } catch (error) {
          showToast(error.message || "Login failed.", "error");
        }
      });
    }

    if (registerForm && auth) {
      registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById(
          "registerConfirmPassword",
        ).value;

        if (!name || !email || !password || !confirmPassword) {
          showToast("Please complete all registration fields.", "error");
          return;
        }

        if (password !== confirmPassword) {
          showToast("Passwords do not match.", "error");
          return;
        }

        try {
          const result = await auth.createUserWithEmailAndPassword(
            email,
            password,
          );
          const user = result.user;
          const userDocRole = isAuthorizedAdminEmail(email)
            ? "admin"
            : "public";

          const db = getFirestoreDb();
          if (db) {
            await db.collection("users").doc(user.uid).set(
              {
                uid: user.uid,
                name,
                email: email.toLowerCase(),
                role: userDocRole,
                active: true,
                createdAt: new Date().toISOString(),
              },
              { merge: true },
            );
          }

          if (user && user.updateProfile) {
            await user.updateProfile({ displayName: name });
          }

          showToast("Account created. Redirecting...", "success");
          await handleAuthenticatedUser(user);
        } catch (error) {
          showToast(error.message || "Registration failed.", "error");
        }
      });
    }

    if (forgotPasswordLink && auth) {
      forgotPasswordLink.addEventListener("click", async (event) => {
        event.preventDefault();
        const email = document.getElementById("email").value.trim();
        if (!email) {
          showToast("Enter your email first to reset the password.", "error");
          return;
        }

        try {
          await auth.sendPasswordResetEmail(email);
          showToast("Password reset email sent.", "success");
        } catch (error) {
          showToast(error.message || "Unable to send reset email.", "error");
        }
      });
    }

    if (createAccountButton) {
      createAccountButton.addEventListener("click", () => {
        if (loginSection) loginSection.style.display = "none";
        if (registerSection) registerSection.style.display = "block";
      });
    }
  }

  if (protectedPage || adminPage || committeePage) {
    const auth = getAuthInstance();
    if (!auth) {
      window.location.href = loginUrl;
      return;
    }

    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        window.location.href = loginUrl;
        return;
      }

      const role = await ensureUserProfileInFirestore(user);
      if (adminPage && role !== "admin") {
        showToast("Access denied.", "error");
        await redirectByRole(role);
        return;
      }

      if (committeePage && !["admin", "committee"].includes(role)) {
        showToast("Access denied.", "error");
        await redirectByRole(role);
        return;
      }
    });
  }

  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      const auth = getAuthInstance();
      if (auth && auth.signOut) {
        await auth.signOut();
      }
      clearDemoUser();
      window.location.href = loginUrl;
    });
  }
});
