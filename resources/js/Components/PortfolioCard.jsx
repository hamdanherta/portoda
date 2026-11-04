import React from 'react';
import { Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import WatermarkedImage from './WatermarkedImage';

export default function PortfolioCard({ item, onClick, compact = false }) {
  const { lang, t, getLocalizedField } = useLanguage();

  if (!item) return null;

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'desain-grafis':
        return t('cat_grafis');
      case 'multimedia':
        return t('cat_multimedia');
      case 'aplikasi':
        return t('cat_aplikasi');
      default:
        return category === 'desain-grafis' ? 'Desain Grafis' : (category || 'Desain Grafis');
    }
  };

  const titleText = getLocalizedField(item, 'title');
  const descText = getLocalizedField(item, 'description');
  const subcatText = getLocalizedField(item, 'subcategory') || (lang === 'en' ? 'Design' : 'Desain');
  const coverImg = item.cover || item.cover_image || item.image_url;

  return (
    <div
      onClick={() => onClick && onClick(item)}
      className="portfolio-card-custom"
      style={{
        background: '#FFFFFF',
        borderRadius: compact ? '20px' : '28px',
        border: 'none',
        boxShadow: '0 4px 20px rgba(0, 40, 110, 0.07)',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* ── THUMBNAIL CONTAINER: Full frame (w-full, tanpa padding kartu) ── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 10',
          borderBottomLeftRadius: compact ? '16px' : '22px',
          borderBottomRightRadius: compact ? '16px' : '22px',
          overflow: 'hidden',
          backgroundColor: '#111827',
          boxShadow: '0 6px 20px rgba(0, 20, 60, 0.12)',
          flexShrink: 0,
          zIndex: 2
        }}
      >
        {coverImg ? (
          <>
            {/* Layer 1: Blurred Backdrop (mengisi penuh sisi kiri-kanan/atas-bawah) */}
            <img
              src={coverImg}
              alt=""
              aria-hidden="true"
              loading="lazy"
              style={{
                position: 'absolute',
                top: '-15%',
                left: '-15%',
                width: '130%',
                height: '130%',
                objectFit: 'cover',
                filter: 'blur(20px) brightness(0.65) saturate(1.3)',
                transform: 'scale(1.08)',
                pointerEvents: 'none',
                userSelect: 'none',
                zIndex: 1
              }}
            />

            {/* Layer 2: Main Contained Image (pas di tengah frame, tidak terpotong, tidak ketarik) */}
            <WatermarkedImage
              src={coverImg}
              alt={titleText}
              loading="lazy"
              objectFit="contain"
              objectPosition="center center"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 2
              }}
            />
          </>
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#005BAB',
            fontWeight: 800,
            fontSize: '0.85rem'
          }}>
            No Image
          </div>
        )}

        {/* Video Icon Badge (Jika karya memiliki video) */}
        {item.video_url && (
          <div
            style={{
              position: 'absolute',
              top: compact ? '8px' : '12px',
              right: compact ? '8px' : '12px',
              zIndex: 5,
              background: 'rgba(0, 91, 171, 0.9)',
              color: '#FFFFFF',
              padding: compact ? '0.2rem 0.45rem' : '0.25rem 0.6rem',
              borderRadius: '999px',
              fontSize: compact ? '0.65rem' : '0.72rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              backdropFilter: 'blur(4px)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)'
            }}
          >
            <Play size={compact ? 10 : 12} fill="currentColor" />
            <span>Video</span>
          </div>
        )}
      </div>

      {/* ── CARD CONTENT BODY (Padding khusus area teks saja) ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        padding: compact ? '0.55rem 0.65rem 0.75rem 0.65rem' : '1.15rem 1.25rem 1.45rem 1.25rem'
      }}>
        {/* Strip: Kategori ───────── Subkategori */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: compact ? '0.25rem' : '0.55rem',
          width: '100%',
          marginBottom: compact ? '0.35rem' : '0.7rem'
        }}>
          <span style={{
            fontSize: compact ? '0.65rem' : '0.92rem',
            fontWeight: 700,
            color: '#005BAB',
            whiteSpace: 'nowrap'
          }}>
            {getCategoryLabel(item.category)}
          </span>

          {/* Garis Horizontal Tipis */}
          <div style={{
            flex: 1,
            height: '1px',
            background: '#005BAB',
            opacity: 0.65,
            minWidth: compact ? '8px' : '16px'
          }} />

          <span style={{
            fontSize: compact ? '0.65rem' : '0.92rem',
            fontWeight: 700,
            color: '#005BAB',
            whiteSpace: 'nowrap'
          }}>
            {subcatText}
          </span>
        </div>

        {/* Judul & Tahun (Tahun di sebelah kanan bawah judul) */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '0.35rem',
          marginBottom: compact ? '0.3rem' : '0.65rem'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: compact ? '0.78rem' : '1.24rem',
            fontWeight: 800,
            color: '#005BAB',
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {titleText}
          </h3>

          {item.year && (
            <span style={{
              fontSize: compact ? '0.65rem' : '0.95rem',
              fontWeight: 700,
              color: '#005BAB',
              whiteSpace: 'nowrap',
              paddingBottom: '1px',
              opacity: 0.95
            }}>
              {item.year}
            </span>
          )}
        </div>

        {/* Deskripsi Singkat */}
        {descText && (
          <p style={{
            margin: 0,
            fontSize: compact ? '0.64rem' : '0.88rem',
            lineHeight: 1.35,
            color: '#28588E',
            fontWeight: 500,
            display: '-webkit-box',
            WebkitLineClamp: compact ? 2 : 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {descText}
          </p>
        )}
      </div>
    </div>
  );
}
