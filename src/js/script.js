/**
 * @file script.js
 * @description Skrip interaksi vanilla JavaScript untuk halaman landing page Modul 1.
 */

document.addEventListener("DOMContentLoaded", () => {
  // ========================================================
  // 1. NAVBAR TOGGLE (Navigasi Responsif Mobile)
  // ========================================================
  const navbarToggle = document.querySelector("#navbar-toggle");
  const navMenu = document.querySelector("#nav-menu");
  const iconOpen = document.querySelector("#nav-icon-open");
  const iconClose = document.querySelector("#nav-icon-close");

  if (navbarToggle && navMenu) {
    /**
     * Fungsi untuk membuka atau menutup menu navigasi di tampilan mobile.
     */
    const toggleMenu = () => {
      const isClosed = navMenu.classList.toggle("hidden");
      const isExpanded = !isClosed;

      // Update atribut aksesibilitas ARIA
      navbarToggle.setAttribute("aria-expanded", String(isExpanded));

      // Ganti tampilan ikon hamburger dan ikon silang (close)
      if (iconOpen && iconClose) {
        iconOpen.classList.toggle("hidden", isExpanded);
        iconClose.classList.toggle("hidden", !isExpanded);
      }
    };

    // Event listener saat tombol hamburger menu diklik
    navbarToggle.addEventListener("click", toggleMenu);

    // Menutup menu mobile secara otomatis saat salah satu link navigasi diklik
    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 768 && !navMenu.classList.contains("hidden")) {
          toggleMenu();
        }
      });
    });

    // Menutup menu mobile saat pengguna menekan tombol keyboard Escape
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !navMenu.classList.contains("hidden")) {
        toggleMenu();
        navbarToggle.focus();
      }
    });
  }

  // ========================================================
  // 2. VALIDASI FORMULIR KONTAK
  // ========================================================
  const contactForm = document.querySelector("#contact-form");
  const nameInput = document.querySelector("#contact-name");
  const emailInput = document.querySelector("#contact-email");
  const messageInput = document.querySelector("#contact-message");
  const formStatus = document.querySelector("#form-status") || document.querySelector("#form-feedback");

  if (contactForm) {
    /**
     * Fungsi untuk menampilkan pesan error dan mengubah border input menjadi merah.
     * @param {HTMLElement} input - Elemen form input target.
     * @param {HTMLElement} errorElement - Elemen tempat menampilkan teks error.
     * @param {string} message - Isi pesan peringatan error.
     */
    const setFieldError = (input, errorElement, message) => {
      if (!input || !errorElement) return;
      input.classList.add("border-red-500", "focus:ring-red-500");
      input.classList.remove("border-slate-300", "focus:ring-brand-secondary");
      input.setAttribute("aria-invalid", "true");
      errorElement.textContent = message;
      errorElement.classList.remove("hidden");
    };

    /**
     * Fungsi untuk membersihkan pesan error saat pengguna mulai mengetik kembali.
     * @param {HTMLElement} input - Elemen form input target.
     * @param {HTMLElement} errorElement - Elemen tempat pesan error.
     */
    const clearFieldError = (input, errorElement) => {
      if (!input || !errorElement) return;
      input.classList.remove("border-red-500", "focus:ring-red-500");
      input.classList.add("border-slate-300", "focus:ring-brand-secondary");
      input.removeAttribute("aria-invalid");
      errorElement.textContent = "";
      errorElement.classList.add("hidden");
    };

    // Elemen notifikasi error untuk masing-masing field input
    const nameError = document.querySelector("#name-error");
    const emailError = document.querySelector("#email-error");
    const messageError = document.querySelector("#message-error");

    // Hapus pesan error secara instan saat pengguna sedang mengetik
    if (nameInput) {
      nameInput.addEventListener("input", () => clearFieldError(nameInput, nameError));
    }
    if (emailInput) {
      emailInput.addEventListener("input", () => clearFieldError(emailInput, emailError));
    }
    if (messageInput) {
      messageInput.addEventListener("input", () => clearFieldError(messageInput, messageError));
    }

    /**
     * Fungsi validasi formulir kontak saat tombol kirim ditekan.
     */
    contactForm.addEventListener("submit", (event) => {
      // Mencegah reload halaman secara default
      event.preventDefault();

      let hasError = false;

      // 1. Validasi nama: wajib diisi dan minimal 3 karakter
      const nameVal = nameInput ? nameInput.value.trim() : "";
      if (nameVal === "") {
        setFieldError(nameInput, nameError, "Nama lengkap wajib diisi.");
        hasError = true;
      } else if (nameVal.length < 3) {
        setFieldError(nameInput, nameError, "Nama harus minimal 3 karakter.");
        hasError = true;
      } else {
        clearFieldError(nameInput, nameError);
      }

      // 2. Validasi email: wajib diisi dan format email harus valid
      const emailVal = emailInput ? emailInput.value.trim() : "";
      if (emailVal === "") {
        setFieldError(emailInput, emailError, "Alamat email wajib diisi.");
        hasError = true;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        setFieldError(emailInput, emailError, "Format email belum sesuai. Contoh: nama@domain.com");
        hasError = true;
      } else {
        clearFieldError(emailInput, emailError);
      }

      // 3. Validasi pesan: wajib diisi dan minimal 5 karakter
      const msgVal = messageInput ? messageInput.value.trim() : "";
      if (msgVal === "") {
        setFieldError(messageInput, messageError, "Pesan pertanyaan wajib diisi.");
        hasError = true;
      } else if (msgVal.length < 5) {
        setFieldError(messageInput, messageError, "Pesan harus minimal 5 karakter.");
        hasError = true;
      } else {
        clearFieldError(messageInput, messageError);
      }

      // Hentikan proses jika ada field yang tidak valid
      if (hasError) {
        if (formStatus) {
          formStatus.className = "p-3.5 rounded-lg text-xs font-semibold bg-red-50 text-red-700 border border-red-200 block";
          formStatus.textContent = "Mohon lengkapi seluruh isian form dengan benar.";
        }
        return;
      }

      // Tampilkan notifikasi sukses jika semua input sudah valid
      if (formStatus) {
        formStatus.className = "p-4 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 block";
        formStatus.innerHTML = `Terima kasih, <strong>${nameVal}</strong>! Pesan Anda telah terkirim.`;
      }

      // Bersihkan nilai input form setelah berhasil
      contactForm.reset();
    });
  }
});
