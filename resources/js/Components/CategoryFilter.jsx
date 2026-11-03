import React, { useEffect } from 'react';
import { Check, Search, X, Layers, Images } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePersona } from '../context/PersonaContext';

export default function CategoryFilter({ activeCategory, setActiveCategory, activeSubcategory, setActiveSubcategory, searchQuery = '', setSearchQuery, itemCount, onOpenGallery }) {
  const { lang, t } = useLanguage();
  const { persona } = usePersona();

  const isMgd = persona === 'mgd';

  useEffect(() => {
    let targetCat = 'desain-grafis';
    if (persona === 'ms') {
      targetCat = 'multimedia';
    } else if (persona === 'dpd') {
      targetCat = 'aplikasi';
    }

    if (activeCategory !== targetCat) {
      setActiveCategory(targetCat);
      setActiveSubcategory('all');
    }
  }, [persona]);

  const personaCategoryMap = {
    mgd: 'desain-grafis',
    ms: 'multimedia',
    dpd: 'aplikasi'
  };

  const currentCategory = personaCategoryMap[persona] || 'desain-grafis';

  const subcategoryMap = {
    'desain-grafis': lang === 'en' 
      ? ['All Subcategories', 'Logo', 'Poster', 'Banner', 'Packaging', 'Feed', 'Others'] 
      : ['Semua', 'Logo', 'Poster', 'Banner', 'Kemasan', 'Feed', 'Lainnya'],
    'multimedia': lang === 'en' 
      ? ['All Subcategories', 'Photography', 'Videography', 'Motion Graphic', 'Film'] 
      : ['Semua', 'Fotografi', 'Videografi', 'Motion Graphic', 'Film'],
    'aplikasi': lang === 'en' 
      ? ['All Subcategories', 'UI/UX', 'Mobile App', 'Web App'] 
      : ['Semua', 'UI/UX', 'Mobile App', 'Web App']
  };

  const defaultSubAll = lang === 'en' ? 'All Subcategories' : 'Semua';
  const availableSubcategories = subcategoryMap[currentCategory] || [defaultSubAll];

  return (
    <div className="reveal-on-scroll" id="gallery-section" style={{ width: '100%', marginBottom: '1.75rem', position: 'relative', zIndex: 10 }}>
      {/* Search Input Bar (Secukupnya, centered with maxWidth 480px) */}
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#005BAB' }} />
          <input
            type="text"
            placeholder={t('filter_search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            className="form-input"
            style={{
              paddingLeft: '3rem',
              paddingRight: searchQuery ? '3rem' : '1rem',
              height: '50px',
              fontSize: '0.96rem',
              borderRadius: 'var(--radius-pill)',
              background: '#FFFFFF',
              border: '2.5px solid #005BAB',
              color: '#005BAB',
              fontWeight: 700,
              width: '100%',
              boxSizing: 'border-box',
              boxShadow: '0 4px 14px rgba(0, 91, 171, 0.08)'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery && setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#FFF3DD',
                border: '1.5px solid #005BAB',
                borderRadius: '999px',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#005BAB',
                cursor: 'pointer'
              }}
              title="Hapus kata kunci pencarian"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Main Section Heading */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.85rem',
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#005BAB', textAlign: 'center', letterSpacing: '-0.02em' }}>
            {t('filter_heading')}
          </h2>
        </div>

        {/* Khusus Persona Graphic Design: Button Akses Cepat Seluruh Galeri + Teks Penjelasan Perbedaan */}
        {persona === 'mgd' && onOpenGallery && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            width: '100%',
            padding: '0.9rem 1.4rem',
            borderRadius: '24px',
            boxShadow: '0 4px 14px rgba(22, 163, 74, 0.08)',
            marginBottom: '0.4rem',
            boxSizing: 'border-box'
          }}>
            <button
              type="button"
              onClick={onOpenGallery}
              style={{
                padding: '0.6rem 1.45rem',
                fontSize: '0.9rem',
                fontWeight: 800,
                borderRadius: '999px',
                background: '#16A34A',
                color: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                animation: 'pulseGreenFilter 3s ease-in-out infinite',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.animationPlayState = 'paused';
                e.currentTarget.style.background = '#15803D';
                e.currentTarget.style.borderColor = '#15803D';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.animationPlayState = 'running';
                e.currentTarget.style.background = '#16A34A';
                e.currentTarget.style.borderColor = '#16A34A';
              }}
            >
              <Images size={17} style={{ flexShrink: 0 }} />
              <span>{lang === 'en' ? 'View All Design Works' : 'Lihat Semua Karya Desain'}</span>
            </button>

            <p style={{
              margin: 8,
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#005BAB',
              lineHeight: 1.5,
              textAlign: 'center',
              opacity: 0.95
            }}>
              {lang === 'en' ? (
                <>
                  <span style={{ fontWeight: 600, color: '#005BAB' }}>"View All Design Works"</span>{' '}
                  opens an instant, compact visual gallery of all graphics without text.{' '}
                  <span style={{ fontWeight: 600, color: '#005BAB' }}>"Explore Works"</span>{' '}
                  below lets you filter by category and read detailed case studies, tools, and project stories.
                </>
              ) : (
                <>
                  
                  Tombol <span style={{ fontWeight: 600, color: '#005BAB' }}>"Lihat Semua Karya Desain"</span>{' '}
                  menampilkan display visual cepat seluruh karya dalam bentuk galeri gambar tanpa teks.{' '}
                  Sedangkan daftar <span style={{ fontWeight: 600, color: '#005BAB' }}>"Jelajahi Portofolio"</span>{' '}
                  di bawah ini menampilkan informasi lengkap setiap karya seperti tools, tahun, klien, dan deskripsi detail.
                </>
              )}
            </p>
          </div>
        )}

        {/* Directly Render Subcategory Pills for Active Persona */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginTop: '0.25rem'
        }}>
          {availableSubcategories.map((sub) => {
            const isSubAll = sub === 'Semua' || sub === 'All Subcategories';
            const isSubActive = (isSubAll && activeSubcategory === 'all') || activeSubcategory === sub;
            return (
              <button
                key={sub}
                onClick={() => setActiveSubcategory(isSubAll ? 'all' : sub)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 1.05rem',
                  borderRadius: '999px',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  color: isSubActive ? '#FFFFFF' : '#005BAB',
                  background: isSubActive ? '#005BAB' : '#FFFFFF',
                  border: '2.5px solid #005BAB',
                  boxShadow: isSubActive ? '0 4px 12px rgba(0, 91, 171, 0.25)' : 'none',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                {isSubActive && <Check size={15} />}
                <span>{sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes pulseGreenFilter {
          0%, 100% {
            background-color: #16A34A;
            border-color: #16A34A;
            box-shadow: 0 4px 14px rgba(22, 163, 74, 0.28);
            transform: translateY(0) scale(1);
          }
          50% {
            background-color: #22C55E;
            border-color: #16A34A;
            box-shadow: 0 8px 22px rgba(34, 197, 94, 0.45);
            transform: translateY(-2px) scale(1.02);
          }
        }
      `}</style>
    </div>
  );
}
