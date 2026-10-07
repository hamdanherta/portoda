import React, { useState } from 'react';
import { Menu, X, Briefcase, Mail, User, FileText, Globe, Award, Sparkles, Layers, Paintbrush, Monitor, Video } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePersona } from '../context/PersonaContext';

export default function Navbar({ onOpenNavModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { persona, setPersona } = usePersona();
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

  const isMgd = persona === 'mgd';
  const isMs  = persona === 'ms';
  const isDpd = persona === 'dpd';

  // Header card theme
  const headerBg     = isMgd ? '#005BAB' : isMs ? '#FFFFFF' : '#FFF3DD';
  const headerBorder = isMgd ? '2.5px solid #FFF3DD' : '2.5px solid #005BAB';
  const headerColor  = isMgd ? '#FFFFFF' : '#005BAB';

  // Nav button theme (items in desktop nav)
  const navBtnBg    = isMgd ? '#FFF3DD' : isMs ? '#005BAB' : '#005BAB';
  const navBtnColor = isMgd ? '#005BAB' : '#FFFFFF';

  // Mobile menu toggle button
  const menuBtnBg    = isMgd ? '#FFFFFF' : isMs ? '#005BAB' : '#005BAB';
  const menuBtnColor = isMgd ? '#005BAB' : '#FFFFFF';

  // Language switcher theme
  const langSwitcherBg     = isMgd ? 'rgba(255,255,255,0.18)' : 'rgba(0,91,171,0.12)';
  const langSwitcherBorder = isMgd ? '1.5px solid rgba(255,255,255,0.35)' : '1.5px solid #005BAB';
  const langPillBg         = isMgd ? '#FFF3DD' : '#005BAB';
  const getLangColor = (l) => {
    if (displayLang === l) {
      return isMgd ? '#005BAB' : '#FFFFFF';
    }
    return isMgd ? '#FFFFFF' : '#005BAB';
  };

  // Switcher Track theme:
  // When MGD: track = #FFFFFF (white container)
  // When MS:  track = #005BAB (blue container)
  // When DPD: track = #FFF3DD (cream container)
  const trackBg     = isMgd ? '#FFFFFF' : isMs ? '#005BAB' : '#FFF3DD';
  const trackBorder = isMgd ? '2.5px solid #FFFFFF' : '2.5px solid #005BAB';

  // Function to compute button style based on persona active/inactive state:
  // 1. MGD (Graphic Designer):
  //    - Active: fill #005BAB, text #FFFFFF, white border (2.5px solid #FFFFFF)
  //    - Inactive on white track (MGD): text #005BAB
  //    - Inactive on blue track (MS): text #FFF3DD
  //    - Inactive on cream track (DPD): text #005BAB
  // 2. MS (Multimedia Specialist):
  //    - Active: fill #FFFFFF, text #005BAB, blue border (2.5px solid #005BAB)
  //    - Inactive: text depending on track
  // 3. DPD (Digital Product Designer):
  //    - Active: fill #005BAB (blue fill), text #FFFFFF (white text), blue border (2.5px solid #005BAB)
  //    - Inactive: text depending on track
  const getBtnStyle = (pKey) => {
    const isActive = persona === pKey;

    if (pKey === 'mgd') {
      if (isActive) {
        return {
          background: '#005BAB',
          color: '#FFFFFF',
          border: '2.5px solid #FFFFFF',
          boxShadow: '0 4px 14px rgba(0, 91, 171, 0.25)'
        };
      }
      return {
        background: 'transparent',
        color: isMs ? '#FFF3DD' : '#005BAB',
        border: '2.5px solid transparent'
      };
    }

    if (pKey === 'ms') {
      if (isActive) {
        return {
          background: '#FFFFFF',
          color: '#005BAB',
          border: '2.5px solid #005BAB',
          boxShadow: '0 4px 14px rgba(0, 91, 171, 0.2)'
        };
      }
      return {
        background: 'transparent',
        color: isMs ? '#FFF3DD' : '#005BAB',
        border: '2.5px solid transparent'
      };
    }

    if (pKey === 'dpd') {
      if (isActive) {
        return {
          background: '#005BAB',
          color: '#FFFFFF',
          border: '2.5px solid #005BAB',
          boxShadow: '0 4px 14px rgba(0, 91, 171, 0.25)'
        };
      }
      return {
        background: 'transparent',
        color: isMs ? '#FFF3DD' : '#005BAB',
        border: '2.5px solid transparent'
      };
    }

    return {};
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 900,
      padding: '1.25rem 0 0rem'
    }}>
      <div className="container" style={{ maxWidth: '1300px' }}>
        {/* Floating Herta Card Header */}
        <div className="herta-card herta-header-card" style={{
          background: headerBg,
          color: headerColor,
          borderRadius: '32px',
          border: headerBorder,
          padding: '1.1rem 2rem',
          boxShadow: isMgd ? '0 14px 36px rgba(0, 91, 171, 0.25)' : isMs ? '0 14px 36px rgba(0, 91, 171, 0.12)' : '0 14px 36px rgba(0, 91, 171, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '90px',
          transition: 'background 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.4s ease, border-color 0.4s ease'
        }}>
          {/* Brand Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer', position: 'relative', zIndex: 1 }}
          >
            <img
              src={isMgd ? "/logocream.png" : "/logoblue.png"}
              alt="Portoda Logo"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = isMgd ? '/logocream.png' : '/logoblue.png';
              }}
              style={{
                height: '52px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.55rem', fontWeight: 800, color: headerColor, letterSpacing: '-0.02em' }}>
                  Portoda
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: isMgd ? '#FFF3DD' : '#005BAB', opacity: 0.9, marginTop: '-2px', fontWeight: 600 }}>
                Portofolio Karya Hamdani
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
                background: langSwitcherBg,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                borderRadius: '999px',
                padding: '3px',
                border: langSwitcherBorder,
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.08)',
                userSelect: 'none'
              }}
              className="lang-switcher-pill"
            >
              <div
                style={{
                  position: 'absolute',
                  top: '3px',
                  bottom: '3px',
                  left: '3px',
                  width: 'calc(50% - 3px)',
                  background: langPillBg,
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
                  color: getLangColor('id'),
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
                  color: getLangColor('en'),
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
                      padding: '0.6rem 1.15rem',
                      borderRadius: '999px',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      color: navBtnColor,
                      background: navBtnBg,
                      border: '2px solid #005BAB',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Icon size={17} />
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
                  padding: '0.6rem',
                  color: menuBtnColor,
                  background: menuBtnBg,
                  borderRadius: '14px',
                  border: '2px solid #005BAB',
                  cursor: 'pointer'
                }}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Persona Switch Bar Below Header */}
        <div style={{
          marginTop: '1.25rem',
          marginBottom: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.6rem',
          textAlign: 'center',
          padding: '0 0.5rem'
        }}>
          {/* Explanation Text */}
          <p style={{
            fontSize: '0.88rem',
            fontWeight: 700,
            color: isMgd ? '#FFFFFF' : '#005BAB',
            margin: 5,
            lineHeight: 1.4,
            maxWidth: '750px',
            opacity: 0.95
          }}>
            {lang === 'en'
              ? 'Hamdani has three types of portfolios. Please select a category below to view the respective works.'
              : 'Hamdani Memiliki Tiga Jenis Portofolio. Silakan Pilih Kategori Di Bawah Ini Untuk Melihat Masing-Masing Karya'}
          </p>

          {/* Unified Persona Switch Track (Horizontal on Desktop, Vertical on Mobile) */}
          <div
            className="persona-switch-track"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              background: trackBg,
              borderRadius: '999px',
              padding: '5px',
              border: trackBorder,
              boxShadow: '0 8px 24px rgba(0, 91, 171, 0.15)',
              width: '100%',
              maxWidth: '780px',
              transition: 'background 0.3s ease, border-color 0.3s ease'
            }}
          >
            {/* Option 1: Graphic Designer (MGD) */}
            <button
              type="button"
              onClick={() => setPersona('mgd')}
              style={{
                flex: 1,
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                textAlign: 'center',
                ...getBtnStyle('mgd')
              }}
            >
              <Paintbrush size={16} style={{ flexShrink: 0 }} />
              <span>Graphic Designer</span>
            </button>

            {/* Option 2: Multimedia Specialist (MS) */}
            <button
              type="button"
              onClick={() => setPersona('ms')}
              style={{
                flex: 1,
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                textAlign: 'center',
                ...getBtnStyle('ms')
              }}
            >
              <Video size={16} style={{ flexShrink: 0 }} />
              <span>Multimedia Specialist</span>
            </button>

            {/* Option 3: Digital Product Designer (DPD) */}
            <button
              type="button"
              onClick={() => setPersona('dpd')}
              style={{
                flex: 1,
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                textAlign: 'center',
                ...getBtnStyle('dpd')
              }}
            >
              <Monitor size={16} style={{ flexShrink: 0 }} />
              <span>Digital Product Designer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="container mobile-drawer" style={{ maxWidth: '1300px', marginTop: '0.75rem' }}>
          <div className="herta-card" style={{
            background: isMgd ? '#005BAB' : isMs ? '#FFFFFF' : '#FFF3DD',
            color: isMgd ? '#FFFFFF' : '#005BAB',
            borderRadius: '24px',
            border: isMgd ? '2.5px solid #FFF3DD' : '2.5px solid #005BAB',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {/* Language Switcher in Mobile Drawer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: isMgd ? '1px solid rgba(255,243,221,0.2)' : '1px solid rgba(0,91,171,0.2)' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: isMgd ? '#FFF3DD' : '#005BAB', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Globe size={16} /> Language / Bahasa:
              </span>
              <div style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                background: isMgd ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 91, 171, 0.12)',
                borderRadius: '999px',
                padding: '2px',
                border: isMgd ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid #005BAB'
              }}>
                <div
                  style={{
                    position: 'absolute',
                    top: '2px',
                    bottom: '2px',
                    left: '2px',
                    width: 'calc(50% - 2px)',
                    background: isMgd ? '#FFF3DD' : '#005BAB',
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
                    color: displayLang === 'id' ? (isMgd ? '#005BAB' : '#FFFFFF') : (isMgd ? '#FFFFFF' : '#005BAB'),
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
                    color: displayLang === 'en' ? (isMgd ? '#005BAB' : '#FFFFFF') : (isMgd ? '#FFFFFF' : '#005BAB'),
                    transition: 'color 0.2s ease'
                  }}
                >
                  EN
                </button>
              </div>
            </div>

            <p style={{ fontSize: '0.78rem', fontWeight: 800, color: isMgd ? '#FFF3DD' : '#005BAB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
                    color: isMgd ? '#005BAB' : '#FFFFFF',
                    background: isMgd ? '#FFF3DD' : '#005BAB',
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
            padding: 1.1rem 2rem !important;
            min-height: 90px !important;
          }
        }

        /* Mobile View: Persona switcher stacks vertically while retaining exact desktop style/colors */
        @media (max-width: 680px) {
          .persona-switch-track {
            flex-direction: column !important;
            border-radius: 24px !important;
            padding: 8px !important;
            gap: 0.5rem !important;
          }
          .persona-switch-track button {
            width: 100% !important;
            padding: 0.75rem 1rem !important;
            font-size: 0.9rem !important;
          }
        }
      `}</style>
    </header>
  );
}
