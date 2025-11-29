document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("blacklist-table-body");
  const searchInput = document.getElementById("searchInput");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const rowsPerPageSelect = document.getElementById("rowsPerPage");
  const paginationControls = document.getElementById("paginationControls");

  // State
  let currentPage = 1;
  let rowsPerPage = 5;
  let currentFilter = 'all';
  let searchQuery = '';
  let activeIntervals = [];

  // Initialize
  filterAndRender();

  // Event Listeners
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    currentPage = 1;
    filterAndRender();
  });

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button style
      filterButtons.forEach(b => {
        b.classList.remove('border-b-2', 'border-b-fuchsia-500', 'active');
        // Reset specific colors if needed, but the border-b is the main indicator
      });
      btn.classList.add('border-b-2', 'border-b-fuchsia-500', 'active');

      currentFilter = btn.dataset.filter;
      currentPage = 1;
      filterAndRender();
    });
  });

  rowsPerPageSelect.addEventListener('change', (e) => {
    rowsPerPage = parseInt(e.target.value);
    currentPage = 1;
    filterAndRender();
  });

  function filterAndRender() {
    // Clear previous intervals
    activeIntervals.forEach(interval => clearInterval(interval));
    activeIntervals = [];

    // Filter data
    let filteredMembers = blacklistMembers.filter(member => {
      // Search filter
      const searchMatch =
        member.nama.toLowerCase().includes(searchQuery) ||
        member.nickname.toLowerCase().includes(searchQuery) ||
        member.pelanggaran.toLowerCase().includes(searchQuery);

      if (!searchMatch) return false;

      // Category filter
      if (currentFilter === 'all') return true;
      if (currentFilter === 'blacklist') {
        return member.duration === 'permanent' || member.pelanggaran.toLowerCase().includes('blacklist');
      }
      if (currentFilter === 'out-community') {
        return member.pelanggaran.toLowerCase().includes('out community');
      }
      if (currentFilter === 'warning') {
        return member.pelanggaran.toLowerCase().includes('warning');
      }
      return true;
    });

    // Pagination
    const totalPages = Math.ceil(filteredMembers.length / rowsPerPage);
    if (currentPage > totalPages) currentPage = Math.max(1, totalPages);

    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedMembers = filteredMembers.slice(startIndex, startIndex + rowsPerPage);

    // Render Table
    tableBody.innerHTML = '';

    if (paginatedMembers.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="5" class="p-4 text-center text-gray-400">No data found</td>`;
      tableBody.appendChild(row);
    } else {
      paginatedMembers.forEach(member => {
        const row = document.createElement("tr");
        row.className = "border-b border-white/10 hover:bg-white/5 transition-colors";
        tableBody.appendChild(row);
        renderBlacklistMember(row, member);
      });
    }

    // Render Pagination Controls
    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    paginationControls.innerHTML = '';

    if (totalPages <= 1) return;

    // Prev Button
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.className = `w-8 h-8 flex items-center justify-center rounded border ${currentPage === 1 ? 'border-gray-700 text-gray-700 cursor-not-allowed' : 'border-fuchsia-500/50 text-fuchsia-300 hover:bg-fuchsia-500/20'}`;
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        filterAndRender();
      }
    });
    paginationControls.appendChild(prevBtn);

    // Page Numbers
    // Logic to show limited page numbers if there are too many pages
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 2) {
        startPage = 1;
        endPage = 3; // Show 1, 2, 3 ... Last
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2;
        endPage = totalPages;
      }
    }

    if (startPage > 1) {
        addPageButton(1);
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'text-gray-500 px-2';
            paginationControls.appendChild(ellipsis);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        addPageButton(i);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'text-gray-500 px-2';
            paginationControls.appendChild(ellipsis);
        }
        addPageButton(totalPages);
    }

    // Next Button
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.className = `w-8 h-8 flex items-center justify-center rounded border ${currentPage === totalPages ? 'border-gray-700 text-gray-700 cursor-not-allowed' : 'border-fuchsia-500/50 text-fuchsia-300 hover:bg-fuchsia-500/20'}`;
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        filterAndRender();
      }
    });
    paginationControls.appendChild(nextBtn);
  }

  function addPageButton(pageNum) {
    const btn = document.createElement('button');
    btn.textContent = pageNum;
    const isActive = currentPage === pageNum;
    btn.className = `w-8 h-8 flex items-center justify-center rounded border ${isActive ? 'bg-fuchsia-600 text-white border-fuchsia-600' : 'border-fuchsia-500/50 text-fuchsia-300 hover:bg-fuchsia-500/20'}`;
    btn.addEventListener('click', () => {
      currentPage = pageNum;
      filterAndRender();
    });
    paginationControls.appendChild(btn);
  }

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
    timerCell.className = "p-4 font-mono text-sm";

    const progressCell = document.createElement("td");
    progressCell.className = "p-4";
    progressCell.innerHTML = `
      <div class="progress-bar-container bg-gray-800 rounded-full h-2 w-full overflow-hidden">
        <div class="progress-bar h-full bg-gradient-to-r from-fuchsia-500 to-purple-600 w-0 transition-all duration-1000"></div>
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

    function updateTimer() {
      const now = new Date();
      const totalDuration = rejoinDate.getTime() - outDate.getTime();
      const elapsedTime = now.getTime() - outDate.getTime();
      const remainingTime = rejoinDate.getTime() - now.getTime();

      if (remainingTime <= 0) {
        timerCell.innerHTML = `<span class="text-green-400 font-bold">Bisa Bergabung</span>`;
        progressBar.style.width = "100%";
        return;
      }

      const percentage = Math.min(100, Math.max(0, (elapsedTime / totalDuration) * 100));
      progressBar.style.width = `${percentage}%`;

      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

      timerCell.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    updateTimer(); // Initial call
    const intervalId = setInterval(updateTimer, 1000);
    activeIntervals.push(intervalId);
  }
});
