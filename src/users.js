/**
 * @file users.js
 * @description Script JavaScript eksternal untuk Codelab Modul 2 - Mengambil dan Menampilkan Data dari Public API.
 * Mengimplementasikan:
 * 1. Fetch API method GET dengan async/await dan try...catch (Bab 7.2 & Bab 9.1).
 * 2. Pengecekan HTTP status response.ok (Bab 9.3).
 * 3. Loading state dan Error message (Bab 9.1 & Bab 9.3).
 * 4. Rendering data dalam bentuk Card menggunakan Template Literal (Bab 3.2 & Bab 4.2).
 * 5. Fitur Search real-time menggunakan Array.filter() dan event 'input' (Bab 4.2 & Bab 6).
 */

// Seleksi elemen DOM berdasarkan ID sesuai Bab 5.1 & Bab 9.1 Gambar 9.2
const searchInput = document.querySelector("#search-input");
const userList = document.querySelector("#user-list");
const loadingMessage = document.querySelector("#loading-message");
const errorMessage = document.querySelector("#error-message");
const retryBtn = document.querySelector("#retry-btn");

// Variabel penyimpan data users yang didapatkan dari API (Bab 2.1)
let usersData = [];

/**
 * Merender daftar user ke dalam format Card sederhana pada DOM.
 * Menggunakan Array Method map() dan Template Literal ${} sesuai Bab 4.2 & Bab 9.1 Gambar 9.3.
 * 
 * @param {Array<Object>} users Array objek pengguna
 */
const renderUsers = (users) => {
  if (!userList) return;

  // Jika hasil pencarian atau data kosong
  if (!users || users.length === 0) {
    userList.innerHTML = `
      <div class="col-span-full text-center py-8 text-gray-500">
        <p class="text-base font-medium">Tidak ada data pengguna yang ditemukan.</p>
      </div>
    `;
    return;
  }

  // Gunakan map() dan join("") untuk menghasilkan string elemen HTML dari array
  userList.innerHTML = users
    .map((user) => {
      // Destructuring properti objek sesuai materi Bab 3.3
      const { name, email, username, phone, website, company, address } = user;

      return `
        <article class="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition duration-300 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-brand-primary">
                ID: ${user.id}
              </span>
              <span class="text-xs text-gray-400">@${username}</span>
            </div>
            <h3 class="text-lg font-bold text-brand-primary mb-1">${name}</h3>
            <p class="text-sm text-gray-600 mb-3 flex items-center gap-1.5">
              <span class="text-gray-400 font-semibold">Email:</span>
              <a href="mailto:${email}" class="text-brand-secondary hover:underline">${email}</a>
            </p>
            <div class="space-y-1 text-xs text-gray-500 pt-3 border-t border-gray-100">
              <p><span class="font-medium text-gray-700">Perusahaan:</span> ${company?.name || "-"}</p>
              <p><span class="font-medium text-gray-700">Kota:</span> ${address?.city || "-"}</p>
              <p><span class="font-medium text-gray-700">Telepon:</span> ${phone || "-"}</p>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-gray-100 text-right">
            <a 
              href="https://${website}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="text-xs font-semibold text-brand-secondary hover:text-brand-primary inline-flex items-center gap-1"
            >
              Kunjungi Website &rarr;
            </a>
          </div>
        </article>
      `;
    })
    .join("");
};

/**
 * Mengambil data dari Public API (JSONPlaceholder) menggunakan Fetch API dengan async/await.
 * Menangani state loading, pengecekan response.ok, serta menangkap error di blok catch.
 * Sesuai alur pada Bab 9.1 & Bab 9.3 Gambar 9.7.
 */
const getUsers = async () => {
  try {
    // 1. Tampilkan state loading dan sembunyikan pesan error sebelumnya
    if (loadingMessage) {
      loadingMessage.textContent = "Loading data pengguna dari server...";
      loadingMessage.classList.remove("hidden");
    }
    if (errorMessage) {
      errorMessage.textContent = "";
      errorMessage.classList.add("hidden");
    }
    if (retryBtn) {
      retryBtn.classList.add("hidden");
    }

    // 2. Kirim HTTP GET request ke Public REST API
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    // 3. Evaluasi status response.ok secara manual (Bab 9.3)
    // Blok catch tidak otomatis dipicu bila server merespons 404/500
    if (!response.ok) {
      throw new Error(`Data gagal dimuat dari server (HTTP status: ${response.status})`);
    }

    // 4. Ubah response stream menjadi data JSON (Bab 8.3 & 9.1)
    const users = await response.json();
    usersData = users;

    // 5. Render data yang berhasil didapatkan ke dalam card
    renderUsers(usersData);

    // Sembunyikan pesan loading setelah berhasil
    if (loadingMessage) {
      loadingMessage.textContent = "";
      loadingMessage.classList.add("hidden");
    }
  } catch (error) {
    // 6. Tangani error dan tampilkan pesan kegagalan kepada user (Bab 9.3)
    console.error("Fetch API Error:", error);

    if (loadingMessage) {
      loadingMessage.textContent = "";
      loadingMessage.classList.add("hidden");
    }

    if (errorMessage) {
      errorMessage.textContent = `Terjadi kesalahan: ${error.message}. Silakan periksa koneksi internet Anda dan coba lagi.`;
      errorMessage.classList.remove("hidden");
    }

    if (retryBtn) {
      retryBtn.classList.remove("hidden");
    }

    // Bersihkan daftar card jika terjadi error
    if (userList) {
      userList.innerHTML = "";
    }
  }
};

// ========================================================
// EVENT LISTENERS
// ========================================================

// Event 'input' untuk Unified Real-time Search berdasarkan nama pengguna (Bab 4.2 & 6)
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase().trim();
    // Menggunakan Array Method filter() sesuai Bab 4.2 Tabel 4.1
    const filteredUsers = usersData.filter((user) => {
      return (
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.username.toLowerCase().includes(keyword)
      );
    });
    renderUsers(filteredUsers);
  });
}

// Tombol coba lagi jika terjadi kegagalan pengambilan data API
if (retryBtn) {
  retryBtn.addEventListener("click", () => {
    getUsers();
  });
}

// Jalankan fungsi getUsers saat file JavaScript dimuat
getUsers();
