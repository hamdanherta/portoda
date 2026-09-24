import React from 'react';
import PortfolioCard from './PortfolioCard';
import { SearchX, RefreshCw, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PortfolioGrid({
  items,
  loading,
  onItemClick,
  onResetFilter,
  isFullGallery = false,
  isExpanded = false,
  currentPage = 1,
  onPageChange,
  onViewMore
}) {
  const { t, lang } = useLanguage();
  const ITEMS_PER_PAGE = 20;

  if (loading) {
    return (
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="herta-card" style={{ height: '360px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ width: '100%', height: '180px', borderRadius: '16px', background: '#FFF3DD', border: '2px solid #005BAB' }} />
              <div style={{ width: '40%', height: '20px', borderRadius: '8px', background: '#FFF3DD' }} />
              <div style={{ width: '85%', height: '24px', borderRadius: '8px', background: '#FFF3DD' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '3rem 1.25rem', textAlign: 'center' }}>
        <div className="herta-card" style={{
          maxWidth: '460px',
          margin: '0 auto',
          padding: '2.5rem 1.75rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '2.5px solid #005BAB'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '999px',
            background: '#FFF3DD',
            color: '#005BAB',
            border: '2.5px solid #005BAB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <SearchX size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#005BAB', marginBottom: '0.4rem' }}>{t('grid_empty_title')}</h3>
            <p style={{ color: '#005BAB', fontSize: '0.88rem', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
              {t('grid_empty_desc')}
            </p>
          </div>
          <button onClick={onResetFilter} className="btn-primary" style={{ marginTop: '0.25rem', padding: '0.65rem 1.35rem', borderRadius: '999px', fontSize: '0.88rem', gap: '0.45rem' }}>
            <RefreshCw size={16} />
            <span>{t('grid_reset_filter')}</span>
          </button>
        </div>
      </div>
    );
  }

  // If in Beranda mode, show max 12 items unless isExpanded is true. If expanded or in Full Gallery mode, use pagination (20 per page).
  const displayItems = (isFullGallery || isExpanded)
    ? items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : items.slice(0, 12);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  return (
    <div className="container" style={{ paddingBottom: '4rem', position: 'relative', zIndex: 10 }}>
      {/* Portfolio Items Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
        gap: '1.5rem'
      }}>
        {displayItems.map((item, index) => (
          <div
            key={item.id}
            className={`reveal-on-scroll ${isExpanded && index >= 12 ? 'reveal-visible' : ''}`}
            style={{ transitionDelay: `${(index % 6) * 0.08}s` }}
          >
            <PortfolioCard item={item} onClick={onItemClick} />
          </div>
        ))}
      </div>

      {/* BERANDA MODE: Tombol Lihat Selengkapnya */}
      {!isFullGallery && !isExpanded && items.length > 12 && (
        <div className="reveal-on-scroll" style={{ textAlign: 'center', marginTop: '2.5rem', transitionDelay: '0.15s' }}>
          <button
            onClick={onViewMore}
            className="btn-primary"
            style={{
              padding: '0.85rem 2.25rem',
              fontSize: '1.05rem',
              fontWeight: 800,
              borderRadius: '999px',
              boxShadow: '0 8px 24px rgba(0, 91, 171, 0.25)',
              gap: '0.65rem'
            }}
          >
            <span>{lang === 'en' ? 'View More' : 'Lihat Selengkapnya'}</span> 
            <ArrowRight size={20} />
          </button>
        </div>
      )}

      {/* FULL GALLERY / EXPANDED MODE: Control Pagination Max 20 Item */}
      {(isFullGallery || isExpanded) && totalPages > 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '2.5rem',
          paddingTop: '1.25rem',
          borderTop: '2.5px solid #005BAB',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#005BAB' }}>
            {lang === 'en'
              ? `Page ${currentPage} of ${totalPages} (Total ${items.length} Works)`
              : `Halaman ${currentPage} dari ${totalPages} (Total ${items.length} Karya)`}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange && onPageChange(currentPage - 1)}
              className="btn-secondary"
              style={{
                padding: '0.45rem 0.9rem',
                fontSize: '0.85rem',
                opacity: currentPage === 1 ? 0.5 : 1,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <ChevronLeft size={16} />
              <span>{lang === 'en' ? 'Previous' : 'Sebelumnya'}</span>
            </button>

            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange && onPageChange(currentPage + 1)}
              className="btn-secondary"
              style={{
                padding: '0.45rem 0.9rem',
                fontSize: '0.85rem',
                opacity: currentPage === totalPages ? 0.5 : 1,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <span>{lang === 'en' ? 'Next' : 'Selanjutnya'}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
