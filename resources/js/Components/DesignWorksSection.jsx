import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, X, Info, Palette, Video, Smartphone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// ── Whitelist Subkategori Graphic Design (MGD) ──────────────────────────────
const ALLOWED_MGD_KEYWORDS = [
  'logo',
  'banner',
  'poster',
  'kemasan',
  'packaging',
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

function isAllowedMgdSubcategory(subcategory) {
  const key = (subcategory || '').toLowerCase().trim();
  if (!key || key === '') return true;
  return ALLOWED_MGD_KEYWORDS.some((k) => key.includes(k));
}

// ── Definisi Subkategori per Persona (Hanya sub-sub kategori, tanpa "Semua") ──
const PERSONA_SUBCATEGORIES = {
  mgd: [
    { key: 'feed',    id: 'Desain Feed',    en: 'Feed Design' },
    { key: 'poster',  id: 'Desain Poster',  en: 'Poster Design' },
    { key: 'banner',  id: 'Desain Banner',  en: 'Banner & Ads' },
    { key: 'kemasan', id: 'Desain Kemasan', en: 'Product Packaging' },
    { key: 'logo',    id: 'Desain Logo',    en: 'Logo Design' },
    { key: 'lain',    id: 'Desain Lainnya', en: 'Other Works' },
  ],
  ms: [
    { key: 'foto',   id: 'Fotografi',      en: 'Photography' },
    { key: 'video',  id: 'Videografi',     en: 'Videography' },
    { key: 'motion', id: 'Motion Graphic', en: 'Motion Graphic' },
    { key: 'film',   id: 'Film & Sinema',  en: 'Film & Cinema' },
  ],
  dpd: [
    { key: 'uiux',   id: 'UI/UX Design',   en: 'UI/UX Design' },
    { key: 'mobile', id: 'Mobile App',     en: 'Mobile App' },
    { key: 'web',    id: 'Web Design',     en: 'Web Design' },
  ],
};

function getCanonicalSubcategoryKey(subcategory, persona = 'mgd') {
  const s = (subcategory || '').toLowerCase().trim();
  if (persona === 'ms') {
    if (s.includes('foto') || s.includes('photo')) return 'foto';
    if (s.includes('video')) return 'video';
    if (s.includes('motion')) return 'motion';
    if (s.includes('film')) return 'film';
    return 'foto';
  }
  if (persona === 'dpd') {
    if (s.includes('mobile')) return 'mobile';
    if (s.includes('web')) return 'web';
    return 'uiux';
  }
  // MGD
  if (s.includes('logo')) return 'logo';
  if (s.includes('banner') || s.includes('iklan')) return 'banner';
  if (s.includes('poster')) return 'poster';
  if (s.includes('kemasan') || s.includes('packaging')) return 'kemasan';
  if (s.includes('feed')) return 'feed';
  return 'lain';
}

// ── Custom Hook untuk Menghitung Jumlah Kolom Responsif ──
function useResponsiveColumnCount(isLogo = false) {
  const [colCount, setColCount] = useState(5);

  useEffect(() => {
    const updateCount = () => {
      const width = window.innerWidth;
      if (width <= 650) {
        setColCount(2); // Mobile: 2 kolom
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
        alt={item.title || 'Karya Portofolio'}
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

// ── Main DesignWorksSection Component ──
export default function DesignWorksSection({ items = [], onSelectWork, persona = 'mgd' }) {
  const { lang } = useLanguage();

  // Daftar subkategori sesuai persona aktif
  const availableSubcategories = useMemo(() => {
    return PERSONA_SUBCATEGORIES[persona] || PERSONA_SUBCATEGORIES.mgd;
  }, [persona]);

  // Default kategori adalah 'feed' untuk MGD, atau elemen pertama untuk persona lainnya
  const [activeSubcategory, setActiveSubcategory] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');

  // Sinkronisasi kategori default saat persona berganti
  useEffect(() => {
    if (persona === 'mgd') {
      setActiveSubcategory('feed');
    } else if (persona === 'ms') {
      setActiveSubcategory('foto');
    } else if (persona === 'dpd') {
      setActiveSubcategory('uiux');
    }
    setSearchQuery('');
  }, [persona]);

  // Filter karya sesuai persona & whitelist
  const personaItems = useMemo(() => {
    return items.filter((i) => {
      const p = (i.persona || '').trim().toLowerCase();
      const cat = (i.category || '').trim().toLowerCase();
      const sub = (i.subcategory || '').trim().toLowerCase();

      if (persona === 'ms') {
        return p === 'ms' || cat === 'multimedia' || sub.includes('foto') || sub.includes('video');
      }
      if (persona === 'dpd') {
        return p === 'dpd' || cat === 'aplikasi' || sub.includes('ui') || sub.includes('app');
      }

      // Persona MGD (Graphic Design)
      if (p === 'ms' || p === 'dpd') return false;
      const isMgd = p === 'mgd' || cat === 'desain-grafis' || sub.includes('feed');
      if (!isMgd) return false;

      return isAllowedMgdSubcategory(i.subcategory);
    });
  }, [items, persona]);

  // Ambil karya untuk subkategori yang sedang di-select
  const subcategoryItems = useMemo(() => {
    const list = personaItems.filter((item) => {
      const key = getCanonicalSubcategoryKey(item.subcategory, persona);
      return key === activeSubcategory;
    });

    // Urutkan tahun terbaru
    return list.sort((a, b) => {
      const yearA = parseInt(a.year, 10) || 0;
      const yearB = parseInt(b.year, 10) || 0;
      if (yearB !== yearA) return yearB - yearA;
      return (b.id || 0) > (a.id || 0) ? 1 : -1;
    });
  }, [personaItems, activeSubcategory, persona]);

  // Filter karya berdasarkan kata kunci pencarian
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return subcategoryItems;

    return subcategoryItems.filter((item) => {
      const title = (item.title || '').toLowerCase();
      const desc = (item.description || '').toLowerCase();
      const client = (item.client || '').toLowerCase();
      const institution = (item.institution || '').toLowerCase();
      const year = String(item.year || '');
      return (
        title.includes(q) ||
        desc.includes(q) ||
        client.includes(q) ||
        institution.includes(q) ||
        year.includes(q)
      );
    });
  }, [subcategoryItems, searchQuery]);

  // Meta label subkategori aktif
  const currentSubcatMeta = useMemo(() => {
    const found = availableSubcategories.find((s) => s.key === activeSubcategory);
    if (found) {
      return { label: lang === 'en' ? found.en : found.id };
    }
    return { label: lang === 'en' ? 'Works' : 'Karya' };
  }, [availableSubcategories, activeSubcategory, lang]);

  // Icon & Title Judul Utama sesuai persona
  const sectionTitle = useMemo(() => {
    if (persona === 'ms') {
      return lang === 'en' ? 'All Multimedia Works' : 'Seluruh Karya Multimedia';
    }
    if (persona === 'dpd') {
      return lang === 'en' ? 'All Application Works' : 'Seluruh Karya Aplikasi';
    }
    return lang === 'en' ? 'All Design Works' : 'Seluruh Karya Desain';
  }, [persona, lang]);

  const SectionIcon = useMemo(() => {
    if (persona === 'ms') return Video;
    if (persona === 'dpd') return Smartphone;
    return Palette;
  }, [persona]);

  // Masonry calculation untuk subkategori aktif
  const isLogo = activeSubcategory === 'logo';
  const columnCount = useResponsiveColumnCount(isLogo);
  const [imageHeights, setImageHeights] = useState({});

  const handleImageLoad = useCallback((id, aspect) => {
    setImageHeights((prev) => {
      if (prev[id] === aspect) return prev;
      return { ...prev, [id]: aspect };
    });
  }, []);

  const columns = useMemo(() => {
    const cols = Array.from({ length: columnCount }, () => []);
    const heights = new Array(columnCount).fill(0);

    filteredItems.forEach((item, index) => {
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
  }, [filteredItems, columnCount, imageHeights]);

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
        paddingLeft: 'clamp(0.5rem, 1.2vw, 1rem)',
        paddingRight: 'clamp(0.5rem, 1.2vw, 1rem)',
        boxSizing: 'border-box',
        scrollMarginTop: '80px',
      }}
    >
      {/* ── Header Judul Bagian Utama dengan Icon Minimalist Modern ── */}
      <div style={{
        marginBottom: '1.4rem',
      }}>
        <h3 style={{
          fontSize: '1.4rem',
          fontWeight: 800,
          color: '#005BAB',
          margin: 0,
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.65rem',
        }}>
          <SectionIcon size={24} strokeWidth={2.4} style={{ color: '#005BAB', flexShrink: 0 }} />
          <span>{sectionTitle}</span>
        </h3>
      </div>

      {/* ── Toolbar: Search Bar Compact + Sub-Sub Kategori Pills ── */}
      <div style={{
        marginBottom: '1.6rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
      }}>
        {/* Kolom Search Karya Desain (Ukuran Pas & Compact) */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
          <Search
            size={18}
            strokeWidth={2.4}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#005BAB',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === 'en'
                ? `Search in ${currentSubcatMeta.label}...`
                : `Cari di ${currentSubcatMeta.label}...`
            }
            style={{
              width: '100%',
              height: '42px',
              paddingLeft: '2.75rem',
              paddingRight: searchQuery ? '2.5rem' : '1.25rem',
              borderRadius: '999px',
              border: '2px solid #005BAB',
              background: '#FFFFFF',
              color: '#005BAB',
              fontWeight: 700,
              fontSize: '0.9rem',
              boxSizing: 'border-box',
              boxShadow: '0 2px 8px rgba(0, 91, 171, 0.05)',
              outline: 'none',
              transition: 'box-shadow 0.18s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 91, 171, 0.18)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 91, 171, 0.05)';
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              title="Hapus pencarian"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#FFF3DD',
                border: '1.5px solid #005BAB',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#005BAB',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <X size={13} strokeWidth={2.6} />
            </button>
          )}
        </div>

        {/* Sub-Sub Kategori Pills (Satu-satunya selector kategori) */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          {availableSubcategories.map((sub) => {
            const isActive = activeSubcategory === sub.key;
            return (
              <button
                key={sub.key}
                onClick={() => setActiveSubcategory(sub.key)}
                style={{
                  padding: '0.42rem 1.15rem',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  border: '1.5px solid #005BAB',
                  background: isActive ? '#005BAB' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#005BAB',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  boxShadow: isActive
                    ? '0 4px 14px rgba(0, 91, 171, 0.28)'
                    : '0 2px 6px rgba(0, 91, 171, 0.04)',
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  whiteSpace: 'nowrap',
                }}
              >
                {lang === 'en' ? sub.en : sub.id}
              </button>
            );
          })}
        </div>

        {/* Baris 3: Tulisan Kecil: "Klik Karya mana saja untuk melihat Detail Karya." */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          fontSize: '0.82rem',
          fontWeight: 600,
          color: '#005BAB',
          opacity: 0.85,
          marginTop: '-0.1rem',
        }}>
          <Info size={15} strokeWidth={2.2} style={{ flexShrink: 0, color: '#005BAB' }} />
          <span>
            {lang === 'en'
              ? 'Click on any work to view work details.'
              : 'Klik Karya mana saja untuk melihat Detail Karya.'}
          </span>
        </div>
      </div>

      {/* ── Subkategori Konten yang Terpilih Saja yang Muncul ── */}
      <div style={{ marginBottom: '1.5rem' }}>
        {/* Header Subkategori (Judul + Garis Horizontal + Badge Kuning Total Karya) */}
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
            {currentSubcatMeta.label}
          </h4>

          {/* Garis Horizontal Penghubung */}
          <div style={{
            flex: 1,
            height: '1.5px',
            background: '#005BAB',
            opacity: 0.65,
          }} />

          {/* Badge Jumlah Karya Warna Kuning */}
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
            {filteredItems.length} {lang === 'en' ? (filteredItems.length === 1 ? 'Work' : 'Works') : 'Karya'}
          </span>
        </div>

        {/* Masonry Grid Karya */}
        {filteredItems.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1.5rem',
            color: '#005BAB',
            background: '#F0F5FA',
            borderRadius: '20px',
            marginTop: '0.75rem',
          }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.96rem' }}>
              {searchQuery
                ? (lang === 'en'
                    ? `No design works found in "${currentSubcatMeta.label}" matching "${searchQuery}".`
                    : `Tidak ada karya desain pada "${currentSubcatMeta.label}" yang cocok dengan "${searchQuery}".`)
                : (lang === 'en'
                    ? `No works found in "${currentSubcatMeta.label}".`
                    : `Belum ada karya untuk kategori "${currentSubcatMeta.label}".`)}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  marginTop: '0.85rem',
                  padding: '0.45rem 1.2rem',
                  borderRadius: '999px',
                  background: '#005BAB',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  transition: 'opacity 0.18s ease',
                }}
              >
                {lang === 'en' ? 'Reset Search' : 'Reset Pencarian'}
              </button>
            )}
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
