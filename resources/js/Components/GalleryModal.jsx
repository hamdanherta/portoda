import React, { useEffect, useRef } from 'react';
import { X, Images, Palette, Info, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import WatermarkedImage from './WatermarkedImage';

// ── Whitelist subkategori yang BOLEH tampil di modal ───────────────────────
// Hanya: Logo, Banner, Poster, Kemasan, Feed, Lainnya
// TIDAK termasuk: Fotografi, Motion Graphic, Videografi, Film, Mobile, Web, UI/UX
const ALLOWED_SUBCATEGORY_KEYWORDS = [
  'logo',
  'banner',
  'poster',
  'kemasan',
  'feed',
  'lain',
  'other',
  'iklan',
  'stationery',
  'editorial',
  'infografis',
  'infographic',
  'brand',
];

/** Cek apakah subcategory ada di whitelist */
function isAllowedSubcategory(subcategory) {
  const key = (subcategory || '').toLowerCase().trim();
  if (!key || key === '') return true; // kosong → masuk ke "Lainnya"
  return ALLOWED_SUBCATEGORY_KEYWORDS.some((k) => key.includes(k));
}
const SUBCATEGORY_META = {
  'logo':       { id: 'Desain Logo',       en: 'Logo Design',        desc_id: 'Karya desain logo brand dan identitas visual.', desc_en: 'Brand logo and visual identity design works.' },
  'poster':     { id: 'Desain Poster',     en: 'Poster Design',      desc_id: 'Desain poster untuk berbagai kebutuhan promosi & acara.', desc_en: 'Poster designs for promotions & events.' },
  'banner':     { id: 'Desain Banner',     en: 'Banner & Ads',       desc_id: 'Karya banner digital maupun cetak untuk kebutuhan iklan.', desc_en: 'Digital and print banner works for advertising.' },
  'kemasan':    { id: 'Desain Kemasan',    en: 'Product Packaging',  desc_id: 'Desain kemasan produk yang menarik dan fungsional.', desc_en: 'Attractive and functional product packaging designs.' },
  'feed':       { id: 'Desain Feed',       en: 'Feed Design',        desc_id: 'Konten visual untuk platform media sosial.', desc_en: 'Visual content for social media platforms.' },
  'infografis': { id: 'Infografis',        en: 'Infographic',        desc_id: 'Penyampaian informasi secara visual dan informatif.', desc_en: 'Visually informative graphic data presentations.' },
  'editorial':  { id: 'Editorial & Layout',en: 'Editorial & Layout', desc_id: 'Desain tata letak untuk buku, majalah, dan publikasi.', desc_en: 'Layout design for books, magazines, and publications.' },
  'stationery': { id: 'Stationery & Brand',en: 'Stationery & Brand', desc_id: 'Kartu nama, kop surat, dan identitas merek lengkap.', desc_en: 'Business cards, letterheads, and full brand identity.' },
  'lain':       { id: 'Desain Lainnya',    en: 'Other Works',        desc_id: 'Karya desain grafis lainnya di luar kategori di atas.', desc_en: 'Other graphic design works outside the above categories.' },
};

/** Resolve subcategory string ke meta label + desc. */
function resolveMeta(subcategory, lang) {
  const key = (subcategory || '').toLowerCase().trim();
  for (const [k, meta] of Object.entries(SUBCATEGORY_META)) {
    if (key === k || key.includes(k) || k.includes(key)) {
      return {
        label: lang === 'en' ? meta.en : meta.id,
        desc:  lang === 'en' ? meta.desc_en : meta.desc_id,
      };
    }
  }
  return {
    label: subcategory || (lang === 'en' ? 'Other' : 'Desain Lainnya'),
    desc:  '',
  };
}

function getCanonicalSubcategoryKey(subcategory) {
  const s = (subcategory || '').toLowerCase().trim();
  if (s.includes('logo')) return 'logo';
  if (s.includes('banner') || s.includes('iklan')) return 'banner';
  if (s.includes('poster')) return 'poster';
  if (s.includes('kemasan') || s.includes('packaging')) return 'kemasan';
  if (s.includes('feed')) return 'feed';
  if (s.includes('infografis') || s.includes('infographic')) return 'infografis';
  if (s.includes('editorial')) return 'editorial';
  if (s.includes('stationery') || s.includes('brand')) return 'stationery';
  return 'lain';
}

// Urutan prioritas subkategori sesuai permintaan pengguna:
// Desain Feed -> Poster -> Banner -> Kemasan -> Logo -> Lainnya
const SUBCATEGORY_ORDER = ['feed', 'poster', 'banner', 'kemasan', 'logo', 'lain'];

/** Group items by canonical subcategory, sort by newest year first, and order categories. */
function groupBySubcategory(items) {
  const map = new Map();
  items.forEach((item) => {
    const key = getCanonicalSubcategoryKey(item.subcategory);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  });

  // Urutkan grup kategori sesuai urutan: Feed -> Poster -> Banner -> Kemasan -> Logo -> Lainnya
  const sortedEntries = Array.from(map.entries()).sort(([keyA], [keyB]) => {
    const indexA = SUBCATEGORY_ORDER.indexOf(keyA);
    const indexB = SUBCATEGORY_ORDER.indexOf(keyB);
    const posA = indexA === -1 ? 99 : indexA;
    const posB = indexB === -1 ? 99 : indexB;
    return posA - posB;
  });

  return sortedEntries.map(([subcategoryKey, grpItems]) => {
    // Urutkan item dari tahun terbaru ke terlama (2026, 2025, 2024, ...)
    const sortedItems = [...grpItems].sort((a, b) => {
      const yearA = parseInt(a.year, 10) || 0;
      const yearB = parseInt(b.year, 10) || 0;
      if (yearB !== yearA) {
        return yearB - yearA; // descending (terbaru dulu)
      }
      return (b.id || 0) > (a.id || 0) ? 1 : -1;
    });

    return { subcategory: subcategoryKey, items: sortedItems };
  });
}

// ── Custom Hook untuk Menghitung Jumlah Kolom Responsif ──
function useResponsiveColumnCount(isLogo = false) {
  const [colCount, setColCount] = React.useState(5);

  React.useEffect(() => {
    const updateCount = () => {
      const width = window.innerWidth;
      if (width <= 650) {
        setColCount(2); // Mobile: 2 kolom untuk semua
      } else if (width <= 900) {
        setColCount(isLogo ? 3 : 4); // Tablet: 3 (logo) atau 4
      } else {
        setColCount(isLogo ? 4 : 5); // Desktop: 4 (logo) atau 5
      }
    };

    updateCount();
    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, [isLogo]);

  return colCount;
}

// ── Single Image Card — Ringan, stabil, frame rapi ──
function GalleryImageCard({ item, onLoadAspect }) {
  const handleLoad = (e) => {
    if (onLoadAspect && e.target.naturalWidth > 0) {
      const aspect = e.target.naturalHeight / e.target.naturalWidth;
      onLoadAspect(item.id, aspect);
    }
  };

  return (
    <div
      style={{
        borderRadius: '10px',
        overflow: 'hidden',
        background: '#EEF2F8',
        boxShadow: '0 2px 6px rgba(0, 91, 171, 0.08)',
        cursor: 'default',
        userSelect: 'none',
        padding: '3px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '0.65rem',
      }}
    >
      <img
        src={item.image_url}
        alt={item.title || 'Karya Graphic Design'}
        decoding="async"
        onLoad={handleLoad}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          borderRadius: '8px',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

// ── Subcategory Section dengan Greedy Shortest-Column Masonry (Tanpa Ruang Kosong) ──
function SubcategorySection({ subcategory, items, lang }) {
  const meta = resolveMeta(subcategory, lang);
  const isLogo = subcategory === 'logo' || (meta.label && meta.label.toLowerCase().includes('logo'));
  const columnCount = useResponsiveColumnCount(isLogo);
  const [imageHeights, setImageHeights] = React.useState({});

  // Simpan rasio aspek alami gambar saat selesai dimuat
  const handleImageLoad = React.useCallback((id, aspect) => {
    setImageHeights((prev) => {
      if (prev[id] === aspect) return prev;
      return { ...prev, [id]: aspect };
    });
  }, []);

  // Distribusikan gambar:
  // - Baris pertama (index < columnCount): Masuk urut ke kolom 0, 1, 2, ... (mengikuti Aturan 1)
  // - Baris berikutnya: Masuk ke kolom yang saat itu paling pendek (mengisi ruang kosong)
  const columns = React.useMemo(() => {
    const cols = Array.from({ length: columnCount }, () => []);
    const heights = new Array(columnCount).fill(0);

    items.forEach((item, index) => {
      let targetCol;
      if (index < columnCount) {
        // Baris pertama persis urut dari kiri ke kanan
        targetCol = index;
      } else {
        // Cari kolom yang tingginya paling rendah saat ini
        let minHeight = heights[0];
        targetCol = 0;
        for (let c = 1; c < columnCount; c++) {
          if (heights[c] < minHeight) {
            minHeight = heights[c];
            targetCol = c;
          }
        }
      }

      cols[targetCol].push(item);
      // Asumsi rasio tinggi default 1.33 jika belum ter-load
      const itemHeightWeight = imageHeights[item.id] || 1.33;
      heights[targetCol] += itemHeightWeight;
    });

    return cols;
  }, [items, columnCount, imageHeights]);

  return (
    <div style={{ marginBottom: '2.25rem' }}>
      {/* Header subkategori */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        marginBottom: '1rem',
      }}>
        {/* Icon bulat */}
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '999px',
          background: '#005BAB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '2px',
        }}>
          <Palette size={17} color="#FFFFFF" />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h3 style={{
              margin: 0,
              fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
              fontWeight: 800,
              color: '#005BAB',
              lineHeight: 1.25,
            }}>
              {meta.label}
            </h3>
            {/* Badge jumlah karya */}
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 800,
              color: '#005BAB',
              background: '#E8F0FE',
              borderRadius: '999px',
              padding: '0.15rem 0.55rem',
              border: '1.5px solid rgba(0, 91, 171, 0.3)',
              whiteSpace: 'nowrap',
            }}>
              {items.length} {lang === 'en' ? 'works' : 'karya'}
            </span>
          </div>

          {meta.desc && (
            <p style={{
              margin: '0.2rem 0 0 0',
              fontSize: '0.8rem',
              fontWeight: 500,
              color: '#4B6B9A',
              lineHeight: 1.45,
            }}>
              {meta.desc}
            </p>
          )}
        </div>
      </div>

      {/* True Masonry Columns: Aliran Per Baris Rapat Tanpa Ruang Kosong */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
          gap: columnCount === 2 ? '0.5rem' : '0.65rem',
          alignItems: 'start',
        }}
      >
        {columns.map((colItems, colIdx) => (
          <div key={colIdx} style={{ display: 'flex', flexDirection: 'column' }}>
            {colItems.map((item) => (
              <GalleryImageCard key={item.id} item={item} onLoadAspect={handleImageLoad} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main GalleryModal ───────────────────────────────────────────────────────
export default function GalleryModal({ items = [], onClose, onExploreClick }) {
  const { lang } = useLanguage();
  const overlayRef = useRef(null);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Tutup saat klik overlay
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Tutup saat Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Filter STRICT:
  // 1. Khusus Graphic Design: persona 'mgd' ATAU category 'desain-grafis' ATAU subkategori Feed
  //    (selama bukan persona ms atau dpd)
  // 2. subcategory HARUS masuk whitelist (Logo, Banner, Poster, Kemasan, Feed, Lainnya)
  //    → Fotografi, Motion Graphic, Videografi, Film, Mobile, Web, UI/UX = DIEKSKLUSI
  const mgdItems = items.filter((i) => {
    const p = (i.persona || '').trim().toLowerCase();
    const cat = (i.category || '').trim().toLowerCase();
    const sub = (i.subcategory || '').trim().toLowerCase();

    // Jangan masukkan karya persona Multimedia (ms) atau Digital Product Design (dpd)
    if (p === 'ms' || p === 'dpd') return false;

    // Harus persona mgd, atau category desain-grafis, atau subkategori feed
    const isMgd = p === 'mgd' || cat === 'desain-grafis' || sub.includes('feed');
    if (!isMgd) return false;

    return isAllowedSubcategory(i.subcategory);
  });
  const groups = groupBySubcategory(mgdItems);

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 20, 60, 0.72)',
          zIndex: 9000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(0.5rem, 2vw, 1.5rem)',
          overflow: 'hidden',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      >
        {/* Modal Panel — Single unified container dengan maxHeight dan scroll internal */}
        <div
          style={{
            width: '100%',
            maxWidth: '1100px',
            maxHeight: '92vh',
            background: '#FFFFFF',
            borderRadius: '32px',
            boxShadow: '0 24px 80px rgba(0, 36, 100, 0.28)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
            animation: 'galleryModalIn 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* ── Header sticky ── */}
          <div
            className="gallery-modal-header"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              padding: 'clamp(0.9rem, 2.5vw, 1.4rem) clamp(1rem, 3vw, 2rem)',
              borderBottom: '2px solid rgba(0, 91, 171, 0.12)',
              position: 'sticky',
              top: 0,
              background: '#FFFFFF',
              zIndex: 10,
              flexWrap: 'wrap',
            }}
          >
            {/* Left: Icon & Judul */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0, flex: '1 1 auto' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#005BAB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Images size={20} color="#FFFFFF" />
              </div>

              <h2 style={{
                margin: 0,
                fontSize: 'clamp(0.95rem, 2.2vw, 1.4rem)',
                fontWeight: 900,
                color: '#005BAB',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                wordBreak: 'break-word',
              }}>
                {lang === 'en'
                  ? "All Graphic Design Works"
                  : 'Seluruh Karya Graphic Design'}
              </h2>
            </div>

            {/* Right Actions: Tombol Jelajahi Karya + Tombol Close */}
            <div className="gallery-header-actions" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}>
              {onExploreClick && (
                <button
                  type="button"
                  onClick={() => { onClose(); onExploreClick(); }}
                  className="gallery-explore-btn"
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    borderRadius: '999px',
                    background: '#16A34A',
                    color: '#FFFFFF',
                    border: '2px solid #16A34A',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
                    transition: 'all 0.2s ease',
                    textAlign: 'center',
                    lineHeight: 1.3,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#15803D';
                    e.currentTarget.style.borderColor = '#15803D';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#16A34A';
                    e.currentTarget.style.borderColor = '#16A34A';
                  }}
                >
                  <span>{lang === 'en' ? 'Explore Works & Info' : 'Jelajahi Karya Beserta Informasi nya'}</span>
                  <ArrowRight size={15} style={{ flexShrink: 0 }} />
                </button>
              )}

              {/* Tombol Close */}
              <button
                onClick={onClose}
                aria-label="Tutup modal"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '999px',
                  border: '2px solid #005BAB',
                  background: '#FFFFFF',
                  color: '#005BAB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'background 0.18s ease, color 0.18s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#005BAB';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.color = '#005BAB';
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* ── Body (Scrollable dengan Momentum & GPU Acceleration) ── */}
          <div
            className="gallery-modal-body"
            style={{
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              padding: 'clamp(1rem, 2.5vw, 1.5rem) clamp(1.25rem, 3vw, 2rem)',
              flex: 1,
              willChange: 'scroll-position',
            }}
          >
            {mgdItems.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                color: '#4B6B9A',
                fontSize: '1rem',
                fontWeight: 600,
              }}>
                {lang === 'en' ? 'No graphic design works found.' : 'Belum ada karya Graphic Design yang ditemukan.'}
              </div>
            ) : (
              groups.map(({ subcategory, items: grpItems }) => (
                <SubcategorySection
                  key={subcategory}
                  subcategory={subcategory}
                  items={grpItems}
                  lang={lang}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Styles ── */}
      <style>{`
        @keyframes galleryModalIn {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Smooth scrollbar styling untuk modal body */
        .gallery-modal-body::-webkit-scrollbar {
          width: 8px;
        }
        .gallery-modal-body::-webkit-scrollbar-track {
          background: #F1F5F9;
          border-radius: 999px;
        }
        .gallery-modal-body::-webkit-scrollbar-thumb {
          background: #C4D3EA;
          border-radius: 999px;
        }
        .gallery-modal-body::-webkit-scrollbar-thumb:hover {
          background: #005BAB;
        }

        /* Grid Masonry per Baris (Row-first flow: Kolom 1 Baris 1, Kolom 2 Baris 1, ...) */
        .gallery-modal-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 0.65rem;
          align-items: start;
        }

        /* Khusus Desain Logo: 4 Kolom di Desktop */
        @media (min-width: 901px) {
          .gallery-grid-logo {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          }
        }

        /* Tablet: 4 kolom untuk umum, 3 kolom untuk logo */
        @media (max-width: 900px) and (min-width: 651px) {
          .gallery-modal-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
          .gallery-grid-logo {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
        }

        /* Mobile Header Responsive: wrap action button & allow flexible text */
        @media (max-width: 650px) {
          .gallery-modal-header {
            padding: 0.85rem 1rem !important;
            gap: 0.6rem !important;
          }
          .gallery-header-actions {
            width: 100% !important;
            justify-content: space-between !important;
            order: 3 !important;
            margin-top: 0.25rem !important;
          }
          .gallery-explore-btn {
            flex: 1 1 auto !important;
            font-size: 0.76rem !important;
            padding: 0.45rem 0.85rem !important;
            white-space: normal !important;
          }
        }

        /* Tablet kecil & Mobile: SEMUA kategori termasuk Desain Logo menjadi 2 kolom */
        @media (max-width: 650px) {
          .gallery-modal-grid,
          .gallery-grid-logo {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 0.5rem !important;
          }
        }
      `}</style>
    </>
  );
}
