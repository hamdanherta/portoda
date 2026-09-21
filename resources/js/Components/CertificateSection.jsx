import React, { useState, useEffect } from 'react';
import { Award, ExternalLink, Calendar, Building2 } from 'lucide-react';
import { infoService } from '../services/infoService';
import { useLanguage } from '../context/LanguageContext';
import WatermarkedImage from './WatermarkedImage';

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
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="herta-card"
              onClick={() => onSelectCertificate && onSelectCertificate({ ...cert, isCertificate: true })}
              style={{
                padding: '1.35rem',
                background: '#FFFFFF',
                borderRadius: '32px',
                border: '2.5px solid #005BAB',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                position: 'relative'
              }}
            >
              <div>
                {/* Cover Image Preview — 16:9 Aspect Ratio with Blurred Backdrop & Contained Image */}
                {cert.cover && (
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '56.25%',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '2px solid #005BAB',
                    marginBottom: '1rem',
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
                )}

                {/* Badges Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    background: '#005BAB',
                    color: '#FFFFFF',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px'
                  }}>
                    {cert.category || 'Sertifikasi'}
                  </span>
                  {cert.year && (
                    <span style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      background: '#FFF3DD',
                      color: '#005BAB',
                      padding: '0.2rem 0.65rem',
                      borderRadius: '999px',
                      border: '1.5px solid #005BAB',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <Calendar size={12} />
                      {cert.year}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#005BAB',
                  lineHeight: 1.35,
                  marginBottom: '0.4rem'
                }}>
                  {cert.title}
                </h3>

                {/* Institution */}
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#005BAB',
                  opacity: 0.85,
                  marginBottom: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <Building2 size={14} />
                  <span>{cert.institution}</span>
                </div>

                {/* Description snippet */}
                {cert.description && (
                  <p style={{
                    fontSize: '0.84rem',
                    color: '#005BAB',
                    opacity: 0.8,
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: '1rem'
                  }}>
                    {cert.description}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <button
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '0.65rem 1rem',
                  fontSize: '0.88rem',
                  borderRadius: '12px',
                  gap: '0.5rem',
                  marginTop: '0.5rem'
                }}
              >
                <span>Lihat Detail Sertifikat</span>
                <ExternalLink size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
