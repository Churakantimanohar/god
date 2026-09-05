document.addEventListener("DOMContentLoaded", () => {
  const user = getDemoUser();
  if (user) {
    document.getElementById("loggedUserLabel").textContent =
      user.name + " • " + user.role;
  }

  const tableBody = document.getElementById("userTableBody");
  const data = loadDemoData();
  const users = data.users || [];

  if (!users.length) {
    tableBody.innerHTML = `<tr><td colspan="4"><div class="empty-state">No users found.</div></td></tr>`;
    return;
  }

  tableBody.innerHTML = users
    .map(
      (member) => `
    <tr>
      <td>${member.name}</td>
      <td>${member.email}</td>
      <td><span class="badge ${member.role.toLowerCase() === "admin" ? "verified" : member.role.toLowerCase() === "treasurer" ? "pending" : "rejected"}">${member.role}</span></td>
      <td>
        <div class="list-actions">
          <button class="tiny-btn" type="button">Edit</button>
          <button class="tiny-btn primary" type="button">Manage</button>
        </div>
      </td>
    </tr>
  `,
    )
    .join("");
});
