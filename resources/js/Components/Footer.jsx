import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer({ onCategoryClick, onOpenAdmin, isLoggedIn }) {
  const { lang, t } = useLanguage();

  const footerBg = '#FFFFFF';
  const footerColor = '#005BAB';

  return (
    <footer className="footer-root" style={{
      width: '100%',
      padding: '0 0 2.25rem',
      marginTop: '-220px',
      position: 'relative',
      zIndex: 2,
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        padding: '0 clamp(1rem, 3.5vw, 2.5rem)',
        boxSizing: 'border-box'
      }}>
        {/* Under-Card Footer — Large Canvas Behind Container Utama */}
        <div className="footer-card" style={{
          width: '100%',
          minHeight: '360px',
          background: footerBg,
          color: footerColor,
          borderRadius: '44px',
          border: 'none',
          padding: '245px clamp(1.5rem, 5vw, 4rem) 2.25rem',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.08), 0 -8px 30px rgba(0, 0, 0, 0.08)',
          boxSizing: 'border-box',
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          {/* Main Top Area: 2 Columns (Brand Info Left, Social Links Right) */}
          <div className="footer-main-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'flex-start',
            gap: '3rem',
            width: '100%',
            textAlign: 'left'
          }}>
            {/* Left Column: Portoda & Taglines */}
            <div style={{ textAlign: 'left' }}>
              <h2 style={{
                fontSize: 'clamp(2.1rem, 3.5vw, 2.7rem)',
                fontWeight: 800,
                color: '#005BAB',
                lineHeight: 1.05,
                margin: '0 0 0.5rem 0',
                letterSpacing: '-0.025em',
                textAlign: 'left'
              }}>
                Portoda
              </h2>

              <h3 style={{
                fontSize: 'clamp(1.5rem, 2.6vw, 2rem)',
                fontWeight: 700,
                color: '#005BAB',
                lineHeight: 1.22,
                margin: '0 0 1.35rem 0',
                letterSpacing: '-0.015em',
                textAlign: 'left'
              }}>
                {lang === 'en' ? (
                  <>Portfolio Application<br />Hamdani</>
                ) : (
                  <>Aplikasi Portofolio<br />Hamdani</>
                )}
              </h3>

              <p style={{
                fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
                fontWeight: 500,
                color: '#005BAB',
                lineHeight: 1.45,
                margin: 0,
                letterSpacing: '-0.01em',
                opacity: 0.95,
                textAlign: 'left'
              }}>
                {lang === 'en' ? (
                  <>Where All of Hamdani's Works<br />Are Preserved</>
                ) : (
                  <>Tempat Seluruh Karya<br />Hamdani Disimpan</>
                )}
              </p>
            </div>

            {/* Right Column: Ikuti & Temukan Hamdani + 7 Social Icons in 4-and-3 Grid */}
            <div className="footer-social-wrapper" style={{ textAlign: 'left' }}>
              <h3 style={{
                fontSize: 'clamp(1.25rem, 2.1vw, 1.45rem)',
                fontWeight: 700,
                color: '#005BAB',
                lineHeight: 1.3,
                margin: '0 0 1rem 0',
                letterSpacing: '-0.01em',
                textAlign: 'left'
              }}>
                {lang === 'en' ? (
                  <>Follow and Find<br />Hamdani</>
                ) : (
                  <>Ikuti dan Temukan<br />Hamdani</>
                )}
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 46px)',
                gap: '0.65rem',
                alignItems: 'center'
              }}>
                {[
                  { id: 'fb', name: 'Facebook', url: 'https://web.facebook.com/hamdanerbic?locale=id_ID' },
                  { id: 'gh', name: 'GitHub', url: 'https://github.com/hamdanherta' },
                  { id: 'ig', name: 'Instagram', url: 'https://www.instagram.com/hamdanherta/' },
                  { id: 'ln', name: 'LinkedIn', url: 'https://www.linkedin.com/in/hamdanherta/' },
                  { id: 'th', name: 'Threads', url: 'https://www.threads.com/@hamdanherta' },
                  { id: 'tt', name: 'TikTok', url: 'https://www.tiktok.com/@hamdanherta?_r=1&_t=ZS-99lIegrs26h' },
                  { id: 'yt', name: 'YouTube', url: 'https://www.youtube.com/@Hamdanherta' }
                ].map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${item.name} Hamdani`}
                    className="footer-social-icon-link"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      background: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                      transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      textDecoration: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <img
                      src={`/sosmed2/${item.id}.png`}
                      alt={item.name}
                      style={{
                        height: '28px',
                        width: '28px',
                        objectFit: 'contain',
                        display: 'block'
                      }}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Divider Line */}
          <div style={{
            width: '100%',
            height: '1px',
            background: '#E5E7EB',
            margin: '1.75rem 0 1.25rem 0'
          }} />

          {/* Bottom Bar: Copyright on Left, Status Pill on Right */}
          <div className="footer-bottom-bar" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            width: '100%'
          }}>
            {/* Copyright Left */}
            <div style={{
              fontSize: '0.86rem',
              color: '#005BAB',
              lineHeight: 1.5,
              fontWeight: 500,
              opacity: 0.85,
              textAlign: 'left'
            }}>
              <div>© {new Date().getFullYear()} Portoda Portfolio by Hamdani.</div>
              <div>{lang === 'en' ? 'All Rights Reserved.' : 'Hak Cipta Dilindungi.'}</div>
            </div>

            {/* Status / Login Pill Right */}
            <div>
              <button
                type="button"
                onClick={onOpenAdmin}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#D0FF97',
                  color: '#005BAB',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  letterSpacing: '-0.01em',
                  padding: '0.42rem 1.4rem',
                  borderRadius: '999px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  transition: 'transform 0.18s ease, filter 0.18s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.filter = 'brightness(0.96)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.filter = 'none';
                }}
                title={isLoggedIn ? (lang === 'en' ? 'Logged In - Go to Admin Dashboard' : 'Sedang Login - Buka Dasbor Admin') : (lang === 'en' ? 'Admin Login' : 'Login Admin')}
              >
                <span>{isLoggedIn ? (lang === 'en' ? 'Sedang Login' : 'Sedang Login') : (lang === 'en' ? 'Login Admin' : 'Login Admin')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer-social-icon-link:hover {
          transform: translateY(-2px) scale(1.08) !important;
          border-color: #005BAB !important;
          box-shadow: 0 4px 14px rgba(0, 91, 171, 0.18) !important;
        }

        /* ========================================================================= */
        /* PENGATURAN PANJANG / KETINGGIAN FOOTER DI MOBILE VIEW                     */
        /* (Ubah nilai padding-top 260px / padding-bottom 2rem jika ingin lebih pendek/panjang) */
        /* ========================================================================= */
        @media (max-width: 768px) {
          .footer-root {
            margin-top: -190px !important;
            padding-bottom: 0.85rem !important; /* Spasi luar bawah footer */
          }
          .footer-card {
            /* Format: padding: [ATAS] [KIRI-KANAN] [BAWAH] */
            padding: 235px 1.5rem 1.6rem !important;
            min-height: auto !important;
            border-radius: 36px !important;
          }
          .footer-main-grid {
            grid-template-columns: 1fr !important;
            gap: 1.4rem !important;
          }
        }

        @media (max-width: 520px) {
          .footer-root {
            margin-top: -190px !important;
            padding-bottom: 0.85rem !important;
          }
          .footer-card {
            /* Khusus layar smartphone lebih kecil */
            padding: 225px 1.25rem 1.45rem !important;
            min-height: auto !important;
          }
          .footer-bottom-bar {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.85rem !important;
          }
        }
      `}</style>
    </footer>
  );
}
