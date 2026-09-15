import React from 'react';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer({ onCategoryClick, onOpenAdmin }) {
  const { lang, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ padding: '1.5rem 0 2.5rem' }}>
      <div className="container reveal-on-scroll">
        {/* Floating Herta Card Footer */}
        <div className="herta-card" style={{
          background: '#005BAB',
          color: '#FFFFFF',
          borderRadius: '28px',
          border: '2.5px solid #005BAB',
          padding: '2.5rem 2rem 1.75rem',
          boxShadow: '0 12px 32px rgba(0, 91, 171, 0.18)'
        }}>
          <div style={{
            marginBottom: '1.75rem'
          }}>
            {/* Brand Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.85rem' }}>
              <img
                src="/logocream.png"
                alt="Portoda Logo"
                style={{
                  height: '44px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF' }}>
                PORTODA — {t('nav_subtitle')}
              </span>
            </div> 
            <p style={{ fontSize: '0.9rem', color: '#FFF3DD', lineHeight: 1.6, fontWeight: 400, maxWidth: '820px' }}>
              {t('footer_tagline')}
            </p>

            {/* Ikuti & Temukan Hamdani (Social Media Links) */}
            <div style={{ marginTop: '1.5rem' }}>
              <span style={{ fontSize: 'clamp(1.2rem, 2.4vw, 1.5rem)', fontWeight: 800, color: '#FFF3DD', display: 'block', marginBottom: '0.85rem', letterSpacing: '-0.01em' }}>
                {lang === 'en' ? 'Follow & Find Hamdani' : 'Ikuti dan Temukan Hamdani'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'yt', name: 'YouTube', icon: '/sosmed/yt.png', url: 'https://www.youtube.com/@Hamdanherta' },
                  { id: 'fb', name: 'Facebook', icon: '/sosmed/fb.png', url: 'https://web.facebook.com/hamdanerbic?locale=id_ID' },
                  { id: 'tt', name: 'TikTok', icon: '/sosmed/tt.png', url: 'https://www.tiktok.com/@hamdanherta?_r=1&_t=ZS-99lIegrs26h' },
                  { id: 'gh', name: 'GitHub', icon: '/sosmed/gh.png', url: 'https://github.com/hamdanherta' },
                  { id: 'ln', name: 'LinkedIn', icon: '/sosmed/ln.png', url: 'https://www.linkedin.com/in/hamdanherta/' },
                  { id: 'th', name: 'Threads', icon: '/sosmed/th.png', url: 'https://www.threads.com/@hamdanherta' },
                  { id: 'ig', name: 'Instagram', icon: '/sosmed/ig.png', url: 'https://www.instagram.com/hamdanherta/' }
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
                      padding: '0.4rem',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.12)',
                      border: '1.5px solid rgba(255, 243, 221, 0.35)',
                      transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      textDecoration: 'none'
                    }}
                  >
                    <img
                      src={item.icon}
                      alt={item.name}
                      style={{
                        height: '38px',
                        width: '38px',
                        objectFit: 'contain',
                        display: 'block'
                      }}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{
            paddingTop: '1.25rem',
            borderTop: '2px solid rgba(255, 243, 221, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.85rem',
            color: '#FFF3DD',
            fontWeight: 700,
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                © {new Date().getFullYear()} Portoda Portfolio by Hamdani. {t('footer_copyright')}
              </div>
              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  style={{
                    fontSize: '0.78rem',
                    color: '#FFF3DD',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontWeight: 700,
                    opacity: 0.8
                  }}
                  title="Buka Dashboard Admin"
                >
                  
                </button>
              )}
            </div>

            <button
              onClick={scrollToTop}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#FFFFFF',
                fontWeight: 800,
                background: 'rgba(255, 255, 255, 0.18)',
                padding: '0.4rem 1rem',
                borderRadius: '999px',
                border: '1.5px solid #FFFFFF'
              }}
            >
              <span>{t('footer_back_to_top')}</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .footer-social-icon-link:hover {
          transform: translateY(-4px) scale(1.15) !important;
          background: rgba(255, 255, 255, 0.28) !important;
          border-color: #FFF3DD !important;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </footer>
  );
}
