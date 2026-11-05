import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Mail, MapPin, Palette, Video, Code, FileText, Download, MessageSquare, Award, ExternalLink, ChevronLeft, ChevronRight, Image as ImageIcon, Home, Calendar, Share2, Globe, Send, SearchX, Check, Loader2, Laptop, Copy } from 'lucide-react';
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

  const [copiedContactId, setCopiedContactId] = useState(null);

  const handleCopyContact = (val, id) => {
    if (!val) return;
    const cleanText = String(val).trim();

    const copyContactFallback = (text) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedContactId(id);
        setTimeout(() => setCopiedContactId(null), 2500);
      } catch (err) {
        console.error('Fallback copy failed', err);
      }
      document.body.removeChild(textArea);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(cleanText).then(() => {
        setCopiedContactId(id);
        setTimeout(() => setCopiedContactId(null), 2500);
      }).catch(() => {
        copyContactFallback(cleanText);
      });
    } else {
      copyContactFallback(cleanText);
    }
  };

  const handleContactAction = (c) => {
    let targetUrl = c.url;
    if (!targetUrl) {
      const cType = (c.type || '').toLowerCase();
      if (cType === 'whatsapp' || (c.title && c.title.toLowerCase().includes('whatsapp'))) {
        const digits = (c.value || '').replace(/[^0-9]/g, '');
        targetUrl = digits ? `https://wa.me/${digits.startsWith('0') ? '62' + digits.slice(1) : digits}` : '';
      } else if (cType === 'email' || (c.value && c.value.includes('@'))) {
        targetUrl = `mailto:${c.value}`;
      } else if (c.value && (c.value.startsWith('http://') || c.value.startsWith('https://'))) {
        targetUrl = c.value;
      }
    }

    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
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

  const isModernModal = activeType === 'pengalaman' || activeType === 'sertifikat' || activeType === 'dokumen' || activeType === 'kontak' || activeType === 'profil';
  const modalBg = '#FFFFFF';
  const modalColor = '#005BAB';
  const modalBorder = isModernModal ? 'none' : '2.5px solid #005BAB';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        className="herta-card info-modal-card animate-fade-in modal-no-scrollbar"
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
            {/* Header Modal Dokumen — Persis Gambar Referensi (Hanya Judul & Tombol Close Merah) */}
            <div style={{ marginBottom: '1.5rem', paddingRight: '3.5rem' }}>
              <h2 style={{
                fontSize: '1.65rem',
                fontWeight: 800,
                color: '#005BAB',
                lineHeight: 1.25,
                margin: 0,
                letterSpacing: '-0.02em',
              }}>
                {lang === 'en' ? 'Download Hamdani CV' : 'Unduh CV Hamdani'}
              </h2>
            </div> 

            {/* Grid Dokumen Dynamic — 2 Kolom di Desktop, 1 Kolom di Mobile */}
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
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: '1.25rem',
                  alignItems: 'stretch'
                }}
              >
                {filteredDocuments.map((doc) => {
                  const docTitle = getLocalizedField(doc, 'title');
                  const docType = getLocalizedField(doc, 'type');
                  const docDesc = getLocalizedField(doc, 'description');
                  const isCopied = copiedDocId === doc.id;

                  // Normalisasi nama kategori: misal 'CV ATS' -> 'CV Ats' sesuai gambar referensi
                  let displayCategory = doc.category || 'CV Ats';
                  if (displayCategory.toUpperCase() === 'CV ATS') {
                    displayCategory = 'CV Ats';
                  }

                  // Warna status kategori dokumen sesuai tema sistem (CV Ats: #D0FF97, CV Kreatif: #62B6FF)
                  const catLower = displayCategory.trim().toLowerCase();
                  let badgeBg = '#D0FF97';
                  if (catLower.includes('kreatif') || catLower.includes('creative') || catLower.includes('organisasi')) {
                    badgeBg = '#62B6FF';
                  } else if (catLower.includes('ats') || catLower.includes('kerja')) {
                    badgeBg = '#D0FF97';
                  } else if (catLower.includes('portofolio') || catLower.includes('magang') || catLower.includes('kontrak')) {
                    badgeBg = '#FFF455';
                  } else if (catLower.includes('freelance') || catLower.includes('other') || catLower.includes('lainnya')) {
                    badgeBg = '#E1E1E1';
                  }

                  return (
                    <div
                      key={doc.id}
                      className="herta-card document-card"
                      style={{
                        padding: '1.45rem 1.45rem 1.35rem 1.45rem',
                        background: '#FFFFFF',
                        border: 'none',
                        borderRadius: '28px',
                        boxShadow: '0 8px 30px rgba(0, 40, 100, 0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                        boxSizing: 'border-box'
                      }}
                    >
                      {/* Top Row: Pill Badge Status Kategori Dokumen & Garis Biru */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        width: '100%'
                      }}>
                        <span style={{
                          fontSize: '0.86rem',
                          fontWeight: 800,
                          background: badgeBg,
                          color: '#005BAB',
                          border: 'none',
                          padding: '0.35rem 1.15rem',
                          borderRadius: '999px',
                          letterSpacing: '-0.01em',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          whiteSpace: 'nowrap'
                        }}>
                          {displayCategory}
                        </span>

                        <div style={{
                          flex: 1,
                          height: '1.5px',
                          background: '#005BAB',
                          opacity: 0.65
                        }} />
                      </div>

                      {/* Judul Dokumen */}
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: '#005BAB',
                        margin: '0.95rem 0 0.15rem 0',
                        lineHeight: 1.25,
                        letterSpacing: '-0.02em',
                        wordBreak: 'break-word'
                      }}>
                        {docTitle}
                      </h3>

                      {/* Tipe / Sub-Judul Dokumen */}
                      {docType && (
                        <h4 style={{
                          fontSize: '0.92rem',
                          fontWeight: 700,
                          color: '#005BAB',
                          opacity: 0.9,
                          margin: '0 0 0.55rem 0',
                          lineHeight: 1.35
                        }}>
                          {docType}
                        </h4>
                      )}

                      {/* Deskripsi Dokumen (Rata Justify) */}
                      {docDesc && (
                        <p style={{
                          fontSize: '0.84rem',
                          color: '#005BAB',
                          fontWeight: 500,
                          lineHeight: 1.55,
                          margin: '0 0 1.25rem 0',
                          textAlign: 'justify',
                          flex: 1
                        }}>
                          {docDesc}
                        </p>
                      )}

                      {/* Bottom Action Row: Tombol Download (Hijau Lime) & Tombol Share (Biru dengan Icon Pesawat Kertas) */}
                      <div style={{
                        display: 'flex',
                        gap: '0.65rem',
                        alignItems: 'center',
                        marginTop: 'auto'
                      }}>
                        {/* Tombol Download */}
                        <button
                          onClick={() => handleDownload(doc)}
                          style={{
                            flex: 1,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#D0FF97',
                            color: '#005BAB',
                            border: 'none',
                            borderRadius: '999px',
                            padding: '0.68rem 1.25rem',
                            fontSize: '0.95rem',
                            fontWeight: 800,
                            letterSpacing: '-0.01em',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            transition: 'all 0.18s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.filter = 'brightness(0.96)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.filter = 'none';
                          }}
                        >
                          Download
                        </button>

                        {/* Tombol Share / Kirim dengan icon Send */}
                        <button
                          onClick={() => handleShareDocument(doc)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#005BAB',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '999px',
                            padding: '0.68rem 1.15rem',
                            minWidth: '52px',
                            cursor: 'pointer',
                            boxShadow: '0 3px 12px rgba(0, 91, 171, 0.22)',
                            transition: 'all 0.18s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.background = '#0049B1';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.background = '#005BAB';
                          }}
                          title={isCopied ? (lang === 'en' ? 'Link Copied!' : 'Tautan Tersalin!') : (lang === 'en' ? 'Share Document Link' : 'Bagikan Tautan Dokumen')}
                        >
                          {isCopied ? <Check size={18} strokeWidth={2.8} /> : <Send size={18} strokeWidth={2.4} />}
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
            {/* Header Modal Profil — Persis Gambar Referensi (Hanya Judul & Tombol Close Merah) */}
            <div style={{ marginBottom: '1.5rem', paddingRight: '3.5rem' }}>
              <h2 style={{
                fontSize: '1.65rem',
                fontWeight: 800,
                color: '#005BAB',
                lineHeight: 1.25,
                margin: 0,
                letterSpacing: '-0.02em',
              }}>
                {lang === 'en' ? 'Hamdani Profile' : 'Profil Hamdani'}
              </h2>
            </div>

            {/* Section: Tentang Hamdani */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{
                fontSize: '1.12rem',
                fontWeight: 800,
                color: '#005BAB',
                margin: '0 0 0.5rem 0',
                letterSpacing: '-0.01em'
              }}>
                {lang === 'en' ? `About ${profileData.name || 'Hamdani'}` : `Tentang ${profileData.name || 'Hamdani'}`}
              </h3>
              <p style={{
                fontSize: '0.92rem',
                color: '#005BAB',
                fontWeight: 500,
                lineHeight: 1.6,
                margin: 0,
                textAlign: 'justify'
              }}>
                {currentBio || (lang === 'en' ? 'Professional graphic designer, multimedia creator, and visual specialist.' : 'Pengerjaan menggunakan teknik compositing feed media sosial berformat vertikal dengan latar belakang gradasi hijau segar. Pengerjaan menggunakan teknik compositing feed media sosial berformat vertikal dengan latar belakang gradasi hijau segar')}
              </p>
            </div>

            {/* Section: Data Diri & Domisili (2 Kolom Bersih Tanpa Box Card) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '1.25rem 2rem',
              marginBottom: '2.25rem'
            }}>
              {/* Domisili Sekarang */}
              <div>
                <h4 style={{
                  fontSize: '0.98rem',
                  fontWeight: 800,
                  color: '#005BAB',
                  margin: '0 0 0.25rem 0'
                }}>
                  {t('profile_domisili')}
                </h4>
                <p style={{
                  fontSize: '0.92rem',
                  fontWeight: 500,
                  color: '#005BAB',
                  margin: 0
                }}>
                  {getLocalizedField(profileData, 'domisili') || 'Kota Jambi, Indonesia'}
                </p>
              </div>

              {/* Asal */}
              <div>
                <h4 style={{
                  fontSize: '0.98rem',
                  fontWeight: 800,
                  color: '#005BAB',
                  margin: '0 0 0.25rem 0'
                }}>
                  {t('profile_residence')}
                </h4>
                <p style={{
                  fontSize: '0.92rem',
                  fontWeight: 500,
                  color: '#005BAB',
                  margin: 0
                }}>
                  {getLocalizedField(profileData, 'tempat_tinggal') || 'Kuala Tungkal Jambi'}
                </p>
              </div>

              {/* Tempat Tanggal Lahir / TTL */}
              <div>
                <h4 style={{
                  fontSize: '0.98rem',
                  fontWeight: 800,
                  color: '#005BAB',
                  margin: '0 0 0.25rem 0'
                }}>
                  {t('profile_ttl')}
                </h4>
                <p style={{
                  fontSize: '0.92rem',
                  fontWeight: 500,
                  color: '#005BAB',
                  margin: 0
                }}>
                  {getLocalizedField(profileData, 'ttl') || 'Jambi, 14 Mei 1998'}
                </p>
              </div>
            </div>

            {/* Section: Spesialisasi & Keahlian */}
            <div>
              <h2 style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                color: '#005BAB',
                lineHeight: 1.25,
                margin: '0 0 1.25rem 0',
                letterSpacing: '-0.02em',
              }}>
                {t('profile_skills_heading')}
              </h2>

              {(!profileData.skills || profileData.skills.length === 0) ? (
                <VisitorEmptyState
                  icon={SearchX}
                  title={lang === 'en' ? 'No Skills Listed' : 'Belum Ada Keahlian'}
                  description={lang === 'en' ? 'Skills and specializations will appear here.' : 'Daftar keahlian dan spesialisasi Hamdani akan tampil di sini.'}
                />
              ) : (
                <div
                  className="skills-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: '1.25rem',
                    alignItems: 'stretch'
                  }}
                >
                  {profileData.skills.map((skill, index) => {
                    const skillTitle = getLocalizedField(skill, 'title');
                    const skillDesc = getLocalizedField(skill, 'desc');

                    // Tentukan Status Kategori Keahlian & Warna Persis Gambar Referensi
                    const cat = (skill.category || 'Hard Skill').trim().toLowerCase();
                    let badgeLabel = 'Hard Skill';
                    let badgeBg = '#D0FF97';

                    if (cat.includes('soft')) {
                      badgeLabel = 'Soft Skill';
                      badgeBg = '#FFF455';
                    } else if (cat.includes('hard')) {
                      badgeLabel = 'Hard Skill';
                      badgeBg = '#D0FF97';
                    } else if (cat.includes('tool') || cat.includes('software')) {
                      badgeLabel = skill.category || 'Tools';
                      badgeBg = '#62B6FF';
                    } else {
                      badgeLabel = skill.category || 'Keahlian';
                      badgeBg = '#E1E1E1';
                    }

                    return (
                      <div
                        key={skill.id || index}
                        className="herta-card skill-card"
                        style={{
                          padding: '1.45rem 1.45rem 1.4rem 1.45rem',
                          background: '#FFFFFF',
                          border: 'none',
                          borderRadius: '28px',
                          boxShadow: '0 8px 30px rgba(0, 40, 100, 0.08)',
                          display: 'flex',
                          flexDirection: 'column',
                          minWidth: 0,
                          boxSizing: 'border-box'
                        }}
                      >
                        {/* Top Row: Pill Badge Status Kategori Keahlian & Garis Biru */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.85rem',
                          width: '100%'
                        }}>
                          <span style={{
                            fontSize: '0.86rem',
                            fontWeight: 800,
                            background: badgeBg,
                            color: '#005BAB',
                            border: 'none',
                            padding: '0.35rem 1.15rem',
                            borderRadius: '999px',
                            letterSpacing: '-0.01em',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            whiteSpace: 'nowrap'
                          }}>
                            {badgeLabel}
                          </span>

                          <div style={{
                            flex: 1,
                            height: '1.5px',
                            background: '#005BAB',
                            opacity: 0.65
                          }} />
                        </div>

                        {/* Judul Keahlian */}
                        <h3 style={{
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          color: '#005BAB',
                          margin: '0.95rem 0 0.35rem 0',
                          lineHeight: 1.25,
                          letterSpacing: '-0.02em',
                          wordBreak: 'break-word'
                        }}>
                          {skillTitle}
                        </h3>

                        {/* Deskripsi Keahlian (Rata Justify) */}
                        {skillDesc && (
                          <p style={{
                            fontSize: '0.84rem',
                            color: '#005BAB',
                            fontWeight: 500,
                            lineHeight: 1.55,
                            margin: 0,
                            textAlign: 'justify'
                          }}>
                            {skillDesc}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

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

                          {/* Badge Tipe Pekerjaan (Hanya tampil jika tipe pengalaman adalah 'Kerja' dan ada tipe pekerjaannya) */}
                          {(() => {
                            const expType = (exp.experience_type || 'Kerja').trim().toLowerCase();
                            const isKerja = expType === 'kerja' || expType === 'work';
                            if (!isKerja || !exp.employment_type || !exp.employment_type.trim()) {
                              return null;
                            }

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
            {/* Header Modal Kontak — Persis Gambar Referensi (Hanya Judul & Tombol Close Merah) */}
            <div style={{ marginBottom: '1.5rem', paddingRight: '3.5rem' }}>
              <h2 style={{
                fontSize: '1.65rem',
                fontWeight: 800,
                color: '#005BAB',
                lineHeight: 1.25,
                margin: 0,
                letterSpacing: '-0.02em',
              }}>
                {lang === 'en' ? 'Contact Hamdani' : 'Hubungi Hamdani'}
              </h2>
            </div>

            {/* Contact Grid Dynamic — 2 Kolom di Desktop, 1 Kolom di Mobile */}
            {contactsList.length === 0 ? (
              <VisitorEmptyState
                icon={SearchX}
                title={lang === 'en' ? 'No Contact Information' : 'Belum Ada Informasi Kontak'}
                description={lang === 'en' ? 'Contact details will appear here.' : 'Informasi dan media komunikasi langsung Hamdani akan tampil di sini.'}
              />
            ) : (
              <div
                className="contacts-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: '1.25rem',
                  alignItems: 'stretch'
                }}
              >
                {contactsList.map((c) => {
                  const cTitle = getLocalizedField(c, 'title');
                  const isCopied = copiedContactId === c.id;

                  // Tentukan Status Tipe Kontak & Warna Persis Gambar Referensi
                  const cType = (c.type || '').trim().toLowerCase();
                  const titleLower = (cTitle || '').trim().toLowerCase();

                  let badgeLabel = 'WhatsApp';
                  let badgeBg = '#D0FF97';

                  if (cType === 'email' || titleLower.includes('email') || titleLower.includes('gmail') || titleLower.includes('mail')) {
                    badgeLabel = 'Email';
                    badgeBg = '#FFF455';
                  } else if (cType === 'social' || titleLower.includes('social') || titleLower.includes('sosial') || titleLower.includes('instagram') || titleLower.includes('linkedin') || titleLower.includes('github') || titleLower.includes('youtube') || titleLower.includes('tiktok') || titleLower.includes('twitter') || titleLower.includes('x')) {
                    badgeLabel = lang === 'en' ? 'Social Media' : 'Sosial Media';
                    badgeBg = '#62B6FF';
                  } else if (cType === 'whatsapp' || titleLower.includes('whatsapp') || titleLower.includes('wa')) {
                    badgeLabel = 'WhatsApp';
                    badgeBg = '#D0FF97';
                  } else {
                    badgeLabel = c.type ? (c.type.charAt(0).toUpperCase() + c.type.slice(1)) : 'Kontak';
                    badgeBg = '#E1E1E1';
                  }

                  return (
                    <div
                      key={c.id}
                      className="herta-card contact-card"
                      style={{
                        padding: '1.45rem 1.45rem 1.35rem 1.45rem',
                        background: '#FFFFFF',
                        border: 'none',
                        borderRadius: '28px',
                        boxShadow: '0 8px 30px rgba(0, 40, 100, 0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                        boxSizing: 'border-box'
                      }}
                    >
                      {/* Top Row: Pill Badge Status Tipe Kontak & Garis Biru */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        width: '100%'
                      }}>
                        <span style={{
                          fontSize: '0.86rem',
                          fontWeight: 800,
                          background: badgeBg,
                          color: '#005BAB',
                          border: 'none',
                          padding: '0.35rem 1.15rem',
                          borderRadius: '999px',
                          letterSpacing: '-0.01em',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          whiteSpace: 'nowrap'
                        }}>
                          {badgeLabel}
                        </span>

                        <div style={{
                          flex: 1,
                          height: '1.5px',
                          background: '#005BAB',
                          opacity: 0.65
                        }} />
                      </div>

                      {/* Judul Kontak (contoh: WhatsApp Hamdani) */}
                      <h3 style={{
                        fontSize: '1.28rem',
                        fontWeight: 800,
                        color: '#005BAB',
                        margin: '0.95rem 0 0.35rem 0',
                        lineHeight: 1.25,
                        letterSpacing: '-0.02em',
                        wordBreak: 'break-word'
                      }}>
                        {cTitle}
                      </h3>

                      {/* Baris Nilai Kontak (Detail nomor/email) & Tombol Outline Copy */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.65rem',
                        marginBottom: '1.15rem',
                        flexWrap: 'wrap'
                      }}>
                        <div style={{
                          fontSize: '0.96rem',
                          fontWeight: 700,
                          color: '#005BAB',
                          wordBreak: 'break-word'
                        }}>
                          {c.value}
                        </div>

                        {/* Tombol Copy (Salin Nilai Kontak) */}
                        <button
                          type="button"
                          onClick={() => handleCopyContact(c.value, c.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            background: isCopied ? '#005BAB' : 'transparent',
                            color: isCopied ? '#FFFFFF' : '#005BAB',
                            border: '1.5px solid #005BAB',
                            borderRadius: '999px',
                            padding: '0.28rem 0.85rem',
                            fontSize: '0.80rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.18s ease'
                          }}
                          title={isCopied ? (lang === 'en' ? 'Copied!' : 'Tersalin!') : (lang === 'en' ? 'Copy' : 'Salin')}
                        >
                          {isCopied ? <Check size={13} strokeWidth={2.8} /> : <Copy size={13} strokeWidth={2.2} />}
                          <span>{isCopied ? (lang === 'en' ? 'Copied' : 'Tersalin') : 'Copy'}</span>
                        </button>
                      </div>

                      {/* Bottom Row: Tombol "Hubungi Sekarang" (Hijau Lime) */}
                      <button
                        type="button"
                        onClick={() => handleContactAction(c)}
                        style={{
                          width: '100%',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#D0FF97',
                          color: '#005BAB',
                          border: 'none',
                          borderRadius: '999px',
                          padding: '0.72rem 1.5rem',
                          fontSize: '1.05rem',
                          fontWeight: 800,
                          letterSpacing: '-0.01em',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          marginTop: 'auto',
                          transition: 'all 0.18s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.filter = 'brightness(0.96)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.filter = 'none';
                        }}
                      >
                        {lang === 'en' ? 'Contact Now' : 'Hubungi Sekarang'}
                      </button>
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
