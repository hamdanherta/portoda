import React from 'react';
import { Play, Eye, Sparkles, Calendar, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PortfolioCard({ item, onClick }) {
  const { lang, t, getLocalizedField } = useLanguage();

  const getBadgeClass = (category) => {
    switch (category) {
      case 'desain-grafis':
        return 'badge-desain-grafis';
      case 'multimedia':
        return 'badge-multimedia';
      case 'aplikasi':
        return 'badge-aplikasi';
      default:
        return 'badge-aplikasi';
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'desain-grafis':
        return t('cat_grafis');
      case 'multimedia':
        return t('cat_multimedia');
      case 'aplikasi':
        return t('cat_aplikasi');
      default:
        return category;
    }
  };

  const titleText = getLocalizedField(item, 'title');
  const descText = getLocalizedField(item, 'description');
  const subcatText = getLocalizedField(item, 'subcategory');

  return (
    <div 
      onClick={() => onClick(item)}
      className="herta-card animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Featured Star Badge */}
      {item.featured && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 10,
          background: '#005BAB',
          color: '#FFFFFF',
          padding: '0.35rem 0.75rem',
          borderRadius: '999px',
          fontSize: '0.72rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          border: '1.5px solid #FFFFFF'
        }}>
          <Sparkles size={12} />
          <span>{t('card_featured').toUpperCase()}</span>
        </div>
      )}

      {/* Thumbnail Container — 16:9 Landscape | Blurred Backdrop + Contained Image */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%',
        overflow: 'hidden',
        borderBottom: '2.5px solid #005BAB',
        backgroundColor: '#111827'
      }}>
        {/* Layer 1: Blurred Backdrop */}
        <img
          src={item.image_url}
          alt=""
          aria-hidden="true"
          loading="lazy"
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            width: '120%',
            height: '120%',
            objectFit: 'cover',
            filter: 'blur(18px) brightness(0.55) saturate(1.4)',
            transform: 'scale(1.05)',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 1
          }}
        />

        {/* Layer 2: Gambar Asli — contain, tidak terpotong */}
        <img
          src={item.image_url}
          alt={titleText}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center center',
            transition: 'transform 0.4s ease',
            zIndex: 2
          }}
          className="card-img"
        />

        {/* Video Badge */}
        {item.video_url && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            zIndex: 5,
            background: '#005BAB',
            color: '#FFFFFF',
            padding: '0.3rem 0.65rem',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            border: '1.5px solid #FFFFFF'
          }}>
            <Play size={12} fill="currentColor" />
            <span>Video</span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-between',
        background: '#FFFFFF'
      }}>
        <div>
          {/* Badges & Subcategory */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <span className={`badge ${getBadgeClass(item.category)}`}>
              {getCategoryLabel(item.category)}
            </span>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#005BAB',
              background: '#FFF3DD',
              padding: '0.25rem 0.65rem',
              borderRadius: '999px',
              border: '1.5px solid #005BAB'
            }}>
              {subcatText}
            </span>
            {item.year && (
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#005BAB', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <Calendar size={12} />
                {item.year}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 style={{
            fontSize: '1.15rem',
            fontWeight: 800,
            lineHeight: 1.3,
            marginBottom: '0.5rem',
            color: '#005BAB',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {titleText}
          </h3>

          {/* Description Snippet */}
          <p style={{
            fontSize: '0.85rem',
            color: '#005BAB',
            fontWeight: 600,
            lineHeight: 1.5,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            opacity: 0.9
          }}>
            {descText}
          </p>
        </div>

        {/* Tags Footer */}
        {Array.isArray(item.tags) && item.tags.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            flexWrap: 'wrap',
            paddingTop: '0.5rem'
          }}>
            {item.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} style={{
                fontSize: '0.72rem',
                color: '#005BAB',
                background: '#FFF3DD',
                padding: '0.2rem 0.55rem',
                borderRadius: '999px',
                fontWeight: 800,
                border: '1.5px solid #005BAB'
              }}>
                #{tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#005BAB' }}>
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      <style>{`
        .herta-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(0, 91, 171, 0.2);
        }
        .herta-card:hover .card-img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
