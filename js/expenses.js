document.addEventListener("DOMContentLoaded", () => {
  const user = getDemoUser();
  if (user) {
    document.getElementById("loggedUserLabel").textContent =
      user.name + " • " + user.role;
  }

  const tableBody = document.getElementById("expenseTableBody");
  const form = document.getElementById("expenseForm");
  const search = document.getElementById("expenseSearch");
  const categoryFilter = document.getElementById("expenseCategoryFilter");
  const statusFilter = document.getElementById("expenseStatusFilter");
  const dateFilter = document.getElementById("expenseDateFilter");

  function renderExpenses() {
    const data = loadDemoData();
    const festivalId = getCurrentFestival().id;
    let entries = (data.expenses || []).filter(
      (item) => item.festivalId === festivalId,
    );

    const searchValue = search.value.trim().toLowerCase();
    const categoryValue = categoryFilter.value;
    const statusValue = statusFilter.value;
    const dateValue = dateFilter.value;

    entries = entries.filter((entry) => {
      const text =
        `${entry.description || ""} ${entry.vendor || ""}`.toLowerCase();
      const matchesSearch = !searchValue || text.includes(searchValue);
      const matchesCategory =
        !categoryValue || entry.category === categoryValue;
      const matchesStatus = !statusValue || entry.status === statusValue;
      const matchesDate = !dateValue || entry.date === dateValue;
      return matchesSearch && matchesCategory && matchesStatus && matchesDate;
    });

    if (!entries.length) {
      tableBody.innerHTML = `<tr><td colspan="9"><div class="empty-state">No expenses recorded yet.</div></td></tr>`;
      return;
    }

    tableBody.innerHTML = entries
      .map((entry) => buildTransactionRow(entry, "expense"))
      .join("");

    tableBody.querySelectorAll("[data-action='verify']").forEach((button) => {
      button.addEventListener("click", () => {
        if (!requirePermission("Treasurer")) return;
        if (!button.dataset.id) return;
        markTransactionStatus("expense", button.dataset.id, "Verified");
      });
    });

    tableBody.querySelectorAll("[data-action='delete']").forEach((button) => {
      button.addEventListener("click", () => {
        if (!requirePermission("Admin")) return;
        deleteTransaction("expense", button.dataset.id);
      });
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!requirePermission("Treasurer")) return;

    const category = document.getElementById("expenseCategory").value;
    const description = document
      .getElementById("expenseDescription")
      .value.trim();
    const vendor = document.getElementById("vendorName").value.trim();
    const amount = Number(document.getElementById("expenseAmount").value);
    const paymentMethod = document.getElementById("expensePaymentMethod").value;
    const date = document.getElementById("expenseDate").value;
    const notes = document.getElementById("expenseNotes").value.trim();
    const status = document.getElementById("expenseStatus").value;
    const billFile = document.getElementById("billUpload").files[0];

    if (!description || !vendor || !date || !amount || amount <= 0) {
      showToast("Please enter valid expense details.", "error");
      return;
    }

    let billUrl = "";
    if (billFile) {
      billUrl = `https://example.com/demo-bills/${billFile.name}`;
      showToast("Bill uploaded successfully.", "success");
    }

    const data = loadDemoData();
    const festivalId = getCurrentFestival().id;
    const newExpense = {
      id: `EXP-${Date.now()}`,
      festivalId,
      category,
      description,
      vendor,
      amount,
      paymentMethod,
      date,
      billUrl,
      billType: billFile
        ? billFile.type.includes("pdf")
          ? "pdf"
          : "image"
        : "",
      status,
      notes,
      createdBy: user?.name || "Treasurer",
      createdAt: new Date().toISOString(),
    };

    data.expenses = data.expenses || [];
    data.expenses.unshift(newExpense);
    saveDemoData(data);
    addAuditLog(
      user?.name || "Treasurer",
      `Created Expense #${newExpense.id}`,
      newExpense.id,
    );
    showToast("Expense added successfully.", "success");
    form.reset();
    renderExpenses();
  });

  [search, categoryFilter, statusFilter, dateFilter].forEach((input) => {
    input.addEventListener("input", renderExpenses);
    input.addEventListener("change", renderExpenses);
  });

  renderExpenses();
});
