const STORAGE_KEY = "ganapathi-seva-demo-data-v1";

function safeNumber(value) {
  const num = Number(value || 0);
  return Number.isFinite(num) ? num : 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(safeNumber(value));
}

function formatDate(dateValue) {
  if (!dateValue) return "—";
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return dateValue;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function formatAuditDate(dateValue) {
  const parsed = new Date(dateValue);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

function defaultDemoData() {
  return {
    festivalYears: [
      {
        id: "2026",
        name: "Ganapathi Festival 2026",
        year: 2026,
        startDate: "2026-08-20",
        endDate: "2026-09-05",
        active: true,
        openingBalance: 0,
      },
    ],
    donations: [
      {
        id: "DON-2026001",
        festivalId: "2026",
        donorName: "Ravi Kumar",
        amount: 5000,
        paymentMethod: "UPI",
        transactionId: "UPI123456",
        date: "2026-08-22",
        status: "Verified",
        notes: "Initial contribution",
        createdBy: "Admin User",
        createdAt: "2026-08-22T10:30:00.000Z",
      },
      {
        id: "DON-2026002",
        festivalId: "2026",
        donorName: "Suresh",
        amount: 2500,
        paymentMethod: "Cash",
        transactionId: "CASH-001",
        date: "2026-08-23",
        status: "Verified",
        notes: "Temple contribution",
        createdBy: "Treasurer Ravi",
        createdAt: "2026-08-23T11:25:00.000Z",
      },
      {
        id: "DON-2026003",
        festivalId: "2026",
        donorName: "Mahesh",
        amount: 10000,
        paymentMethod: "Bank Transfer",
        transactionId: "BANK-1024",
        date: "2026-08-24",
        status: "Verified",
        notes: "Major donation",
        createdBy: "Admin User",
        createdAt: "2026-08-24T09:10:00.000Z",
      },
      {
        id: "DON-2026004",
        festivalId: "2026",
        donorName: "Prakash",
        amount: 1000,
        paymentMethod: "UPI",
        transactionId: "UPI987654",
        date: "2026-08-25",
        status: "Verified",
        notes: "Small contribution",
        createdBy: "Treasurer Ravi",
        createdAt: "2026-08-25T16:00:00.000Z",
      },
    ],
    expenses: [
      {
        id: "EXP-2026001",
        festivalId: "2026",
        category: "Ganapathi Idol",
        description: "Ganapathi Idol",
        vendor: "Sri Balaji Arts",
        amount: 15000,
        paymentMethod: "Bank Transfer",
        date: "2026-08-27",
        billUrl: "",
        billType: "image",
        status: "Verified",
        notes: "Idol purchase",
        createdBy: "Admin User",
        createdAt: "2026-08-27T15:00:00.000Z",
      },
      {
        id: "EXP-2026002",
        festivalId: "2026",
        category: "Decoration",
        description: "Decoration for entrance",
        vendor: "Decor Studio",
        amount: 8500,
        paymentMethod: "UPI",
        date: "2026-08-28",
        billUrl: "",
        billType: "image",
        status: "Verified",
        notes: "Traditional decor",
        createdBy: "Treasurer Ravi",
        createdAt: "2026-08-28T14:30:00.000Z",
      },
      {
        id: "EXP-2026003",
        festivalId: "2026",
        category: "Sound System",
        description: "Sound system rental",
        vendor: "Audio X",
        amount: 12000,
        paymentMethod: "Bank Transfer",
        date: "2026-08-29",
        billUrl: "",
        billType: "image",
        status: "Verified",
        notes: "Festival sound setup",
        createdBy: "Admin User",
        createdAt: "2026-08-29T12:15:00.000Z",
      },
      {
        id: "EXP-2026004",
        festivalId: "2026",
        category: "Food",
        description: "Annadanam food supply",
        vendor: "Community Kitchen",
        amount: 20000,
        paymentMethod: "Cash",
        date: "2026-08-30",
        billUrl: "",
        billType: "image",
        status: "Verified",
        notes: "Food services",
        createdBy: "Treasurer Ravi",
        createdAt: "2026-08-30T09:40:00.000Z",
      },
      {
        id: "EXP-2026005",
        festivalId: "2026",
        category: "Electricity",
        description: "Temporary power connection",
        vendor: "Power Works",
        amount: 4500,
        paymentMethod: "Bank Transfer",
        date: "2026-08-31",
        billUrl: "",
        billType: "pdf",
        status: "Verified",
        notes: "Power for event",
        createdBy: "Admin User",
        createdAt: "2026-08-31T18:00:00.000Z",
      },
    ],
    users: [
      {
        userId: "demo-admin",
        name: "Admin User",
        email: "admin@ganapathiseva.com",
        role: "Super Admin",
        isSuperAdmin: true,
      },
      {
        userId: "demo-treasurer",
        name: "Treasurer Ravi",
        email: "treasurer@ganapathiseva.com",
        role: "Treasurer",
      },
      {
        userId: "demo-viewer",
        name: "Community Viewer",
        email: "viewer@ganapathiseva.com",
        role: "Viewer",
      },
    ],
    auditLog: [
      {
        id: "AUD-1",
        user: "Admin User",
        action: "Verified Donation #DON-2026001",
        transaction: "DON-2026001",
        date: "2026-08-22T11:15:00.000Z",
      },
      {
        id: "AUD-2",
        user: "Treasurer Ravi",
        action: "Verified Expense #EXP-2026002",
        transaction: "EXP-2026002",
        date: "2026-08-28T15:10:00.000Z",
      },
    ],
  };
}

function loadDemoData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDemoData()));
    return defaultDemoData();
  }

  try {
    const parsed = JSON.parse(stored);
    return parsed;
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDemoData()));
    return defaultDemoData();
  }
}

function notifyDataChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("ganapathi-data-changed", {
      detail: { source: "storage" },
    }),
  );
}

function saveDemoData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  notifyDataChanged();
}

function clearDemoData() {
  const emptyData = {
    festivalYears: [],
    donations: [],
    expenses: [],
    users: [],
    auditLog: [],
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(emptyData));
  notifyDataChanged();
  return emptyData;
}

function resetDemoData() {
  return clearDemoData();
}

function getCurrentFestival() {
  const data = loadDemoData();
  const festivalYears = Array.isArray(data.festivalYears)
    ? data.festivalYears
    : [];
  return (
    festivalYears.find((year) => year.active) ||
    festivalYears[0] || {
      id: "",
      name: "",
      year: null,
      active: false,
      openingBalance: 0,
    }
  );
}

function getFestivalById(festivalId) {
  const data = loadDemoData();
  const festivalYears = Array.isArray(data.festivalYears)
    ? data.festivalYears
    : [];
  return (
    festivalYears.find((year) => year.id === festivalId) ||
    festivalYears[0] || {
      id: "",
      name: "",
      year: null,
      active: false,
      openingBalance: 0,
    }
  );
}

function getFinancialSummary(festivalId = getCurrentFestival().id) {
  const data = loadDemoData();
  const activeFestivalId = festivalId || getCurrentFestival().id || "";
  const donations = (data.donations || []).filter(
    (entry) =>
      entry.festivalId === activeFestivalId && entry.status === "Verified",
  );
  const expenses = (data.expenses || []).filter(
    (entry) =>
      entry.festivalId === activeFestivalId && entry.status === "Verified",
  );

  const totalDonations = donations.reduce(
    (sum, item) => sum + safeNumber(item.amount),
    0,
  );
  const totalExpenses = expenses.reduce(
    (sum, item) => sum + safeNumber(item.amount),
    0,
  );
  const balance = totalDonations - totalExpenses;

  return {
    totalDonations,
    totalExpenses,
    balance,
    donorCount: new Set(donations.map((item) => item.donorName)).size,
    expenseCount: expenses.length,
    donations,
    expenses,
  };
}

