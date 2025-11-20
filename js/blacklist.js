document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("blacklist-table-body");

  blacklistMembers.forEach(member => {
    const row = document.createElement("tr");
    row.className = "border-b border-white/10";
    tableBody.appendChild(row);
    renderBlacklistMember(row, member);
  });
});

function renderBlacklistMember(row, member) {
  if (member.duration === "permanent") {
    row.innerHTML = `
      <td class="p-4">${member.nama}</td>
      <td class="p-4">${member.nickname}</td>
      <td class="p-4">${member.pelanggaran}</td>
      <td class="p-4">Permanen</td>
      <td class="p-4">N/A</td>
    `;
    return;
  }

  const outDate = new Date(member.outDate);
  const rejoinDate = new Date(outDate);
  rejoinDate.setMonth(rejoinDate.getMonth() + member.duration);

  const timerCell = document.createElement("td");
  timerCell.className = "p-4";

  const progressCell = document.createElement("td");
  progressCell.className = "p-4";
  progressCell.innerHTML = `
    <div class="progress-bar-container">
      <div class="progress-bar"></div>
    </div>
  `;

  row.innerHTML = `
    <td class="p-4">${member.nama}</td>
    <td class="p-4">${member.nickname}</td>
    <td class="p-4">${member.pelanggaran}</td>
  `;
  row.appendChild(timerCell);
  row.appendChild(progressCell);

  const progressBar = progressCell.querySelector(".progress-bar");

  const intervalId = setInterval(() => {
    const now = new Date();
    const totalDuration = rejoinDate.getTime() - outDate.getTime();
    const elapsedTime = now.getTime() - outDate.getTime();
    const remainingTime = rejoinDate.getTime() - now.getTime();

    if (remainingTime <= 0) {
      clearInterval(intervalId);
      timerCell.innerHTML = `<span class="neon-green-text">Bisa Bergabung</span>`;
      progressBar.style.width = "100%";
      return;
    }

    const percentage = (elapsedTime / totalDuration) * 100;
    progressBar.style.width = `${percentage}%`;

    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    timerCell.textContent = `${days}h ${hours}j ${minutes}m ${seconds}d`;
  }, 1000);
}
