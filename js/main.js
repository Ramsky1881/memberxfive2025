// --- BACK TO TOP LOGIC ---
const backToTopBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- ONE-CLICK COPY LOGIC ---
function showToast(message) {
    const toast = document.getElementById("toast");
    if(message) toast.innerText = message;
    toast.className = "show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
}

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast("Nickname Copied!");
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showToast("Nickname Copied!");
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }
        document.body.removeChild(textArea);
    }
}

// --- AR BUTTON LOGIC ---
function activateAR(name) {
    const modelViewer = document.querySelector('#ar-viewer');
    if (modelViewer) {
        modelViewer.activateAR();
    } else {
        alert("AR Module not loaded!");
    }
}

// --- IMAGE ERROR HANDLING ---
function handleImageError(img, name) {
    img.onerror = null;
    img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=512&font-size=0.33`;
}

// --- EDIT NICKNAME LOGIC ---
let selectedMemberForEdit = null;
const ADMIN_NUMBERS = {
    "Aniky": "6285133337946",
    "Rayhan": "6285766931491",
    "Joko": "6289514915776"
};

function openEditNicknameModal(memberIndex) {
    selectedMemberForEdit = members[memberIndex];
    document.getElementById("edit-modal-title").innerText = `Edit Nickname: ${selectedMemberForEdit.name}`;

    // Reset Form
    document.getElementById("edit-step-1").classList.remove("hidden");
    document.getElementById("edit-step-2").classList.add("hidden");
    document.getElementById("code-error-msg").classList.add("hidden");
    document.getElementById("input-unique-code").value = "";
    document.getElementById("input-new-nickname").value = "";

    // Show Modal
    const modal = document.getElementById("edit-nickname-modal");
    modal.classList.remove("hidden");
    setTimeout(() => modal.classList.add("active"), 10);
}

function closeEditNicknameModal() {
    const modal = document.getElementById("edit-nickname-modal");
    modal.classList.remove("active");
    setTimeout(() => modal.classList.add("hidden"), 300);
    selectedMemberForEdit = null;
}

function verifyUniqueCode() {
    const inputCode = document.getElementById("input-unique-code").value.trim().toUpperCase();
    const errorMsg = document.getElementById("code-error-msg");

    if (!selectedMemberForEdit) return;

    // Check if member has a code, if not (legacy data), maybe allow or deny?
    // Assuming all migrated.
    if (selectedMemberForEdit.code === inputCode) {
        // Success
        document.getElementById("edit-step-1").classList.add("hidden");
        document.getElementById("edit-step-2").classList.remove("hidden");
    } else {
        // Failed
        errorMsg.classList.remove("hidden");
        errorMsg.classList.add("blink-red");
    }
}

function sendWhatsAppRequest() {
    const newNick = document.getElementById("input-new-nickname").value.trim();
    const adminName = document.getElementById("select-admin").value;

    if (!newNick) {
        alert("Mohon isi nickname baru.");
        return;
    }

    const adminPhone = ADMIN_NUMBERS[adminName];
    const message = `Halo Admin ${adminName}, Saya ${selectedMemberForEdit.name} (Kode: ${selectedMemberForEdit.code}) ingin request ganti nickname menjadi: *${newNick}*`;

    const url = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    closeEditNicknameModal();
}

// --- APP LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    let currentCategory = 'all';
    const profileGrid = document.getElementById('profile-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');

    // Create Modal HTML and append to body if not exists
    if (!document.getElementById("edit-nickname-modal")) {
        const modalHTML = `
        <div id="edit-nickname-modal" class="modal fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 hidden transition-opacity duration-300 opacity-0">
            <div class="modal-content relative w-full max-w-md bg-[#0d1117] border border-cyan-500 rounded-lg p-6 shadow-[0_0_20px_rgba(0,255,255,0.3)] transform scale-90 transition-transform duration-300">
                <button id="close-edit-modal" class="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <i class="fas fa-times text-xl"></i>
                </button>

                <h3 id="edit-modal-title" class="text-xl font-bold text-cyan-400 mb-6 font-orbitron border-b border-white/10 pb-2">Edit Nickname</h3>

                <!-- STEP 1: VERIFY CODE -->
                <div id="edit-step-1" class="space-y-4">
                    <p class="text-gray-300 text-sm">Masukkan <span class="text-pink-500 font-bold">Kode Unik</span> Anda untuk melanjutkan.</p>
                    <input type="text" id="input-unique-code" placeholder="Contoh: RAMXL" class="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-pink-500 text-center tracking-widest uppercase font-mono">
                    <p id="code-error-msg" class="text-red-500 text-xs hidden"><i class="fas fa-exclamation-triangle"></i> Kode Salah! Akses Ditolak.</p>
                    <button id="verify-code-btn" class="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded transition-colors uppercase tracking-wide">
                        Verifikasi
                    </button>
                </div>

                <!-- STEP 2: REQUEST FORM -->
                <div id="edit-step-2" class="space-y-4 hidden">
                    <div>
                        <label class="block text-xs font-bold text-gray-400 mb-1">NEW NICKNAME</label>
                        <input type="text" id="input-new-nickname" placeholder="Nickname Baru" class="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-500">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-400 mb-1">SELECT ADMIN</label>
                        <select id="select-admin" class="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-500">
                            <option value="Aniky">Aniky</option>
                            <option value="Rayhan">Rayhan</option>
                            <option value="Joko">Joko</option>
                        </select>
                    </div>
                    <button id="send-request-btn" class="w-full py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded transition-colors uppercase tracking-wide flex items-center justify-center gap-2">
                        <i class="fab fa-whatsapp"></i> Kirim Request
                    </button>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Attach Event Listeners for Modal
        document.getElementById("close-edit-modal").addEventListener("click", closeEditNicknameModal);
        document.getElementById("verify-code-btn").addEventListener("click", verifyUniqueCode);
        document.getElementById("send-request-btn").addEventListener("click", sendWhatsAppRequest);
    }

    const renderProfileCards = (filteredMembers) => {
        profileGrid.innerHTML = '';

        if (filteredMembers.length === 0) {
            profileGrid.innerHTML = '<div class="col-span-full flex flex-col items-center justify-center py-12 opacity-50"><i class="fas fa-ghost text-6xl mb-4 text-gray-600"></i><p class="text-center text-gray-400 text-xl">Tidak ada anggota yang ditemukan.</p></div>';
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        filteredMembers.forEach((member, index) => {
            // Find global index for edit functionality reference
            const globalIndex = members.indexOf(member);

            const cardContainer = document.createElement('div');
            cardContainer.className = 'profile-card-container group reveal-card';
            cardContainer.style.transitionDelay = `${index * 50}ms`;

            const cardInner = document.createElement('div');
            cardInner.className = 'profile-card-inner';

            const genderIcon = member.gender === 'male' ? '<i class="fas fa-mars text-blue-400"></i>' : (member.gender === 'female' ? '<i class="fas fa-venus text-pink-400"></i>' : '');
            const genderText = member.gender === 'male' ? 'Male' : (member.gender === 'female' ? 'Female' : '-');

            const cardFront = document.createElement('div');
            cardFront.className = 'profile-card-face profile-card-front cyber-aug-configuration';
            cardFront.setAttribute('data-augmented-ui', 'tl-clip tr-clip bl-clip br-clip both');

            cardFront.innerHTML = `
                <img class="main-photo img-glitch-hover" src="${member.avatar}" alt="${member.name}" loading="lazy" onerror="handleImageError(this, '${member.name}')">
                <div class="overlay"></div>
                <button class="ar-btn" onclick="activateAR('${member.name}')" title="View in AR">
                    <i class="fas fa-cube"></i> View in AR
                </button>
                <div class="content-container">
                    <div class="min-h-[54px] mb-1 w-full flex justify-start items-end">
                        <h2 class="text-3xl font-bold typewriter-text leading-tight text-white drop-shadow-lg" data-text="${member.name}"></h2>
                    </div>
                    <p class="text-lg text-cyan-300 font-medium mb-4 drop-shadow-md uppercase tracking-widest">${member.title}</p>
                    <button class="flip-btn ghost-btn w-full py-2 px-6 rounded text-sm font-bold uppercase tracking-wider mx-auto self-center">
                      Lihat Detail
                      <span class="light-sweep"></span>
                    </button>
                </div>
            `;

            const cardBack = document.createElement('div');
            cardBack.className = 'profile-card-face profile-card-back cyber-aug-configuration';
            cardBack.setAttribute('data-augmented-ui', 'tl-clip tr-clip bl-clip br-clip both');

            const imgHTML = `<img class="w-24 h-24 rounded-full object-cover border-4 border-fuchsia-500/50 mx-auto shadow-lg shadow-fuchsia-500/20" src="${member.avatar}" alt="Avatar ${member.name}" loading="lazy" onerror="handleImageError(this, '${member.name}')">`;

            cardBack.innerHTML = `
              <div class="text-center relative z-10">
                ${imgHTML}
                <h2 class="text-2xl font-bold text-white mt-3">${member.name}</h2>
                <div class="flex items-center justify-center gap-2 mt-1">
                    <span class="text-fuchsia-400 font-medium text-sm tracking-wide">${member.title}</span>
                </div>
              </div>
              <div class="text-left mt-4 border-t border-white/10 pt-4 space-y-2 text-sm self-stretch flex-grow relative z-10">
                <div class="flex items-center bg-white/5 p-2 rounded relative group/nick">
                    <i class="fas fa-user-circle fa-fw w-6 text-gray-400"></i>
                    <span class="font-semibold mr-2 text-gray-300">Nick:</span>
                    <span class="text-white truncate flex-1">${member.nickname}</span>
                    <i class="fas fa-pen ml-2 cursor-pointer text-cyan-400 hover:text-white" onclick="openEditNicknameModal(${globalIndex})" title="Request Edit Nickname"></i>
                    <i class="fas fa-copy ml-2 cursor-pointer copy-btn text-gray-400 hover:text-white" onclick="copyToClipboard('${member.nickname}')" title="Copy Nickname"></i>
                </div>
                <div class="flex items-center bg-white/5 p-2 rounded"><i class="fas fa-map-marker-alt fa-fw w-6 text-gray-400"></i><span class="font-semibold mr-2 text-gray-300">Domisili:</span><span class="text-white">${member.domisili}</span></div>
                <div class="flex items-center bg-white/5 p-2 rounded"><i class="fas fa-calendar-alt fa-fw w-6 text-gray-400"></i><span class="font-semibold mr-2 text-gray-300">Lahir:</span><span class="text-white">${member.dob}</span></div>
                <div class="flex items-center bg-white/5 p-2 rounded"><span class="font-semibold mr-2 w-6 text-center">${genderIcon}</span><span class="font-semibold mr-2 text-gray-300">Gender:</span><span class="text-white">${genderText}</span></div>
              </div>
              <button class="flip-btn w-full mt-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-semibold py-2 px-4 rounded transition-colors flex items-center justify-center space-x-2 group-hover:border-fuchsia-500 relative z-10">
                <i class="fas fa-arrow-left"></i>
                <span>KEMBALI</span>
              </button>
            `;

            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            cardContainer.appendChild(cardInner);
            profileGrid.appendChild(cardContainer);

            observer.observe(cardContainer);
        });

        addEventListeners();
        document.querySelectorAll('.typewriter-text').forEach(startTypewriter);
    };

    const updateCards = () => {
        const searchTerm = searchInput.value.toLowerCase();
        let filteredMembers = [];

        let membersToFilter = members;
        if (currentCategory !== 'all') {
            if (currentCategory === 'dewan staff') {
                membersToFilter = members.filter(member => member.category === 'dewan staff');
            } else {
                membersToFilter = members.filter(member => member.gender === currentCategory);
            }
        }

        if (searchTerm === '') {
            filteredMembers = membersToFilter;
        } else {
            filteredMembers = membersToFilter.filter(member =>
                member.name.toLowerCase().includes(searchTerm) ||
                member.nickname.toLowerCase().includes(searchTerm) ||
                member.domisili.toLowerCase().includes(searchTerm) ||
                member.title.toLowerCase().includes(searchTerm)
            );
        }

        const currentCards = document.querySelectorAll('.profile-card-container');
        if (currentCards.length > 0) {
            currentCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
            });
            setTimeout(() => {
                renderProfileCards(filteredMembers);
            }, 300);
        } else {
            renderProfileCards(filteredMembers);
        }
    };

    const handleFilterClick = (category) => {
        currentCategory = category;
        filterButtons.forEach(btn => {
            if (btn.dataset.category === category) {
                btn.classList.remove('hover:bg-white/10', 'text-gray-200');
                btn.classList.add('bg-fuchsia-600/80', 'text-white', 'shadow-lg', 'shadow-fuchsia-500/30');
            } else {
                btn.classList.remove('bg-fuchsia-600/80', 'text-white', 'shadow-lg', 'shadow-fuchsia-500/30');
                btn.classList.add('hover:bg-white/10', 'text-gray-200');
            }
        });
        updateCards();
    };

    const addEventListeners = () => {
        document.querySelectorAll('.flip-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const cardContainer = button.closest('.profile-card-container');
                cardContainer.classList.toggle('is-flipped');
            });
        });
        document.querySelectorAll('.ar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const category = e.currentTarget.dataset.category;
            handleFilterClick(category);
        });
    });

    let searchTimeout;
    searchInput.addEventListener('keyup', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(updateCards, 300);
    });

    handleFilterClick('all');

    // --- QR CODE LOGIC ---
    const testerSelect = document.getElementById('tester-select');
    const qrcodeContainer = document.getElementById('qrcode');

    if (testerSelect && qrcodeContainer) {
        qrcodeContainer.innerHTML = '';

        const qrSize = window.innerWidth < 768 ? 112 : 144;
        let qrcode = new QRCode(qrcodeContainer, {
            width: qrSize,
            height: qrSize,
            correctLevel : QRCode.CorrectLevel.H
        });

        function generateQR(link) {
            qrcode.makeCode(link);
        }

        testerSelect.addEventListener('change', (e) => {
            generateQR(e.target.value);
        });

        generateQR(testerSelect.value);

        document.getElementById('select-now-btn').addEventListener('click', () => {
            window.open(testerSelect.value, '_blank');
        });

        document.getElementById('download-qr-btn').addEventListener('click', () => {
            const qrImage = qrcodeContainer.querySelector('img');
            const qrCanvas = qrcodeContainer.querySelector('canvas');
            let dataUrl = '';
            if (qrImage && qrImage.src.startsWith('data:')) {
                dataUrl = qrImage.src;
            } else if (qrCanvas) {
                dataUrl = qrCanvas.toDataURL("image/png");
            }

            if (dataUrl) {
                const link = document.createElement('a');
                const selectedName = testerSelect.options[testerSelect.selectedIndex].text;
                link.download = `WA-QR-${selectedName}.png`;
                link.href = dataUrl;
                link.click();
            } else {
                alert("QR Code belum siap diunduh. Silakan tunggu sebentar.");
            }
        });
    }
});