function addAuditLog(userName, action, transaction) {
  const data = loadDemoData();
  data.auditLog = data.auditLog || [];
  data.auditLog.unshift({
    id: `AUD-${Date.now()}`,
    user: userName,
    action,
    transaction,
    date: new Date().toISOString(),
  });
  saveDemoData(data);
}

function showToast(message, type = "success") {
  const existing = document.querySelector(".toast-container");
  if (!existing) {
    const container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const wrapper = document.querySelector(".toast-container");
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  wrapper.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 200);
  }, 2600);
}

function isAdminRole(roleName) {
  const normalized = (roleName || "").toLowerCase().replace(/\s+/g, " ").trim();
  return (
    normalized === "admin" ||
    normalized === "super admin" ||
    normalized === "superadmin"
  );
}

function requirePermission(requiredRole) {
  const user = getDemoUser();
  if (!user) {
    window.location.href = "login.html";
    return false;
  }

  const role = (user.role || "Viewer").toLowerCase();
  const required = (requiredRole || "Viewer").toLowerCase();

  if (isAdminRole(user.role)) return true;
  if (
    role === "treasurer" &&
    (required === "viewer" || required === "treasurer")
  )
    return true;
  if (role === "viewer" && required === "viewer") return true;

  showToast("You do not have permission to perform this action.", "error");
  return false;
}

function getDemoUser() {
  const stored = localStorage.getItem("ganapathi-demo-user");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (error) {
    return null;
  }
}

function setDemoUser(user) {
  localStorage.setItem("ganapathi-demo-user", JSON.stringify(user));
  localStorage.setItem("ganapathi-demo-auth", "true");
}

function clearDemoUser() {
  localStorage.removeItem("ganapathi-demo-user");
  localStorage.removeItem("ganapathi-demo-auth");
}

function getPublicUrlForYear(year) {
  const base =
    window.location.origin && window.location.origin !== "file://"
      ? window.location.origin
      : "";
  return `${base}/transparency.html?year=${year}`;
}

function getActiveUserRole() {
  const user = getDemoUser();
  if (!user) return "Viewer";
  return isAdminRole(user.role) ? "Super Admin" : user.role;
}

function buildStatusBadge(status) {
  const normalized = (status || "Pending").toLowerCase();
  const map = {
    pending: "pending",
    verified: "verified",
    rejected: "rejected",
  };
  return `<span class="badge ${map[normalized] || "pending"}">${status || "Pending"}</span>`;
}

