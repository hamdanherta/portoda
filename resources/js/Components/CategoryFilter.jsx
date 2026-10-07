import React, { useEffect } from 'react';
import { Check, Search, X, Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePersona } from '../context/PersonaContext';

export default function CategoryFilter({ activeCategory, setActiveCategory, activeSubcategory, setActiveSubcategory, searchQuery = '', setSearchQuery, itemCount }) {
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
  const availableSubcategories = subcategoryMap[currentCategory] || [defaultSubAll];

  return (
    <div className="container reveal-on-scroll" id="gallery-section" style={{ paddingBottom: '1.5rem', paddingTop: '1rem', position: 'relative', zIndex: 10 }}>
      {/* Search Input Bar */}
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
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
          <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: isMgd ? '#FFF3DD' : '#005BAB', textAlign: 'center', letterSpacing: '-0.02em' }}>
            {t('filter_heading')}
          </h2>
        </div>

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
                  background: isSubActive ? '#005BAB' : (isMgd ? '#FFF3DD' : '#FFFFFF'),
                  border: isMgd ? '2.5px solid #FFF3DD' : '2.5px solid #005BAB',
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
    </div>
  );
}
