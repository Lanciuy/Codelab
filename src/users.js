/**
 * @file users.js
 * @description Modul pengambilan dan rendering data dari Public REST API untuk Codelab Modul 2.
 * Mengimplementasikan:
 * 1. Fetch API method GET dengan async/await dan penanganan error try...catch (Bab 7 & 9)
 * 2. Pengecekan eksplisit HTTP response.ok (Bab 9.3)
 * 3. Loading state dan Error message interaktif dengan tombol coba lagi (Bab 9.1 & 9.3)
 * 4. Rendering data dalam bentuk Card menggunakan Template Literal, Destructuring, dan Array map (Bab 3.2, 3.3, 4.2)
 * 5. Fitur Search real-time menggunakan Array filter() dan event input (Bab 4.2 & Bab 6)
 */

// Seleksi elemen DOM berdasarkan ID sesuai modul
const searchInput = document.querySelector("#search-input");
const userList = document.querySelector("#user-list");
const loadingContainer = document.querySelector("#loading-container");
const loadingMessage = document.querySelector("#loading-message");
const errorContainer = document.querySelector("#error-container");
const errorMessage = document.querySelector("#error-message");
const retryBtn = document.querySelector("#retry-btn");
const userCountBadge = document.querySelector("#user-count-badge");

// Variabel penyimpan state data pengguna
let usersData = [];

/**
 * Sanitasi string teks untuk mencegah celah XSS (Cross-Site Scripting)
 * Sesuai materi Bab 9.1 Catatan Penting.
 * 
 * @param {string} text Teks mentah
 * @returns {string} Teks aman yang telah di-escape
 */
const escapeHTML = (text) => {
  if (text === null || text === undefined) return "";
  const div = document.createElement("div");
  div.textContent = String(text);
  return div.innerHTML;
};

/**
 * Menghasilkan dua inisial huruf dari nama pengguna untuk avatar visual.
 * 
 * @param {string} name Nama lengkap pengguna
 * @returns {string} Dua huruf inisial kapital
 */
