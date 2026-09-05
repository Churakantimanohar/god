document.addEventListener("DOMContentLoaded", () => {
  function renderTransparency() {
    const params = new URLSearchParams(window.location.search);
    const year = params.get("year") || "2026";
    document.getElementById("festivalTitle").textContent = year;

    const data = loadDemoData();
    const festival =
      data.festivalYears.find((entry) => entry.id === year) ||
      data.festivalYears[0];
    const summary = getFinancialSummary(year);

    document.getElementById("publicDonations").textContent = formatCurrency(
      summary.totalDonations,
    );
    document.getElementById("publicExpenses").textContent = formatCurrency(
      summary.totalExpenses,
    );
    document.getElementById("publicBalance").textContent = formatCurrency(
      summary.balance,
    );
    document.getElementById("lastUpdatedText").textContent =
      "Last Updated: " +
      new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    const donationTable = document.getElementById("publicDonationsTable");
    donationTable.innerHTML = summary.donations.length
      ? summary.donations
          .map(
            (item) => `
          <tr>
            <td>${formatDate(item.date)}</td>
            <td>${item.donorName}</td>
            <td>${formatCurrency(item.amount)}</td>
            <td>${item.paymentMethod}</td>
          </tr>
        `,
          )
          .join("")
      : `<tr><td colspan="4"><div class="empty-state">No verified donations recorded yet.</div></td></tr>`;

    const expenseTable = document.getElementById("publicExpensesTable");
    expenseTable.innerHTML = summary.expenses.length
      ? summary.expenses
          .map(
            (item) => `
          <tr>
            <td>${formatDate(item.date)}</td>
            <td>${item.category}</td>
            <td>${item.description}</td>
            <td>${formatCurrency(item.amount)}</td>
            <td>${item.billUrl ? `<a href="${item.billUrl}" target="_blank" class="bill-link">View</a>` : "—"}</td>
          </tr>
        `,
          )
          .join("")
      : `<tr><td colspan="5"><div class="empty-state">No verified expenses recorded yet.</div></td></tr>`;

    const qrTarget = getPublicUrlForYear(festival.id || year);
    const qr = qrcode(0, "L");
    qr.addData(qrTarget);
    qr.make();
    document.getElementById("qrCodeWrapper").innerHTML = qr.createImgTag(6, 10);
  }

  renderTransparency();
  window.addEventListener("ganapathi-data-changed", renderTransparency);
});
