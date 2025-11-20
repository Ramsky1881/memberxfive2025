document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("blacklist-table-body");

  blacklistMembers.forEach(member => {
    const row = document.createElement("tr");
    row.className = "border-b border-white/10";

    const rejoinDate = getRejoinDate(member.outDate, member.duration);

    row.innerHTML = `
      <td class="p-4">${member.nama}</td>
      <td class="p-4">${member.nickname}</td>
      <td class="p-4">${member.pelanggaran}</td>
      <td class="p-4">${rejoinDate}</td>
    `;

    tableBody.appendChild(row);
  });
});

function getRejoinDate(outDate, duration) {
  if (duration === "permanent") {
    return "Permanen";
  }

  const out = new Date(outDate);
  out.setMonth(out.getMonth() + duration);

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return out.toLocaleDateString('id-ID', options);
}