const getInitials = (name) => {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Palet warna untuk latar belakang avatar inisial
 */
const AVATAR_PALETTES = [
  "bg-blue-100 text-blue-800 border-blue-200",
  "bg-indigo-100 text-indigo-800 border-indigo-200",
  "bg-emerald-100 text-emerald-800 border-emerald-200",
  "bg-purple-100 text-purple-800 border-purple-200",
  "bg-amber-100 text-amber-800 border-amber-200",
];

/**
 * Merender daftar user ke dalam format Card sederhana pada DOM.
 * Menggunakan Array Method map() dan Template Literal ${} sesuai Bab 4.2 & Bab 9.1 Gambar 9.3.
 * 
 * @param {Array<Object>} users Array of objects data pengguna
 */
const renderUsers = (users) => {
  if (!userList) return;

  // Perbarui indikator jumlah data yang sedang tampil
  if (userCountBadge) {
    userCountBadge.textContent = `${users.length} pengguna`;
  }

  // Tampilan ketika hasil pencarian tidak menemukan kecocokan
  if (!users || users.length === 0) {
    userList.innerHTML = `
      <div class="col-span-full text-center py-12 px-6 bg-white rounded-xl border border-dashed border-slate-300">
        <p class="text-sm font-semibold text-slate-800">Tidak ada data pengguna yang cocok.</p>
        <p class="text-xs text-slate-500 mt-1">Coba gunakan kata kunci pencarian nama atau email lainnya.</p>
      </div>
    `;
    return;
  }

  // Konversi array pengguna menjadi elemen card HTML via map() + join("")
  userList.innerHTML = users
    .map((user) => {
      // Destructuring properti objek sesuai materi Bab 3.3
      const { id, name, username, email, phone, website, company, address } = user;

      const safeName = escapeHTML(name);
      const safeUsername = escapeHTML(username);
      const safeEmail = escapeHTML(email);
      const safeCompany = escapeHTML(company?.name || "-");
      const safeCity = escapeHTML(address?.city || "-");
      const safePhone = escapeHTML(phone || "-");
      const safeWebsite = escapeHTML(website || "");

      const avatarClass = AVATAR_PALETTES[id % AVATAR_PALETTES.length];
      const initials = getInitials(safeName);

      return `
        <article class="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div>
            <!-- Header Kartu: Inisial Squircle & ID -->
            <div class="flex items-center justify-between gap-3 mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg border flex items-center justify-center font-bold text-xs ${avatarClass}">
                  ${initials}
                </div>
                <div>
                  <h3 class="text-base font-bold text-slate-900 leading-tight">${safeName}</h3>
                  <p class="text-xs text-slate-500">@${safeUsername}</p>
                </div>
              </div>
              <span class="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                #${id}
              </span>
            </div>

            <!-- Informasi Kontak & Perusahaan -->
            <div class="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <p class="flex items-center gap-1.5">
                <span class="font-medium text-slate-800">Email:</span>
                <a href="mailto:${safeEmail}" class="text-brand-secondary hover:underline break-all">${safeEmail}</a>
              </p>
              <p><span class="font-medium text-slate-800">Perusahaan:</span> ${safeCompany}</p>
              <p><span class="font-medium text-slate-800">Kota:</span> ${safeCity}</p>
              <p><span class="font-medium text-slate-800">Telepon:</span> <span class="font-mono text-[11px]">${safePhone}</span></p>
            </div>
          </div>

          <!-- Tautan Eksternal Website -->
          <div class="mt-4 pt-3 border-t border-slate-100 flex justify-end">
            ${
              safeWebsite
                ? `<a 
                    href="https://${safeWebsite}" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    class="text-xs font-semibold text-brand-secondary hover:underline inline-flex items-center gap-1"
                  >
                    <span>${safeWebsite}</span>
                    <span aria-hidden="true">&rarr;</span>
                  </a>`
                : `<span class="text-xs text-slate-400">-</span>`
            }
          </div>
        </article>
      `;
    })
    .join("");
};

/**
 * Mengambil data dari REST API publik (JSONPlaceholder) menggunakan Fetch API (Bab 9).
 * Menangani mode demonstrasi kegagalan lewat parameter URL '?fail=1'.
 */
const getUsers = async () => {
  // Evaluasi mode fail untuk kemudahan demo pengujian error tanpa mematikan internet
  const urlParams = new URLSearchParams(window.location.search);
  const isFailMode = urlParams.get("fail") === "1";
  const apiEndpoint = isFailMode
    ? "https://jsonplaceholder.typicode.com/invalid-endpoint-404"
    : "https://jsonplaceholder.typicode.com/users";

  try {
    // 1. Tampilkan state loading (teks + skeleton cards) dan reset state error
    if (loadingContainer) loadingContainer.classList.remove("hidden");
    if (loadingMessage) loadingMessage.textContent = "Mengambil data pengguna dari REST API...";
    if (errorContainer) errorContainer.classList.add("hidden");
    if (userList) userList.innerHTML = "";

    // 2. Kirim permintaan HTTP GET via Fetch API (Bab 9.1 & 9.2)
    const response = await fetch(apiEndpoint);

    // 3. Pengecekan manual response.ok sesuai Bab 9.3 Gambar 9.7
    if (!response.ok) {
      throw new Error(`Data gagal dimuat dari server (HTTP status: ${response.status})`);
    }

    // 4. Konversi response stream menjadi data JavaScript Array of Objects (Bab 8.3)
    const users = await response.json();
    usersData = users;

    // 5. Render data pengguna ke dalam kartu-kartu visual
    renderUsers(usersData);

    // Sembunyikan container loading setelah data siap
    if (loadingContainer) loadingContainer.classList.add("hidden");
  } catch (error) {
    // 6. Tangani kegagalan jaringan atau HTTP error (Bab 9.3)
    console.error("Gagal melakukan fetch data:", error);

    if (loadingContainer) loadingContainer.classList.add("hidden");
    if (errorMessage) {
      errorMessage.textContent = `${error.message}. Periksa koneksi internet atau parameter endpoint lalu coba kembali.`;
    }
    if (errorContainer) errorContainer.classList.remove("hidden");
    if (userCountBadge) userCountBadge.textContent = "0 pengguna";
  }
};

// ========================================================
// EVENT LISTENERS
// ========================================================

// Event 'input' untuk Unified Real-time Search berdasarkan nama atau email (Bab 4.2 & Bab 6)
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase().trim();
    // Menggunakan Array Method filter() sesuai Bab 4.2 Tabel 4.1
    const filteredUsers = usersData.filter((user) => {
      const matchName = user.name && user.name.toLowerCase().includes(keyword);
      const matchEmail = user.email && user.email.toLowerCase().includes(keyword);
      const matchUsername = user.username && user.username.toLowerCase().includes(keyword);
      return matchName || matchEmail || matchUsername;
    });
    renderUsers(filteredUsers);
  });
}

// Tombol coba lagi (Retry) jika terjadi error state
if (retryBtn) {
  retryBtn.addEventListener("click", () => {
    // Jika sedang dalam simulasi parameter URL ?fail=1, bersihkan query agar retry memulihkan data normal
    if (window.location.search.includes("fail=1")) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    getUsers();
  });
}

// Jalankan pengambilan data pertama kali saat DOM siap
document.addEventListener("DOMContentLoaded", () => {
  getUsers();
});
