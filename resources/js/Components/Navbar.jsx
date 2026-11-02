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

  const headerBg    = '#FFFFFF';
  const headerColor = '#005BAB';

  const navBtnBg    = '#005BAB';
  const navBtnColor = '#FFFFFF';

  const menuBtnBg    = '#005BAB';
  const menuBtnColor = '#FFFFFF';

  const langSwitcherBg     = 'rgba(0,91,171,0.12)';
  const langSwitcherBorder = '1.5px solid #005BAB';
  const langPillBg         = '#005BAB';
  const getLangColor = (l) => (displayLang === l ? '#FFFFFF' : '#005BAB');

  const trackBg     = isMgd ? '#FFFFFF' : isMs ? '#005BAB' : '#FFF3DD';
  const trackBorder = isMgd ? '2.5px solid #FFFFFF' : '2.5px solid #005BAB';

  const getBtnStyle = (pKey) => {
    const isActive = persona === pKey;
    if (pKey === 'mgd') {
      if (isActive) return { background: '#005BAB', color: '#FFFFFF', border: '2.5px solid #FFFFFF', boxShadow: '0 4px 14px rgba(0, 91, 171, 0.25)' };
      return { background: 'transparent', color: isMs ? '#FFF3DD' : '#005BAB', border: '2.5px solid transparent' };
    }
    if (pKey === 'ms') {
      if (isActive) return { background: '#FFFFFF', color: '#005BAB', border: '2.5px solid #005BAB', boxShadow: '0 4px 14px rgba(0, 91, 171, 0.2)' };
      return { background: 'transparent', color: isMs ? '#FFF3DD' : '#005BAB', border: '2.5px solid transparent' };
    }
    if (pKey === 'dpd') {
      if (isActive) return { background: '#005BAB', color: '#FFFFFF', border: '2.5px solid #005BAB', boxShadow: '0 4px 14px rgba(0, 91, 171, 0.25)' };
      return { background: 'transparent', color: isMs ? '#FFF3DD' : '#005BAB', border: '2.5px solid transparent' };
    }
    return {};
  };

  return (
    <header style={{
      position: 'relative',
      zIndex: mobileMenuOpen ? 50 : 2,
      padding: '1.75rem 0 0',
      width: '100%'
    }}>
      <div style={{
        width: '100%',
        padding: '0 clamp(1rem, 3.5vw, 2.5rem)',
        boxSizing: 'border-box'
      }}>
        {/* Under-Card Header — Large Canvas Behind Container Utama */}
        <div className={`herta-header-card${mobileMenuOpen ? ' mobile-open' : ''}`} style={{
          width: '100%',
          background: headerBg,
          color: headerColor,
          borderRadius: '44px',
          border: 'none',
          boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.12), 0 16px 40px rgba(0, 0, 0, 0.08)',
          boxSizing: 'border-box',
          overflow: 'hidden',
          transition: 'background 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.4s ease'
        }}>

          {/* ── Top Bar: Logo kiri + Nav/Hamburger kanan ── */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '1.1rem 2rem',
            boxSizing: 'border-box'
          }} className="navbar-topbar">

            {/* Brand Logo */}
            <div
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }}
            >
              <img
                src="/logoblue.png"
                alt="Portoda Logo"
                onError={(e) => { e.target.onerror = null; e.target.src = '/logoblue.png'; }}
                style={{ height: '52px', width: 'auto', objectFit: 'contain' }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.55rem', fontWeight: 800, color: headerColor, letterSpacing: '-0.02em' }}>
                    Portoda
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#005BAB', opacity: 0.9, marginTop: '-2px', fontWeight: 600 }}>
                  Aplikasi Portofolio Hamdani
                </p>
              </div>
            </div>

            {/* Right: Desktop Nav + Lang + Mobile Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>

              {/* Language Switcher (Desktop only) */}
              <div
                className="lang-switcher-pill"
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
              >
                <div style={{
                  position: 'absolute', top: '3px', bottom: '3px', left: '3px',
                  width: 'calc(50% - 3px)',
                  background: langPillBg,
                  borderRadius: '999px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  transform: displayLang === 'en' ? 'translateX(100%)' : 'translateX(0%)',
                  transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  pointerEvents: 'none', zIndex: 1
                }} />
                <button type="button" onClick={() => handleLanguageChange('id')}
                  style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', padding: '0.4rem 0.85rem', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', border: 'none', background: 'transparent', color: getLangColor('id'), transition: 'color 0.2s ease' }}>
                  <span>ID</span>
                </button>
                <button type="button" onClick={() => handleLanguageChange('en')}
                  style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', padding: '0.4rem 0.85rem', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', border: 'none', background: 'transparent', color: getLangColor('en'), transition: 'color 0.2s ease' }}>
                  <span>EN</span>
                </button>
              </div>

              {/* Desktop Nav Links */}
              <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button key={item.id} onClick={() => handleNavClick(item.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0.6rem 1.15rem', borderRadius: '999px', fontSize: '0.88rem', fontWeight: 800, color: navBtnColor, background: navBtnBg, border: '2px solid #005BAB', transition: 'all 0.2s ease', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                      <Icon size={17} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Hamburger (Mobile only) */}
              <div className="mobile-toggle" style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  style={{ padding: '0.6rem', color: menuBtnColor, background: menuBtnBg, borderRadius: '14px', border: '2px solid #005BAB', cursor: 'pointer' }}
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* ── Mobile Drawer — di dalam card, selalu ada dengan transisi halus ── */}
          <div className="mobile-drawer-inner" style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            padding: '1rem 1.25rem 1.25rem',
            borderTop: '1px solid rgba(0,91,171,0.2)',
            boxSizing: 'border-box',
            opacity: mobileMenuOpen ? 1 : 0,
            visibility: mobileMenuOpen ? 'visible' : 'hidden',
            transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.35s ease',
            pointerEvents: mobileMenuOpen ? 'auto' : 'none'
          }}>
            {/* Language Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#005BAB', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Globe size={16} /> Language / Bahasa:
              </span>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', background: 'rgba(0,91,171,0.12)', borderRadius: '999px', padding: '2px', border: '1px solid #005BAB' }}>
                <div style={{ position: 'absolute', top: '2px', bottom: '2px', left: '2px', width: 'calc(50% - 2px)', background: '#005BAB', borderRadius: '999px', transform: displayLang === 'en' ? 'translateX(100%)' : 'translateX(0%)', transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)', pointerEvents: 'none', zIndex: 1 }} />
                <button onClick={() => handleLanguageChange('id')} style={{ position: 'relative', zIndex: 2, padding: '0.35rem 0.75rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 800, border: 'none', background: 'transparent', color: displayLang === 'id' ? '#FFFFFF' : '#005BAB', cursor: 'pointer' }}>ID</button>
                <button onClick={() => handleLanguageChange('en')} style={{ position: 'relative', zIndex: 2, padding: '0.35rem 0.75rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 800, border: 'none', background: 'transparent', color: displayLang === 'en' ? '#FFFFFF' : '#005BAB', cursor: 'pointer' }}>EN</button>
              </div>
            </div>

            <p style={{ fontSize: '0.78rem', fontWeight: 800, color: '#005BAB', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              {t('nav_mobile_title')}
            </p>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} onClick={() => handleNavClick(item.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.2rem', borderRadius: '16px', fontWeight: 800, color: '#FFFFFF', background: '#005BAB', border: '2px solid #005BAB', width: '100%', cursor: 'pointer' }}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Responsive CSS */}
      <style>{`
        /* ── DESKTOP (≥1201px): card tinggi 380px, drawer & hamburger tersembunyi ── */
        @media (min-width: 1201px) {
          .mobile-toggle { display: none !important; }
          .mobile-drawer-inner { display: none !important; }
          .lang-switcher-pill { display: inline-flex !important; }
          .herta-header-card {
            height: 380px !important;
          }
          .navbar-topbar {
            padding: 1.75rem clamp(1.5rem, 3.5vw, 2.75rem) 1.5rem !important;
          }
        }

        /* ── MOBILE (≤1200px): fixed height, hamburger tampil, desktop nav tersembunyi ── */
        @media (max-width: 1200px) {
          .desktop-nav { display: none !important; }
          .lang-switcher-pill { display: none !important; }
          .mobile-toggle { display: flex !important; }

          /* Navbar closed: tinggi ditambah lagi, posisi konten tetap di atas */
          .herta-header-card {
            height: 200px  !important; 
            overflow: hidden !important;
            transition: height 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s ease, color 0.4s ease !important;
          }

          /* Navbar open (drawer terbuka): tinggi juga ditambah proporsional */
          .herta-header-card.mobile-open {
            height: 660px !important;
            overflow: hidden !important;
          }

          .navbar-topbar {
            padding: 1.85rem 1.85rem !important;
            height: 120px !important;
            align-items: flex-start !important;
            box-sizing: border-box !important;
            flex-shrink: 0 !important; 
          }

          /* Container utama (Hero) menumpuk di atas navbar mobile dengan overlap yang jelas */
          .hero-section-wrapper {
            margin-top: -90px !important; 
          }
        }

        /* Mobile: Persona switcher stacks vertically */
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
