import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ExternalLink, Calendar, User, Tag, Play, ChevronLeft, ChevronRight, Award, Briefcase, Building2, Sparkles, FolderKanban, Wrench, Code, Layers, Smartphone, Share2, Check, Maximize2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import WatermarkedImage from './WatermarkedImage';

export default function DetailModal({ item, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
  const { lang, t, getLocalizedField } = useLanguage();
  const autoSlideRef = useRef(null);
  const resumeTimerRef = useRef(null);

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

  useEffect(() => {
    setCurrentImageIndex(0);
    setIsPaused(false);
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
    <div className="modal-overlay" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        className="herta-card animate-fade-in detail-modal-scroll"
        style={{
          width: '100%',
          maxWidth: '880px',
          maxHeight: '92vh',
          overflowY: 'auto',
          borderRadius: 'var(--radius-lg)',
          background: '#FFF3DD',
          border: '2.5px solid #005BAB',
          position: 'relative',
          padding: 0,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {/* ─── JUDUL KARYA HEADER — STICKY ─── */}
        <div
          className="detail-modal-header"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 20,
            padding: '0.85rem 1.25rem',
            background: '#005BAB',
            borderBottom: '2.5px solid #003d80',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            flexWrap: 'nowrap',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)'
          }}
        >
          {/* Subkategori badge */}
          {subcatText && (
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              background: '#FFFFFF',
              color: '#005BAB',
              padding: '0.25rem 0.65rem',
              borderRadius: '999px',
              flexShrink: 0,
              whiteSpace: 'nowrap',
              marginTop: '0.15rem'
            }}>
              {subcatText}
            </span>
          )}

          {/* Judul Karya */}
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: 0,
            lineHeight: 1.3,
            flex: 1,
            minWidth: 0,
            wordBreak: 'break-word'
          }}>
            {titleText}
          </h2>

          {/* Tombol Tutup — di dalam header sticky */}
          <button
            onClick={onClose}
            style={{
              flexShrink: 0,
              background: '#FFFFFF',
              color: '#005BAB',
              border: '2.5px solid #FFFFFF',
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

        {/* Media Header (Video Embed or Image Carousel) */}
        <div style={{ position: 'relative', width: '100%', backgroundColor: '#FFFFFF', borderBottom: '2.5px solid #005BAB' }}>
          {videoEmbedUrl ? (
            <div
              className={`video-embed-container ${(videoEmbedUrl.includes('drive.google.com') || videoEmbedUrl.includes('docs.google.com')) ? 'is-gdrive' : ''}`}
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

              {/* Mobile-only fullscreen hint — hanya tampil di layar kecil untuk GDrive */}
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
          ) : (
            <div
              style={{ position: 'relative', background: '#111827', width: '100%', paddingTop: '56.25%', overflow: 'hidden' }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Progress bar auto-slide — hanya tampil jika > 1 gambar & tidak paused */}
              {imagesList.length > 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '3px',
                  background: 'rgba(255,255,255,0.2)',
                  zIndex: 10
                }}>
                  <div
                    key={`${currentImageIndex}-${isPaused}`}
                    style={{
                      height: '100%',
                      background: '#FFFFFF',
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
                width: `${imagesList.length * 100}%`,
                height: '100%',
                display: 'flex',
                transform: `translateX(-${(currentImageIndex * 100) / imagesList.length}%)`,
                transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                willChange: 'transform'
              }}>
                {imagesList.map((imgSrc, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      width: `${100 / imagesList.length}%`,
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
                    {/* Layer 2: Main Contained Image (Watermarked on save) */}
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

              {/* Carousel Controls (If > 1 Image) */}
              {imagesList.length > 1 && (
                <>
                  {/* Prev Button */}
                  <button
                    onClick={handlePrevImage}
                    className="detail-carousel-btn detail-carousel-btn-prev"
                    style={{
                      position: 'absolute',
                      left: '0.85rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: '#FFFFFF',
                      color: '#005BAB',
                      border: '2.5px solid #005BAB',
                      borderRadius: '999px',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0, 91, 171, 0.25)',
                      zIndex: 10
                    }}
                    title="Foto Sebelumnya"
                  >
                    <ChevronLeft size={22} />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={handleNextImage}
                    className="detail-carousel-btn detail-carousel-btn-next"
                    style={{
                      position: 'absolute',
                      right: '0.85rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: '#FFFFFF',
                      color: '#005BAB',
                      border: '2.5px solid #005BAB',
                      borderRadius: '999px',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0, 91, 171, 0.25)',
                      zIndex: 10
                    }}
                    title="Foto Selanjutnya"
                  >
                    <ChevronRight size={22} />
                  </button>

                  {/* Slide Counter Badge */}
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: '#005BAB',
                    color: '#FFFFFF',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    border: '1.5px solid #FFFFFF'
                  }}>
                    {lang === 'en' ? `Photo ${currentImageIndex + 1} of ${imagesList.length}` : `Foto ${currentImageIndex + 1} dari ${imagesList.length}`}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Thumbnail Strip Selector (If > 1 Image) */}
          {!videoEmbedUrl && imagesList.length > 1 && (
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              justifyContent: 'center',
              padding: '0.65rem',
              background: '#FFF3DD',
              borderTop: '1.5px solid #005BAB',
              overflowX: 'auto'
            }}>
              {imagesList.map((thumbSrc, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: idx === currentImageIndex ? '3px solid #005BAB' : '1.5px solid #005BAB',
                    opacity: idx === currentImageIndex ? 1 : 0.6,
                    transform: idx === currentImageIndex ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                    padding: 0
                  }}
                >
                  <WatermarkedImage src={thumbSrc} alt="" objectFit="cover" style={{ width: '100%', height: '100%' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail Content Body */}
        <div className="detail-modal-body" style={{ padding: '1.5rem' }}>
          {/* Metadata badges — aligned nicely left to right with spacious row gap */}
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
            {item.year && (
              <span style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#FFFFFF',
                background: '#005BAB',
                padding: '0.4rem 0.95rem',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                border: '1.5px solid #005BAB'
              }}>
                <Calendar size={14} />
                {t('detail_year')}: {item.year}
              </span>
            )}
            {item.institution && (
              <span style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#005BAB',
                background: '#FFF3DD',
                padding: '0.4rem 0.95rem',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                border: '1.5px solid #005BAB'
              }}>
                <Award size={15} />
                {item.institution}
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
                  background: '#FFF3DD',
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
                <span>{lang === 'en' ? 'Project Type' : 'Jenis Proyek'}: {item.project_type}</span>
              </span>
            )}
            {(isMobileApp || isWebApp) && item.development_method && (
              <span
                className="detail-modal-method-badge"
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  background: '#005BAB',
                  padding: '0.4rem 0.95rem',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  border: '1.5px solid #005BAB'
                }}
              >
                <Code size={15} />
                <span>{lang === 'en' ? 'Method' : 'Metode'}: {item.development_method}</span>
              </span>
            )}
            {item.tools_used && (
              <span
                className="detail-modal-tools-badge"
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: '#005BAB',
                  background: '#FFF3DD',
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
            {(isMobileApp || isWebApp) && item.framework && (
              <span
                className="detail-modal-framework-badge"
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: '#005BAB',
                  background: '#FFF3DD',
                  padding: '0.4rem 0.95rem',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  border: '1.5px solid #005BAB'
                }}
              >
                <Layers size={15} />
                <span>Framework: {item.framework}</span>
              </span>
            )}
            {isUIUX && item.platform && (
              <span
                className="detail-modal-platform-badge"
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  background: '#005BAB',
                  padding: '0.4rem 0.95rem',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  border: '1.5px solid #005BAB'
                }}
              >
                <Smartphone size={15} />
                <span>Platform: {item.platform}</span>
              </span>
            )}
          </div>

          {/* Peran Hamdani — Khusus Kategori Multimedia Subkategori Film */}
          {isMultimediaFilm && item.role && item.role.trim() !== '' && (
            <div className="role-pill-wrapper" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#005BAB',
              color: '#FFFFFF',
              padding: '0.5rem 1.1rem',
              borderRadius: '999px',
              fontSize: '0.88rem',
              fontWeight: 800,
              marginBottom: '1rem',
              border: '2px solid #005BAB',
              boxShadow: '0 4px 12px rgba(0,91,171,0.18)'
            }}>
              <Award className="role-pill-icon" size={16} />
              <span>{lang === 'en' ? 'Hamdani as' : 'Peran Hamdani sebagai'}:</span>
              <span className="role-pill-value" style={{ background: '#FFFFFF', color: '#005BAB', padding: '0.15rem 0.7rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 800 }}>
                {item.role}
              </span>
            </div>
          )}

          {/* Description */}
          <div style={{
            fontSize: '0.92rem',
            color: '#005BAB',
            fontWeight: 600,
            lineHeight: 1.6,
            marginBottom: '1.5rem',
            whiteSpace: 'pre-line',
            background: '#FFFFFF',
            padding: '1.25rem',
            borderRadius: '20px',
            border: '2px solid #005BAB'
          }}>
            {descText}
          </div>

          {/* Software / Tech Tags */}
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

          {/* Bottom Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: '2px solid #005BAB' }}>

            {appOrProjLink && !isVideografi && (
              <a
                href={appOrProjLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ background: '#005BAB', color: '#FFFFFF' }}
              >
                <span>
                  {isUIUX
                    ? t('detail_btn_prototype')
                    : (isMobileApp || isWebApp || isAplikasiCategory)
                      ? (lang === 'en' ? 'Try App' : 'Coba Aplikasi')
                      : t('detail_btn_project')}
                </span>
                <ExternalLink size={16} />
              </a>
            )}

            {/* Share Link Button (Khusus Karya) */}
            {item.category && (
              <button
                type="button"
                onClick={handleShare}
                className="btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: copied ? '#005BAB' : '#FFF3DD',
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
          @keyframes slideProgress {
            from { width: 0%; }
            to   { width: 100%; }
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
          /* Google Drive preview player has its own UI chrome (top timeline + bottom controls)
             that require extra height beyond pure 16:9 to avoid overlap — applies all screen sizes */
          .video-embed-container.is-gdrive {
            padding-top: 66% !important;
          }
          @media (max-width: 640px) {
            /* Show mobile fullscreen hint on small screens centered directly over play button */
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
            /* Mobile: GDrive chrome ~80px on 375px screen → ratio ≈ 80% for safety.
               Shift iframe up 30px to clip the weird top-timeline bar. */
            .video-embed-container.is-gdrive {
              padding-top: 80% !important;
              min-height: 265px !important;
              overflow: hidden !important;
            }
            .video-embed-container.is-gdrive iframe {
              top: -30px !important;
              height: calc(100% + 30px) !important;
            }
            .detail-modal-header {
              padding: 0.75rem 0.85rem !important;
            }
            .detail-modal-body {
              padding: 1rem 0.85rem !important;
            }
            .detail-carousel-btn-prev {
              left: 0.5rem !important;
              width: 36px !important;
              height: 36px !important;
            }
            .detail-carousel-btn-next {
              right: 0.5rem !important;
              width: 36px !important;
              height: 36px !important;
            }
            /* Peran Hamdani pill — mobile fix */
            .role-pill-wrapper {
              flex-wrap: wrap !important;
              justify-content: center !important;
              padding: 0.6rem 1rem !important;
            }
            .role-pill-icon {
              width: 16px !important;
              height: 16px !important;
              min-width: 16px !important;
              flex-shrink: 0 !important;
            }
            .role-pill-value {
              font-weight: 400 !important;
              text-align: center !important;
              padding: 0.35rem 0.7rem !important;
              margin-top: 0.25rem !important;
              margin-bottom: 0.25rem !important;
              width: 100% !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
