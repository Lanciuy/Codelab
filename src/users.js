/**
 * @file users.js
 * @description Modul interaksi data REST API Anime (Studio Ghibli API) untuk Codelab Modul 2.
 */

// Seleksi elemen DOM berdasarkan ID
const searchInput = document.querySelector("#search-input");
const userList = document.querySelector("#user-list");
const loadingContainer = document.querySelector("#loading-container");
const loadingMessage = document.querySelector("#loading-message");
const errorContainer = document.querySelector("#error-container");
const errorMessage = document.querySelector("#error-message");
const retryBtn = document.querySelector("#retry-btn");
const userCountBadge = document.querySelector("#user-count-badge");

// Menyimpan daftar data anime yang berhasil diambil dari API
let animeData = [];

/**
 * Fungsi untuk membersihkan teks dari karakter HTML berbahaya (mencegah celah XSS).
 * @param {string} text - Teks mentah yang akan dibersihkan.
 * @returns {string} Teks aman yang sudah di-escape.
 */
const escapeHTML = (text) => {
  if (text === null || text === undefined) return "";
  const div = document.createElement("div");
  div.textContent = String(text);
  return div.innerHTML;
};

/**
 * Fungsi untuk menampilkan daftar anime dalam bentuk kartu (card) pada halaman web.
 * @param {Array<Object>} films - Kumpulan data film anime dari API.
 */
const renderAnimeCards = (films) => {
  if (!userList) return;

  // Update label total data anime yang tampil
  if (userCountBadge) {
    userCountBadge.textContent = `${films.length} film anime`;
  }

  // Tampilan ketika hasil pencarian tidak ditemukan
  if (!films || films.length === 0) {
    userList.innerHTML = `
      <div class="col-span-full text-center py-14 px-6 bg-white rounded-2xl border border-dashed border-slate-300">
        <p class="text-base font-bold text-slate-800">Tidak ada film anime yang cocok.</p>
        <p class="text-xs text-slate-500 mt-1">Coba gunakan kata kunci pencarian judul atau nama sutradara lainnya.</p>
      </div>
    `;
    return;
  }

  // Render setiap item film menjadi elemen HTML kartu
  userList.innerHTML = films
    .map((film) => {
      const {
        id,
        title,
        original_title,
        original_title_romanised,
        image,
        description,
        director,
        release_date,
        running_time,
        rt_score,
      } = film;

      const safeTitle = escapeHTML(title || "Tanpa Judul");
      const safeKanji = escapeHTML(original_title || "");
      const safeRomanised = escapeHTML(original_title_romanised || "");
      const safeDirector = escapeHTML(director || "Studio Ghibli");
      const safeYear = escapeHTML(release_date || "-");
      const safeDuration = escapeHTML(running_time ? `${running_time} mnt` : "-");
      const safeScore = escapeHTML(rt_score ? `${rt_score}%` : "N/A");
      const safeDescription = escapeHTML(
        description
          ? description.length > 130
            ? description.slice(0, 127) + "..."
            : description
          : "Deskripsi film anime belum tersedia."
      );
      const posterUrl = escapeHTML(
        image || "https://placehold.co/400x600/1e293b/ffffff?text=Studio+Ghibli"
      );

      return `
        <article class="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
          <div>
            <!-- Poster Anime -->
            <div class="relative aspect-3/4 overflow-hidden bg-slate-900">
              <img 
                src="${posterUrl}" 
                alt="${safeTitle}" 
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/30 opacity-60 group-hover:opacity-40 transition-opacity"></div>
              
              <!-- Badge Skor Rating -->
              <div class="absolute top-3 right-3 flex items-center gap-1 bg-black/75 backdrop-blur-md text-amber-400 px-2.5 py-1 rounded-full text-xs font-bold shadow-md">
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span>${safeScore}</span>
              </div>

              <!-- Badge Tahun Rilis dan Durasi -->
              <div class="absolute bottom-3 left-3 flex items-center gap-1.5">
                <span class="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  ${safeYear}
                </span>
                <span class="bg-slate-800/80 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded shadow">
                  ${safeDuration}
                </span>
              </div>
            </div>

            <!-- Konten Kartu -->
            <div class="p-5 flex flex-col grow">
              <!-- Nama Sutradara -->
              <div class="flex items-center gap-1 text-xs text-brand-secondary font-semibold mb-1">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                <span class="line-clamp-1">${safeDirector}</span>
              </div>

              <!-- Judul Film -->
              <h3 class="font-bold text-slate-900 group-hover:text-brand-secondary transition-colors line-clamp-1 text-base mb-1" title="${safeTitle}">
                ${safeTitle}
              </h3>

              <!-- Judul Asli Bahasa Jepang -->
              <p class="text-[11px] font-medium text-slate-400 line-clamp-1 mb-2">
                ${safeKanji} ${safeRomanised ? `(${safeRomanised})` : ""}
              </p>

              <!-- Ringkasan Cerita -->
              <p class="text-xs text-slate-600 leading-relaxed grow line-clamp-3 mb-4">
                ${safeDescription}
              </p>
            </div>
          </div>

          <!-- Bagian Bawah Kartu -->
          <div class="px-5 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span class="text-brand-secondary font-semibold group-hover:underline inline-flex items-center gap-1">
              <span>Studio Ghibli</span>
              <span aria-hidden="true">&rarr;</span>
            </span>
            <span class="text-[10px] font-mono text-slate-400">ID: ${escapeHTML(id ? id.slice(0, 8) : "-")}</span>
          </div>
        </article>
      `;
    })
    .join("");
};

