import React from 'react';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePersona } from '../context/PersonaContext';

export default function Footer({ onCategoryClick, onOpenAdmin, isLoggedIn }) {
  const { lang, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Selalu gunakan styling seperti persona Multimedia (MS): background putih, teks & aksen biru #005BAB
  const footerBg     = '#FFFFFF';
  const footerColor  = '#005BAB';
  const subtextColor = '#005BAB';

  return (
    <footer style={{
      width: '100%',
      padding: '0 0 1.75rem',
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
        <div style={{
          width: '100%',
          minHeight: '380px',
          background: footerBg,
          color: footerColor,
          borderRadius: '44px',
          border: 'none',
          padding: '240px clamp(1.5rem, 5vw, 4rem) 2.25rem',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.08), 0 -8px 30px rgba(0, 0, 0, 0.08)',
          boxSizing: 'border-box',
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ textAlign: 'left', width: '100%' }}>
            <div style={{
              marginBottom: '1.75rem',
              textAlign: 'left'
            }}>
            {/* Brand Info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '0.85rem',
              marginBottom: '0.85rem',
              textAlign: 'left'
            }}>
              <img
                src="/logoblue.png"
                alt="Portoda Logo"
                style={{
                  height: '44px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: footerColor, textAlign: 'left' }}>
                Portoda {t('nav_subtitle')} 
              </span>
            </div> 
            <p style={{
              fontSize: '0.9rem',
              color: subtextColor,
              lineHeight: 1.6,
              fontWeight: 500,
              width: '100%',
              maxWidth: '100%',
              textAlign: 'left',
              margin: '0 0 1.5rem 0'
            }}>
              {t('footer_tagline')}
            </p>

            {/* Ikuti & Temukan Hamdani (Social Media Links) */}
            <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
              <span style={{
                fontSize: 'clamp(1.2rem, 2.4vw, 1.5rem)',
                fontWeight: 800,
                color: subtextColor,
                display: 'block',
                marginBottom: '0.85rem',
                letterSpacing: '-0.01em',
                textAlign: 'left'
              }}>
                {lang === 'en' ? 'Follow & Find Hamdani' : 'Ikuti dan Temukan Hamdani'}
              </span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '0.85rem',
                flexWrap: 'wrap'
              }}>
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
                      background: '#FFFFFF',
                      border: '2px solid #005BAB',
                      transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      textDecoration: 'none'
                    }}
                  >
                    <img
                      src={`/sosmed2/${item.id}.png`}
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
            borderTop: '1.5px solid rgba(0, 91, 171, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.85rem',
            color: subtextColor,
            fontWeight: 700,
            position: 'relative',
            zIndex: 1,
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '1rem', flexWrap: 'wrap', textAlign: 'left' }}>
              <div style={{ textAlign: 'left' }}>
                © {new Date().getFullYear()} Portoda Portfolio by Hamdani. {t('footer_copyright')}
              </div>
              {isLoggedIn && onOpenAdmin && (
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    backgroundColor: '#005BAB',
                    border: '2px solid #005BAB',
                    padding: '0.28rem 0.85rem',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0, 91, 171, 0.2)'
                  }}
                  className="hover-lift"
                  title="Klik untuk langsung masuk ke Dasbor Admin"
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 0 6px #FFFFFF',
                      display: 'inline-block'
                    }}
                  />
                  <span>Sedang Login</span>
                </button>
              )}
            </div>

            <button
              onClick={scrollToTop}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#005BAB',
                fontWeight: 800,
                background: 'rgba(0, 91, 171, 0.08)',
                padding: '0.4rem 1rem',
                borderRadius: '999px',
                border: '1.5px solid #005BAB'
              }}
            >
              <span>{t('footer_back_to_top')}</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
        </div>
      </div>
      <style>{`
        .footer-social-icon-link:hover {
          transform: translateY(-4px) scale(1.15) !important;
          background: rgba(0, 91, 171, 0.15) !important;
          border-color: #005BAB !important;
          box-shadow: 0 8px 20px rgba(0, 91, 171, 0.25);
        }
      `}</style>
    </footer>
  );
}
