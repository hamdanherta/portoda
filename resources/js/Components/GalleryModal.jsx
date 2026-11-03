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

/** Group items by canonical subcategory, preserve order. */
function groupBySubcategory(items) {
  const map = new Map();
  items.forEach((item) => {
    const key = getCanonicalSubcategoryKey(item.subcategory);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  });
  return Array.from(map.entries()).map(([subcategoryKey, grpItems]) => ({ subcategory: subcategoryKey, items: grpItems }));
}

// ── Single Image Card — Ringan, hardware accelerated, rasio gambar asli ──
function GalleryImageCard({ item }) {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <div
      style={{
        breakInside: 'avoid',
        marginBottom: '0.55rem',
        borderRadius: '10px',
        overflow: 'hidden',
        background: loaded ? 'transparent' : '#E8EEF8',
        boxShadow: '0 2px 6px rgba(0, 91, 171, 0.08)',
        cursor: 'default',
        userSelect: 'none',
        padding: '3px',
        contain: 'paint layout',
        minHeight: loaded ? 'auto' : '110px',
        transition: 'background 0.3s ease',
      }}
    >
      <img
        src={item.image_url}
        alt={item.title || 'Karya Graphic Design'}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          borderRadius: '8px',
          pointerEvents: 'none',
          opacity: loaded ? 1 : 0.85,
          transition: 'opacity 0.25s ease',
          contentVisibility: 'auto',
        }}
      />
    </div>
  );
}

// ── Subcategory Section ─────────────────────────────────────────────────────
function SubcategorySection({ subcategory, items, lang }) {
  const meta = resolveMeta(subcategory, lang);

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

      {/* Image Grid — CSS columns masonry: mengisi ruang, ikuti rasio asli */}
      <div className="gallery-modal-grid">
        {items.map((item) => (
          <GalleryImageCard key={item.id} item={item} />
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

        /* CSS Columns masonry — gambar ikuti rasio asli, tidak ada ruang kosong */
        .gallery-modal-grid {
          column-count: 5;
          column-gap: 0.55rem;
          contain: layout;
        }

        /* Tablet: 4 kolom */
        @media (max-width: 900px) {
          .gallery-modal-grid {
            column-count: 4;
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

        /* Tablet kecil: 3 kolom */
        @media (max-width: 650px) {
          .gallery-modal-grid {
            column-count: 3;
          }
        }

        /* Mobile: 2 kolom */
        @media (max-width: 420px) {
          .gallery-modal-grid {
            column-count: 2;
            column-gap: 0.4rem;
          }
        }
      `}</style>
    </>
  );
}
