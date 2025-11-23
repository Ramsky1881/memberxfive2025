document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById("video");

    // Fungsi untuk membuat video fullscreen
    function goFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    // Fungsi untuk memulai video
    function startVideo() {
        video.style.display = "block"; // Menampilkan video
        video.muted = false; // Menghidupkan suara
        video.play().then(() => {
            goFullscreen(video); // Masuk mode fullscreen
        }).catch(error => {
            console.error("Autoplay diblokir, menunggu interaksi user:", error);
        });
    }

    // Event Listener untuk tombol Keyboard
    document.addEventListener("keydown", function (event) {
        // Cek jika Ctrl + U ditekan
        if (event.ctrlKey && event.key.toLowerCase() === "u") {
            event.preventDefault(); // Mencegah View Source
            startVideo(); // Putar Video sebagai gantinya
        }

        // Kode ini juga memblokir Ctrl + Shift + I (Inspect Element)
        if (event.ctrlKey && event.shiftKey && event.key === "I") {
            event.preventDefault();
        }

        // Kode ini juga memblokir F12 (Developer Tools)
        if (event.key === "F12") {
            event.preventDefault();
        }
    });

    // Kode ini memblokir Klik Kanan (Context Menu)
    document.addEventListener("contextmenu", function (event) {
        event.preventDefault();
        // ... logika tambahan ...
    });
});