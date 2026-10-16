/**
 * @file ui.js
 * @description Modul rendering UI dan manipulasi DOM untuk The Vibe Grid.
 * Mengimplementasikan Template Literal (Bab 3.2), Destructuring (Bab 3.3),
 * Array Method map & join (Bab 4.2 Gambar 4.9), serta sanitasi XSS (Bab 9.1).
 */

/**
 * Sanitasi string teks untuk mencegah celah Cross-Site Scripting (XSS)
 * Menggunakan pendekatan DOM textContent sesuai Bab 9.1 Gambar 9.4.
 * 
 * @param {string} text Teks mentah yang akan disanitasi
 * @returns {string} Teks aman yang telah di-escape
 */
export function escapeHTML(text) {
  if (text === null || text === undefined) return "";
  const div = document.createElement("div");
  div.textContent = String(text);
  return div.innerHTML;
}

/**
 * Merender daftar anime ke dalam bentuk Grid Card menggunakan Template Literal,
 * Object Destructuring, dan kombinasi array method map() + join("").
 * 
 * @param {Array<Object>} animeList Array of objects data anime
 * @param {HTMLElement} containerElement Elemen kontainer grid
 */
export function renderAnimeGrid(animeList, containerElement) {
  if (!containerElement) return;

  if (!Array.isArray(animeList) || animeList.length === 0) {
    containerElement.innerHTML = "";
    return;
  }

  // Menggunakan map() dan template literal ${} sesuai Bab 4.2 Gambar 4.9 & Bab 9.1 Gambar 9.3
  const cardsHTML = animeList
    .map((anime) => {
      // Object Destructuring sesuai materi Bab 3.3
      const {
        mal_id,
        title,
        title_english,
        images,
        score,
        episodes,
        status,
        genres,
        synopsis,
      } = anime;

      // Ambil URL gambar dengan fallback aman
      const imageUrl =
        images?.webp?.large_image_url ||
        images?.webp?.image_url ||
        images?.jpg?.large_image_url ||
        "https://placehold.co/400x600/1e293b/ffffff?text=No+Cover";

      // Render badge genre (maksimal 3 genre)
      const genreBadges = Array.isArray(genres)
        ? genres
            .slice(0, 3)
            .map(
              (g) =>
                `<span class="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">${escapeHTML(
                  g.name
                )}</span>`
            )
            .join(" ")
        : "";

      const displayTitle = escapeHTML(title_english || title || "Tanpa Judul");
      const shortSynopsis = escapeHTML(
        synopsis
          ? synopsis.length > 120
            ? synopsis.slice(0, 117) + "..."
            : synopsis
          : "Sinopsis tidak tersedia."
      );
      const displayScore = typeof score === "number" ? score.toFixed(1) : "N/A";
      const displayEpisodes = episodes ? `${episodes} Ep` : (status === "Currently Airing" ? "Ongoing" : "Unknown");

      return `
        <article 
          class="anime-card group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          data-mal-id="${escapeHTML(mal_id)}"
          tabindex="0"
          role="button"
          aria-label="Lihat detail ${displayTitle}"
        >
          <!-- Gambar Cover dengan Efek Hover -->
          <div class="relative aspect-3/4 overflow-hidden bg-slate-900">
            <img 
              src="${escapeHTML(imageUrl)}" 
              alt="${displayTitle}" 
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/30 opacity-60 group-hover:opacity-40 transition-opacity"></div>
            
            <!-- Badge Skor -->
            <div class="absolute top-3 right-3 flex items-center gap-1 bg-black/75 backdrop-blur-md text-amber-400 px-2.5 py-1 rounded-full text-xs font-bold shadow-md">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span>${displayScore}</span>
            </div>

            <!-- Badge Episode -->
            <div class="absolute bottom-3 left-3 bg-brand-primary/80 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow">
              ${escapeHTML(displayEpisodes)}
            </div>
          </div>

          <!-- Informasi Konten -->
          <div class="p-4 flex flex-col grow">
            <!-- Badges Genre -->
            <div class="flex flex-wrap gap-1 mb-2">
              ${genreBadges}
            </div>

            <!-- Judul -->
            <h3 class="font-bold text-gray-900 group-hover:text-brand-secondary transition-colors line-clamp-1 text-base mb-1" title="${displayTitle}">
              ${displayTitle}
            </h3>

            <!-- Sinopsis Singkat -->
            <p class="text-xs text-gray-500 leading-relaxed grow line-clamp-3 mb-4">
              ${shortSynopsis}
            </p>

            <!-- Action Button -->
            <div class="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
              <span class="text-brand-secondary font-semibold group-hover:underline">Buka Detail</span>
              <span class="text-gray-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  containerElement.innerHTML = cardsHTML;
}

/**
 * Menampilkan skeleton loading state saat proses fetch sedang berlangsung
 * 
 * @param {HTMLElement} containerElement Elemen kontainer
 * @param {number} count Jumlah skeleton cards yang ditampilkan
 */
export function renderLoadingSkeleton(containerElement, count = 8) {
  if (!containerElement) return;

  const skeletonCards = Array.from({ length: count })
    .map(
      () => `
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col animate-pulse">
          <div class="aspect-3/4 bg-slate-200"></div>
          <div class="p-4 space-y-3 grow">
            <div class="flex gap-2">
              <div class="h-4 bg-slate-200 rounded-full w-14"></div>
              <div class="h-4 bg-slate-200 rounded-full w-16"></div>
            </div>
            <div class="h-5 bg-slate-200 rounded w-3/4"></div>
            <div class="space-y-1.5 pt-1">
              <div class="h-3 bg-slate-200 rounded w-full"></div>
              <div class="h-3 bg-slate-200 rounded w-5/6"></div>
              <div class="h-3 bg-slate-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      `
    )
    .join("");

  containerElement.innerHTML = skeletonCards;
}

/**
 * Menampilkan pesan error state secara interaktif
 * 
 * @param {HTMLElement} errorElement Kontainer error
 * @param {HTMLElement} messageElement Elemen teks error
 * @param {string} errorMessage Isi pesan error
 */
export function showErrorState(errorElement, messageElement, errorMessage) {
  if (messageElement) {
    messageElement.textContent = errorMessage;
  }
  if (errorElement) {
    errorElement.classList.remove("hidden");
  }
}

/**
 * Menyembunyikan pesan error state
 * 
 * @param {HTMLElement} errorElement Kontainer error
 */
export function hideErrorState(errorElement) {
  if (errorElement) {
    errorElement.classList.add("hidden");
  }
}

/**
 * Merender modal detail anime saat salah satu card diklik
 * 
 * @param {Object} anime Objek data anime
 * @param {HTMLElement} modalContainer Kontainer modal
 */
export function renderDetailModal(anime, modalContainer) {
  if (!modalContainer || !anime) return;

  const {
    title,
    title_english,
    title_japanese,
    images,
    score,
    scored_by,
    episodes,
    status,
    rating,
    genres,
    synopsis,
    url,
    aired,
  } = anime;

  const imageUrl =
    images?.webp?.large_image_url ||
    images?.webp?.image_url ||
    images?.jpg?.large_image_url ||
    "https://placehold.co/400x600/1e293b/ffffff?text=No+Cover";

  const genreBadges = Array.isArray(genres)
    ? genres
        .map(
          (g) =>
            `<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-brand-primary">${escapeHTML(
              g.name
            )}</span>`
        )
        .join(" ")
    : "-";

  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" id="modal-backdrop">
      <div 
        class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col relative transform transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <!-- Tombol Tutup Modal -->
        <button 
          id="modal-close-btn" 
          type="button" 
          class="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Tutup dialog modal"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <!-- Cover Poster -->
          <div class="md:col-span-1">
            <img 
              src="${escapeHTML(imageUrl)}" 
              alt="${escapeHTML(title)}" 
              class="w-full rounded-2xl shadow-md object-cover aspect-3/4"
            />
            <div class="mt-4 p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-gray-600 border border-slate-100">
              <div class="flex justify-between">
                <span class="font-semibold text-gray-700">Status:</span>
                <span>${escapeHTML(status || "Unknown")}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold text-gray-700">Episode:</span>
                <span>${escapeHTML(episodes || "Ongoing")}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold text-gray-700">Tayang:</span>
                <span>${escapeHTML(aired?.string || "-")}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold text-gray-700">Rating:</span>
                <span>${escapeHTML(rating || "-")}</span>
              </div>
            </div>
          </div>

          <!-- Detail Informasi -->
          <div class="md:col-span-2 flex flex-col">
            <div class="flex items-center gap-2 mb-2">
              <span class="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                ★ ${typeof score === "number" ? score.toFixed(2) : "N/A"}
              </span>
              <span class="text-xs text-gray-400">(${scored_by ? scored_by.toLocaleString() : 0} votes)</span>
            </div>

            <h2 id="modal-title" class="text-2xl font-bold text-gray-900 leading-snug">
              ${escapeHTML(title)}
            </h2>
            ${
              title_english && title_english !== title
                ? `<p class="text-sm text-gray-500 mb-1">${escapeHTML(title_english)}</p>`
                : ""
            }
            ${
              title_japanese
                ? `<p class="text-xs text-gray-400 font-mono mb-3">${escapeHTML(title_japanese)}</p>`
                : ""
            }

            <div class="flex flex-wrap gap-1.5 mb-4">
              ${genreBadges}
            </div>

            <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Sinopsis</h4>
            <div class="text-sm text-gray-700 leading-relaxed overflow-y-auto max-h-48 pr-2 space-y-2 mb-6">
              <p>${escapeHTML(synopsis || "Sinopsis belum tersedia.")}</p>
            </div>

            <div class="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
              <a 
                href="${escapeHTML(url || "#")}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-xs font-bold text-brand-secondary hover:underline"
              >
                <span>Lihat di MyAnimeList</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </a>
              <button 
                id="modal-btn-dismiss" 
                type="button" 
                class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  modalContainer.classList.remove("hidden");
}

/**
 * Menutup modal detail
 * 
 * @param {HTMLElement} modalContainer Kontainer modal
 */
export function closeModal(modalContainer) {
  if (!modalContainer) return;
  modalContainer.classList.add("hidden");
  modalContainer.innerHTML = "";
}
