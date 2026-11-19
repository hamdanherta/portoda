import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';

// ── Whitelist subkategori yang BOLEH tampil ──────────────────────────────
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
  'logo':       { id: 'Desain Logo',       en: 'Logo Design' },
  'poster':     { id: 'Desain Poster',     en: 'Poster Design' },
  'banner':     { id: 'Desain Banner',     en: 'Banner & Ads' },
  'kemasan':    { id: 'Desain Kemasan',    en: 'Product Packaging' },
  'feed':       { id: 'Desain Feed',       en: 'Feed Design' },
  'infografis': { id: 'Infografis',        en: 'Infographic' },
  'editorial':  { id: 'Editorial & Layout',en: 'Editorial & Layout' },
  'stationery': { id: 'Stationery & Brand',en: 'Stationery & Brand' },
  'lain':       { id: 'Desain Lainnya',    en: 'Other Works' },
};

/** Resolve subcategory string ke meta label */
function resolveMeta(subcategory, lang) {
  const key = (subcategory || '').toLowerCase().trim();
  for (const [k, meta] of Object.entries(SUBCATEGORY_META)) {
    if (key === k || key.includes(k) || k.includes(key)) {
      return {
        label: lang === 'en' ? meta.en : meta.id,
      };
    }
  }
  return {
    label: subcategory || (lang === 'en' ? 'Other' : 'Desain Lainnya'),
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

// Urutan prioritas subkategori:
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
  const [colCount, setColCount] = useState(5);

  useEffect(() => {
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

// ── Single Image Card ──
function GalleryImageCard({ item, onLoadAspect, onSelectWork }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleLoad = (e) => {
    if (onLoadAspect && e.target.naturalWidth > 0) {
      const aspect = e.target.naturalHeight / e.target.naturalWidth;
      onLoadAspect(item.id, aspect);
    }
  };

  const imgSrc = item.image_url || item.cover || item.cover_image || (Array.isArray(item.images) && item.images[0]);

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
        src={imgSrc}
        alt={item.title || 'Karya Graphic Design'}
        decoding="async"
        loading="lazy"
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

// ── Subcategory Section dengan Greedy Shortest-Column Masonry ──
function SubcategorySection({ subcategory, items, lang, onSelectWork }) {
  const meta = resolveMeta(subcategory, lang);
  const isLogo = subcategory === 'logo' || (meta.label && meta.label.toLowerCase().includes('logo'));
  const columnCount = useResponsiveColumnCount(isLogo);
  const [imageHeights, setImageHeights] = useState({});

  // Simpan rasio aspek alami gambar saat selesai dimuat
  const handleImageLoad = useCallback((id, aspect) => {
    setImageHeights((prev) => {
      if (prev[id] === aspect) return prev;
      return { ...prev, [id]: aspect };
    });
  }, []);

  // Distribusikan gambar:
  // - Baris pertama (index < columnCount): Masuk urut ke kolom 0, 1, 2, ...
  // - Baris berikutnya: Masuk ke kolom yang saat itu paling pendek (tanpa ruang kosong)
  const columns = useMemo(() => {
    const cols = Array.from({ length: columnCount }, () => []);
    const heights = new Array(columnCount).fill(0);

    items.forEach((item, index) => {
      let targetCol;
      if (index < columnCount) {
        targetCol = index;
      } else {
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
      const itemHeightWeight = imageHeights[item.id] || 1.33;
      heights[targetCol] += itemHeightWeight;
    });

    return cols;
  }, [items, columnCount, imageHeights]);

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      {/* Header subkategori — Judul + Garis Horizontal + Badge Kuning */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        marginBottom: '1.15rem',
        width: '100%',
      }}>
        <h4 style={{
          margin: 0,
          fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
          fontWeight: 700,
          color: '#005BAB',
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
        }}>
          {meta.label}
        </h4>

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

      {/* True Masonry Columns */}
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

// ── Main DesignWorksSection Component ──
export default function DesignWorksSection({ items = [], onSelectWork }) {
  const { lang } = useLanguage();

  // Filter STRICT:
  // 1. Khusus Graphic Design: persona 'mgd' ATAU category 'desain-grafis' ATAU subkategori Feed
  //    (selama bukan persona ms atau dpd)
  // 2. subcategory HARUS masuk whitelist (Logo, Banner, Poster, Kemasan, Feed, Lainnya)
  const mgdItems = useMemo(() => {
    return items.filter((i) => {
      const p = (i.persona || '').trim().toLowerCase();
      const cat = (i.category || '').trim().toLowerCase();
      const sub = (i.subcategory || '').trim().toLowerCase();

      if (p === 'ms' || p === 'dpd') return false;

      const isMgd = p === 'mgd' || cat === 'desain-grafis' || sub.includes('feed');
      if (!isMgd) return false;

      return isAllowedSubcategory(i.subcategory);
    });
  }, [items]);

  const groups = useMemo(() => groupBySubcategory(mgdItems), [mgdItems]);

  return (
    <div
      id="seluruh-karya-desain"
      style={{
        marginTop: '2.5rem',
        paddingTop: '2.25rem',
        borderTop: '2px solid rgba(0, 91, 171, 0.15)',
        position: 'relative',
        zIndex: 1,
        width: '100%',
        scrollMarginTop: '80px',
      }}
    >
      {/* Header Judul Bagian Utama */}
      <div style={{
        marginBottom: '1.5rem',
        marginLeft: 'clamp(0.5rem, 1.2vw, 1rem)',
        marginRight: 'clamp(0.5rem, 1.2vw, 1rem)',
      }}>
        <h3 style={{
          fontSize: '1.4rem',
          fontWeight: 800,
          color: '#005BAB',
          margin: 0,
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
        }}>
          {lang === 'en' ? 'All Design Works' : 'Seluruh Karya Desain'}
        </h3>
      </div>

      {/* Konten Subkategori & Karya */}
      {mgdItems.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '2.5rem 1rem',
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
  );
}
