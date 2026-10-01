import React, { useEffect } from 'react';
import { Grid, Image, Video, Smartphone, Check, Search, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePersona } from '../context/PersonaContext';

export default function CategoryFilter({ activeCategory, setActiveCategory, activeSubcategory, setActiveSubcategory, searchQuery = '', setSearchQuery, itemCount }) {
  const { lang, t } = useLanguage();
  const { persona } = usePersona();

  const isMgd = persona === 'mgd';

  const allCategories = [
    { id: 'all', label: t('cat_all'), icon: Grid },
    { id: 'desain-grafis', label: t('cat_grafis'), icon: Image },
    { id: 'multimedia', label: t('cat_multimedia'), icon: Video },
    { id: 'aplikasi', label: t('cat_aplikasi'), icon: Smartphone }
  ];

  const categories = isMgd
    ? allCategories.filter(c => c.id === 'all' || c.id === 'desain-grafis' || c.id === 'multimedia')
    : allCategories.filter(c => c.id === 'aplikasi');

  useEffect(() => {
    if (isMgd && activeCategory === 'aplikasi') {
      setActiveCategory('all');
      setActiveSubcategory('all');
    } else if (!isMgd && activeCategory !== 'aplikasi') {
      setActiveCategory('aplikasi');
      setActiveSubcategory('all');
    }
  }, [persona, activeCategory, isMgd]);

  const subcategoryMap = {
    'all': lang === 'en' ? ['All Subcategories'] : ['Semua'],
    'desain-grafis': lang === 'en' 
      ? ['All Subcategories', 'Logo Design', 'Poster', 'Banner', 'Packaging', 'Others'] 
      : ['Semua', 'Desain Logo', 'Poster', 'Banner', 'Kemasan', 'Lainnya'],
    'multimedia': lang === 'en' 
      ? ['All Subcategories', 'Photography', 'Videography', 'Motion Graphic', 'Film'] 
      : ['Semua', 'Fotografi', 'Videografi', 'Motion Graphic', 'Film'],
    'aplikasi': lang === 'en' 
      ? ['All Subcategories', 'UI/UX', 'Mobile App', 'Web App'] 
      : ['Semua', 'UI/UX', 'Mobile App', 'Web App']
  };

  const defaultSubAll = lang === 'en' ? 'All Subcategories' : 'Semua';
  const availableSubcategories = subcategoryMap[activeCategory] || [defaultSubAll];

  const handleMainCategoryChange = (catId) => {
    setActiveCategory(catId);
    setActiveSubcategory('all');
  };

  return (
    <div className="container reveal-on-scroll" id="gallery-section" style={{ paddingBottom: '1.5rem', paddingTop: '1rem', position: 'relative', zIndex: 10 }}>
      {/* Search Input Bar */}
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: isMgd ? '#005BAB' : '#005BAB' }} />
        <input
          type="text"
          placeholder={t('filter_search_placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
          className="form-input"
          style={{
            paddingLeft: '3rem',
            paddingRight: searchQuery ? '3rem' : '1rem',
            height: '52px',
            fontSize: '1rem',
            borderRadius: 'var(--radius-pill)',
            background: isMgd ? '#FFF3DD' : '#FFFFFF',
            border: isMgd ? '2.5px solid #FFF3DD' : '2.5px solid #005BAB',
            color: '#005BAB',
            fontWeight: 700
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery && setSearchQuery('')}
            style={{
              position: 'absolute',
              right: '16px',
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

      {/* Main Category Header & Pills */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '1.25rem',
        textAlign: 'center'
      }}>
        {/* Baris 1: Judul Galeri */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: isMgd ? '#FFF3DD' : '#005BAB', textAlign: 'center', letterSpacing: '-0.02em' }}>
            {t('filter_heading')}
          </h2>
        </div>

        {/* Baris 2: Main Category Filter Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.65rem',
          flexWrap: 'wrap'
        }}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleMainCategoryChange(cat.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 1.1rem',
                  borderRadius: '999px',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: isActive ? '#005BAB' : (isMgd ? '#FFF3DD' : '#FFFFFF'),
                  color: isActive ? '#FFFFFF' : '#005BAB',
                  border: isMgd ? '2.5px solid #FFF3DD' : '2.5px solid #005BAB',
                  boxShadow: isActive ? '0 4px 14px rgba(0, 91, 171, 0.25)' : 'none'
                }}
              >
                <Icon size={16} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Category Pills */}
      {availableSubcategories.length > 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginTop: '0.75rem'
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
                  gap: '0.35rem',
                  padding: '0.35rem 0.9rem',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  color: isSubActive ? '#FFFFFF' : '#005BAB',
                  background: isSubActive ? '#005BAB' : (isMgd ? '#FFF3DD' : '#FFFFFF'),
                  border: isMgd ? '2.5px solid #FFF3DD' : '2.5px solid #005BAB',
                  transition: 'all 0.2s ease'
                }}
              >
                {isSubActive && <Check size={14} />}
                <span>{sub}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