/**
 * Fungsi untuk mengambil data anime dari REST API publik menggunakan Fetch API (Method GET).
 * Mengatur loading state saat proses berlangsung dan menampilkan error state jika gagal.
 */
const getAnimeData = async () => {
  // Mode simulasi error menggunakan query '?fail=1' di URL
  const urlParams = new URLSearchParams(window.location.search);
  const isFailMode = urlParams.get("fail") === "1";
  const apiEndpoint = isFailMode
    ? "https://ghibliapi.vercel.app/invalid-endpoint-404"
    : "https://ghibliapi.vercel.app/films";

  try {
    // 1. Tampilkan indikator loading dan sembunyikan pesan error sebelumnya
    if (loadingContainer) loadingContainer.classList.remove("hidden");
    if (loadingMessage) loadingMessage.textContent = "Mengambil katalog film anime dari Studio Ghibli REST API...";
    if (errorContainer) errorContainer.classList.add("hidden");
    if (userList) userList.innerHTML = "";

    // 2. Request data ke REST API menggunakan Fetch API
    const response = await fetch(apiEndpoint);

    // 3. Pastikan respon server berstatus sukses (HTTP 200-299)
    if (!response.ok) {
      throw new Error(`Data gagal dimuat dari server (HTTP status: ${response.status})`);
    }

    // 4. Konversi hasil respon menjadi data JSON
    const payload = await response.json();
    animeData = Array.isArray(payload) ? payload : [];

    // 5. Render data film anime ke tampilan kartu
    renderAnimeCards(animeData);

    // Sembunyikan indikator loading setelah data selesai dimuat
    if (loadingContainer) loadingContainer.classList.add("hidden");
  } catch (error) {
    // 6. Tangani jika terjadi error koneksi atau HTTP gagal
    console.error("Gagal melakukan fetch data anime:", error);

    if (loadingContainer) loadingContainer.classList.add("hidden");
    if (errorMessage) {
      errorMessage.textContent = `${error.message}. Periksa koneksi internet atau parameter endpoint lalu coba kembali.`;
    }
    if (errorContainer) errorContainer.classList.remove("hidden");
    if (userCountBadge) userCountBadge.textContent = "0 film anime";
  }
};

/**
 * Event listener untuk input pencarian film anime secara real-time.
 */
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase().trim();
    // Filter data berdasarkan judul, nama jepang, sutradara, atau sinopsis
    const filteredAnime = animeData.filter((film) => {
      const title = film.title ? film.title.toLowerCase() : "";
      const kanji = film.original_title ? film.original_title.toLowerCase() : "";
      const roman = film.original_title_romanised ? film.original_title_romanised.toLowerCase() : "";
      const director = film.director ? film.director.toLowerCase() : "";
      const desc = film.description ? film.description.toLowerCase() : "";
      return (
        title.includes(keyword) ||
        kanji.includes(keyword) ||
        roman.includes(keyword) ||
        director.includes(keyword) ||
        desc.includes(keyword)
      );
    });
    renderAnimeCards(filteredAnime);
  });
}

/**
 * Event listener untuk tombol coba lagi (Retry) saat terjadi error state.
 */
if (retryBtn) {
  retryBtn.addEventListener("click", () => {
    // Bersihkan parameter fail=1 jika sedang dalam mode uji coba error
    if (window.location.search.includes("fail=1")) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    getAnimeData();
  });
}

/**
 * Jalankan pengambilan data secara otomatis saat struktur HTML selesai dimuat.
 */
document.addEventListener("DOMContentLoaded", () => {
  getAnimeData();
});
