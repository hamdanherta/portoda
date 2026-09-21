import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Mail, MapPin, Palette, Video, Code, FileText, Download, MessageSquare, Award, ExternalLink, ChevronLeft, ChevronRight, Image as ImageIcon, Home, Calendar, Share2, Globe, Send, SearchX, Check } from 'lucide-react';
import { infoService } from '../services/infoService';
import { useLanguage } from '../context/LanguageContext';
import WatermarkedImage from './WatermarkedImage';

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
          background: '#FFF3DD',
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
    <div style={{ marginTop: '0.85rem', marginBottom: '0.85rem', borderRadius: '14px', overflow: 'hidden', border: '2px solid #005BAB', position: 'relative' }}>
      {/* 16:9 Landscape Aspect Ratio with Blurred Backdrop & Contain Foreground */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', overflow: 'hidden', background: '#111827' }}>
        {/* Sliding Track for Smooth Carousel Slide Animation */}
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

              {/* Layer 2: Main Image contain (no crop) */}
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
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#FFFFFF',
                color: '#005BAB',
                border: '2px solid #005BAB',
                borderRadius: '999px',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                zIndex: 10
              }}
              title="Foto Sebelumnya"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => (prev === mediaList.length - 1 ? 0 : prev + 1));
              }}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#FFFFFF',
                color: '#005BAB',
                border: '2px solid #005BAB',
                borderRadius: '999px',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                zIndex: 10
              }}
              title="Foto Selanjutnya"
            >
              <ChevronRight size={20} />
            </button>

            {/* Indicator Badge */}
            <div style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              background: '#005BAB',
              color: '#FFFFFF',
              padding: '0.2rem 0.6rem',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 800,
              border: '1px solid #FFFFFF',
              zIndex: 10
            }}>
              {currentIndex + 1} / {mediaList.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip if > 1 photo */}
      {mediaList.length > 1 && (
        <div style={{
          display: 'flex',
          gap: '0.4rem',
          padding: '0.5rem',
          background: '#FFF3DD',
          borderTop: '1.5px solid #005BAB',
          overflowX: 'auto'
        }}>
          {mediaList.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '6px',
                overflow: 'hidden',
                border: idx === currentIndex ? '2.5px solid #005BAB' : '1px solid #005BAB',
                opacity: idx === currentIndex ? 1 : 0.6,
                transform: idx === currentIndex ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s ease',
                padding: 0,
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
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
  const { lang, t, getLocalizedField } = useLanguage();

  useEffect(() => {
    const loadAll = async () => {
      const [exps, docs, cnts, prof, certs] = await Promise.all([
        infoService.getExperiences(),
        infoService.getDocuments(),
        infoService.getContacts(),
        infoService.getProfile(),
        infoService.getCertificates()
      ]);
      setExperiences(exps || []);
      setDocumentsList(docs || []);
      setContactsList(cnts || []);
      setProfileData(prof || {});
      setCertificatesList(certs || []);
    };

    if (activeType) {
      loadAll();
    }

    window.addEventListener('portoda_info_updated', loadAll);
    return () => window.removeEventListener('portoda_info_updated', loadAll);
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

  if (!activeType) return null;

  const handleDownload = async (doc) => {
    const docTitle = getLocalizedField(doc, 'title');
    const fileUrl = doc.file_url || doc.fileUrl || doc.file_path || doc.url || '';
    const fileName = doc.file_name || doc.fileName || `${docTitle || 'Dokumen'}.pdf`;

    if (!fileUrl) {
      alert(lang === 'en' ? 'Document file is not available.' : 'Berkas dokumen belum tersedia.');
      return;
    }

    if (fileUrl.startsWith('data:')) {
      try {
        const res = await fetch(fileUrl);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
        return;
      } catch (e) {
        console.error('Failed to convert base64 data to blob:', e);
      }
    }

    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = fileName;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        className="herta-card animate-fade-in modal-no-scrollbar"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 'var(--radius-lg)',
          background: '#FFF3DD',
          border: '2.5px solid #005BAB',
          position: 'relative',
          padding: '2rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 20,
            background: '#FFFFFF',
            color: '#005BAB',
            border: '2.5px solid #005BAB',
            width: '40px',
            height: '40px',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Tutup (ESC)"
        >
          <X size={20} />
        </button>

        {/* --- DOKUMEN HAMDANI --- */}
        {activeType === 'dokumen' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '2.5px solid #005BAB', paddingBottom: '1rem', paddingRight: '3.6rem' }}>
              <div style={{ padding: '0.6rem', borderRadius: '14px', background: '#005BAB', color: '#FFFFFF', border: '2px solid #005BAB', flexShrink: 0 }}>
                <FileText size={28} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#005BAB', lineHeight: 1.3, wordBreak: 'break-word', margin: 0 }}>{t('doc_title')}</h2>
                <p style={{ fontSize: '0.88rem', color: '#005BAB', fontWeight: 700, marginTop: '0.25rem' }}>
                  {lang === 'en' ? 'Download Resumes, CVs, Portfolio PDF & Transcripts' : 'Unduh Berkas Lamaran, CV, Portofolio & Transkrip Resmi'}
                </p>
              </div>
            </div>

            {/* Grid Dokumen Dynamic */}
            {documentsList.length === 0 ? (
              <VisitorEmptyState
                icon={SearchX}
                title={lang === 'en' ? 'No Documents Available' : 'Belum Ada Dokumen Tersedia'}
                description={lang === 'en' ? 'Documents and PDF files will appear here once uploaded.' : 'Berkas CV, Portofolio PDF, dan dokumen resmi Hamdani akan tampil di sini setelah diunggah.'}
              />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.2rem' }}>
                {documentsList.map((doc) => {
                  const docTitle = getLocalizedField(doc, 'title');
                  const docType = getLocalizedField(doc, 'type');
                  const docDesc = getLocalizedField(doc, 'description');
                  const isCopied = copiedDocId === doc.id;

                  return (
                    <div key={doc.id} className="herta-card" style={{ padding: '1.35rem', background: '#FFFFFF', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                          <div style={{ padding: '0.5rem', borderRadius: '10px', background: '#FFF3DD', color: '#005BAB', border: '1.5px solid #005BAB', flexShrink: 0 }}>
                            <FileText size={20} />
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#005BAB' }}>{docTitle}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.15rem' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#005BAB', opacity: 0.85 }}>{docType}</span>
                              {doc.category && (
                                <span style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  background: doc.category === 'CV Kreatif' ? '#FEF3C7' : doc.category === 'Portofolio' ? '#D1FAE5' : '#EEF2FF',
                                  color: doc.category === 'CV Kreatif' ? '#D97706' : doc.category === 'Portofolio' ? '#059669' : '#4F46E5',
                                  border: `1.5px solid ${doc.category === 'CV Kreatif' ? '#D97706' : doc.category === 'Portofolio' ? '#059669' : '#4F46E5'}`,
                                  padding: '0.15rem 0.55rem',
                                  borderRadius: '999px'
                                }}>
                                  {doc.category}
                                </span>
                              )}
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
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '2.5px solid #005BAB', paddingBottom: '1rem', paddingRight: '3.6rem' }}>
              <div style={{ padding: '0.6rem', borderRadius: '14px', background: '#005BAB', color: '#FFFFFF', border: '2px solid #005BAB', flexShrink: 0 }}>
                <User size={28} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#005BAB', lineHeight: 1.3, wordBreak: 'break-word', margin: 0 }}>{t('profile_title')} — {profileData.name || 'Hamdani'}</h2>
                <p style={{ fontSize: '0.88rem', color: '#005BAB', fontWeight: 700, marginTop: '0.25rem' }}>
                  {getLocalizedField(profileData, 'tagline') || 'Graphic Designer, Multimedia Creator & Web Developer'}
                </p>
              </div>
            </div>

            {/* Bio Card */}
            <div className="herta-card" style={{ padding: '1.5rem', background: '#FFFFFF', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#005BAB', marginBottom: '0.6rem' }}>
                {lang === 'en' ? `About ${profileData.name || 'Hamdani'}` : `Tentang ${profileData.name || 'Hamdani'}`}
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#005BAB', fontWeight: 600, lineHeight: 1.65, whiteSpace: 'pre-line' }}>
                {getLocalizedField(profileData, 'bio')}
              </p>
            </div>

            {/* Domisili & Data Diri Card */}
            <div className="herta-card" style={{ padding: '1.5rem', background: '#FFFFFF', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#005BAB', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={20} />
                <span>{t('profile_domisili_heading')}</span>
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div style={{ background: '#FFF3DD', padding: '1rem', borderRadius: '14px', border: '1.5px solid #005BAB' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: '#005BAB', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <MapPin size={16} />
                    <span>{t('profile_domisili')}</span>
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#005BAB' }}>
                    {getLocalizedField(profileData, 'domisili') || 'Kota Jambi, Indonesia'}
                  </div>
                </div>

                <div style={{ background: '#FFF3DD', padding: '1rem', borderRadius: '14px', border: '1.5px solid #005BAB' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: '#005BAB', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <Home size={16} />
                    <span>{t('profile_residence')}</span>
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#005BAB' }}>
                    {getLocalizedField(profileData, 'tempat_tinggal') || 'Kota Jambi, Indonesia'}
                  </div>
                </div>

                <div style={{ background: '#FFF3DD', padding: '1rem', borderRadius: '14px', border: '1.5px solid #005BAB' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: '#005BAB', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <Calendar size={16} />
                    <span>{t('profile_ttl')}</span>
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#005BAB' }}>
                    {getLocalizedField(profileData, 'ttl') || 'Jambi, 14 Mei 1998'}
                  </div>
                </div>
              </div>
            </div>

            {/* Keahlian & Spesialisasi */}
            {profileData.skills && profileData.skills.length > 0 && (
              <div className="herta-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#005BAB', marginBottom: '1rem' }}>
                  {t('profile_skills_heading')}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {profileData.skills.map((skill, index) => (
                    <div key={skill.id || index} style={{ background: '#FFF3DD', padding: '1rem', borderRadius: '12px', border: '1.5px solid #005BAB' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem', fontWeight: 800, color: '#005BAB', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Award size={18} />
                          <span>{getLocalizedField(skill, 'title')}</span>
                        </div>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          background: skill.category === 'Hard Skill' ? '#10B981' : '#005BAB',
                          color: '#FFFFFF',
                          padding: '0.12rem 0.5rem',
                          borderRadius: '999px'
                        }}>
                          {skill.category || 'Soft Skill'}
                        </span>
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
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '2.5px solid #005BAB', paddingBottom: '1rem', paddingRight: '3.6rem' }}>
              <div style={{ padding: '0.6rem', borderRadius: '14px', background: '#005BAB', color: '#FFFFFF', border: '2px solid #005BAB', flexShrink: 0 }}>
                <Briefcase size={28} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#005BAB', lineHeight: 1.3, wordBreak: 'break-word', margin: 0 }}>{t('exp_title')}</h2>
                <p style={{ fontSize: '0.88rem', color: '#005BAB', fontWeight: 700, marginTop: '0.25rem' }}>
                  {lang === 'en' ? 'Professional Track Record & Creative Career' : 'Rekam Jejak Profesional & Karir Kreatif'}
                </p>
              </div>
            </div>

            {/* Timeline Experience List Dynamic */}
            {experiences.length === 0 ? (
              <VisitorEmptyState
                icon={SearchX}
                title={lang === 'en' ? 'No Experience Listed' : 'Belum Ada Pengalaman'}
                description={lang === 'en' ? 'Experience track record will appear here.' : 'Daftar rekam jejak karir dan pengalaman profesional Hamdani akan tampil di sini.'}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {experiences.map((exp) => {
                  const expMedia = Array.isArray(exp.media) && exp.media.length > 0
                    ? exp.media
                    : (Array.isArray(exp.images) && exp.images.length > 0 ? exp.images : []);

                  return (
                    <div key={exp.id} className="herta-card" style={{ padding: '1.35rem', background: '#FFFFFF' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#005BAB', margin: 0 }}>
                            {getLocalizedField(exp, 'title')}
                          </h3>

                          {/* Tipe Pengalaman Badge (Hijau = Kerja, Biru = Magang, Kuning = Organisasi, Ungu = Freelance) */}
                          {(() => {
                            const type = exp.experience_type || 'Kerja';
                            let bg = '#DCFCE7', color = '#15803D', border = '#16A34A';
                            if (type === 'Magang') { bg = '#E0F2FE'; color = '#0284C7'; border = '#0284C7'; }
                            else if (type === 'Organisasi') { bg = '#FEF3C7'; color = '#D97706'; border = '#D97706'; }
                            else if (type === 'Freelance') { bg = '#F3E8FF'; color = '#7E22CE'; border = '#A855F7'; }

                            return (
                              <span style={{ fontSize: '0.72rem', fontWeight: 800, background: bg, color: color, border: `1.5px solid ${border}`, padding: '0.15rem 0.55rem', borderRadius: '999px' }}>
                                {type}
                              </span>
                            );
                          })()}

                          {/* Tipe Pekerjaan Sub-Badge (Khusus Tipe Kerja) */}
                          {(exp.experience_type === 'Kerja' || !exp.experience_type) && exp.employment_type && (
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#FFF3DD', color: '#005BAB', border: '1.5px solid #005BAB', padding: '0.15rem 0.55rem', borderRadius: '999px' }}>
                              {exp.employment_type}
                            </span>
                          )}
                        </div>

                        <span style={{ fontSize: '0.78rem', fontWeight: 800, background: '#005BAB', color: '#FFFFFF', padding: '0.2rem 0.65rem', borderRadius: '999px' }}>
                          {getLocalizedField(exp, 'period')}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#005BAB', opacity: 0.9, marginBottom: '0.6rem' }}>
                        {exp.company}
                      </h4>
                      <p style={{ fontSize: '0.88rem', color: '#005BAB', fontWeight: 600, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                        {getLocalizedField(exp, 'description')}
                      </p>

                      {/* Media Dokumentasi Pengalaman Kerja */}
                      {expMedia.length > 0 && (
                        <ExpMediaCarousel mediaList={expMedia} title={getLocalizedField(exp, 'title')} />
                      )}
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
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '2.5px solid #005BAB', paddingBottom: '1rem', paddingRight: '3.6rem' }}>
              <div style={{ padding: '0.6rem', borderRadius: '14px', background: '#005BAB', color: '#FFFFFF', border: '2px solid #005BAB', flexShrink: 0 }}>
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
                        <div style={{ padding: '0.65rem', borderRadius: '12px', background: '#FFF3DD', color: '#005BAB', border: '1.5px solid #005BAB', flexShrink: 0 }}>
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
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '2.5px solid #005BAB', paddingBottom: '1rem', paddingRight: '3.6rem' }}>
              <div style={{ padding: '0.6rem', borderRadius: '14px', background: '#005BAB', color: '#FFFFFF', border: '2px solid #005BAB', flexShrink: 0 }}>
                <Award size={28} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#005BAB', lineHeight: 1.3, wordBreak: 'break-word', margin: 0 }}>Sertifikat & Penghargaan</h2>
                <p style={{ fontSize: '0.88rem', color: '#005BAB', fontWeight: 700, marginTop: '0.25rem' }}>
                  Daftar sertifikat keahlian, penghargaan visual, dan lisensi pelatihan resmi Hamdani.
                </p>
              </div>
            </div>

            {/* Grid Certificate Cards */}
            {certificatesList.length === 0 ? (
              <VisitorEmptyState
                icon={SearchX}
                title={lang === 'en' ? 'No Certificates Available' : 'Belum Ada Sertifikat Tersedia'}
                description={lang === 'en' ? 'Certificates and awards will appear here.' : 'Daftar sertifikat keahlian, lisensi pelatihan, dan penghargaan visual Hamdani akan tampil di sini.'}
              />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                {certificatesList.map((cert) => (
                  <div
                    key={cert.id}
                    className="herta-card"
                    onClick={() => {
                      if (onSelectCertificate) {
                        onSelectCertificate({ ...cert, isCertificate: true });
                        onClose();
                      }
                    }}
                    style={{
                      padding: '1.25rem',
                      background: '#FFFFFF',
                      borderRadius: '20px',
                      border: '2.5px solid #005BAB',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      {/* Media Cover & Gallery Carousel — 16:9 Aspect Ratio with Blurred Backdrop & Contained Image */}
                      {(() => {
                        const certMedia = Array.from(new Set([cert.cover, ...(cert.gallery || [])].filter(Boolean)));
                        if (certMedia.length > 1) {
                          return <ExpMediaCarousel mediaList={certMedia} title={cert.title} />;
                        }
                        return cert.cover ? (
                          <div style={{
                            position: 'relative',
                            width: '100%',
                            paddingTop: '56.25%',
                            borderRadius: '14px',
                            overflow: 'hidden',
                            border: '1.5px solid #005BAB',
                            marginBottom: '0.85rem',
                            backgroundColor: '#111827'
                          }}>
                            {/* Layer 1: Blurred Backdrop */}
                            <img
                              src={cert.cover}
                              alt=""
                              aria-hidden="true"
                              style={{
                                position: 'absolute',
                                top: '-10%',
                                left: '-10%',
                                width: '120%',
                                height: '120%',
                                objectFit: 'cover',
                                filter: 'blur(18px) brightness(0.6) saturate(1.4)',
                                transform: 'scale(1.05)',
                                pointerEvents: 'none',
                                userSelect: 'none',
                                zIndex: 1
                              }}
                            />
                            {/* Layer 2: Main Contained Image */}
                            <WatermarkedImage
                              src={cert.cover}
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
                          </div>
                        ) : null;
                      })()}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#005BAB', color: '#FFFFFF', padding: '0.15rem 0.55rem', borderRadius: '999px' }}>
                          {cert.category || 'Sertifikasi'}
                        </span>
                        {cert.year && (
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#FFF3DD', color: '#005BAB', padding: '0.15rem 0.55rem', borderRadius: '999px', border: '1px solid #005BAB' }}>
                            {cert.year}
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#005BAB', marginBottom: '0.4rem', lineHeight: 1.35 }}>
                        {cert.title}
                      </h3>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#005BAB', opacity: 0.85, marginBottom: '0.5rem' }}>
                        {cert.institution}
                      </div>
                      {cert.description && (
                        <p style={{ fontSize: '0.82rem', color: '#005BAB', opacity: 0.8, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {cert.description}
                        </p>
                      )}
                    </div>

                    <button
                      className="btn-primary"
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        padding: '0.6rem 1rem',
                        fontSize: '0.85rem',
                        borderRadius: '12px',
                        gap: '0.4rem'
                      }}
                    >
                      <span>Lihat Detail Sertifikat</span>
                      <ExternalLink size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal Footer Button */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1rem', borderTop: '2px solid #005BAB', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn-primary">
            <span>{t('detail_close')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
