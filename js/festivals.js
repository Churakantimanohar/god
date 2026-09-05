document.addEventListener("DOMContentLoaded", () => {
  const user = getDemoUser();
  if (user) {
    document.getElementById("loggedUserLabel").textContent =
      user.name + " • " + user.role;
  }

  const tableBody = document.getElementById("festivalTableBody");
  const form = document.getElementById("festivalForm");

  function renderFestivals() {
    const data = loadDemoData();
    const festivals = data.festivalYears || [];

    if (!festivals.length) {
      tableBody.innerHTML = `<tr><td colspan="7"><div class="empty-state">No festival years found.</div></td></tr>`;
      return;
    }

    tableBody.innerHTML = festivals
      .map(
        (festival) => `
      <tr>
        <td>${festival.year}</td>
        <td>${festival.name}</td>
        <td>${formatDate(festival.startDate)}</td>
        <td>${formatDate(festival.endDate)}</td>
        <td>${formatCurrency(festival.openingBalance || 0)}</td>
        <td>${festival.active ? '<span class="badge verified">Active</span>' : '<span class="badge pending">Inactive</span>'}</td>
        <td>
          <div class="list-actions">
            <button class="tiny-btn primary" type="button" data-action="activate" data-id="${festival.id}">Set Active</button>
          </div>
        </td>
      </tr>
    `,
      )
      .join("");

    tableBody.querySelectorAll("[data-action='activate']").forEach((button) => {
      button.addEventListener("click", () => {
        if (!requirePermission("Admin")) return;
        const data = loadDemoData();
        data.festivalYears = (data.festivalYears || []).map((f) => ({
          ...f,
          active: f.id === button.dataset.id,
        }));
        saveDemoData(data);
        showToast("Festival year updated successfully.", "success");
        renderFestivals();
      });
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!requirePermission("Admin")) return;

    const year = Number(document.getElementById("festivalYear").value);
    const name = document.getElementById("festivalName").value.trim();
    const startDate = document.getElementById("festivalStart").value;
    const endDate = document.getElementById("festivalEnd").value;
    const openingBalance = Number(
      document.getElementById("openingBalance").value || 0,
    );
    const active = document.getElementById("activeFestival").value === "1";

    if (!year || !name || !startDate || !endDate) {
      showToast("Please complete all festival fields.", "error");
      return;
    }

    const data = loadDemoData();
    const newFestival = {
      id: String(year),
      name,
      year,
      startDate,
      endDate,
      active,
      openingBalance,
    };

    const existing = (data.festivalYears || []).find(
      (festival) => festival.id === String(year),
    );
    if (existing) {
      showToast("A festival year already exists for this year.", "error");
      return;
    }

    data.festivalYears = data.festivalYears || [];
    data.festivalYears.push(newFestival);
    saveDemoData(data);
    showToast("Festival year created successfully.", "success");
    form.reset();
    renderFestivals();
  });

  renderFestivals();
});
