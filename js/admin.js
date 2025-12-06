document.addEventListener("DOMContentLoaded", () => {
    // --- VARIABLES ---
    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredMembers = [...members]; // Start with all members
    let editModeIndex = -1;

    // --- DOM ELEMENTS ---
    const loginOverlay = document.getElementById("login-overlay");
    const dashboardContent = document.getElementById("dashboard-content");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginBtn = document.getElementById("login-btn");
    const loginError = document.getElementById("login-error");
    const logoutBtn = document.getElementById("logout-btn");

    const statTotal = document.getElementById("stat-total");
    const statFemale = document.getElementById("stat-female");
    const statMale = document.getElementById("stat-male");
    const statTopRegion = document.getElementById("stat-top-region");

    const memberTableBody = document.getElementById("member-table-body");
    const paginationControls = document.getElementById("pagination-controls");
    const adminSearch = document.getElementById("adminSearch");

    const memberModal = document.getElementById("member-modal");
    const closeModalBtn = document.getElementById("close-modal");
    const cancelBtn = document.getElementById("cancel-btn");
    const memberForm = document.getElementById("member-form");
    const addMemberBtn = document.getElementById("add-member-btn");
    const modalTitle = document.getElementById("modal-title");

    const githubModal = document.getElementById("github-modal");
    const saveGithubBtn = document.getElementById("save-github-btn");
    const cancelGithubBtn = document.getElementById("cancel-github");
    const confirmGithubBtn = document.getElementById("confirm-github");
    const githubTokenInput = document.getElementById("github-token");

    // Pre-fill token
    const HARDCODED_TOKEN = "__GITHUB_TOKEN__";
    if(githubTokenInput) githubTokenInput.value = HARDCODED_TOKEN;

    // --- LOGIN LOGIC ---
    loginBtn.addEventListener("click", () => {
        const u = usernameInput.value;
        const p = passwordInput.value;
        if ((u === "__ADMIN_USERNAME__" || u === "__ADMIN_PASSWORD__") && (p === "__ADMIN_PASSWORD__" || p === "__ADMIN_USERNAME__")) { // Allow swap just in case user got confused, strictly follow req though: u:adminxfive p:xfive2017boss
           if (u === "__ADMIN_USERNAME__" && p === "__ADMIN_PASSWORD__") {
                grantAccess();
           } else {
               showLoginError();
           }
        } else {
            showLoginError();
        }
    });

    function showLoginError() {
        loginError.classList.remove("hidden");
        setTimeout(() => loginError.classList.add("hidden"), 3000);
    }

    function grantAccess() {
        loginOverlay.classList.add("hidden");
        dashboardContent.classList.remove("hidden");
        initDashboard();
    }

    logoutBtn.addEventListener("click", () => {
        location.reload();
    });

    // --- DASHBOARD INIT ---
    function initDashboard() {
        renderStats();
        renderCharts();
        renderBirthdays();
        renderTable();
    }

    // --- BIRTHDAY LOGIC ---
    function renderBirthdays() {
        const birthdayList = document.getElementById("birthday-list");
        const monthLabel = document.getElementById("current-month-name");

        const now = new Date();
        const currentMonthIndex = now.getMonth(); // 0 = Jan, 11 = Dec
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        monthLabel.textContent = monthNames[currentMonthIndex].toUpperCase();

        // Month parsing map (normalized to lowercase) -> index 0-11
        const monthMap = {
            "januari": 0, "january": 0, "jan": 0,
            "februari": 1, "february": 1, "feb": 1,
            "maret": 2, "march": 2, "mar": 2,
            "april": 3, "apr": 3,
            "mei": 4, "may": 4, "mey": 4,
            "juni": 5, "june": 5, "jun": 5,
            "juli": 6, "july": 6, "jul": 6,
            "agustus": 7, "august": 7, "aug": 7, "agust": 7, "agustust": 7,
            "september": 8, "sept": 8, "sep": 8,
            "oktober": 9, "october": 9, "okt": 9, "oct": 9,
            "november": 10, "nov": 10,
            "desember": 11, "december": 11, "des": 11, "dec": 11
        };

        const bdayMembers = members.filter(m => {
            if (!m.dob || m.dob === "-") return false;
            // dob format: "7 Juni" or "15 May"
            const parts = m.dob.trim().split(" ");
            if (parts.length < 2) return false;

            // Assume format "Day Month"
            const monthStr = parts[1].toLowerCase();
            const monthIdx = monthMap[monthStr];

            return monthIdx === currentMonthIndex;
        });

        birthdayList.innerHTML = "";

        if (bdayMembers.length === 0) {
             birthdayList.innerHTML = `
                  <div class="col-span-full text-center py-8 text-gray-500 border border-dashed border-gray-700 rounded-lg">
                      <i class="fas fa-sad-tear text-2xl mb-2"></i><br>
                      No birthdays found for this month.
                  </div>`;
             return;
        }

        bdayMembers.forEach(m => {
            const card = document.createElement("div");
            card.className = "bg-white/5 border border-pink-500/30 p-3 rounded-lg flex items-center gap-3 hover:bg-white/10 transition-colors";
            card.innerHTML = `
                <img src="${m.avatar}" class="w-10 h-10 rounded-full object-cover border border-pink-500">
                <div class="overflow-hidden">
                    <h4 class="font-bold text-white text-sm truncate">${m.name}</h4>
                    <p class="text-xs text-pink-400"><i class="fas fa-birthday-cake mr-1"></i>${m.dob}</p>
                </div>
            `;
            birthdayList.appendChild(card);
        });
    }

    // --- STATS CALCULATION ---
    function renderStats() {
        statTotal.textContent = members.length;
        const femaleCount = members.filter(m => m.gender && m.gender.toLowerCase() === 'female').length;
        const maleCount = members.filter(m => m.gender && m.gender.toLowerCase() === 'male').length;
        statFemale.textContent = femaleCount;
        statMale.textContent = maleCount;

        // Top Region
        const regionCounts = {};
        members.forEach(m => {
            if(m.domisili) {
                const region = m.domisili.trim();
                regionCounts[region] = (regionCounts[region] || 0) + 1;
            }
        });
        let topRegion = "-";
        let maxCount = 0;
        for (const [region, count] of Object.entries(regionCounts)) {
            if (count > maxCount) {
                maxCount = count;
                topRegion = region;
            }
        }
        statTopRegion.textContent = topRegion;
    }

    // --- CHARTS ---
    let genderChartInstance = null;
    let domicileChartInstance = null;

    function renderCharts() {
        const femaleCount = members.filter(m => m.gender && m.gender.toLowerCase() === 'female').length;
        const maleCount = members.filter(m => m.gender && m.gender.toLowerCase() === 'male').length;
        const otherCount = members.length - femaleCount - maleCount;

        // Gender Chart
        const ctxGender = document.getElementById('genderChart').getContext('2d');
        if (genderChartInstance) genderChartInstance.destroy();
        genderChartInstance = new Chart(ctxGender, {
            type: 'doughnut',
            data: {
                labels: ['Male', 'Female', 'Other'],
                datasets: [{
                    data: [maleCount, femaleCount, otherCount],
                    backgroundColor: ['#3b82f6', '#ec4899', '#9ca3af'],
                    borderColor: '#000',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { color: '#fff' } }
                }
            }
        });

        // Domicile Chart (Top 10)
        const regionCounts = {};
        members.forEach(m => {
            if(m.domisili) {
                const r = m.domisili.trim();
                regionCounts[r] = (regionCounts[r] || 0) + 1;
            }
        });
        // Sort and take top 10
        const sortedRegions = Object.entries(regionCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        const ctxDomicile = document.getElementById('domicileChart').getContext('2d');
        if (domicileChartInstance) domicileChartInstance.destroy();
        domicileChartInstance = new Chart(ctxDomicile, {
            type: 'bar',
            data: {
                labels: sortedRegions.map(i => i[0]),
                datasets: [{
                    label: 'Members',
                    data: sortedRegions.map(i => i[1]),
                    backgroundColor: 'rgba(0, 255, 255, 0.6)',
                    borderColor: '#00ffff',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, ticks: { color: '#aaa' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                    x: { ticks: { color: '#aaa' }, grid: { display: false } }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    // --- TABLE RENDER ---
    function renderTable() {
        memberTableBody.innerHTML = "";
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = filteredMembers.slice(startIndex, endIndex);

        pageItems.forEach((m, index) => {
            const actualIndex = members.indexOf(m); // Find original index for editing
            const tr = document.createElement("tr");
            tr.className = "border-b border-gray-800 hover:bg-white/5 transition-colors";
            tr.innerHTML = `
                <td class="p-3">
                    <img src="${m.avatar}" alt="avatar" class="w-10 h-10 rounded-full object-cover border border-cyan-500/50">
                </td>
                <td class="p-3">
                    <div class="font-bold text-white">${m.name}</div>
                    <div class="text-xs text-gray-400">${m.nickname || '-'}</div>
                </td>
                <td class="p-3 font-mono text-pink-400">${m.code || 'N/A'}</td>
                <td class="p-3 text-gray-300">${m.domisili || '-'}</td>
                <td class="p-3">
                    <span class="px-2 py-1 rounded text-xs font-bold ${m.category === 'dewan staff' ? 'bg-purple-900 text-purple-200' : 'bg-gray-800 text-gray-300'}">
                        ${m.category}
                    </span>
                </td>
                <td class="p-3 text-right">
                    <button class="text-cyan-400 hover:text-white mr-3" onclick="editMember(${actualIndex})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-red-400 hover:text-white" onclick="deleteMember(${actualIndex})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            memberTableBody.appendChild(tr);
        });

        renderPagination();
    }

    function renderPagination() {
        paginationControls.innerHTML = "";
        const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

        const prevBtn = document.createElement("button");
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.className = `p-2 rounded hover:bg-white/10 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`;
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => { if(currentPage > 1) { currentPage--; renderTable(); }};
        paginationControls.appendChild(prevBtn);

        const info = document.createElement("span");
        info.className = "text-sm text-gray-400";
        info.textContent = `Page ${currentPage} of ${totalPages || 1}`;
        paginationControls.appendChild(info);

        const nextBtn = document.createElement("button");
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.className = `p-2 rounded hover:bg-white/10 ${currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : ''}`;
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
        nextBtn.onclick = () => { if(currentPage < totalPages) { currentPage++; renderTable(); }};
        paginationControls.appendChild(nextBtn);
    }

    // --- SEARCH ---
    adminSearch.addEventListener("input", (e) => {
        const term = e.target.value.toLowerCase();
        filteredMembers = members.filter(m =>
            m.name.toLowerCase().includes(term) ||
            (m.nickname && m.nickname.toLowerCase().includes(term)) ||
            (m.code && m.code.toLowerCase().includes(term)) ||
            (m.domisili && m.domisili.toLowerCase().includes(term))
        );
        currentPage = 1;
        renderTable();
    });

    // --- ADD / EDIT MEMBER ---
    window.editMember = (index) => {
        const m = members[index];
        editModeIndex = index;
        modalTitle.textContent = "EDIT MEMBER";

        document.getElementById("inp-name").value = m.name;
        document.getElementById("inp-nickname").value = m.nickname;
        document.getElementById("inp-title").value = m.title;
        document.getElementById("inp-domisili").value = m.domisili;
        document.getElementById("inp-dob").value = m.dob;
        document.getElementById("inp-gender").value = m.gender;
        document.getElementById("inp-category").value = m.category;
        document.getElementById("inp-code").value = m.code;
        document.getElementById("inp-avatar").value = m.avatar;
        document.getElementById("inp-bgImage").value = m.bgImage;

        openModal();
    }

    window.deleteMember = (index) => {
        if(confirm(`Are you sure you want to delete ${members[index].name}?`)) {
            members.splice(index, 1);
            // Refresh filtered list keeping search term if possible, but for simplicity reset filter
            adminSearch.value = "";
            filteredMembers = [...members];
            renderStats();
            renderCharts();
            renderTable();
        }
    }

    addMemberBtn.addEventListener("click", () => {
        editModeIndex = -1;
        modalTitle.textContent = "ADD NEW MEMBER";
        memberForm.reset();
        document.getElementById("inp-code").value = generateUniqueCode("");
        openModal();
    });

    function openModal() {
        memberModal.classList.remove("hidden");
        setTimeout(() => memberModal.classList.add("active"), 10);
    }

    function closeModal() {
        memberModal.classList.remove("active");
        setTimeout(() => memberModal.classList.add("hidden"), 300);
    }

    closeModalBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);

    // Generate Code Button
    document.getElementById("generate-code-btn").addEventListener("click", () => {
        const name = document.getElementById("inp-name").value;
        document.getElementById("inp-code").value = generateUniqueCode(name);
    });

    function generateUniqueCode(name) {
        let cleanName = name.replace(/[^a-zA-Z]/g, "").toUpperCase();
        if (cleanName.length < 3) cleanName = (cleanName + "XXX").slice(0, 3);
        const prefix = cleanName.substring(0, 3);

        // Simple random generator
        const randomSuffix = Math.random().toString(36).substring(2, 4).toUpperCase();
        return prefix + randomSuffix;
    }

    memberForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const newMember = {
            name: document.getElementById("inp-name").value,
            nickname: document.getElementById("inp-nickname").value,
            title: document.getElementById("inp-title").value,
            domisili: document.getElementById("inp-domisili").value,
            dob: document.getElementById("inp-dob").value,
            gender: document.getElementById("inp-gender").value,
            category: document.getElementById("inp-category").value,
            code: document.getElementById("inp-code").value,
            avatar: document.getElementById("inp-avatar").value,
            bgImage: document.getElementById("inp-bgImage").value
        };

        if (editModeIndex >= 0) {
            members[editModeIndex] = newMember;
        } else {
            members.push(newMember);
        }

        closeModal();
        // Reset filter
        adminSearch.value = "";
        filteredMembers = [...members];
        renderStats();
        renderCharts();
        renderTable();
    });

    // --- GITHUB SYNC ---
    saveGithubBtn.addEventListener("click", () => {
        githubModal.classList.remove("hidden");
        setTimeout(() => githubModal.classList.add("active"), 10);
    });

    document.getElementById("cancel-github").addEventListener("click", () => {
        githubModal.classList.remove("active");
        setTimeout(() => githubModal.classList.add("hidden"), 300);
    });

    confirmGithubBtn.addEventListener("click", async () => {
        const token = githubTokenInput.value;
        if (!token) {
            alert("Please enter a GitHub Token");
            return;
        }

        const confirmBtn = confirmGithubBtn;
        const originalText = confirmBtn.innerHTML;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Pushing...';
        confirmBtn.disabled = true;

        try {
            // 1. Reconstruct js/members.js content
            // We need to match the original formatting as close as possible or just dump the json
            // User requested automation. We can generate a string that looks like the file.
            const fileContent = `const members = ${JSON.stringify(members, null, 6)};`;

            // 2. Get current SHA of the file (required for update)
            // Assuming repo details: Ramsky1881/memberxfive2025
            const owner = "Ramsky1881";
            const repo = "memberxfive2025";
            const path = "js/members.js";

            // Get SHA
            const getRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
                headers: {
                    "Authorization": `token ${token}`,
                    "Accept": "application/vnd.github.v3+json"
                }
            });

            if (!getRes.ok) throw new Error("Failed to fetch file info. Check token/permissions.");
            const getData = await getRes.json();
            const sha = getData.sha;

            // 3. PUT update
            // Content must be base64 encoded
            const contentEncoded = btoa(unescape(encodeURIComponent(fileContent)));

            const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
                method: "PUT",
                headers: {
                    "Authorization": `token ${token}`,
                    "Accept": "application/vnd.github.v3+json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: "Update members via Admin Dashboard",
                    content: contentEncoded,
                    sha: sha
                })
            });

            if (!putRes.ok) throw new Error("Failed to update file.");

            alert("Success! Data updated on GitHub. It may take a few minutes for the site to reflect changes.");
            githubModal.classList.remove("active");
            setTimeout(() => githubModal.classList.add("hidden"), 300);

        } catch (err) {
            console.error(err);
            alert("Error: " + err.message);
        } finally {
            confirmBtn.innerHTML = originalText;
            confirmBtn.disabled = false;
        }
    });

});
