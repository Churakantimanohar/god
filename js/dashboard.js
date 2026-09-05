document.addEventListener("DOMContentLoaded", () => {
  const user = getDemoUser();
  if (user) {
    document.getElementById("loggedUserLabel").textContent =
      user.name + " • " + user.role;
  }

  function renderDashboard() {
    const summary = getFinancialSummary();
    document.getElementById("totalDonationsValue").textContent = formatCurrency(
      summary.totalDonations,
    );
    document.getElementById("totalExpensesValue").textContent = formatCurrency(
      summary.totalExpenses,
    );
    document.getElementById("balanceValue").textContent = formatCurrency(
      summary.balance,
    );
    document.getElementById("donorCountValue").textContent = String(
      summary.donorCount,
    );
    document.getElementById("expenseCountValue").textContent = String(
      summary.expenseCount,
    );
    document.getElementById("lastUpdatedValue").textContent =
      "Last Updated: " +
      new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    const chartCtx = document.getElementById("donationExpenseChart");
    if (chartCtx && chartCtx.chartInstance) {
      chartCtx.chartInstance.destroy();
    }

    chartCtx.chartInstance = new Chart(chartCtx, {
      type: "bar",
      data: {
        labels: ["Donations", "Expenses"],
        datasets: [
          {
            label: "Festival Finance",
            data: [summary.totalDonations, summary.totalExpenses],
            backgroundColor: ["#1f7a5a", "#f6b73c"],
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            ticks: {
              callback: (value) => "₹" + value.toLocaleString("en-IN"),
            },
          },
        },
      },
    });

    const categoryBreakdown = calculateExpenseBreakdown("2026");
    const categoryLabels = Object.keys(categoryBreakdown);
    const categoryValues = Object.values(categoryBreakdown);
    const categoryChart = document.getElementById("categoryChart");

    if (categoryChart && categoryChart.chartInstance) {
      categoryChart.chartInstance.destroy();
    }

    categoryChart.chartInstance = new Chart(categoryChart, {
      type: "doughnut",
      data: {
        labels: categoryLabels.length ? categoryLabels : ["No Data"],
        datasets: [
          {
            data: categoryValues.length ? categoryValues : [1],
            backgroundColor: [
              "#1f7a5a",
              "#f5b23b",
              "#4f46e5",
              "#ec4899",
              "#f97316",
              "#10b981",
              "#eab308",
              "#8b5cf6",
              "#ef4444",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom" } },
      },
    });

    const recentRows = [];
    const data = loadDemoData();
    const recentDonations = (data.donations || []).slice(0, 3);
    const recentExpenses = (data.expenses || []).slice(0, 2);

    recentDonations.forEach((donation) => {
      recentRows.push({
        date: donation.date,
        type: "Donation",
        details: donation.donorName,
        amount: donation.amount,
        status: donation.status,
      });
    });

    recentExpenses.forEach((expense) => {
      recentRows.push({
        date: expense.date,
        type: "Expense",
        details: expense.description,
        amount: expense.amount,
        status: expense.status,
      });
    });

    recentRows.sort((a, b) => new Date(b.date) - new Date(a.date));

    const tableBody = document.getElementById("recentActivityTableBody");
    if (!recentRows.length) {
      tableBody.innerHTML = `<tr><td colspan="5"><div class="empty-state">No recent activity recorded yet.</div></td></tr>`;
      return;
    }

    tableBody.innerHTML = recentRows
      .slice(0, 5)
      .map(
        (row) => `
      <tr>
        <td>${formatDate(row.date)}</td>
        <td>${row.type}</td>
        <td>${row.details}</td>
        <td>${formatCurrency(row.amount)}</td>
        <td>${buildStatusBadge(row.status)}</td>
      </tr>
    `,
      )
      .join("");
  }

  renderDashboard();
  window.addEventListener("ganapathi-data-changed", renderDashboard);
});
