import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Mail, MapPin, Palette, Video, Code, FileText, Download, MessageSquare, Award, ExternalLink, ChevronLeft, ChevronRight, Image as ImageIcon, Home, Calendar, Share2, Globe, Send, SearchX, Check, Loader2, Laptop } from 'lucide-react';
import { infoService } from '../services/infoService';
import { useLanguage } from '../context/LanguageContext';
import { usePersona } from '../context/PersonaContext';
import WatermarkedImage from './WatermarkedImage';
import MetadataCopyBtn from './MetadataCopyBtn';

function VisitorEmptyState({ 
  icon: Icon = SearchX, 
  title = "Belum Ada Data Available", 
  description = "Belum ada berkas atau data yang tersedia di kategori ini." 
}) {
  return (
    <div style={{ width: '100%', padding: '2.5rem 1rem', textAlign: 'center' }}>
      <div
        className="herta-card"
        style={{
          maxWidth: '460px',
          margin: '0 auto',
          padding: '2.5rem 1.75rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          background: '#FFFFFF',
          borderRadius: '32px',
          border: '2.5px solid #005BAB'
        }}
      >
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '999px',
          background: '#FFFFFF',
          color: '#005BAB',
          border: '2.5px solid #005BAB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={32} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#005BAB', marginBottom: '0.4rem' }}>{title}</h3>
          <p style={{ color: '#005BAB', fontSize: '0.88rem', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function ExpMediaCarousel({ mediaList, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!mediaList || mediaList.length === 0) return null;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      paddingTop: '62%',
      borderBottomLeftRadius: '26px',
      borderBottomRightRadius: '26px',
      overflow: 'hidden',
      background: '#111827',
      boxShadow: '0 8px 24px rgba(0, 20, 60, 0.16)',
      zIndex: 2
    }}>
      {/* Sliding Track */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${mediaList.length * 100}%`,
        height: '100%',
        display: 'flex',
        transform: `translateX(-${(currentIndex * 100) / mediaList.length}%)`,
        transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
        willChange: 'transform'
      }}>
        {mediaList.map((imgSrc, idx) => (
          <div
            key={idx}
            style={{
              position: 'relative',
              width: `${100 / mediaList.length}%`,
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
              alt={`${title} - Foto ${idx + 1}`}
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

      {/* Navigation Buttons if > 1 photo */}
      {mediaList.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev === 0 ? mediaList.length - 1 : prev - 1));
            }}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#005BAB',
              border: '1.5px solid rgba(0, 91, 171, 0.25)',
              borderRadius: '999px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              backdropFilter: 'blur(4px)',
              zIndex: 10
            }}
            title="Foto Sebelumnya"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev === mediaList.length - 1 ? 0 : prev + 1));
            }}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#005BAB',
              border: '1.5px solid rgba(0, 91, 171, 0.25)',
              borderRadius: '999px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              backdropFilter: 'blur(4px)',
              zIndex: 10
            }}
            title="Foto Selanjutnya"
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>

          {/* Indicator Badge */}
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
            backdropFilter: 'blur(4px)',
            zIndex: 10
          }}>
            {currentIndex + 1} / {mediaList.length}
          </div>
        </>
      )}
    </div>
  );
}

export default function InfoModal({ activeType, onClose, onSelectCertificate }) {
  const [experiences, setExperiences] = useState([]);
  const [documentsList, setDocumentsList] = useState([]);
  const [contactsList, setContactsList] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [certificatesList, setCertificatesList] = useState([]);
  const [softwareSkillsList, setSoftwareSkillsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang, t, getLocalizedField } = useLanguage();
  const { persona } = usePersona();

  const isMgd = persona === 'mgd';
  const isMs  = persona === 'ms';
  const isDpd = persona === 'dpd';

  // Filter dokumen berdasarkan persona aktif
  const filteredDocuments = documentsList.filter(doc => {
    const p = doc.persona || 'both';
    if (p === 'both' || p === 'all' || !doc.persona) return true;
    return p === persona;
  });

  const currentTagline = persona === 'mgd'
    ? (lang === 'en' ? (profileData?.tagline_mgd_en || profileData?.tagline_mgd || profileData?.tagline_en || 'Graphic Designer') : (profileData?.tagline_mgd || profileData?.tagline || 'Graphic Designer'))
    : persona === 'ms'
    ? (lang === 'en' ? (profileData?.tagline_ms_en || profileData?.tagline_ms || profileData?.tagline_en || 'Multimedia Specialist') : (profileData?.tagline_ms || profileData?.tagline || 'Multimedia Specialist'))
    : (lang === 'en' ? (profileData?.tagline_dpd_en || profileData?.tagline_dpd || profileData?.tagline_en || 'Digital Product Designer') : (profileData?.tagline_dpd || profileData?.tagline || 'Digital Product Designer'));

  const currentBio = persona === 'mgd'
    ? (lang === 'en' ? (profileData?.bio_mgd_en || profileData?.bio_mgd || profileData?.bio_en || t('hero_bio')) : (profileData?.bio_mgd || profileData?.bio || t('hero_bio')))
    : persona === 'ms'
    ? (lang === 'en' ? (profileData?.bio_ms_en || profileData?.bio_ms || profileData?.bio_en || t('hero_bio')) : (profileData?.bio_ms || profileData?.bio || t('hero_bio')))
    : (lang === 'en' ? (profileData?.bio_dpd_en || profileData?.bio_dpd || profileData?.bio_en || t('hero_bio')) : (profileData?.bio_dpd || profileData?.bio || t('hero_bio')));

  useEffect(() => {
    let isMounted = true;
    const loadAll = async () => {
      setLoading(true);
      try {
        const [exps, docs, cnts, prof, certs, sskills] = await Promise.all([
          infoService.getExperiences(),
          infoService.getDocuments(),
          infoService.getContacts(),
          infoService.getProfile(),
          infoService.getCertificates(),
          infoService.getSoftwareSkills()
        ]);
        if (isMounted) {
          setExperiences(exps || []);
          setDocumentsList(docs || []);
          setContactsList(cnts || []);
          setProfileData(prof || {});
          setCertificatesList(certs || []);
          setSoftwareSkillsList(sskills || []);
        }
      } catch (err) {
        console.error('Failed to load info modal data:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (activeType) {
      loadAll();
    } else {
      setLoading(true);
    }

    const handleUpdate = () => loadAll();
    window.addEventListener('portoda_info_updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('portoda_info_updated', handleUpdate);
    };
  }, [activeType]);

  const [copiedDocId, setCopiedDocId] = useState(null);

  const handleShareDocument = (doc) => {
    if (!doc || !doc.id) return;
    const shareUrl = `${window.location.origin}/?doc=${doc.id}`;

    const copyFallback = (text) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedDocId(doc.id);
        setTimeout(() => setCopiedDocId(null), 3000);
      } catch (err) {
        console.error('Fallback copy failed', err);
      }
      document.body.removeChild(textArea);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedDocId(doc.id);
        setTimeout(() => setCopiedDocId(null), 3000);
      }).catch(() => {
        copyFallback(shareUrl);
      });
    } else {
      copyFallback(shareUrl);
    }
  };

  const handleDownload = async (doc) => {
    const docTitle = getLocalizedField(doc, 'title');
    const rawUrl = doc.file_url || doc.fileUrl || doc.file_path || doc.url || '';
    const fileName = doc.file_name || doc.fileName || `${docTitle || 'Dokumen'}.pdf`;

    if (!rawUrl) {
      alert(lang === 'en' ? 'Document file is not available.' : 'Berkas dokumen belum tersedia.');
      return;
    }

    // Build absolute URL
    const fileUrl = rawUrl.startsWith('http') ? rawUrl
      : rawUrl.startsWith('/')
        ? `${window.location.origin}${rawUrl}`
        : `${window.location.origin}/${rawUrl}`;

    try {
      const res = await fetch(fileUrl, { method: 'GET', credentials: 'same-origin' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
    } catch (e) {
      console.error('Download via fetch failed, falling back:', e);
      // Fallback: open in new tab
      window.open(fileUrl, '_blank');
    }
  };

  // Auto download document if opened via share link (?doc=ID or ?document=ID)
  useEffect(() => {
    if (activeType === 'dokumen' && documentsList && documentsList.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const targetDocId = urlParams.get('doc') || urlParams.get('document');
      if (targetDocId) {
        const foundDoc = documentsList.find(d => String(d.id) === String(targetDocId));
        if (foundDoc) {
          handleDownload(foundDoc);
        }
      }
    }
  }, [activeType, documentsList]);

  if (!activeType) return null;

  const isModernModal = activeType === 'pengalaman' || activeType === 'sertifikat';
  const modalBg = '#FFFFFF';
  const modalColor = '#005BAB';
  const modalBorder = isModernModal ? 'none' : '2.5px solid #005BAB';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        className="herta-card animate-fade-in modal-no-scrollbar"
        style={{
          width: '100%',
          maxWidth: isModernModal ? '860px' : '840px',
          maxHeight: 'min(92vh, 92dvh)',
          overflowY: 'auto',
          borderRadius: isModernModal ? '36px' : 'var(--radius-lg)',
          background: modalBg,
          border: modalBorder,
          color: modalColor,
          position: 'relative',
          padding: isModernModal ? '1.75rem 1.75rem 2rem' : '2rem',
          boxShadow: isModernModal ? '0 25px 60px -15px rgba(0, 0, 0, 0.28)' : '0 20px 45px rgba(0, 0, 0, 0.08)',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Tutup modal"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            zIndex: 30,
            background: isModernModal ? '#EF4444' : '#FFFFFF',
            color: '#FFFFFF',
            border: 'none',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: isModernModal ? '0 4px 14px rgba(239, 68, 68, 0.45)' : 'none',
            transition: 'transform 0.18s ease, background 0.18s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
            if (isModernModal) e.currentTarget.style.background = '#DC2626';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            if (isModernModal) e.currentTarget.style.background = '#EF4444';
          }}
          title="Tutup (ESC)"
        >
          <X size={18} strokeWidth={2.8} />
        </button>

        {/* Loading Spinner State */}
        {loading ? (
          <div style={{
            padding: '4rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            minHeight: '280px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '999px',
              background: '#FFFFFF',
              border: '2.5px solid #005BAB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Loader2 size={30} color="#005BAB" className="animate-spin" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: modalColor, margin: 0 }}>
                {lang === 'en' ? 'Loading Data...' : 'Memuat Data...'}
              </h4>
              <p style={{ fontSize: '0.82rem', fontWeight: 600, color: modalColor, opacity: 0.8, marginTop: '0.35rem', margin: 0 }}>
                {lang === 'en' ? 'Please wait a moment while we prepare the content.' : 'Mohon tunggu sebentar, sedang menyinkronkan data.'}
              </p>
            </div>
          </div>
        ) : (
          <>
        {/* --- DOKUMEN HAMDANI --- */}
        {activeType === 'dokumen' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '0.5rem', paddingRight: '3.6rem' }}>
              <div style={{ padding: '0.6rem', borderRadius: '14px', background: '#FFFFFF', color: '#005BAB', border: '2px solid #005BAB', flexShrink: 0 }}>
                <FileText size={28} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#005BAB', lineHeight: 1.3, wordBreak: 'break-word', margin: 0 }}>{t('doc_title')}</h2>
                <p style={{ fontSize: '0.88rem', color: '#005BAB', fontWeight: 700, marginTop: '0.25rem' }}>
                  {lang === 'en' ? 'Please download Hamdani CV if needed' : 'Silahkan Unduh Berkas CV Hamdani Jika Diperlukan'}
                </p>
              </div>
            </div>

            {/* Grid Dokumen Dynamic — filtered by persona */}
            {filteredDocuments.length === 0 ? (
              <VisitorEmptyState
                icon={SearchX}
                title={lang === 'en' ? 'No Documents Available' : 'Belum Ada Dokumen Tersedia'}
                description={lang === 'en' ? 'Documents and PDF files will appear here once uploaded.' : 'Berkas CV, Portofolio PDF, dan dokumen resmi Hamdani akan tampil di sini setelah diunggah.'}
              />
            ) : (
              <div
                className="docs-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1.2rem',
                  alignItems: 'start'
                }}
              >
                {filteredDocuments.map((doc) => {
                  const docTitle = getLocalizedField(doc, 'title');
                  const docType = getLocalizedField(doc, 'type');
                  const docDesc = getLocalizedField(doc, 'description');
                  const docCategory = doc.category || 'CV ATS';
                  const isCopied = copiedDocId === doc.id;

                  return (
                    <div key={doc.id} className="herta-card" style={{ padding: '1.35rem', background: '#FFFFFF', border: '2px solid #005BAB', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', minWidth: 0 }}>
                      <span style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: docCategory === 'CV Kreatif' ? '#FEF3C7' : docCategory === 'Portofolio' ? '#D1FAE5' : '#EEF2FF',
                        color: docCategory === 'CV Kreatif' ? '#D97706' : docCategory === 'Portofolio' ? '#059669' : '#4F46E5',
                        border: `1.5px solid ${docCategory === 'CV Kreatif' ? '#D97706' : docCategory === 'Portofolio' ? '#059669' : '#4F46E5'}`,
                        padding: '0.15rem 0.6rem',
                        borderRadius: '999px',
                        zIndex: 2
                      }}>
                        {docCategory}
                      </span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', marginBottom: '0.85rem', paddingRight: '5.5rem' }}>
                          <div style={{ padding: '0.5rem', borderRadius: '10px', background: '#FFFFFF', color: '#005BAB', border: '1.5px solid #005BAB', flexShrink: 0 }}>
                            <FileText size={20} />
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#005BAB' }}>{docTitle}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.15rem' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#005BAB', opacity: 0.85 }}>{docType}</span>
                            </div>
                          </div>
                        </div>
                        {docDesc && (
                          <p style={{ fontSize: '0.86rem', color: '#005BAB', fontWeight: 600, lineHeight: 1.5, marginBottom: '1.25rem' }}>
                            {docDesc}
                          </p>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="btn-primary"
                          style={{ flex: 1, justifyContent: 'center', fontSize: '0.88rem', padding: '0.6rem 1rem' }}
                        >
                          <Download size={16} />
                          <span>{t('doc_download')}</span>
                        </button>
                        <button
                          onClick={() => handleShareDocument(doc)}
                          className={isCopied ? "btn-green" : "btn-secondary"}
                          style={{ padding: '0.6rem 0.85rem', borderRadius: '12px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                          title="Bagikan Tautan Dokumen"
                        >
                          {isCopied ? <Check size={16} /> : <Share2 size={16} />}
                          <span>{isCopied ? 'Tersalin!' : 'Bagikan'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- PROFIL HAMDANI --- */}
        {activeType === 'profil' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '0.5rem', paddingRight: '3.6rem' }}>
              <div style={{ padding: '0.6rem', borderRadius: '14px', background: '#FFFFFF', color: '#005BAB', border: '2px solid #005BAB', flexShrink: 0 }}>
                <User size={28} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#005BAB', lineHeight: 1.3, wordBreak: 'break-word', margin: 0 }}>{t('profile_title')} — {profileData.name || 'Hamdani'}</h2>
                <p style={{ fontSize: '0.88rem', color: '#005BAB', fontWeight: 700, marginTop: '0.25rem' }}>
                  {currentTagline}
                </p>
              </div>
            </div>

            {/* Bio Card */}
            <div className="herta-card" style={{ padding: '1.5rem', background: '#FFFFFF', border: '2px solid #005BAB', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#005BAB', margin: 0 }}>
                  {lang === 'en' ? `About ${profileData.name || 'Hamdani'}` : `Tentang ${profileData.name || 'Hamdani'}`}
                </h3>
                <MetadataCopyBtn text={currentBio} label="Tentang" />
              </div>
              <p style={{ fontSize: '0.95rem', color: '#005BAB', fontWeight: 400, lineHeight: 1.65, whiteSpace: 'pre-line', margin: 0 }}>
                {currentBio}
              </p>
            </div>

            {/* Domisili & Data Diri Card */}
            <div className="herta-card" style={{ padding: '1.5rem', background: '#FFFFFF', border: '2px solid #005BAB', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#005BAB', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={20} style={{ flexShrink: 0 }} />
                <span>{t('profile_domisili_heading')}</span>
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div style={{ background: '#FFFFFF', padding: '1.1rem 1rem', borderRadius: '14px', border: '1.5px solid #005BAB', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 800, color: '#005BAB', fontSize: '0.85rem' }}>
                      <MapPin size={16} style={{ flexShrink: 0 }} />
                      <span style={{ lineHeight: 1.3 }}>{t('profile_domisili')}</span>
                    </div>
                    <MetadataCopyBtn text={getLocalizedField(profileData, 'domisili') || 'Kota Jambi, Indonesia'} label="Domisili" />
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 400, color: '#005BAB', lineHeight: 1.5 }}>
                    {getLocalizedField(profileData, 'domisili') || 'Kota Jambi, Indonesia'}
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '1.1rem 1rem', borderRadius: '14px', border: '1.5px solid #005BAB', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 800, color: '#005BAB', fontSize: '0.85rem', flex: 1, minWidth: 0 }}>
                      <Home size={16} style={{ flexShrink: 0 }} />
                      <span style={{ lineHeight: 1.3 }}>{t('profile_residence')}</span>
                    </div>
                    <MetadataCopyBtn text={getLocalizedField(profileData, 'tempat_tinggal') || 'Kota Jambi, Indonesia'} label="Tempat Tinggal" />
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 400, color: '#005BAB', lineHeight: 1.5 }}>
                    {getLocalizedField(profileData, 'tempat_tinggal') || 'Kota Jambi, Indonesia'}
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '1.1rem 1rem', borderRadius: '14px', border: '1.5px solid #005BAB', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 800, color: '#005BAB', fontSize: '0.85rem' }}>
                    <Calendar size={16} style={{ flexShrink: 0 }} />
                    <span style={{ lineHeight: 1.3 }}>{t('profile_ttl')}</span>
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 400, color: '#005BAB', lineHeight: 1.5 }}>
                    {getLocalizedField(profileData, 'ttl') || 'Jambi, 14 Mei 1998'}
                  </div>
                </div>
              </div>
            </div>

            {/* Keahlian & Spesialisasi */}
            {profileData.skills && profileData.skills.length > 0 && (
              <div className="herta-card" style={{ padding: '1.5rem', background: '#FFFFFF', border: '2px solid #005BAB' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#005BAB', marginBottom: '1rem' }}>
                  {t('profile_skills_heading')}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {profileData.skills.map((skill, index) => (
                    <div key={skill.id || index} style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1.5px solid #005BAB' }}>
                      <div style={{ marginBottom: '0.45rem' }}>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          background: skill.category === 'Hard Skill' ? '#10B981' : '#005BAB',
                          color: '#FFFFFF',
                          padding: '0.12rem 0.55rem',
                          borderRadius: '999px',
                          display: 'inline-block'
                        }}>
                          {skill.category || 'Soft Skill'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontWeight: 800, color: '#005BAB', marginBottom: '0.4rem' }}>
                        <Award size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ wordBreak: 'break-word', lineHeight: 1.35 }}>{getLocalizedField(skill, 'title')}</span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#005BAB', fontWeight: 600 }}>{getLocalizedField(skill, 'desc')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* --- PENGALAMAN KERJA --- */}
        {activeType === 'pengalaman' && (
          <div>
            <div style={{ marginBottom: '1.5rem', paddingRight: '3.5rem' }}>
              <h2 style={{
                fontSize: '1.65rem',
                fontWeight: 800,
                color: '#005BAB',
                lineHeight: 1.25,
                margin: 0,
                letterSpacing: '-0.02em',
              }}>
                Pengalaman dan Organisasi
              </h2>
            </div>

            {/* Timeline Experience List Dynamic (2 columns desktop, 1 column mobile) */}
            {experiences.length === 0 ? (
              <VisitorEmptyState
                icon={SearchX}
                title={lang === 'en' ? 'No Experience Listed' : 'Belum Ada Pengalaman'}
                description={lang === 'en' ? 'Experience track record will appear here.' : 'Daftar rekam jejak karir dan pengalaman profesional Hamdani akan tampil di sini.'}
              />
            ) : (
              <div className="experience-grid">
                {experiences.map((exp) => {
                  const expMedia = Array.isArray(exp.media) && exp.media.length > 0
                    ? exp.media
                    : (Array.isArray(exp.images) && exp.images.length > 0 ? exp.images : []);

                  return (
                    <div
                      key={exp.id}
                      className="herta-card experience-card"
                      style={{
                        padding: 0,
                        background: '#FFFFFF',
                        border: 'none',
                        borderRadius: '28px',
                        boxShadow: '0 8px 30px rgba(0, 40, 100, 0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        minWidth: 0
                      }}
                    >
                      {/* Media Gambar Carousel di Paling Atas (Full Width, No Margin, No Padding) */}
                      {expMedia.length > 0 && (
                        <ExpMediaCarousel mediaList={expMedia} title={getLocalizedField(exp, 'title')} />
                      )}

                      {/* Body Konten Card Pengalaman */}
                      <div style={{ padding: '1.25rem 1.25rem 1.65rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        
                        {/* Baris Strip Periode / Waktu */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          width: '100%'
                        }}>
                          <span style={{
                            fontSize: '0.86rem',
                            fontWeight: 700,
                            color: '#005BAB',
                            whiteSpace: 'nowrap'
                          }}>
                            {getLocalizedField(exp, 'period') || 'Okt 2024 – Okt 2026'}
                          </span>

                          <div style={{
                            flex: 1,
                            height: '1.5px',
                            background: '#005BAB',
                            opacity: 0.65
                          }} />
                        </div>

                        {/* Judul Posisi / Pekerjaan */}
                        <h3 style={{
                          fontSize: '1.35rem',
                          fontWeight: 900,
                          color: '#005BAB',
                          margin: 0,
                          lineHeight: 1.25,
                          letterSpacing: '-0.02em',
                          wordBreak: 'break-word'
                        }}>
                          {getLocalizedField(exp, 'title')}
                        </h3>

                        {/* Pill Badges: Tipe Pengalaman & Tipe Pekerjaan Sesuai Skema Warna Lampiran */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                          {/* Badge Tipe Pengalaman */}
                          {(() => {
                            const rawType = (exp.experience_type || 'Kerja').trim();
                            const typeLower = rawType.toLowerCase();

                            let bg = '#D0FF97'; // default Kerja
                            if (typeLower.includes('magang') || typeLower.includes('intern')) {
                              bg = '#FFF455';
                            } else if (typeLower.includes('organisasi') || typeLower.includes('org')) {
                              bg = '#62B6FF';
                            } else if (typeLower.includes('freelance')) {
                              bg = '#E1E1E1';
                            } else if (typeLower.includes('kerja') || typeLower.includes('work')) {
                              bg = '#D0FF97';
                            }

                            return (
                              <span style={{
                                fontSize: '0.88rem',
                                fontWeight: 800,
                                background: bg,
                                color: '#005BAB',
                                border: 'none',
                                padding: '0.38rem 1.15rem',
                                borderRadius: '999px',
                                letterSpacing: '-0.01em',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                              }}>
                                {rawType}
                              </span>
                            );
                          })()}

                          {/* Badge Tipe Pekerjaan */}
                          {exp.employment_type && (() => {
                            const rawEmp = exp.employment_type.trim();
                            const empLower = rawEmp.toLowerCase();

                            // Localization mapping: Full Time -> Penuh Waktu jika bahasa ID
                            let label = rawEmp;
                            if (lang !== 'en') {
                              if (empLower === 'full time' || empLower === 'fulltime') label = 'Penuh Waktu';
                            }

                            let bg = '#D0FF97'; // default Penuh Waktu
                            if (empLower.includes('kontrak') || empLower.includes('contract')) {
                              bg = '#FFF455';
                            } else if (empLower.includes('remote')) {
                              bg = '#62B6FF';
                            } else if (empLower.includes('penuh waktu') || empLower.includes('full time') || empLower.includes('fulltime')) {
                              bg = '#D0FF97';
                            } else if (empLower.includes('part time') || empLower.includes('paruh waktu')) {
                              bg = '#E1E1E1';
                            }

                            return (
                              <span style={{
                                fontSize: '0.88rem',
                                fontWeight: 800,
                                background: bg,
                                color: '#005BAB',
                                border: 'none',
                                padding: '0.38rem 1.15rem',
                                borderRadius: '999px',
                                letterSpacing: '-0.01em',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                              }}>
                                {label}
                              </span>
                            );
                          })()}

                          {/* Nama Instansi / Perusahaan jika ada */}
                          {exp.company && (
                            <span style={{
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              background: '#F0F7FF',
                              color: '#005BAB',
                              border: '1.5px solid rgba(0, 91, 171, 0.25)',
                              padding: '0.35rem 1rem',
                              borderRadius: '999px',
                              letterSpacing: '-0.01em'
                            }}>
                              {exp.company}
                            </span>
                          )}
                        </div>

                        {/* Deskripsi List Pengalaman Berurutan */}
                        {getLocalizedField(exp, 'description') && (
                          <div style={{ marginTop: '0.4rem' }}>
                            {(() => {
                              const rawDesc = getLocalizedField(exp, 'description') || '';
                              const lines = rawDesc
                                .split(/\r?\n/)
                                .map(l => l.trim())
                                .filter(Boolean);

                              if (lines.length > 1) {
                                return (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                    {lines.map((line, idx) => {
                                      const cleanText = line.replace(/^\d+[.)]\s*/, '');
                                      return (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                                          <span style={{
                                            fontSize: '0.88rem',
                                            fontWeight: 600,
                                            color: '#28588E',
                                            lineHeight: 1.55,
                                            flexShrink: 0
                                          }}>
                                            {idx + 1}.
                                          </span>
                                          <p style={{
                                            fontSize: '0.88rem',
                                            fontWeight: 500,
                                            color: '#28588E',
                                            lineHeight: 1.55,
                                            margin: 0
                                          }}>
                                            {cleanText}
                                          </p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              }

                              return (
                                <p style={{
                                  fontSize: '0.88rem',
                                  fontWeight: 500,
                                  color: '#28588E',
                                  lineHeight: 1.55,
                                  whiteSpace: 'pre-line',
                                  margin: 0
                                }}>
                                  {rawDesc}
                                </p>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- KONTAK --- */}
        {activeType === 'kontak' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '0.5rem', paddingRight: '3.6rem' }}>
              <div style={{ padding: '0.6rem', borderRadius: '14px', background: '#FFFFFF', color: '#005BAB', border: '2px solid #005BAB', flexShrink: 0 }}>
                <Mail size={28} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#005BAB', lineHeight: 1.3, wordBreak: 'break-word', margin: 0 }}>{t('contact_title')}</h2>
                <p style={{ fontSize: '0.88rem', color: '#005BAB', fontWeight: 700, marginTop: '0.25rem' }}>
                  {t('contact_sub')}
                </p>
              </div>
            </div>

            {/* Contact Action Buttons Grid Dynamic */}
            {contactsList.length === 0 ? (
              <VisitorEmptyState
                icon={SearchX}
                title={lang === 'en' ? 'No Contact Information' : 'Belum Ada Informasi Kontak'}
                description={lang === 'en' ? 'Contact details will appear here.' : 'Informasi dan media komunikasi langsung Hamdani akan tampil di sini.'}
              />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                {contactsList.map((c) => {
                  const isLink = Boolean(c.url);
                  const cTitle = getLocalizedField(c, 'title');
                  const cSubtext = getLocalizedField(c, 'subtext') || (lang === 'en' ? 'Open Link' : 'Buka Link');

                  return (
                    <div
                      key={c.id}
                      className="herta-card"
                      style={{
                        padding: '1.35rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        background: '#FFFFFF',
                        borderRadius: '20px',
                        border: '2.5px solid #005BAB',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                        <div style={{ padding: '0.65rem', borderRadius: '12px', background: '#FFFFFF', color: '#005BAB', border: '1.5px solid #005BAB', flexShrink: 0 }}>
                          {c.type === 'email' ? <Mail size={24} /> : c.type === 'social' ? <Globe size={24} /> : <MessageSquare size={24} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#005BAB', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.2rem' }}>
                            {cTitle}
                          </div>
                          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#005BAB', wordBreak: 'break-word' }}>
                            {c.value}
                          </div>
                        </div>
                      </div>

                      {/* Tombol yang ketika diklik mengarah ke URL Link */}
                      {isLink ? (
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary"
                          style={{
                            width: '100%',
                            justifyContent: 'center',
                            padding: '0.65rem 1rem',
                            fontSize: '0.9rem',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            gap: '0.5rem',
                            boxSizing: 'border-box'
                          }}
                        >
                          <span>{cSubtext}</span>
                          <ExternalLink size={16} />
                        </a>
                      ) : (
                        <button
                          disabled
                          className="btn-secondary"
                          style={{
                            width: '100%',
                            justifyContent: 'center',
                            padding: '0.65rem 1rem',
                            fontSize: '0.9rem',
                            borderRadius: '12px',
                            opacity: 0.7
                          }}
                        >
                          <span>{cSubtext}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- SERTIFIKAT --- */}
        {activeType === 'sertifikat' && (
          <div>
            <div style={{ marginBottom: '1.5rem', paddingRight: '3.5rem' }}>
              <h2 style={{
                fontSize: '1.65rem',
                fontWeight: 800,
                color: '#005BAB',
                lineHeight: 1.25,
                margin: 0,
                letterSpacing: '-0.02em',
              }}>
                Penghargaan & Sertifikasi
              </h2>
            </div>

            {/* Grid Certificate Cards */}
            {certificatesList.length === 0 ? (
              <VisitorEmptyState
                icon={SearchX}
                title={lang === 'en' ? 'No Certificates Available' : 'Belum Ada Sertifikat Tersedia'}
                description={lang === 'en' ? 'Certificates and awards will appear here.' : 'Daftar sertifikat keahlian, lisensi pelatihan, dan penghargaan visual Hamdani akan tampil di sini.'}
              />
            ) : (
              <div className="experience-grid" style={{ marginBottom: '1.5rem' }}>
                {certificatesList.map((cert) => {
                  const coverImg = cert.cover || (Array.isArray(cert.gallery) && cert.gallery[0]) || null;

                  return (
                    <div
                      key={cert.id}
                      className="herta-card certificate-card"
                      onClick={() => {
                        if (onSelectCertificate) {
                          onSelectCertificate({ ...cert, isCertificate: true });
                        }
                      }}
                      style={{
                        padding: 0,
                        background: '#FFFFFF',
                        borderRadius: '28px',
                        border: 'none',
                        boxShadow: '0 8px 30px rgba(0, 40, 100, 0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                    >
                      {/* 1. Container Image Full Frame (w-full, no padding di atas) */}
                      <div
                        style={{
                          position: 'relative',
                          width: '100%',
                          paddingTop: '62%',
                          borderBottomLeftRadius: '26px',
                          borderBottomRightRadius: '26px',
                          overflow: 'hidden',
                          background: '#111827',
                          boxShadow: '0 8px 24px rgba(0, 20, 60, 0.16)',
                          zIndex: 2
                        }}
                      >
                        {coverImg ? (
                          <>
                            {/* Layer 1: Blurred Backdrop */}
                            <img
                              src={coverImg}
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
                                userSelect: 'none',
                                zIndex: 1
                              }}
                            />
                            {/* Layer 2: Main Contained Image */}
                            <WatermarkedImage
                              src={coverImg}
                              alt={cert.title}
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
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #005BAB 0%, #003d73 100%)',
                            color: '#FFFFFF'
                          }}>
                            <Award size={48} />
                          </div>
                        )}
                      </div>

                      {/* 2. Body Konten Card Sertifikat */}
                      <div style={{ padding: '1.25rem 1.25rem 1.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {/* Strip: Kategori ─────── Tahun */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            width: '100%'
                          }}>
                            <span style={{
                              fontSize: '0.86rem',
                              fontWeight: 700,
                              color: '#005BAB',
                              whiteSpace: 'nowrap'
                            }}>
                              {cert.category || 'Penghargaan'}
                            </span>

                            <div style={{
                              flex: 1,
                              height: '1.5px',
                              background: '#005BAB',
                              opacity: 0.65
                            }} />

                            {cert.year && (
                              <span style={{
                                fontSize: '0.86rem',
                                fontWeight: 700,
                                color: '#005BAB',
                                whiteSpace: 'nowrap'
                              }}>
                                {cert.year}
                              </span>
                            )}
                          </div>

                          {/* Judul Sertifikat / Penghargaan */}
                          <h3 style={{
                            fontSize: '1.28rem',
                            fontWeight: 900,
                            color: '#005BAB',
                            margin: 0,
                            lineHeight: 1.25,
                            letterSpacing: '-0.02em',
                            wordBreak: 'break-word'
                          }}>
                            {cert.title}
                          </h3>

                          {/* Pill Badge Institusi Hijau Muda */}
                          {cert.institution && (
                            <div>
                              <span style={{
                                display: 'inline-block',
                                fontSize: '0.84rem',
                                fontWeight: 800,
                                background: '#D0FF97',
                                color: '#005BAB',
                                border: 'none',
                                padding: '0.35rem 1.15rem',
                                borderRadius: '999px',
                                letterSpacing: '-0.01em',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                              }}>
                                {cert.institution}
                              </span>
                            </div>
                          )}

                          {/* Deskripsi Singkat */}
                          {cert.description && (
                            <p style={{
                              fontSize: '0.88rem',
                              fontWeight: 500,
                              color: '#28588E',
                              lineHeight: 1.55,
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              margin: 0
                            }}>
                              {cert.description}
                            </p>
                          )}
                        </div>

                        {/* Tombol Lihat Detail Biru */}
                        <div style={{ marginTop: '0.5rem' }}>
                          <button
                            type="button"
                            style={{
                              width: '100%',
                              padding: '0.72rem 1rem',
                              borderRadius: '999px',
                              background: '#005BAB',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: '0.92rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 4px 14px rgba(0, 91, 171, 0.25)',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                          >
                            {lang === 'en' ? 'View Details' : 'Lihat Detail'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        </>
        )}

        {/* Modal Footer Button */}
        <div style={{ marginTop: '1.75rem', paddingTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            className="btn-primary"
          >
            <span>{t('detail_close')}</span>
          </button>
        </div>
        <style>{`
          @media (max-width: 600px) {
            .docs-grid {
              grid-template-columns: 1fr !important;
            }
          }
          @media (max-width: 680px) {
            .experience-card {
              padding-top: 1.75rem !important;
              padding-bottom: 1.75rem !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
