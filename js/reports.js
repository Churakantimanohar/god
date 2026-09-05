document.addEventListener("DOMContentLoaded", () => {
  const user = getDemoUser();
  if (user) {
    document.getElementById("loggedUserLabel").textContent =
      user.name + " • " + user.role;
  }

  const summary = getFinancialSummary("2026");
  document.getElementById("reportDonations").textContent = formatCurrency(
    summary.totalDonations,
  );
  document.getElementById("reportExpenses").textContent = formatCurrency(
    summary.totalExpenses,
  );
  document.getElementById("reportBalance").textContent = formatCurrency(
    summary.balance,
  );
  document.getElementById("reportDonationCount").textContent = String(
    summary.donorCount,
  );
  document.getElementById("reportExpenseCount").textContent = String(
    summary.expenseCount,
  );

  const breakdown = calculateExpenseBreakdown("2026");
  const list = document.getElementById("expenseBreakdownList");
  const rows = Object.entries(breakdown)
    .map(
      ([label, value]) => `
    <div class="report-row"><span>${label}</span><strong>${formatCurrency(value)}</strong></div>
  `,
    )
    .join("");
  list.innerHTML =
    rows ||
    '<div class="report-row"><span>No expenses</span><strong>₹0</strong></div>';

  document.getElementById("downloadReportBtn").addEventListener("click", () => {
    const payload = `Ganapathi Seva Financial Report\n2026\n\nTotal Donations: ${formatCurrency(summary.totalDonations)}\nTotal Expenses: ${formatCurrency(summary.totalExpenses)}\nClosing Balance: ${formatCurrency(summary.balance)}`;
    const blob = new Blob([payload], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ganapathi-seva-report-2026.txt";
    link.click();
    URL.revokeObjectURL(url);
    showToast("Report downloaded successfully.", "success");
  });
});
