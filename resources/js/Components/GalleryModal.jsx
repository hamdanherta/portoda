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

// ── Single Image Card — rasio mengikuti gambar asli, no fixed aspect-ratio ──
function GalleryImageCard({ item }) {
  return (
    <div
      style={{
        breakInside: 'avoid',          /* jangan potong di tengah kolom */
        marginBottom: '0.55rem',
        borderRadius: '10px',
        overflow: 'hidden',
        background: '#EEF2F8',
        boxShadow: '0 2px 6px rgba(0, 91, 171, 0.08)',
        cursor: 'default',
        userSelect: 'none',
        padding: '3px',                /* padding tipis di sekeliling gambar */
      }}
    >
      <WatermarkedImage
        src={item.image_url}
        alt={item.title || 'Karya Graphic Design'}
        objectFit="cover"
        style={{
          width: '100%',
          height: 'auto',              /* ikuti rasio asli gambar */
          display: 'block',
          borderRadius: '8px',
          pointerEvents: 'none',
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
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: 'clamp(0.5rem, 2vw, 1.5rem)',
          overflowY: 'auto',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      >
        {/* Modal Panel */}
        <div
          style={{
            width: '100%',
            maxWidth: '1100px',
            background: '#FFFFFF',
            borderRadius: '32px',
            boxShadow: '0 24px 80px rgba(0, 36, 100, 0.28)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            marginTop: 'clamp(0.5rem, 2vw, 1rem)',
            marginBottom: 'clamp(0.5rem, 2vw, 2rem)',
            animation: 'galleryModalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* ── Header sticky ── */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: 'clamp(1.1rem, 2.5vw, 1.75rem) clamp(1.25rem, 3vw, 2rem)',
            borderBottom: '2px solid rgba(0, 91, 171, 0.12)',
            position: 'sticky',
            top: 0,
            background: '#FFFFFF',
            zIndex: 10,
          }}>
            {/* Icon */}
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: '#005BAB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Images size={22} color="#FFFFFF" />
            </div>

            {/* Judul */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{
                margin: 0,
                fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                fontWeight: 900,
                color: '#005BAB',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}>
                {lang === 'en'
                  ? "Hamdani's Graphic Design Works"
                  : 'Seluruh Karya Graphic Design Hamdani'}
              </h2>
              {/* <p style={{
                margin: '0.2rem 0 0 0',
                fontSize: '0.78rem',
                fontWeight: 500,
                color: '#4B6B9A',
              }}>
                {mgdItems.length} {lang === 'en' ? 'works in' : 'karya dalam'} {groups.length} {lang === 'en' ? 'categories' : 'subkategori'}
              </p> */}
            </div>

            {/* Tombol Close */}
            <button
              onClick={onClose}
              aria-label="Tutup modal"
              style={{
                width: '40px',
                height: '40px',
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
              <X size={19} />
            </button>
          </div>

          {/* ── Banner Penjelasan ── */}
          <div style={{
            margin: 'clamp(1rem, 2.5vw, 1.5rem) clamp(1.25rem, 3vw, 2rem) 0',
            padding: 'clamp(0.85rem, 2vw, 1.2rem) clamp(1rem, 2.5vw, 1.5rem)',
            background: 'linear-gradient(135deg, #EBF2FF 0%, #F0F6FF 100%)',
            borderRadius: '18px',
            border: '1.5px solid rgba(0, 91, 171, 0.2)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem',
          }}>
            {/* Info icon */}
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#005BAB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '1px',
            }}>
              <Info size={18} color="#FFFFFF" />
            </div>

            <div style={{ flex: 1 }}>
              <p style={{
                margin: 0,
                fontSize: 'clamp(0.78rem, 1.5vw, 0.88rem)',
                fontWeight: 600,
                color: '#005BAB',
                lineHeight: 1.6,
              }}>
                {lang === 'en'
                  ? 'This is a quick display of all Hamdani\'s Graphic Design works. There is no detail information for each work here. If you want to see the complete information for each work, visit:'
                  : 'Ini Merupakan Display Cepat Seluruh Karya Graphic Design Hamdani. Tidak ada Informasi tentang Setiap Karya di sini. Jika Anda ingin melihat Informasi Lengkap setiap Karya, Kunjungi:'}
              </p>

              {/* Tombol Jelajahi Karya */}
              <button
                onClick={() => { onClose(); if (onExploreClick) onExploreClick(); }}
                style={{
                  marginTop: '0.65rem',
                  padding: '0.45rem 1.1rem',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  borderRadius: '999px',
                  background: '#005BAB',
                  color: '#FFFFFF',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  transition: 'opacity 0.18s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <ArrowRight size={15} />
                {lang === 'en' ? 'Explore Works' : 'Jelajahi Karya'}
              </button>
            </div>
          </div>

          {/* ── Body (Scrollable) ── */}
          <div style={{
            overflowY: 'auto',
            padding: 'clamp(1.25rem, 3vw, 1.75rem) clamp(1.25rem, 3vw, 2rem)',
            flex: 1,
          }}>
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

          {/* ── Footer ── */}
          <div style={{
            borderTop: '2px solid rgba(0, 91, 171, 0.1)',
            padding: '0.9rem clamp(1.25rem, 3vw, 2rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            background: '#F8FAFF',
          }}>
            <button
              onClick={onClose}
              style={{
                padding: '0.5rem 1.3rem',
                fontSize: '0.85rem',
                fontWeight: 800,
                borderRadius: '999px',
                background: '#005BAB',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'opacity 0.18s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <X size={15} />
              {lang === 'en' ? 'Close Gallery' : 'Tutup Galeri'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Styles ── */}
      <style>{`
        @keyframes galleryModalIn {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }

        /* CSS Columns masonry — gambar ikuti rasio asli, tidak ada ruang kosong */
        .gallery-modal-grid {
          column-count: 5;
          column-gap: 0.55rem;
        }

        /* Tablet: 4 kolom */
        @media (max-width: 900px) {
          .gallery-modal-grid {
            column-count: 4;
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
