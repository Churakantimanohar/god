document.addEventListener("DOMContentLoaded", () => {
  const user = getDemoUser();
  if (user) {
    document.getElementById("loggedUserLabel").textContent =
      user.name + " • " + user.role;
  }

  const tableBody = document.getElementById("donationTableBody");
  const form = document.getElementById("donationForm");
  const donationSearch = document.getElementById("donationSearch");
  const donationStatusFilter = document.getElementById("donationStatusFilter");
  const donationMethodFilter = document.getElementById("donationMethodFilter");
  const donationDateFilter = document.getElementById("donationDateFilter");

  function renderDonations() {
    const data = loadDemoData();
    const festivalId = getCurrentFestival().id;
    let entries = (data.donations || []).filter(
      (item) => item.festivalId === festivalId,
    );

    const searchValue = donationSearch.value.trim().toLowerCase();
    const statusValue = donationStatusFilter.value;
    const methodValue = donationMethodFilter.value;
    const dateValue = donationDateFilter.value;

    entries = entries.filter((entry) => {
      const matchesSearch =
        !searchValue ||
        (entry.donorName || "").toLowerCase().includes(searchValue);
      const matchesStatus = !statusValue || entry.status === statusValue;
      const matchesMethod = !methodValue || entry.paymentMethod === methodValue;
      const matchesDate = !dateValue || entry.date === dateValue;
      return matchesSearch && matchesStatus && matchesMethod && matchesDate;
    });

    if (!entries.length) {
      tableBody.innerHTML = `<tr><td colspan="8"><div class="empty-state">No donations recorded yet.</div></td></tr>`;
      return;
    }

    tableBody.innerHTML = entries
      .map((entry) => buildTransactionRow(entry, "donation"))
      .join("");

    tableBody.querySelectorAll("[data-action='verify']").forEach((button) => {
      button.addEventListener("click", () => {
        if (!requirePermission("Treasurer")) return;
        markTransactionStatus("donation", button.dataset.id, "Verified");
      });
    });

    tableBody.querySelectorAll("[data-action='delete']").forEach((button) => {
      button.addEventListener("click", () => {
        if (!requirePermission("Admin")) return;
        deleteTransaction("donation", button.dataset.id);
      });
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!requirePermission("Treasurer")) return;

    const donorName = document.getElementById("donorName").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const paymentMethod = document.getElementById("paymentMethod").value;
    const transactionId =
      document.getElementById("transactionId").value.trim() ||
      generateTransactionId("UPI");
    const date = document.getElementById("date").value;
    const notes = document.getElementById("notes").value.trim();
    const status = document.getElementById("status").value;

    if (!donorName || donorName.length < 2) {
      showToast("Please enter a valid donor name.", "error");
      return;
    }
    if (!amount || amount <= 0) {
      showToast("Please enter a valid donation amount.", "error");
      return;
    }
    if (!date) {
      showToast("Please select a valid date.", "error");
      return;
    }

    const data = loadDemoData();
    const festivalId = getCurrentFestival().id;
    const newDonation = {
      id: `DON-${Date.now()}`,
      festivalId,
      donorName,
      amount,
      paymentMethod,
      transactionId,
      date,
      status,
      notes,
      createdBy: user?.name || "Treasurer",
      createdAt: new Date().toISOString(),
    };

    data.donations = data.donations || [];
    data.donations.unshift(newDonation);
    saveDemoData(data);
    addAuditLog(
      user?.name || "Treasurer",
      `Created Donation #${newDonation.id}`,
      newDonation.id,
    );
    showToast("Donation added successfully.", "success");
    form.reset();
    renderDonations();
  });

  [
    donationSearch,
    donationStatusFilter,
    donationMethodFilter,
    donationDateFilter,
  ].forEach((element) => {
    element.addEventListener("input", renderDonations);
    element.addEventListener("change", renderDonations);
  });

  renderDonations();
});
