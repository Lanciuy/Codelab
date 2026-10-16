/**
 * @file script.js
 * @description Skrip interaksi vanilla JavaScript untuk Codelab Modul 2.
 * Menangani:
 * 1. Navbar Toggle (Mobile Menu) dengan ARIA accessibility & keyboard escape
 * 2. Validasi Form Kontak (Nama, Email format, Pesan) menggunakan validitas native
 */

document.addEventListener("DOMContentLoaded", () => {
  // ========================================================
  // 1. NAVBAR TOGGLE (A1: Mobile Responsive Navigation)
  // ========================================================
  const navbarToggle = document.querySelector("#navbar-toggle");
  const navMenu = document.querySelector("#nav-menu");
  const iconOpen = document.querySelector("#nav-icon-open");
  const iconClose = document.querySelector("#nav-icon-close");

  if (navbarToggle && navMenu) {
    /**
     * Membuka atau menutup menu navigasi mobile dan menyelaraskan state aksesibilitas.
     * Menggunakan classList.toggle("hidden") sesuai materi Bab 5.2.
     */
    const toggleMenu = () => {
      const isClosed = navMenu.classList.toggle("hidden");
      const isExpanded = !isClosed;

      navbarToggle.setAttribute("aria-expanded", String(isExpanded));

      if (iconOpen && iconClose) {
        iconOpen.classList.toggle("hidden", isExpanded);
        iconClose.classList.toggle("hidden", !isExpanded);
      }
    };

    navbarToggle.addEventListener("click", toggleMenu);

    // Menutup menu mobile saat tautan di dalamnya diklik
    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 768 && !navMenu.classList.contains("hidden")) {
          toggleMenu();
        }
      });
    });

    // Menutup menu saat pengguna menekan tombol Escape untuk kenyamanan navigasi keyboard
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !navMenu.classList.contains("hidden")) {
        toggleMenu();
        navbarToggle.focus();
      }
    });
  }

  // ========================================================
  // 2. FORM VALIDATION (A2: Cek Kosong & A3: Format Tidak Sesuai)
  // ========================================================
  const contactForm = document.querySelector("#contact-form");
  const nameInput = document.querySelector("#contact-name");
  const emailInput = document.querySelector("#contact-email");
  const messageInput = document.querySelector("#contact-message");
  const formStatus = document.querySelector("#form-status") || document.querySelector("#form-feedback");

  if (contactForm) {
    /**
     * Helper untuk menampilkan pesan kesalahan pada field input tertentu.
     * Memperbarui atribut aria-invalid untuk aksesibilitas screen reader.
     * 
     * @param {HTMLInputElement|HTMLTextAreaElement} input Elemen input target
     * @param {HTMLElement} errorElement Elemen penampung pesan error
     * @param {string} message Teks pesan kesalahan
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
     * Helper untuk membersihkan status kesalahan saat pengguna mengetik.
     * 
     * @param {HTMLInputElement|HTMLTextAreaElement} input Elemen input target
     * @param {HTMLElement} errorElement Elemen penampung pesan error
     */
    const clearFieldError = (input, errorElement) => {
      if (!input || !errorElement) return;
      input.classList.remove("border-red-500", "focus:ring-red-500");
      input.classList.add("border-slate-300", "focus:ring-brand-secondary");
      input.removeAttribute("aria-invalid");
      errorElement.textContent = "";
      errorElement.classList.add("hidden");
    };

    // Referensi elemen error per field
    const nameError = document.querySelector("#name-error");
    const emailError = document.querySelector("#email-error");
    const messageError = document.querySelector("#message-error");

    // Event 'input' real-time untuk menghapus pesan kesalahan secara langsung
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
     * Menangani submit form dengan validasi menyeluruh tanpa reload halaman.
     */
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      let hasError = false;

      // 1. Validasi Nama: wajib diisi & minimal 3 karakter
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

      // 2. Validasi Email: cek wajib isi dan validasi format menggunakan API native validity
      const emailVal = emailInput ? emailInput.value.trim() : "";
      if (emailVal === "") {
        setFieldError(emailInput, emailError, "Alamat email wajib diisi.");
        hasError = true;
      } else if (emailInput.validity.typeMismatch || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        setFieldError(emailInput, emailError, "Format email belum sesuai. Contoh: nama@domain.com");
        hasError = true;
      } else {
        clearFieldError(emailInput, emailError);
      }

      // 3. Validasi Pesan: wajib diisi & minimal 5 karakter
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

      // Jika ada field yang tidak valid, arahkan fokus ke field error pertama
      if (hasError) {
        if (formStatus) {
          formStatus.className = "p-3.5 rounded-lg text-xs font-semibold bg-red-50 text-red-700 border border-red-200 block";
          formStatus.textContent = "Mohon lengkapi seluruh isian form dengan benar.";
        }
        return;
      }

      // Seluruh field valid: tampilkan pesan sukses terkalibrasi dan reset form
      if (formStatus) {
        formStatus.className = "p-4 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 block";
        formStatus.innerHTML = `Terima kasih, <strong>${nameVal}</strong>! Pesan Anda telah terkirim.`;
      }

      contactForm.reset();
    });
  }
});
