import React, { useState } from 'react';
import { Menu, X, Briefcase, Mail, User, FileText, Globe, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ onOpenNavModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const [displayLang, setDisplayLang] = useState(lang);

  React.useEffect(() => {
    setDisplayLang(lang);
  }, [lang]);

  const handleLanguageChange = (newLang) => {
    if (newLang === lang) return;
    setDisplayLang(newLang);
    React.startTransition(() => {
      setLang(newLang);
    });
  };

  const navItems = [
    { id: 'pengalaman', label: t('nav_experiences'), icon: Briefcase },
    { id: 'dokumen', label: t('nav_documents'), icon: FileText },
    { id: 'sertifikat', label: t('nav_certificates'), icon: Award },
    { id: 'kontak', label: t('nav_contact'), icon: Mail },
    { id: 'profil', label: t('nav_profile'), icon: User },
  ];

  const handleNavClick = (id) => {
    setMobileMenuOpen(false);
    onOpenNavModal(id);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 900,
      padding: '1.5rem 0 1rem'
    }}>
      <div className="container" style={{ maxWidth: '1300px' }}>
        {/* Floating Herta Card Header */}
        <div className="herta-card herta-header-card" style={{
          background: '#005BAB',
          color: '#FFFFFF',
          borderRadius: '32px',
          border: '2.5px solid #005BAB',
          padding: '1.25rem 2.25rem',
          boxShadow: '0 14px 36px rgba(0, 91, 171, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '94px'
        }}>
          {/* Brand Logo */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', position: 'relative', zIndex: 1 }}
          >
            <img
              src="/logocream.png"
              alt="Portoda Logo"
              style={{
                height: '56px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                  Portoda
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#FFF3DD', opacity: 0.9, marginTop: '-2px', fontWeight: 600 }}>
                {t('nav_subtitle')}
              </p>
            </div>
          </div>

          {/* Right Section: Desktop Nav + Language Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Language Switcher Capsule Toggle (Desktop & Tablet) */}
            <div 
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                borderRadius: '999px',
                padding: '3px',
                border: '1.5px solid rgba(255, 255, 255, 0.35)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.12)',
                userSelect: 'none'
              }}
              className="lang-switcher-pill"
            >
              {/* Sliding Active Pill Background (Hardware Accelerated 60fps) */}
              <div 
                style={{
                  position: 'absolute',
                  top: '3px',
                  bottom: '3px',
                  left: '3px',
                  width: 'calc(50% - 3px)',
                  background: '#FFF3DD',
                  borderRadius: '999px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  transform: displayLang === 'en' ? 'translateX(100%)' : 'translateX(0%)',
                  transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  willChange: 'transform',
                  pointerEvents: 'none',
                  zIndex: 1
                }}
              />

              <button
                type="button"
                onClick={() => handleLanguageChange('id')}
                style={{
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: 'none',
                  background: 'transparent',
                  color: displayLang === 'id' ? '#005BAB' : '#FFFFFF',
                  transition: 'color 0.2s ease'
                }}
              >
                <span>ID</span>
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                style={{
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: 'none',
                  background: 'transparent',
                  color: displayLang === 'en' ? '#005BAB' : '#FFFFFF',
                  transition: 'color 0.2s ease'
                }}
              >
                <span>EN</span>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', position: 'relative', zIndex: 1 }} className="desktop-nav">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                      padding: '0.65rem 1.25rem',
                      borderRadius: '999px',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      color: '#005BAB',
                      background: '#FFF3DD',
                      border: '2px solid #005BAB',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Menu Toggle */}
            <div style={{ display: 'flex', alignItems: 'center' }} className="mobile-toggle">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                  padding: '0.65rem',
                  color: '#005BAB',
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  border: '2px solid #FFFFFF',
                  cursor: 'pointer'
                }}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="container mobile-drawer" style={{ maxWidth: '1300px', marginTop: '0.75rem' }}>
          <div className="herta-card" style={{
            background: '#005BAB',
            borderRadius: '24px',
            border: '2.5px solid #005BAB',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {/* Language Switcher in Mobile Drawer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,243,221,0.2)' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFF3DD', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Globe size={16} /> Language / Bahasa:
              </span>
              <div style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.18)',
                borderRadius: '999px',
                padding: '2px',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <div 
                  style={{
                    position: 'absolute',
                    top: '2px',
                    bottom: '2px',
                    left: '2px',
                    width: 'calc(50% - 2px)',
                    background: '#FFF3DD',
                    borderRadius: '999px',
                    transform: displayLang === 'en' ? 'translateX(100%)' : 'translateX(0%)',
                    transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    willChange: 'transform',
                    pointerEvents: 'none',
                    zIndex: 1
                  }}
                />
                <button
                  onClick={() => handleLanguageChange('id')}
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: '0.35rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    border: 'none',
                    background: 'transparent',
                    color: displayLang === 'id' ? '#005BAB' : '#FFFFFF',
                    transition: 'color 0.2s ease'
                  }}
                >
                  ID
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: '0.35rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    border: 'none',
                    background: 'transparent',
                    color: displayLang === 'en' ? '#005BAB' : '#FFFFFF',
                    transition: 'color 0.2s ease'
                  }}
                >
                  EN
                </button>
              </div>
            </div>

            <p style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FFF3DD', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('nav_mobile_title')}
            </p>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem 1.2rem',
                    borderRadius: '16px',
                    fontWeight: 800,
                    color: '#005BAB',
                    background: '#FFF3DD',
                    border: '2px solid #005BAB'
                  }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Inline responsive style tweaks */}
      <style>{`
        @media (max-width: 1200px) {
          .desktop-nav { display: none !important; }
          .lang-switcher-pill { display: none !important; }
          .herta-header-card {
            padding: 1rem 1.25rem !important;
            min-height: 84px !important;
          }
        }
        @media (min-width: 1201px) {
          .mobile-toggle { display: none !important; }
          .mobile-drawer { display: none !important; }
          .lang-switcher-pill { display: inline-flex !important; }
          .herta-header-card {
            padding: 1.25rem 2.25rem !important;
            min-height: 94px !important;
          }
        }
      `}</style>
    </header>
  );
}
