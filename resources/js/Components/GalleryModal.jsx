import React, { useEffect, useRef } from 'react';
import { X, Info } from 'lucide-react';
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

// ── Single Image Card — Ringan, stabil, frame rapi, interaktif klik modal detail ──
function GalleryImageCard({ item, onLoadAspect, onSelectWork }) {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleLoad = (e) => {
    if (onLoadAspect && e.target.naturalWidth > 0) {
      const aspect = e.target.naturalHeight / e.target.naturalWidth;
      onLoadAspect(item.id, aspect);
    }
  };

  return (
    <div
      onClick={() => onSelectWork && onSelectWork(item)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onSelectWork) {
          e.preventDefault();
          onSelectWork(item);
        }
      }}
      title={`Lihat detail: ${item.title || 'Karya'}`}
      style={{
        borderRadius: '10px',
        overflow: 'hidden',
        background: '#EEF2F8',
        boxShadow: isHovered
          ? '0 6px 18px rgba(0, 91, 171, 0.28)'
          : '0 2px 6px rgba(0, 91, 171, 0.08)',
        border: isHovered ? '2px solid #005BAB' : '2px solid transparent',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        cursor: 'pointer',
        userSelect: 'none',
        padding: '3px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '0.65rem',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
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
          borderRadius: '7px',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

// ── Subcategory Section dengan Greedy Shortest-Column Masonry (Tanpa Ruang Kosong) ──
function SubcategorySection({ subcategory, items, lang, onSelectWork }) {
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
      {/* Header subkategori — Sesuai Desain Referensi (Judul + Garis Horizontal + Badge Kuning) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        marginBottom: '1.15rem',
        width: '100%',
      }}>
        <h3 style={{
          margin: 0,
          fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
          fontWeight: 700,
          color: '#005BAB',
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
        }}>
          {meta.label}
        </h3>

        {/* Garis Horizontal Penghubung */}
        <div style={{
          flex: 1,
          height: '1.5px',
          background: '#005BAB',
          opacity: 0.65,
        }} />

        {/* Badge jumlah karya warna kuning */}
        <span style={{
          fontSize: '0.84rem',
          fontWeight: 800,
          color: '#005BAB',
          background: '#FFF455',
          borderRadius: '999px',
          padding: '0.3rem 0.95rem',
          border: 'none',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
          letterSpacing: '-0.01em',
        }}>
          {items.length} {lang === 'en' ? (items.length === 1 ? 'Work' : 'Works') : 'Karya'}
        </span>
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
              <GalleryImageCard
                key={item.id}
                item={item}
                onLoadAspect={handleImageLoad}
                onSelectWork={onSelectWork}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main GalleryModal ───────────────────────────────────────────────────────
export default function GalleryModal({ items = [], onClose, onSelectWork }) {
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
        {/* Modal Panel Container — Persis 100% Desain Referensi */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="herta-card gallery-modal-card animate-fade-in modal-no-scrollbar"
          style={{
            width: '100%',
            maxWidth: '1100px',
            maxHeight: 'min(92vh, 92dvh)',
            overflowY: 'auto',
            background: '#FFFFFF',
            borderRadius: '36px',
            border: 'none',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.28)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            padding: '1.85rem 2rem 2.25rem',
            animation: 'galleryModalIn 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* Tombol Close Merah Bulat di Pojok Kanan Atas */}
          <button
            onClick={onClose}
            aria-label="Tutup modal"
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              zIndex: 30,
              background: '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.45)',
              transition: 'transform 0.18s ease, background 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08)';
              e.currentTarget.style.background = '#DC2626';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = '#EF4444';
            }}
            title="Tutup (ESC)"
          >
            <X size={18} strokeWidth={2.8} />
          </button>

          {/* Header Judul Modal — Persis Referensi */}
          <div style={{ marginBottom: '1.5rem', paddingRight: '3.5rem' }}>
            <h2 style={{
              fontSize: '1.65rem',
              fontWeight: 800,
              color: '#005BAB',
              lineHeight: 1.25,
              margin: 0,
              letterSpacing: '-0.02em',
            }}>
              {lang === 'en' ? 'All Design Works' : 'Seluruh Karya Desain'}
            </h2>
          </div>

          {/* Konten Subkategori & Karya */}
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
                onSelectWork={onSelectWork}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Styles ── */}
      <style>{`
        @keyframes galleryModalIn {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Modal card scrollbar hidden */
        .gallery-modal-card::-webkit-scrollbar {
          display: none;
        }

        /* Responsive Mobile View — Extra padding-top agar judul & konten tidak menabrak tombol close */
        @media (max-width: 768px) {
          .gallery-modal-card {
            padding-top: 2.25rem !important;
            padding-left: 1.15rem !important;
            padding-right: 1.15rem !important;
            padding-bottom: 2rem !important;
            border-radius: 32px !important;
          }
        }
      `}</style>
    </>
  );
}
