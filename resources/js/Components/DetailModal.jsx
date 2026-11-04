import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { X, ExternalLink, Calendar, User, Tag, Play, ChevronLeft, ChevronRight, Award, Briefcase, Building2, Sparkles, FolderKanban, Wrench, Code, Layers, Smartphone, Share2, Check, Maximize2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePersona } from '../context/PersonaContext';
import WatermarkedImage from './WatermarkedImage';
import PortfolioCard from './PortfolioCard';
import MetadataCopyBtn from './MetadataCopyBtn';

export default function DetailModal({ item, allItems = [], onClose, onSelectWork, onViewAllWorks }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
  const { lang, t, getLocalizedField } = useLanguage();
  const { persona } = usePersona();
  const isMGD = persona === 'mgd';
  const autoSlideRef = useRef(null);
  const resumeTimerRef = useRef(null);
  const modalRef = useRef(null);

  const handleShare = () => {
    if (!item) return;
    const shareUrl = `${window.location.origin}/?karya=${item.id}`;

    const copyFallback = (text) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        console.error('Fallback copy failed', err);
      }
      document.body.removeChild(textArea);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }).catch(() => {
        copyFallback(shareUrl);
      });
    } else {
      copyFallback(shareUrl);
    }
  };

  // Safe image list extraction (handles null item and certificates cleanly)
  const imagesList = item
    ? Array.from(
        new Set(
          [
            item.cover || item.cover_image || item.image_url,
            ...(Array.isArray(item.gallery)
              ? item.gallery
              : Array.isArray(item.gallery_images)
              ? item.gallery_images
              : Array.isArray(item.images) && item.images.length > 1
              ? item.images.slice(1)
              : [])
          ].filter(Boolean)
        )
      )
    : [];

  const otherWorks = useMemo(() => {
    if (!item || item.isCertificate || !Array.isArray(allItems)) return [];
    return allItems
      .filter((other) => !other.isCertificate && String(other.id) !== String(item.id))
      .slice(0, 4);
  }, [item, allItems]);

  useEffect(() => {
    setCurrentImageIndex(0);
    setIsPaused(false);
    if (modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
  }, [item]);

  const pauseAndResume = useCallback(() => {
    setIsPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setIsPaused(false), 5000);
  }, []);

  const handlePrevImage = useCallback(() => {
    if (imagesList.length <= 1) return;
    pauseAndResume();
    setCurrentImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  }, [imagesList.length, pauseAndResume]);

  const handleNextImage = useCallback(() => {
    if (imagesList.length <= 1) return;
    pauseAndResume();
    setCurrentImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
  }, [imagesList.length, pauseAndResume]);

  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'ArrowRight') handleNextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, currentImageIndex, item, handlePrevImage, handleNextImage]);

  // Auto-slide effect (always declared at top level)
  useEffect(() => {
    if (!item || imagesList.length <= 1) return;
    if (isPaused) {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
      return;
    }
    autoSlideRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
    }, 3500);
    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [isPaused, imagesList.length, item]);

  if (!item) return null;

  const titleText = getLocalizedField(item, 'title');
  const descText = getLocalizedField(item, 'description');
  const subcatText = getLocalizedField(item, 'subcategory');

  const subcatLower = (item.subcategory || '').toLowerCase().trim();
  const isVideografi = subcatLower.includes('videografi') || subcatLower.includes('videography');
  const isMotionGraphic = subcatLower.includes('motion');
  const isFilm = subcatLower.includes('film') || subcatLower.includes('movie');
  const isMultimediaFilm = (item.category || '').toLowerCase() === 'multimedia' && isFilm;
  const isMobileApp = subcatLower.includes('mobile') || subcatLower.includes('seluler') || subcatLower.includes('hp');
  const isWebApp = subcatLower.includes('web app') || subcatLower.includes('aplikasi web');
  const isUIUX = subcatLower.includes('ui') || subcatLower.includes('ux');
  const isAplikasiCategory = item.category === 'aplikasi' || isMobileApp || isWebApp || isUIUX;

  const getEmbedVideoUrl = (url) => {
    if (!url) return null;
    let videoId = null;
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/shorts/')) {
      videoId = url.split('shorts/')[1]?.split('?')[0];
    }
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    if (url.includes('vimeo.com/')) {
      const vimeoId = url.split('vimeo.com/')[1]?.split('?')[0]?.split('/')[0];
      if (vimeoId) {
        return `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
      }
    }
    if (url.includes('instagram.com') || url.includes('instagr.am')) {
      let igCode = null;
      if (url.includes('/reel/')) {
        igCode = url.split('/reel/')[1]?.split('/')[0]?.split('?')[0];
      } else if (url.includes('/reels/')) {
        igCode = url.split('/reels/')[1]?.split('/')[0]?.split('?')[0];
      } else if (url.includes('/p/')) {
        igCode = url.split('/p/')[1]?.split('/')[0]?.split('?')[0];
      } else if (url.includes('/tv/')) {
        igCode = url.split('/tv/')[1]?.split('/')[0]?.split('?')[0];
      }
      if (igCode) {
        return `https://www.instagram.com/p/${igCode}/embed`;
      }
      if (url.includes('/embed')) {
        return url;
      }
    }
    if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
      let fileId = null;
      if (url.includes('/file/d/')) {
        fileId = url.split('/file/d/')[1]?.split('/')[0]?.split('?')[0];
      } else if (url.includes('id=')) {
        fileId = url.split('id=')[1]?.split('&')[0];
      }
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
      if (url.includes('/preview')) {
        return url;
      }
    }
    if (url.startsWith('http') && (url.includes('embed') || url.includes('player'))) {
      return `${url}${url.includes('?') ? '&' : '?'}autoplay=1`;
    }
    return null;
  };

  const isVideoPlatformLink = (link) => {
    if (!link) return false;
    return link.includes('youtube') || link.includes('youtu.be') || link.includes('vimeo') || link.includes('instagram') || link.includes('instagr.am') || link.includes('drive.google.com') || link.includes('docs.google.com');
  };

  const rawVideoLink = item.video_url || 
    (isVideoPlatformLink(item.project_url) ? item.project_url : '') ||
    (isVideoPlatformLink(item.prototype_url) ? item.prototype_url : '');

  const videoEmbedUrl = getEmbedVideoUrl(rawVideoLink);
  const isGdriveVideo = !!(videoEmbedUrl && (videoEmbedUrl.includes('drive.google.com') || videoEmbedUrl.includes('docs.google.com')));

  const appOrProjLink = item.prototype_url || item.project_url || item.app_url || item.demo_url || item.link || item.url;

  return (
    <div className="modal-overlay detail-modal-overlay-wrap" onClick={onClose} style={{ zIndex: 10000, padding: 'clamp(0.75rem, 2vw, 1.75rem)' }}>
      <div 
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        className="herta-card animate-fade-in detail-modal-scroll detail-modal-inner-card"
        style={{
          width: '100%',
          maxWidth: videoEmbedUrl ? '880px' : '960px',
          maxHeight: '94vh',
          overflowY: 'auto',
          borderRadius: '32px',
          background: '#FFFFFF',
          border: '2px solid rgba(0, 91, 171, 0.18)',
          boxShadow: '0 20px 60px rgba(0, 40, 110, 0.2)',
          position: 'relative',
          padding: 0,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {/* ========================================================= */}
        {/* CASE 1: JIKA ADA VIDEO EMBED (TETAP SEPERTI SEMULA)       */}
        {/* ========================================================= */}
        {videoEmbedUrl ? (
          <>
            {/* Header Sticky Video */}
            <div
              className="detail-modal-header"
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 20,
                padding: '0.85rem 1.25rem',
                background: '#FFFFFF',
                borderBottom: '2px solid #005BAB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                boxShadow: '0 4px 16px rgba(0,91,171,0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
                {item?.year && (
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    color: '#005BAB',
                    background: '#FFFFFF',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    border: '1.5px solid #005BAB'
                  }}>
                    <Calendar size={14} />
                    {t('detail_year')}: {item.year}
                  </span>
                )}
              </div>

              <button
                onClick={onClose}
                style={{
                  flexShrink: 0,
                  background: '#FFFFFF',
                  color: '#005BAB',
                  border: '2px solid #005BAB',
                  width: '38px',
                  height: '38px',
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title="Tutup (ESC)"
              >
                <X size={20} />
              </button>
            </div>

            {/* Video Container */}
            <div style={{ position: 'relative', width: '100%', backgroundColor: '#FFFFFF' }}>
              <div
                className={`video-embed-container ${isGdriveVideo ? 'is-gdrive' : ''}`}
                style={{
                  position: 'relative',
                  width: '100%',
                  backgroundColor: videoEmbedUrl.includes('instagram.com') ? '#FFFFFF' : '#000000',
                  ...(videoEmbedUrl.includes('instagram.com')
                    ? { height: '520px', maxHeight: '75vh' }
                    : { paddingTop: '56.25%' })
                }}
              >
                <iframe
                  src={videoEmbedUrl}
                  title={titleText}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                />

                {isGdriveVideo && (
                  <div className="gdrive-mobile-hint">
                    <p className="gdrive-hint-text">
                      💡 Tonton dalam fullscreen untuk <br></br> pengalaman yang lebih baik
                    </p>
                    <button
                      className="gdrive-hint-btn"
                      onClick={() => setIsVideoFullscreen(true)}
                    >
                      <Maximize2 size={15} />
                      <span>Tonton Fullscreen</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Body Video Mode */}
            <div className="detail-modal-body" style={{ padding: '1.5rem' }}>
              <h2 style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#005BAB',
                margin: '0 0 1.15rem 0',
                lineHeight: 1.3,
                wordBreak: 'break-word',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <span>{titleText}</span>
                <MetadataCopyBtn text={titleText} label="Judul" />
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem 0.65rem', flexWrap: 'wrap', marginBottom: '1.35rem' }}>
                <span className={`badge badge-${item.category}`} style={{ border: '1.5px solid #005BAB', padding: '0.4rem 0.95rem', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 800 }}>
                  {item.category === 'desain-grafis' ? t('cat_grafis') :
                   item.category === 'multimedia' ? t('cat_multimedia') :
                   item.category === 'aplikasi' ? t('cat_aplikasi') : item.category}
                </span>
                {subcatText && (
                  <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: '#005BAB',
                    background: '#FFFFFF',
                    padding: '0.4rem 0.95rem',
                    borderRadius: '999px',
                    border: '1.5px solid #005BAB'
                  }}>
                    {subcatText}
                  </span>
                )}
                {item.institution && (
                  <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: '#005BAB',
                    background: '#FFFFFF',
                    padding: '0.4rem 0.95rem',
                    borderRadius: '999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    border: '1.5px solid #005BAB'
                  }}>
                    <Award size={15} />
                    <span>{item.institution}</span>
                    <MetadataCopyBtn text={item.institution} label="Instansi" />
                  </span>
                )}
                {item.client && (
                  <span
                    className="detail-modal-client-badge"
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      color: '#005BAB',
                      background: '#FFFFFF',
                      padding: '0.4rem 0.95rem',
                      borderRadius: '999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      border: '1.5px solid #005BAB'
                    }}
                  >
                    <User size={15} />
                    {item.client}
                  </span>
                )}
                {item.project_type && (
                  <span
                    className="detail-modal-project-type-badge"
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      color: '#005BAB',
                      background: '#FFFFFF',
                      padding: '0.4rem 0.95rem',
                      borderRadius: '999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      border: '1.5px solid #005BAB'
                    }}
                  >
                    {((type) => {
                      const t = (type || '').toLowerCase().trim();
                      if (t.includes('freelance')) return <Briefcase size={15} />;
                      if (t.includes('pekerjaan') || t.includes('work') || t.includes('job')) return <Building2 size={15} />;
                      if (t.includes('iseng') || t.includes('pribadi') || t.includes('personal')) return <Sparkles size={15} />;
                      if (t.includes('lomba') || t.includes('contest') || t.includes('competition')) return <Award size={15} />;
                      return <FolderKanban size={15} />;
                    })(item.project_type)}
                    <span>{lang === 'en' ? 'Project Type' : 'Jenis Proyek'}: {item.project_type === 'Iseng' ? 'Personal' : item.project_type}</span>
                  </span>
                )}
                {item.tools_used && (
                  <span
                    className="detail-modal-tools-badge"
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      color: '#005BAB',
                      background: '#FFFFFF',
                      padding: '0.4rem 0.95rem',
                      borderRadius: '999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      border: '1.5px solid #005BAB'
                    }}
                  >
                    <Wrench size={15} />
                    <span>{lang === 'en' ? 'Tools / Software' : 'Alat / Software'}: {item.tools_used}</span>
                  </span>
                )}
              </div>

              {descText && (
                <div style={{
                  fontSize: '0.92rem',
                  color: '#005BAB',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  marginBottom: '1.5rem',
                  whiteSpace: 'pre-line',
                  background: '#FFFFFF',
                  padding: '1.25rem',
                  borderRadius: '20px',
                  border: '2px solid #005BAB'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>{descText}</div>
                    <MetadataCopyBtn text={descText} label="Deskripsi" />
                  </div>
                </div>
              )}

              {Array.isArray(item.tags) && item.tags.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.85rem', color: '#005BAB', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 800 }}>
                    {t('detail_tags')}:
                  </h4>
                  <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                    {item.tags.map((tag, idx) => (
                      <span key={idx} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: '#FFFFFF',
                        color: '#005BAB',
                        border: '1.5px solid #005BAB',
                        padding: '0.35rem 0.8rem',
                        borderRadius: '999px',
                        fontSize: '0.82rem',
                        fontWeight: 800
                      }}>
                        <Tag size={13} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Actions Video */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '0.75rem' }}>
                {item.category && (
                  <button
                    type="button"
                    onClick={handleShare}
                    className="btn-secondary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      background: copied ? '#005BAB' : '#FFFFFF',
                      color: copied ? '#FFFFFF' : '#005BAB',
                      border: '2px solid #005BAB',
                      transition: 'all 0.2s ease',
                      fontWeight: 800
                    }}
                    title={lang === 'en' ? 'Share link to this portfolio item' : 'Bagikan link karya ini'}
                  >
                    {copied ? <Check size={16} /> : <Share2 size={16} />}
                    <span>{copied ? (lang === 'en' ? 'Link Copied!' : 'Link Tersalin!') : (lang === 'en' ? 'Share' : 'Bagikan')}</span>
                  </button>
                )}
                <button onClick={onClose} className="btn-secondary">
                  <span>{t('detail_close')}</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* ========================================================= */
          /* CASE 2: DESAIN BARU 100% SESUAI GAMBAR LAMPIRAN           */
          /* ========================================================= */
          <>
            {/* ═════════════════════════════════════════════════════════ */}
            {/* DESKTOP DETAIL VIEW (Layar > 768px, Tetap Utuh 100%)    */}
          {/* ═════════════════════════════════════════════════════════ */}
          <div className="detail-modal-desktop-view">
          <div style={{ padding: 'clamp(1.2rem, 3vw, 2.5rem)', boxSizing: 'border-box' }}>
            {/* Top 2 Columns Grid */}
            <div className="detail-two-col-grid" style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 1fr',
              gap: 'clamp(1.25rem, 3vw, 2.5rem)',
              alignItems: 'start'
            }}>
              
              {/* ── KOLOM KIRI: Preview Gambar + Deskripsi + Tag ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Frame Gambar Utama (Rasio Lama 16:9, Slide Animasi, Progress Bar, Blur Backdrop & Contain Image) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      paddingTop: '56.25%', // Rasio 16:9 seperti modal yang lama
                      borderRadius: '26px',
                      overflow: 'hidden',
                      background: '#111827',
                      boxShadow: '0 8px 24px rgba(0, 91, 171, 0.12)',
                    }}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                  >
                    {/* Progress bar auto-slide — tampil jika > 1 gambar */}
                    {imagesList.length > 1 && (
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '4px',
                        background: 'rgba(255,255,255,0.2)',
                        zIndex: 15
                      }}>
                        <div
                          key={`${currentImageIndex}-${isPaused}`}
                          style={{
                            height: '100%',
                            background: '#005BAB',
                            boxShadow: '0 0 8px rgba(0, 91, 171, 0.8)',
                            animation: isPaused ? 'none' : 'slideProgress 3.5s linear forwards',
                            width: isPaused ? '0%' : undefined
                          }}
                        />
                      </div>
                    )}

                    {/* Smooth Slide Track Container */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: `${Math.max(imagesList.length, 1) * 100}%`,
                      height: '100%',
                      display: 'flex',
                      transform: `translateX(-${(currentImageIndex * 100) / Math.max(imagesList.length, 1)}%)`,
                      transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                      willChange: 'transform'
                    }}>
                      {(imagesList.length > 0 ? imagesList : [item.cover || item.image_url]).map((imgSrc, idx) => (
                        <div
                          key={idx}
                          style={{
                            position: 'relative',
                            width: `${100 / Math.max(imagesList.length, 1)}%`,
                            height: '100%',
                            flexShrink: 0,
                            overflow: 'hidden',
                            background: '#111827'
                          }}
                        >
                          {/* Layer 1: Blurred Backdrop (apapun rasionya, background blur mengisi penuh) */}
                          <img
                            src={imgSrc}
                            alt=""
                            aria-hidden="true"
                            style={{
                              position: 'absolute',
                              top: '-10%',
                              left: '-10%',
                              width: '120%',
                              height: '120%',
                              objectFit: 'cover',
                              filter: 'blur(20px) brightness(0.5) saturate(1.4)',
                              transform: 'scale(1.05)',
                              pointerEvents: 'none',
                              zIndex: 1
                            }}
                          />
                          {/* Layer 2: Main Contained Image (pas di dalam frame, contain, tidak kepotong/ketarik) */}
                          <WatermarkedImage
                            src={imgSrc}
                            alt={`${titleText} - Foto ${idx + 1}`}
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
                        </div>
                      ))}
                    </div>

                    {/* Tombol Close Merah Bulat di Pojok Kanan Atas Gambar */}
                    {/* <button
                      onClick={onClose}
                      aria-label="Tutup modal"
                      style={{
                        position: 'absolute',
                        top: '14px',
                        right: '14px',
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: '#EF4444',
                        color: '#FFFFFF',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.45)',
                        transition: 'transform 0.18s ease, background 0.18s ease',
                        zIndex: 16
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.background = '#DC2626'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#EF4444'; }}
                    >
                      <X size={20} strokeWidth={2.8} />
                    </button> */}

                    {/* Badge Indikator Foto jika > 1 gambar */}
                    {imagesList.length > 1 && (
                      <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        background: 'rgba(0, 0, 0, 0.65)',
                        color: '#FFFFFF',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        zIndex: 14,
                        backdropFilter: 'blur(4px)'
                      }}>
                        {currentImageIndex + 1} / {imagesList.length}
                      </div>
                    )}

                    {/* Tombol Slide Carousel Panah Kiri & Kanan (jika gambar > 1) */}
                    {imagesList.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          aria-label="Foto Sebelumnya"
                          style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: '1.5px solid rgba(0, 91, 171, 0.25)',
                            color: '#005BAB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 14,
                            transition: 'all 0.18s ease'
                          }}
                        >
                          <ChevronLeft size={22} strokeWidth={2.5} />
                        </button>

                        <button
                          onClick={handleNextImage}
                          aria-label="Foto Selanjutnya"
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: '1.5px solid rgba(0, 91, 171, 0.25)',
                            color: '#005BAB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 14,
                            transition: 'all 0.18s ease'
                          }}
                        >
                          <ChevronRight size={22} strokeWidth={2.5} />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Strip Selector jika > 1 Gambar */}
                  {imagesList.length > 1 && (
                    <div style={{
                      display: 'flex',
                      gap: '0.45rem',
                      justifyContent: 'flex-start',
                      overflowX: 'auto',
                      padding: '0.2rem 0',
                      scrollbarWidth: 'none'
                    }}>
                      {imagesList.map((thumbSrc, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            pauseAndResume();
                            setCurrentImageIndex(idx);
                          }}
                          style={{
                            width: '50px',
                            height: '50px',
                            flexShrink: 0,
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: idx === currentImageIndex ? '2.5px solid #005BAB' : '1.5px solid rgba(0, 91, 171, 0.2)',
                            opacity: idx === currentImageIndex ? 1 : 0.6,
                            transform: idx === currentImageIndex ? 'scale(1.03)' : 'scale(1)',
                            transition: 'all 0.2s ease',
                            padding: 0,
                            cursor: 'pointer',
                            background: '#111827'
                          }}
                        >
                          <WatermarkedImage src={thumbSrc} alt="" objectFit="cover" style={{ width: '100%', height: '100%' }} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Deskripsi Karya */}{/* Deskripsi Karya */}
                <div>
                  <h3 style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: '#005BAB',
                    margin: '0 0 0.5rem 0',
                    letterSpacing: '-0.01em'
                  }}>
                    {lang === 'en' ? 'Artwork Description' : 'Deskripsi Karya'}
                  </h3>
                  <p style={{
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    color: '#28588E',
                    margin: 0,
                    fontWeight: 500,
                    whiteSpace: 'pre-line'
                  }}>
                    {descText || (lang === 'en' ? 'No description available for this project.' : 'Belum ada deskripsi untuk karya ini.')}
                  </p>
                </div>

                {/* Tags */}
                {Array.isArray(item.tags) && item.tags.length > 0 && (
                  <div>
                    <h4 style={{
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      color: '#005BAB',
                      margin: '0 0 0.45rem 0'
                    }}>
                      Tag
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem 0.65rem' }}>
                      {item.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            color: '#005BAB'
                          }}
                        >
                          {tag.startsWith('#') ? tag : `#${tag}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── KOLOM KANAN: Tahun + Bagikan/Close + Kategori Strip + Judul + Metadata ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
                
                {/* Baris Atas: Tahun (Kiri) & Tombol Bagikan + Close Merah (Kanan) */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}>
                  {/* Angka Tahun */}
                  <span style={{
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: '#005BAB',
                    letterSpacing: '-0.02em'
                  }}>
                    {item.year || '2026'}
                  </span>

                  {/* Action Buttons: Bagikan + Close */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <button
                      type="button"
                      onClick={handleShare}
                      style={{
                        padding: '0.45rem 1.45rem',
                        borderRadius: '999px',
                        background: copied ? '#16A34A' : '#005BAB',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '0.92rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(0, 91, 171, 0.25)',
                        transition: 'all 0.2s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      {copied ? <Check size={16} /> : null}
                      <span>{copied ? (lang === 'en' ? 'Copied!' : 'Tersalin!') : (lang === 'en' ? 'Share' : 'Bagikan')}</span>
                    </button>

                    <button
                      onClick={onClose}
                      aria-label="Tutup modal"
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#EF4444',
                        color: '#FFFFFF',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                        transition: 'transform 0.18s ease, background 0.18s ease'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.background = '#DC2626'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#EF4444'; }}
                    >
                      <X size={20} strokeWidth={2.8} />
                    </button>
                  </div>
                </div>

                {/* Strip Kategori ─────── Subkategori */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%'
                }}>
                  <span style={{
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: '#005BAB',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.category === 'desain-grafis' ? 'Desain Grafis' :
                     item.category === 'multimedia' ? 'Multimedia' :
                     item.category === 'aplikasi' ? 'Aplikasi' : (item.category || 'Desain Grafis')}
                  </span>

                  {/* Garis Horizontal Pemisah Tipis */}
                  <div style={{
                    flex: 1,
                    height: '1.5px',
                    background: '#005BAB',
                    opacity: 0.65
                  }} />

                  <span style={{
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: '#005BAB',
                    whiteSpace: 'nowrap'
                  }}>
                    {subcatText || (lang === 'en' ? 'Design' : 'Desain')}
                  </span>
                </div>

                {/* Judul Karya Besar */}
                <h2 style={{
                  margin: 0,
                  fontSize: 'clamp(1.35rem, 2.5vw, 1.85rem)',
                  fontWeight: 900,
                  color: '#005BAB',
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                  wordBreak: 'break-word'
                }}>
                  {titleText}
                </h2>

                {/* Metadata Fields: Klien, Alat/Software, Jenis Proyek */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  
                  {/* Klien */}
                  <div>
                    <span style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#4B6B9A',
                      marginBottom: '0.15rem'
                    }}>
                      {lang === 'en' ? 'Client' : 'Klien'}
                    </span>
                    <span style={{
                      fontSize: '1.18rem',
                      fontWeight: 800,
                      color: '#005BAB'
                    }}>
                      {item.client || item.institution || '-'}
                    </span>
                  </div>

                  {/* Alat / Software */}
                  <div>
                    <span style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#4B6B9A',
                      marginBottom: '0.15rem'
                    }}>
                      {lang === 'en' ? 'Tool / Software' : 'Alat/Software'}
                    </span>
                    <span style={{
                      fontSize: '1.18rem',
                      fontWeight: 800,
                      color: '#005BAB'
                    }}>
                      {item.tools_used || item.framework || '-'}
                    </span>
                  </div>

                  {/* Jenis Proyek */}
                  <div>
                    <span style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#4B6B9A',
                      marginBottom: '0.15rem'
                    }}>
                      {lang === 'en' ? 'Project Type' : 'Jenis Proyek'}
                    </span>
                    <span style={{
                      fontSize: '1.18rem',
                      fontWeight: 800,
                      color: '#005BAB'
                    }}>
                      {item.project_type || 'Pekerjaan'}
                    </span>
                  </div>

                  {/* Tombol External Link Proyek (jika ada) */}
                  {appOrProjLink && !isVideografi && (
                    <div style={{ marginTop: '0.35rem' }}>
                      <a
                        href={appOrProjLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: '#005BAB',
                          color: '#FFFFFF',
                          padding: '0.5rem 1.25rem',
                          borderRadius: '999px',
                          fontSize: '0.86rem',
                          fontWeight: 800,
                          textDecoration: 'none'
                        }}
                      >
                        <span>
                          {isUIUX
                            ? t('detail_btn_prototype')
                            : (isMobileApp || isWebApp || isAplikasiCategory)
                              ? (lang === 'en' ? 'Try App' : 'Coba Aplikasi')
                              : t('detail_btn_project')}
                        </span>
                        <ExternalLink size={15} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── BAGIAN BAWAH: Karya Lainnya + Button Selengkapnya ── */}
            {otherWorks.length > 0 && (
              <div style={{ marginTop: '2.5rem', borderTop: '1.5px solid rgba(0, 91, 171, 0.12)', paddingTop: '1.5rem' }}>
                {/* Header: Karya Lainnya + Selengkapnya Button */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  marginBottom: '1.25rem'
                }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    color: '#005BAB',
                    margin: 0,
                    letterSpacing: '-0.01em'
                  }}>
                    {lang === 'en' ? 'Other Works' : 'Karya Lainnya'}
                  </h3>

                  <button
                    type="button"
                    onClick={() => {
                      if (onViewAllWorks) {
                        onViewAllWorks();
                      } else {
                        onClose();
                      }
                    }}
                    style={{
                      padding: '0.45rem 1.35rem',
                      borderRadius: '999px',
                      background: '#005BAB',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0, 91, 171, 0.22)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    {lang === 'en' ? 'See More' : 'Selengkapnya'}
                  </button>
                </div>

                {/* Grid 4 Card Karya Lainnya Sesuai Desain Lampiran */}
                <div className="detail-other-works-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '1rem',
                  alignItems: 'stretch'
                }}>
                  {otherWorks.map((otherItem) => (
                    <PortfolioCard
                      key={otherItem.id}
                      item={otherItem}
                      onClick={onSelectWork}
                      compact={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          </div>


          {/* ═════════════════════════════════════════════════════════ */}
          {/* MOBILE DETAIL VIEW (Khusus Layar <= 768px, 100% Lampiran)  */}
          {/* ═════════════════════════════════════════════════════════ */}
          <div className=" detail-modal-mobile-view" style={{ width: '100%' }}>
            
            {/* 1. Container Image Full Frame (w-full, no margin, no padding) */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                paddingTop: '62%', // Rasio ideal mobile view
                borderBottomLeftRadius: '26px',
                borderBottomRightRadius: '26px',
                overflow: 'hidden',
                background: '#111827',
                boxShadow: '0 8px 24px rgba(0, 20, 60, 0.16)',
                zIndex: 10
              }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Progress bar auto-slide */}
              {imagesList.length > 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  background: 'rgba(255,255,255,0.2)',
                  zIndex: 15
                }}>
                  <div
                    key={`mob-${currentImageIndex}-${isPaused}`}
                    style={{
                      height: '100%',
                      background: '#005BAB',
                      boxShadow: '0 0 8px rgba(0, 91, 171, 0.8)',
                      animation: isPaused ? 'none' : 'slideProgress 3.5s linear forwards',
                      width: isPaused ? '0%' : undefined
                    }}
                  />
                </div>
              )}

              {/* Smooth Slide Track Container */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${Math.max(imagesList.length, 1) * 100}%`,
                height: '100%',
                display: 'flex',
                transform: `translateX(-${(currentImageIndex * 100) / Math.max(imagesList.length, 1)}%)`,
                transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                willChange: 'transform'
              }}>
                {(imagesList.length > 0 ? imagesList : [item.cover || item.image_url]).map((imgSrc, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      width: `${100 / Math.max(imagesList.length, 1)}%`,
                      height: '100%',
                      flexShrink: 0,
                      overflow: 'hidden',
                      background: '#111827'
                    }}
                  >
                    {/* Layer 1: Blurred Backdrop */}
                    <img
                      src={imgSrc}
                      alt=""
                      aria-hidden="true"
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
                        zIndex: 1
                      }}
                    />
                    {/* Layer 2: Main Contained Image */}
                    <WatermarkedImage
                      src={imgSrc}
                      alt={`${titleText} - Foto ${idx + 1}`}
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
                  </div>
                ))}
              </div>

              {/* Tombol Close Merah Bulat di Pojok Kanan Atas Gambar */}
              <button
                onClick={onClose}
                aria-label="Tutup modal"
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#EF4444',
                  color: '#FFFFFF',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.45)',
                  zIndex: 16
                }}
              >
                <X size={20} strokeWidth={2.8} />
              </button>

              {/* Badge Indikator Foto jika > 1 gambar */}
              {imagesList.length > 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  background: 'rgba(0, 0, 0, 0.65)',
                  color: '#FFFFFF',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  zIndex: 14,
                  backdropFilter: 'blur(4px)'
                }}>
                  {currentImageIndex + 1} / {imagesList.length}
                </div>
              )}

              {/* Tombol Slide Carousel Panah Kiri & Kanan (jika gambar > 1) */}
              {imagesList.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    aria-label="Foto Sebelumnya"
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: '1.5px solid rgba(0, 91, 171, 0.25)',
                      color: '#005BAB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      backdropFilter: 'blur(4px)',
                      zIndex: 14
                    }}
                  >
                    <ChevronLeft size={20} strokeWidth={2.5} />
                  </button>

                  <button
                    onClick={handleNextImage}
                    aria-label="Foto Selanjutnya"
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: '1.5px solid rgba(0, 91, 171, 0.25)',
                      color: '#005BAB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      backdropFilter: 'blur(4px)',
                      zIndex: 14
                    }}
                  >
                    <ChevronRight size={20} strokeWidth={2.5} />
                  </button>
                </>
              )}
            </div>

            {/* 2. Body Konten Mobile dengan padding samping dan bawah */}
            <div style={{ padding: '1.25rem 1.1rem 2rem 1.1rem' }}>
              
              {/* Baris 1: Strip Kategori ─────── Subkategori & Tombol Bagikan */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.65rem',
                marginBottom: '1rem'
              }}>
                {/* Kategori ─────── Subkategori */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  flex: 1,
                  minWidth: 0
                }}>
                  <span style={{
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: '#005BAB',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.category === 'desain-grafis' ? 'Desain Grafis' :
                     item.category === 'multimedia' ? 'Multimedia' :
                     item.category === 'aplikasi' ? 'Aplikasi' : (item.category || 'Desain Grafis')}
                  </span>

                  <div style={{
                    flex: 1,
                    height: '1.5px',
                    background: '#005BAB',
                    opacity: 0.65
                  }} />

                  <span style={{
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: '#005BAB',
                    whiteSpace: 'nowrap'
                  }}>
                    {subcatText || (lang === 'en' ? 'Design' : 'Desain')}
                  </span>
                </div>

                {/* Tombol Bagikan Pill Biru */}
                <button
                  type="button"
                  onClick={handleShare}
                  style={{
                    padding: '0.42rem 1.35rem',
                    borderRadius: '999px',
                    background: copied ? '#16A34A' : '#005BAB',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 91, 171, 0.25)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    flexShrink: 0
                  }}
                >
                  {copied ? <Check size={14} /> : null}
                  <span>{copied ? (lang === 'en' ? 'Copied!' : 'Tersalin!') : (lang === 'en' ? 'Share' : 'Bagikan')}</span>
                </button>
              </div>

              {/* Baris 2: Judul Karya & Tahun (Tahun di sebelah kanan bawah judul) */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: '0.75rem',
                marginBottom: '1.25rem'
              }}>
                <h2 style={{
                  margin: 0,
                  fontSize: '1.38rem',
                  fontWeight: 900,
                  color: '#005BAB',
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                  wordBreak: 'break-word',
                  flex: 1
                }}>
                  {titleText}
                </h2>

                {item.year && (
                  <span style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: '#005BAB',
                    whiteSpace: 'nowrap',
                    paddingBottom: '2px'
                  }}>
                    {item.year}
                  </span>
                )}
              </div>

              {/* Baris 3 & 4: Metadata 2 Kolom (Klien di kiri, Jenis Proyek di kanan, Alat/Software di bawah) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1.15rem 1rem',
                marginBottom: '1.45rem'
              }}>
                {/* Klien */}
                <div>
                  <span style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#4B6B9A',
                    marginBottom: '0.2rem'
                  }}>
                    {lang === 'en' ? 'Client' : 'Klien'}
                  </span>
                  <span style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#005BAB',
                    lineHeight: 1.25,
                    display: 'block'
                  }}>
                    {item.client || item.institution || '-'}
                  </span>
                </div>

                {/* Jenis Proyek */}
                <div>
                  <span style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#4B6B9A',
                    marginBottom: '0.2rem'
                  }}>
                    {lang === 'en' ? 'Project Type' : 'Jenis Proyek'}
                  </span>
                  <span style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#005BAB',
                    lineHeight: 1.25,
                    display: 'block'
                  }}>
                    {item.project_type || 'Pekerjaan'}
                  </span>
                </div>

                {/* Alat / Software */}
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#4B6B9A',
                    marginBottom: '0.2rem'
                  }}>
                    {lang === 'en' ? 'Tool / Software' : 'Alat/Software'}
                  </span>
                  <span style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#005BAB',
                    lineHeight: 1.25,
                    display: 'block'
                  }}>
                    {item.tools_used || item.framework || '-'}
                  </span>
                </div>
              </div>

              {/* Deskripsi Karya */}
              <div style={{ marginBottom: '1.35rem' }}>
                <h3 style={{
                  fontSize: '1.02rem',
                  fontWeight: 800,
                  color: '#005BAB',
                  margin: '0 0 0.45rem 0',
                  letterSpacing: '-0.01em'
                }}>
                  {lang === 'en' ? 'Artwork Description' : 'Deskripsi Karya'}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  lineHeight: 1.55,
                  color: '#28588E',
                  margin: 0,
                  fontWeight: 500,
                  whiteSpace: 'pre-line'
                }}>
                  {descText || (lang === 'en' ? 'No description available for this project.' : 'Belum ada deskripsi untuk karya ini.')}
                </p>
              </div>

              {/* Tag */}
              {Array.isArray(item.tags) && item.tags.length > 0 && (
                <div style={{ marginBottom: '1.75rem' }}>
                  <h4 style={{
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    color: '#005BAB',
                    margin: '0 0 0.4rem 0'
                  }}>
                    Tag
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem 0.55rem' }}>
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          color: '#005BAB'
                        }}
                      >
                        {tag.startsWith('#') ? tag : `#${tag}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Karya Lainnya + Button Selengkapnya + Grid 2 Kolom */}
              {otherWorks.length > 0 && (
                <div style={{
                  borderTop: '1.5px solid rgba(0, 91, 171, 0.12)',
                  paddingTop: '1.35rem'
                }}>
                  {/* Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    marginBottom: '1.15rem'
                  }}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 900,
                      color: '#005BAB',
                      margin: 0,
                      letterSpacing: '-0.01em'
                    }}>
                      {lang === 'en' ? 'Other Works' : 'Karya Lainnya'}
                    </h3>

                    <button
                      type="button"
                      onClick={() => {
                        if (onViewAllWorks) {
                          onViewAllWorks();
                        } else {
                          onClose();
                        }
                      }}
                      style={{
                        padding: '0.42rem 1.25rem',
                        borderRadius: '999px',
                        background: '#005BAB',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '0.86rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0, 91, 171, 0.22)'
                      }}
                    >
                      {lang === 'en' ? 'See More' : 'Selengkapnya'}
                    </button>
                  </div>

                  {/* Grid 2 Kolom Card Karya Lainnya */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.75rem',
                    alignItems: 'stretch'
                  }}>
                    {otherWorks.map((otherItem) => (
                      <PortfolioCard
                        key={otherItem.id}
                        item={otherItem}
                        onClick={onSelectWork}
                        compact={true}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          </>
        )}

        {/* ── GDrive Video Fullscreen Overlay ── */}
        {isVideoFullscreen && videoEmbedUrl && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: '#000000',
              zIndex: 999999,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Tombol tutup fullscreen */}
            <button
              onClick={() => setIsVideoFullscreen(false)}
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                zIndex: 1000000,
                background: 'rgba(255,255,255,0.15)',
                border: '1.5px solid rgba(255,255,255,0.45)',
                backdropFilter: 'blur(6px)',
                color: '#FFFFFF',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
              title="Tutup Fullscreen"
            >
              <X size={20} />
            </button>
            {/* Iframe fullscreen */}
            <iframe
              src={videoEmbedUrl}
              title={titleText}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        )}

        <style>{`
          .detail-modal-scroll::-webkit-scrollbar { display: none; }

          /* Desktop vs Mobile Detail View Toggle */
          .detail-modal-desktop-view { display: block; }
          .detail-modal-mobile-view { display: none; }

          @media (max-width: 768px) {
            .detail-modal-overlay-wrap {
              padding: 0.65rem 0.5rem !important;
            }
            .detail-modal-inner-card {
              padding: 0 !important;
              border-radius: 28px !important;
              max-height: 96vh !important;
              overflow-x: hidden !important;
            }
            .detail-modal-desktop-view {
              display: none !important;
            }
            .detail-modal-mobile-view {
              display: block !important;
              width: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
            }
          }

          @keyframes slideProgress {
            from { width: 0%; }
            to   { width: 100%; }
          }
          
          /* Responsive 2 Columns Grid for Design Modal */
          @media (max-width: 768px) {
            .detail-two-col-grid {
              grid-template-columns: 1fr !important;
              gap: 1.5rem !important;
            }
            .detail-other-works-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 0.75rem !important;
            }
          }

          @media (max-width: 480px) {
            .detail-other-works-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 0.5rem !important;
            }
          }

          /* GDrive mobile hint: hidden by default (desktop), shown on mobile via media query */
          .gdrive-mobile-hint {
            display: none;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 0.6rem 1rem 0.75rem;
            background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%);
            flex-direction: column;
            align-items: center;
            gap: 0.45rem;
            z-index: 15;
          }
          .gdrive-hint-text {
            color: rgba(255,255,255,0.95);
            font-size: 0.78rem;
            font-weight: 600;
            text-align: center;
            margin: 0;
            line-height: 1.4;
            text-shadow: 0 2px 6px rgba(0,0,0,0.85);
          }
          .gdrive-hint-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            background: #005BAB;
            color: #FFFFFF;
            border: 2px solid rgba(255,255,255,0.4);
            border-radius: 999px;
            padding: 0.5rem 1.25rem;
            font-size: 0.85rem;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
            transition: all 0.2s ease;
          }
          .gdrive-hint-btn:active {
            background: #003d80;
            transform: scale(0.96);
          }
          .video-embed-container.is-gdrive {
            padding-top: 66% !important;
          }
          @media (max-width: 640px) {
            .gdrive-mobile-hint {
              display: flex !important;
              top: 50% !important;
              left: 50% !important;
              bottom: auto !important;
              transform: translate(-50%, -50%) !important;
              background: transparent !important;
              padding: 0 !important;
              width: 90% !important;
            }
            .video-embed-container {
              padding-top: 56.25% !important;
            }
            .video-embed-container.is-gdrive {
              padding-top: 80% !important;
              min-height: 265px !important;
              overflow: hidden !important;
            }
            .video-embed-container.is-gdrive iframe {
              top: -30px !important;
              height: calc(100% + 30px) !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

