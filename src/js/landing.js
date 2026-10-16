/**
 * @file landing.js
 * @description Modul interaksi JavaScript untuk halaman landing page Modul 1.
 */

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. NAVBAR TOGGLE (Navigasi Mobile)
  // ==========================================
  const navbarToggleBtn = document.querySelector("#navbar-toggle");
  const navMenu = document.querySelector("#nav-menu");
  const navIconOpen = document.querySelector("#nav-icon-open");
  const navIconClose = document.querySelector("#nav-icon-close");

  if (navbarToggleBtn && navMenu) {
    /**
     * Fungsi untuk toggle buka/tutup menu navigasi pada tampilan layar mobile.
     */
    const toggleMobileNav = () => {
      const isHidden = navMenu.classList.toggle("hidden");

      // Perbarui atribut aksesibilitas ARIA
      navbarToggleBtn.setAttribute("aria-expanded", String(!isHidden));

      // Toggle ikon hamburger dan silang (close)
      if (navIconOpen && navIconClose) {
        navIconOpen.classList.toggle("hidden");
        navIconClose.classList.toggle("hidden");
      }
    };

    navbarToggleBtn.addEventListener("click", toggleMobileNav);

    // Menutup menu mobile saat salah satu link navigasi diklik
    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 768) {
          navMenu.classList.add("hidden");
          navbarToggleBtn.setAttribute("aria-expanded", "false");
          if (navIconOpen && navIconClose) {
            navIconOpen.classList.remove("hidden");
            navIconClose.classList.add("hidden");
          }
        }
      });
    });
  }

  // ==========================================
  // 2. VALIDASI FORMULIR KONTAK
  // ==========================================
  const contactForm = document.querySelector("#contact-form");
  const nameInput = document.querySelector("#contact-name");
  const emailInput = document.querySelector("#contact-email");
  const messageInput = document.querySelector("#contact-message");
  const formFeedback = document.querySelector("#form-status") || document.querySelector("#form-feedback");

  const nameError = document.querySelector("#name-error");
  const emailError = document.querySelector("#email-error");
  const messageError = document.querySelector("#message-error");

  /**
   * Fungsi untuk menampilkan status error pada input field.
   * @param {HTMLElement} inputElement - Elemen form input target.
   * @param {HTMLElement} errorElement - Elemen penampung pesan error.
   * @param {string} message - Isi pesan peringatan error.
   */
  const setFieldError = (inputElement, errorElement, message) => {
    if (!inputElement || !errorElement) return;
    inputElement.classList.add("border-red-500", "focus:ring-red-500");
    inputElement.classList.remove("border-gray-300", "focus:ring-brand-secondary");
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
  };

  /**
   * Fungsi untuk menghapus status error saat pengguna mengetik kembali.
   * @param {HTMLElement} inputElement - Elemen form input target.
   * @param {HTMLElement} errorElement - Elemen penampung pesan error.
   */
  const clearFieldError = (inputElement, errorElement) => {
    if (!inputElement || !errorElement) return;
    inputElement.classList.remove("border-red-500", "focus:ring-red-500");
    inputElement.classList.add("border-gray-300", "focus:ring-brand-secondary");
    errorElement.textContent = "";
    errorElement.classList.add("hidden");
  };

  // Real-time input clearing
  if (nameInput) {
    nameInput.addEventListener("input", () => clearFieldError(nameInput, nameError));
  }
  if (emailInput) {
    emailInput.addEventListener("input", () => clearFieldError(emailInput, emailError));
  }
  if (messageInput) {
    messageInput.addEventListener("input", () => clearFieldError(messageInput, messageError));
  }

  if (contactForm) {
    /**
     * Fungsi penanganan submit form dengan pengecekan kelengkapan data.
     */
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (formFeedback) {
        formFeedback.classList.add("hidden");
        formFeedback.innerHTML = "";
      }

      const nameValue = nameInput ? nameInput.value.trim() : "";
      const emailValue = emailInput ? emailInput.value.trim() : "";
      const messageValue = messageInput ? messageInput.value.trim() : "";

      let isValid = true;

      // 1. Validasi nama
      if (nameValue === "") {
        setFieldError(nameInput, nameError, "Nama lengkap wajib diisi.");
        isValid = false;
      } else if (nameValue.length < 3) {
        setFieldError(nameInput, nameError, "Nama harus minimal 3 karakter.");
        isValid = false;
      } else {
        clearFieldError(nameInput, nameError);
      }

      // 2. Validasi format email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailValue === "") {
        setFieldError(emailInput, emailError, "Alamat email wajib diisi.");
        isValid = false;
      } else if (!emailPattern.test(emailValue)) {
        setFieldError(emailInput, emailError, "Format email tidak valid (contoh: user@mail.com).");
        isValid = false;
      } else {
        clearFieldError(emailInput, emailError);
      }

      // 3. Validasi pesan
      if (messageValue === "") {
        setFieldError(messageInput, messageError, "Pesan tidak boleh kosong.");
        isValid = false;
      } else if (messageValue.length < 5) {
        setFieldError(messageInput, messageError, "Pesan harus minimal 5 karakter.");
        isValid = false;
      } else {
        clearFieldError(messageInput, messageError);
      }

      if (!isValid) {
        if (formFeedback) {
          formFeedback.className = "p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold block";
          formFeedback.textContent = "Mohon periksa kembali form. Terdapat isian yang belum sesuai.";
        }
        return;
      }

      if (formFeedback) {
        formFeedback.className = "p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold block";
        formFeedback.innerHTML = `Terima kasih, <strong>${nameValue}</strong>! Pesan Anda telah terkirim.`;
      }

      contactForm.reset();
    });
  }
});