function buildTransactionRow(item, type = "donation") {
  if (type === "donation") {
    return `
      <tr>
        <td>${formatDate(item.date)}</td>
        <td>${item.donorName}</td>
        <td>${formatCurrency(item.amount)}</td>
        <td>${item.paymentMethod}</td>
        <td>${item.transactionId || "—"}</td>
        <td>${buildStatusBadge(item.status)}</td>
        <td>${item.createdBy || "Admin"}</td>
        <td>
          <div class="list-actions">
            <button class="tiny-btn primary" type="button" data-action="verify" data-id="${item.id}" data-type="donation">Verify</button>
            <button class="tiny-btn" type="button" data-action="delete" data-id="${item.id}" data-type="donation">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }

  return `
    <tr>
      <td>${formatDate(item.date)}</td>
      <td>${item.category}</td>
      <td>${item.description}</td>
      <td>${item.vendor}</td>
      <td>${formatCurrency(item.amount)}</td>
      <td>${item.paymentMethod}</td>
      <td>${item.billUrl ? `<a href="${item.billUrl}" target="_blank" class="bill-link">View Bill</a>` : "No Bill"}</td>
      <td>${buildStatusBadge(item.status)}</td>
      <td>
        <div class="list-actions">
          <button class="tiny-btn primary" type="button" data-action="verify" data-id="${item.id}" data-type="expense">Verify</button>
          <button class="tiny-btn" type="button" data-action="delete" data-id="${item.id}" data-type="expense">Delete</button>
        </div>
      </td>
    </tr>
  `;
}

function calculateExpenseBreakdown(yearId) {
  const data = loadDemoData();
  const expenses = (data.expenses || []).filter(
    (entry) => entry.festivalId === yearId && entry.status === "Verified",
  );
  const breakdown = {};

  expenses.forEach((expense) => {
    const key = expense.category || "Miscellaneous";
    breakdown[key] = (breakdown[key] || 0) + safeNumber(expense.amount);
  });

  return breakdown;
}

function renderYearOptions(selectEl, selectedId) {
  const data = loadDemoData();
  if (!selectEl) return;
  selectEl.innerHTML = "";
  data.festivalYears.forEach((year) => {
    const option = document.createElement("option");
    option.value = year.id;
    option.textContent = `${year.name} (${year.id})`;
    option.selected = year.id === selectedId;
    selectEl.appendChild(option);
  });
}

function generateTransactionId(prefix) {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${Date.now()}-${random}`;
}

function markTransactionStatus(type, transactionId, nextStatus) {
  const data = loadDemoData();
  const collection = type === "donation" ? "donations" : "expenses";
  const entry = (data[collection] || []).find(
    (item) => item.id === transactionId || item.transactionId === transactionId,
  );

  if (!entry) {
    showToast("Transaction not found.", "error");
    return;
  }

  entry.status = nextStatus;
  saveDemoData(data);
  showToast(
    `${type === "donation" ? "Donation" : "Expense"} marked as ${nextStatus}.`,
    "success",
  );
  addAuditLog(
    getDemoUser()?.name || "System",
    `${nextStatus} ${type === "donation" ? "Donation" : "Expense"} #${entry.id}`,
    entry.id,
  );
  window.location.reload();
}

function deleteTransaction(type, transactionId) {
  const data = loadDemoData();
  const collection = type === "donation" ? "donations" : "expenses";
  const updated = (data[collection] || []).filter(
    (item) => item.id !== transactionId && item.transactionId !== transactionId,
  );
  data[collection] = updated;
  saveDemoData(data);
  addAuditLog(
    getDemoUser()?.name || "System",
    `Deleted ${type === "donation" ? "Donation" : "Expense"} #${transactionId}`,
    transactionId,
  );
  showToast(
    `${type === "donation" ? "Donation" : "Expense"} removed successfully.`,
    "success",
  );
  window.location.reload();
}

function setupGlobalToastStyles() {
  if (document.querySelector("style[data-toast-style='yes']")) return;
  const style = document.createElement("style");
  style.setAttribute("data-toast-style", "yes");
  style.textContent = `
    .toast-container {
      position: fixed;
      right: 20px;
      bottom: 20px;
      display: grid;
      gap: 12px;
      z-index: 2000;
    }
    .toast {
      min-width: 240px;
      max-width: 360px;
      padding: 14px 16px;
      background: #111827;
      color: #fff;
      border-radius: 12px;
      box-shadow: 0 14px 32px rgba(15, 23, 42, 0.2);
      opacity: 0;
      transform: translateY(12px);
      transition: 0.2s ease;
      font-weight: 600;
    }
    .toast.show {
      opacity: 1;
      transform: translateY(0);
    }
    .toast-success { background: #1f9d61; }
    .toast-error { background: #dc2626; }
  `;
  document.head.appendChild(style);
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      window.dispatchEvent(
        new CustomEvent("ganapathi-data-changed", {
          detail: { source: "storage" },
        }),
      );
    }
  });
}

setupGlobalToastStyles();

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    STORAGE_KEY,
    defaultDemoData,
    loadDemoData,
    saveDemoData,
    clearDemoData,
    resetDemoData,
    notifyDataChanged,
    getFinancialSummary,
    addAuditLog,
    buildStatusBadge,
    calculateExpenseBreakdown,
    getCurrentFestival,
    getFestivalById,
    getDemoUser,
    setDemoUser,
    clearDemoUser,
    getPublicUrlForYear,
    getActiveUserRole,
  };
}
