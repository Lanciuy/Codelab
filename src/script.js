/**
 * @file script.js
 * @description Script JavaScript eksternal untuk Codelab Modul 2 - Interaksi Halaman Modul 1.
 * Mengimplementasikan:
 * 1. Navbar Toggle (Mobile Menu) - Event Handling 'click' & DOM Manipulation classList.toggle
 * 2. Validasi Form Kontak - Event Handling 'submit' & 'input', DOM Manipulation textContent & classList
 */

// Memastikan DOM telah selesai dimuat sebelum menjalankan manipulasi elemen
document.addEventListener("DOMContentLoaded", () => {
  // ========================================================
  // 1. NAVBAR TOGGLE (Interaksi Menu Navigasi pada Mobile)
  // ========================================================
  const navbarToggle = document.querySelector("#navbar-toggle");
  const navMenu = document.querySelector("#nav-menu");

  if (navbarToggle && navMenu) {
    /**
     * Menangani aksi klik pada tombol hamburger menu.
     * Menggunakan classList.toggle("hidden") untuk menampilkan/menyembunyikan menu navigasi.
     * Sesuai dengan materi Modul 2 Bab 5.2 (Tabel 5.2) dan Bab 6 (Event Handling).
     */
    navbarToggle.addEventListener("click", () => {
      navMenu.classList.toggle("hidden");
    });

    // Menutup menu mobile secara otomatis saat salah satu link diklik
    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 768) {
          navMenu.classList.add("hidden");
        }
      });
    });
  }

  // ========================================================
  // 2. VALIDASI FORM (Peringatan Input Kosong & Umpan Balik)
  // ========================================================
  const contactForm = document.querySelector("#contact-form");
  const nameInput = document.querySelector("#name-input");
  const formMessage = document.querySelector("#form-message");

  if (contactForm && nameInput && formMessage) {
    /**
     * Menangani event 'input' secara real-time saat user mulai mengetik.
     * Membersihkan pesan error jika user telah mengisikan karakter.
     * Sesuai Bab 6 Gambar 6.3.
     */
    nameInput.addEventListener("input", () => {
      if (nameInput.value.trim() !== "") {
        nameInput.classList.remove("border-red-500", "focus:ring-red-500");
        nameInput.classList.add("border-gray-300", "focus:ring-brand-secondary");
        formMessage.textContent = "";
        formMessage.classList.add("hidden");
      }
    });

    /**
     * Menangani event 'submit' pada form.
     * Mencegah reload halaman bawaan browser menggunakan event.preventDefault().
     * Memeriksa apakah input nama kosong, menampilkan pesan error atau sukses.
     * Sesuai Bab 6 Gambar 6.3.
     */
    contactForm.addEventListener("submit", (event) => {
      // Mencegah submit default browser (reload halaman)
      event.preventDefault();

      const nameValue = nameInput.value.trim();

      // Cek apakah input nama kosong
      if (nameValue === "") {
        // Tampilkan pesan error dan ubah border input menjadi merah
        nameInput.classList.remove("border-gray-300", "focus:ring-brand-secondary");
        nameInput.classList.add("border-red-500", "focus:ring-red-500");

        formMessage.textContent = "Nama wajib diisi!";
        formMessage.className = "text-sm font-semibold text-red-600 mt-2 block";
        return;
      }

      // Jika validasi berhasil: tampilkan pesan sukses menggunakan Template Literal (Bab 3.2)
      nameInput.classList.remove("border-red-500", "focus:ring-red-500");
      nameInput.classList.add("border-gray-300", "focus:ring-brand-secondary");

      formMessage.textContent = `Terima kasih, ${nameValue}! Pesan berhasil dikirim.`;
      formMessage.className = "text-sm font-semibold text-emerald-600 mt-2 block";

      // Reset nilai input form
      contactForm.reset();
    });
  }
});
