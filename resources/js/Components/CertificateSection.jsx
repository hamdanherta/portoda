import React, { useState, useEffect } from 'react';
import { Award, ExternalLink, Calendar, Building2 } from 'lucide-react';
import { infoService } from '../services/infoService';
import { useLanguage } from '../context/LanguageContext';
import WatermarkedImage from './WatermarkedImage';
import MetadataCopyBtn from './MetadataCopyBtn';

export default function CertificateSection({ onSelectCertificate }) {
  const [certificates, setCertificates] = useState([]);
  const { lang } = useLanguage();

  useEffect(() => {
    const loadCerts = async () => {
      const data = await infoService.getCertificates();
      setCertificates(data || []);
    };

    loadCerts();
    window.addEventListener('portoda_info_updated', loadCerts);
    return () => window.removeEventListener('portoda_info_updated', loadCerts);
  }, []);

  if (!certificates || certificates.length === 0) return null;

  return (
    <section style={{ padding: '3rem 0 4rem', position: 'relative', zIndex: 10 }}>
      <div className="container">
        {/* Section Header Card */}
        <div
          className="herta-card"
          style={{
            padding: '1.75rem 2rem',
            background: '#FFFFFF',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            border: '2.5px solid #005BAB'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                background: '#FFF3DD',
                border: '2px solid #005BAB',
                color: '#005BAB',
                fontSize: '0.82rem',
                fontWeight: 800
              }}>
                <Award size={16} />
                <span>{lang === 'en' ? 'Certificates & Credentials' : 'Sertifikat & Penghargaan'}</span>
              </span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#005BAB' }}>
              {lang === 'en' ? "Hamdani's Official Certificates" : 'Pencapaian & Sertifikat Resmi Hamdani'}
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#005BAB', fontWeight: 600, opacity: 0.9, marginTop: '0.25rem' }}>
              {lang === 'en'
                ? 'Official skill certifications, design competition awards, and training credentials.'
                : 'Daftar sertifikasi kompetensi keahlian, penghargaan karya kreatif, dan lisensi pelatihan.'}
            </p>
          </div>

          <span style={{
            fontSize: '0.82rem',
            fontWeight: 800,
            background: '#005BAB',
            color: '#FFFFFF',
            padding: '0.4rem 0.9rem',
            borderRadius: '999px',
            border: '2px solid #005BAB'
          }}>
            {certificates.length} {lang === 'en' ? 'Certificates' : 'Sertifikat'}
          </span>
        </div>

        {/* Certificate Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
          gap: '1.5rem'
        }}>
          {certificates.map((cert) => {
            const rawCat = (cert.category || 'Penghargaan').trim();
            const catLower = rawCat.toLowerCase();
            let catBg = '#D0FF97';
            if (catLower.includes('sertifikasi') || catLower.includes('certif')) {
              catBg = '#FFF455';
            } else if (catLower.includes('pelatihan') || catLower.includes('training') || catLower.includes('course')) {
              catBg = '#62B6FF';
            } else if (catLower.includes('penghargaan') || catLower.includes('award')) {
              catBg = '#D0FF97';
            }

            return (
              <div
                key={cert.id}
                className="herta-card certificate-card"
                onClick={() => onSelectCertificate && onSelectCertificate({ ...cert, isCertificate: true })}
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
                  {cert.cover ? (
                    <>
                      {/* Layer 1: Blurred Backdrop */}
                      <img
                        src={cert.cover}
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

                    {/* Pill Badge Institusi Hijau */}
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
      </div>
    </section>
  );
}
