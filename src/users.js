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
 * Palet warna netral bersahaja untuk latar belakang avatar squircle
 */
const AVATAR_PALETTES = [
  "bg-amber-100 text-amber-800 border-amber-200",
  "bg-stone-200 text-stone-800 border-stone-300",
  "bg-orange-100 text-accent border-orange-200",
  "bg-emerald-100 text-emerald-800 border-emerald-200",
  "bg-slate-200 text-slate-800 border-slate-300",
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
      <div class="col-span-full text-center py-12 px-6 bg-surface rounded-2xl border border-dashed border-line">
        <p class="text-sm font-semibold text-ink">Tidak ada data pengguna yang cocok.</p>
        <p class="text-xs text-muted mt-1">Coba gunakan kata kunci pencarian nama atau email lainnya.</p>
      </div>
    `;
    return;
  }

  // Konversi array pengguna menjadi elemen card HTML via map() + join("")
  userList.innerHTML = users
    .map((user, index) => {
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
        <article 
          class="animate-rise bg-surface rounded-2xl p-6 border border-line shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          style="animation-delay: ${index * 40}ms"
        >
          <div>
            <!-- Header Kartu: Inisial Squircle & ID -->
            <div class="flex items-center justify-between gap-3 mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl border flex items-center justify-center font-mono font-bold text-xs ${avatarClass}">
                  ${initials}
                </div>
                <div>
                  <h3 class="text-base font-bold text-ink leading-tight">${safeName}</h3>
                  <p class="text-xs font-mono text-muted">@${safeUsername}</p>
                </div>
              </div>
              <span class="text-[11px] font-mono px-2 py-0.5 rounded-full bg-line/60 text-muted border border-line">
                #${id}
              </span>
            </div>

            <!-- Informasi Kontak & Perusahaan -->
            <div class="space-y-1.5 text-xs text-muted pt-3 border-t border-line">
              <p class="flex items-center gap-1.5">
                <span class="font-medium text-ink">Email:</span>
                <a href="mailto:${safeEmail}" class="text-accent hover:underline break-all">${safeEmail}</a>
              </p>
              <p><span class="font-medium text-ink">Perusahaan:</span> ${safeCompany}</p>
              <p><span class="font-medium text-ink">Kota:</span> ${safeCity}</p>
              <p><span class="font-medium text-ink">Telepon:</span> <span class="font-mono text-[11px]">${safePhone}</span></p>
            </div>
          </div>

          <!-- Tautan Eksternal Website -->
          <div class="mt-4 pt-3 border-t border-line flex justify-end">
            ${
              safeWebsite
                ? `<a 
                    href="https://${safeWebsite}" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    class="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1"
                  >
                    <span>${safeWebsite}</span>
                    <span aria-hidden="true">&rarr;</span>
                  </a>`
                : `<span class="text-xs text-muted">-</span>`
            }
          </div>
        </article>
      `;
    })
    .join("");
};

/**
 * Mengambil data dari REST API publik (JSONPlaceholder) menggunakan Fetch API (Bab 9).
 * Menangani mode demonstrasi kegagalan lewat parameter URL '?fail=1' (Keputusan D2).
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
    getUsers();
  });
}

// Jalankan pengambilan data pertama kali saat DOM siap
document.addEventListener("DOMContentLoaded", () => {
  getUsers();
});
