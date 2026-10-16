/**
 * @file landing.js
 * @description Modul interaksi JavaScript untuk halaman landing page Modul 1.
 * Mengimplementasikan:
 * 1. Mobile Navbar Toggle (Event Handling: click, DOM Manipulation: classList.toggle)
 * 2. Contact Form Validation (Event Handling: submit, input; DOM Manipulation: textContent, classList)
 */

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. NAVBAR TOGGLE (Mobile Responsive)
  // ==========================================
  const navbarToggleBtn = document.querySelector("#navbar-toggle");
  const navMenu = document.querySelector("#nav-menu");
  const navIconOpen = document.querySelector("#nav-icon-open");
  const navIconClose = document.querySelector("#nav-icon-close");

  if (navbarToggleBtn && navMenu) {
    /**
     * Menangani interaksi klik pada tombol hamburger menu untuk menampilkan/menyembunyikan menu.
     * Menggunakan method DOM classList.toggle() sesuai Bab 5.2 & 6.
     */
    navbarToggleBtn.addEventListener("click", () => {
      const isHidden = navMenu.classList.toggle("hidden");

      // Perbarui atribut aksesibilitas ARIA
      navbarToggleBtn.setAttribute("aria-expanded", String(!isHidden));

      // Toggle ikon hamburger dan ikon silang (close)
      if (navIconOpen && navIconClose) {
        navIconOpen.classList.toggle("hidden");
        navIconClose.classList.toggle("hidden");
      }
    });

    // Menutup menu mobile saat salah satu tautan navigasi diklik
    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        // Hanya tutup menu jika berada di tampilan layar kecil (mobile)
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
  // 2. CONTACT FORM VALIDATION
  // ==========================================
  const contactForm = document.querySelector("#contact-form");
  const nameInput = document.querySelector("#contact-name");
  const emailInput = document.querySelector("#contact-email");
  const messageInput = document.querySelector("#contact-message");
  const formFeedback = document.querySelector("#form-status") || document.querySelector("#form-feedback");

  // Helper elements untuk error message per field
  const nameError = document.querySelector("#name-error");
  const emailError = document.querySelector("#email-error");
  const messageError = document.querySelector("#message-error");

  /**
   * Helper function untuk merender pesan error per input field
   * Menggunakan classList untuk mengganti style border input menjadi merah
   */
  const setFieldError = (inputElement, errorElement, message) => {
    if (!inputElement || !errorElement) return;
    inputElement.classList.add("border-red-500", "focus:ring-red-500");
    inputElement.classList.remove("border-gray-300", "focus:ring-brand-secondary");
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
  };

  /**
   * Helper function untuk membersihkan status error pada input field
   */
  const clearFieldError = (inputElement, errorElement) => {
    if (!inputElement || !errorElement) return;
    inputElement.classList.remove("border-red-500", "focus:ring-red-500");
    inputElement.classList.add("border-gray-300", "focus:ring-brand-secondary");
    errorElement.textContent = "";
    errorElement.classList.add("hidden");
  };

  // Real-time validation menggunakan event 'input' sesuai Bab 6 Tabel 6.1
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
     * Menangani submit form kontak dengan validasi field, pencegahan reload bawaan browser (event.preventDefault),
     * dan memberikan umpan balik visual kepada pengguna.
     */
    contactForm.addEventListener("submit", (event) => {
      // Mencegah browser melakukan submit default / refresh halaman
      event.preventDefault();

      // Reset umpan balik umum
      if (formFeedback) {
        formFeedback.classList.add("hidden");
        formFeedback.innerHTML = "";
      }

      // Ambil nilai input menggunakan properti .value dan sanitasi spasi (.trim())
      const nameValue = nameInput ? nameInput.value.trim() : "";
      const emailValue = emailInput ? emailInput.value.trim() : "";
      const messageValue = messageInput ? messageInput.value.trim() : "";

      let isValid = true;

      // 1. Validasi Nama: wajib diisi dan minimal 3 karakter
      if (nameValue === "") {
        setFieldError(nameInput, nameError, "Nama lengkap wajib diisi.");
        isValid = false;
      } else if (nameValue.length < 3) {
        setFieldError(nameInput, nameError, "Nama harus minimal 3 karakter.");
        isValid = false;
      } else {
        clearFieldError(nameInput, nameError);
      }

      // 2. Validasi Email: wajib diisi dan format email valid
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

      // 3. Validasi Pesan: wajib diisi dan minimal 5 karakter
      if (messageValue === "") {
        setFieldError(messageInput, messageError, "Pesan tidak boleh kosong.");
        isValid = false;
      } else if (messageValue.length < 5) {
        setFieldError(messageInput, messageError, "Pesan harus minimal 5 karakter.");
        isValid = false;
      } else {
        clearFieldError(messageInput, messageError);
      }

      // Jika ada field yang tidak valid, batalkan proses submit
      if (!isValid) {
        if (formFeedback) {
          formFeedback.className = "p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium animate-pulse";
          formFeedback.innerHTML = `
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              <span>Mohon periksa kembali form. Terdapat input yang belum sesuai.</span>
            </div>
          `;
          formFeedback.classList.remove("hidden");
        }
        return;
      }

      // Jika validasi sukses: Tampilkan notifikasi berhasil dan bersihkan form
      if (formFeedback) {
        formFeedback.className = "p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium shadow-sm";
        // Menggunakan Template Literal sesuai materi Bab 3.2
        formFeedback.innerHTML = `
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <div>
              <p class="font-bold">Pesan Berhasil Dikirim!</p>
              <p class="text-xs text-emerald-700 mt-0.5">Terima kasih, <strong>${nameValue}</strong>. Kami akan segera menghubungi Anda melalui <strong>${emailValue}</strong>.</p>
            </div>
          </div>
        `;
        formFeedback.classList.remove("hidden");
      }

      // Reset form input
      contactForm.reset();
    });
  }
});
