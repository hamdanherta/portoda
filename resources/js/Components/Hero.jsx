import React from 'react';
import { Sparkles, Palette, Video, Code, ArrowRight, MapPin, Mail, MessageSquare, Clock, Briefcase, Award, Building2, Paintbrush, Monitor } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePersona } from '../context/PersonaContext';
import { infoService } from '../services/infoService';
import WatermarkedImage from './WatermarkedImage';

function AnimatedCounter({ end, duration = 1800 }) {
  const [count, setCount] = React.useState(0);
  const target = parseInt(end, 10) || 0;

  React.useEffect(() => {
    let startTimestamp = null;
    let frameId = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out expo for smooth decelerating animation
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.floor(easeOut * target);
      setCount(currentVal);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [target, duration]);

  return <span>{count}</span>;
}

export default function Hero({ onExploreClick, totalItems = 0, onOpenContact, children }) {
  const { lang, t } = useLanguage();
  const { persona, setPersona } = usePersona();
  const [profile, setProfile] = React.useState({});
  const [experiences, setExperiences] = React.useState([]);
  const [softwareSkills, setSoftwareSkills] = React.useState([]);
  const [clients, setClients] = React.useState([]);

  const handleScrollToClients = () => {
    const target = document.getElementById('klien-hamdani');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    const loadInfo = async () => {
      const p = await infoService.getProfile();
      const exps = await infoService.getExperiences();
      const sskills = await infoService.getSoftwareSkills();
      const clts = await infoService.getClients();
      setProfile(p || {});
      setExperiences(exps || []);
      setSoftwareSkills(sskills || []);
      setClients(clts || []);
    };
    loadInfo();
    window.addEventListener('portoda_info_updated', loadInfo);
    return () => window.removeEventListener('portoda_info_updated', loadInfo);
  }, []);

  const isMgd = persona === 'mgd';

  const currentTagline = persona === 'mgd'
    ? (lang === 'en' ? (profile?.tagline_mgd_en || profile?.tagline_mgd || profile?.tagline_en || 'Graphic Designer') : (profile?.tagline_mgd || profile?.tagline || 'Graphic Designer'))
    : persona === 'ms'
    ? (lang === 'en' ? (profile?.tagline_ms_en || profile?.tagline_ms || profile?.tagline_en || 'Multimedia Specialist') : (profile?.tagline_ms || profile?.tagline || 'Multimedia Specialist'))
    : (lang === 'en' ? (profile?.tagline_dpd_en || profile?.tagline_dpd || profile?.tagline_en || 'Digital Product Designer') : (profile?.tagline_dpd || profile?.tagline || 'Digital Product Designer'));

  const currentBio = persona === 'mgd'
    ? (lang === 'en' ? (profile?.bio_mgd_en || profile?.bio_mgd || profile?.bio_en || t('hero_bio')) : (profile?.bio_mgd || profile?.bio || t('hero_bio')))
    : persona === 'ms'
    ? (lang === 'en' ? (profile?.bio_ms_en || profile?.bio_ms || profile?.bio_en || t('hero_bio')) : (profile?.bio_ms || profile?.bio || t('hero_bio')))
    : (lang === 'en' ? (profile?.bio_dpd_en || profile?.bio_dpd || profile?.bio_en || t('hero_bio')) : (profile?.bio_dpd || profile?.bio || t('hero_bio')));

  const getExperienceStats = () => {
    try {
      if (!Array.isArray(experiences) || experiences.length === 0) {
        return { years: '1,8', months: 22 };
      }

      let totalMonths = 0;
      experiences.forEach((exp) => {
        if (exp.duration_months && !isNaN(parseInt(exp.duration_months, 10))) {
          totalMonths += parseInt(exp.duration_months, 10);
        }
      });

      if (totalMonths > 0) {
        const yearsNum = totalMonths === 22 ? '1,8' : (totalMonths / 12).toFixed(1).replace('.', ',');
        return {
          years: yearsNum,
          months: totalMonths
        };
      }

      return { years: '1,8', months: 22 };
    } catch (e) {
      return { years: '1,8', months: 22 };
    }
  };

  const expStats = getExperienceStats();

  return (
    <section className="hero-section-wrapper" style={{ padding: '0', marginTop: '-280px', width: '100%', position: 'relative', zIndex: 10 }}>
      <div style={{
        width: '100%',
        padding: '0 clamp(1rem, 3.5vw, 2.5rem)',
        boxSizing: 'border-box'
      }}>
        {/* Main Herta Card Hero & Welcome Container (Overlaps on top of Navbar with premium shadow & no border) */}
        <div className="herta-card hero-main-card" style={{
          width: '100%',
          padding: 'clamp(2rem, 4vw, 3.25rem) clamp(1.5rem, 4vw, 3.5rem)',
          background: '#FFFFFF',
          borderRadius: '44px',
          border: 'none',
          position: 'relative',
          zIndex: 10,
          boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.08), 0 20px 45px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          {/* PERSONA SWITCHER SECTION (Didalam Container Utama) */}
          <div style={{
            marginBottom: '2rem',
            paddingBottom: '1.75rem',
            borderBottom: '2px solid rgba(0, 91, 171, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.65rem',
            textAlign: 'center',
            width: '100%'
          }}>
            {/* Heading: Welcome to My Portfolio (Gradient atas ke bawah #317AFC -> #9EC1FF) */}
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5.2vw, 3.25rem)',
              fontWeight: 900,
              background: 'linear-gradient(180deg, #005BAB 0%, #0049B1 100%)',  
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent', 
              backgroundClip: 'text',
              color: 'transparent',
              display: 'inline-block',
              margin: '8px 0',
              letterSpacing: '-0.02em',
              lineHeight: 1.25
            }}>
              {t('hero_welcome')}
            </h2>

            {/* Explanation Text */}
            <p style={{
              fontSize: 'clamp(0.78rem, 1.5vw, 1.00rem)',
              fontWeight: 600,
              color: '#005BAB',
              margin: 0,
              lineHeight: 1.45,
              maxWidth: '850px',
              opacity: 0.95
            }}>
              {lang === 'en'
                ? 'Hamdani has three types of portfolios. Please select a category below to view the respective works.'
                : 'Hamdani Memiliki Tiga Jenis Portofolio. Silakan Pilih Kategori Di Bawah Ini Untuk Melihat Masing-Masing Karya'}
            </p>

            {/* Persona Switch Track */}
            <div
              className="persona-switch-track"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                background: '#FFFFFF',
                borderRadius: '999px',
                padding: '6px',
                border: '2.5px solid #005BAB',
                boxShadow: '0 8px 24px rgba(0, 91, 171, 0.12)',
                width: '100%',
                maxWidth: '780px',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Option 1: Graphic Design (MGD) */}
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
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  textAlign: 'center',
                  background: persona === 'mgd' ? '#005BAB' : 'transparent',
                  color: persona === 'mgd' ? '#FFFFFF' : '#005BAB',
                  border: persona === 'mgd' ? '2.5px solid #005BAB' : '2.5px solid transparent',
                  boxShadow: persona === 'mgd' ? '0 4px 14px rgba(0, 91, 171, 0.25)' : 'none'
                }}
              >
                <Paintbrush size={16} style={{ flexShrink: 0 }} />
                <span>Graphic Design</span>
              </button>

              {/* Option 2: Multimedia (MS) */}
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
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  textAlign: 'center',
                  background: persona === 'ms' ? '#005BAB' : 'transparent',
                  color: persona === 'ms' ? '#FFFFFF' : '#005BAB',
                  border: persona === 'ms' ? '2.5px solid #005BAB' : '2.5px solid transparent',
                  boxShadow: persona === 'ms' ? '0 4px 14px rgba(0, 91, 171, 0.25)' : 'none'
                }}
              >
                <Video size={16} style={{ flexShrink: 0 }} />
                <span>Multimedia</span>
              </button>

              {/* Option 3: Digital Product Design (DPD) */}
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
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  textAlign: 'center',
                  background: persona === 'dpd' ? '#005BAB' : 'transparent',
                  color: persona === 'dpd' ? '#FFFFFF' : '#005BAB',
                  border: persona === 'dpd' ? '2.5px solid #005BAB' : '2.5px solid transparent',
                  boxShadow: persona === 'dpd' ? '0 4px 14px rgba(0, 91, 171, 0.25)' : 'none'
                }}
              >
                <Monitor size={16} style={{ flexShrink: 0 }} />
                <span>Digital Product Design</span>
              </button>
            </div>
          </div>

          {/* TOP WELCOME SECTION: Foto Muka & Bio Info */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '2rem',
            flexWrap: 'wrap',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            position: 'relative',
            zIndex: 1
          }} className="hero-profile-row reveal-on-scroll">
            {/* Foto Muka Hamdani */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexShrink: 0,
              margin: '0 auto',
              position: 'relative'
            }} className="hero-photo-wrapper">
              <img
                src="/hamdani.webp"
                alt="Foto Hamdani"
                style={{
                  width: '260px',
                  height: '310px',
                  maxHeight: '320px',
                  objectFit: 'cover',
                  borderRadius: '32px',
                  border: '3px solid #005BAB',
                  boxShadow: '0 8px 24px rgba(0, 91, 171, 0.15)',
                  display: 'block'
                }}
              />
            </div>

            {/* Di Samping Foto: Title, Stat Bar, Deskripsi & Lokasi Jambi */}
            <div style={{ flex: 1, minWidth: '280px', textAlign: 'left' }} className="hero-profile-text">
              {/* Title Utama */}
              <h1 style={{
                fontSize: 'clamp(1.65rem, 3.2vw, 2.4rem)',
                lineHeight: 1.25,
                fontWeight: 800,
                color: '#005BAB',
                marginBottom: '1rem',
                letterSpacing: '-0.02em'
              }}>
                <span className="hero-title-name">{profile?.name || 'Hamdani'}</span>
                <span className="hero-title-sep"> — </span>
                <br className="hero-title-br" />
                <span className="hero-title-tagline" style={{ fontWeight: 400 }}>
                  {currentTagline}
                </span>
              </h1>

              {/* Deskripsi Singkat */}
              <p style={{
                fontSize: 'clamp(0.92rem, 1.6vw, 1.05rem)',
                color: '#005BAB',
                fontWeight: 400,
                lineHeight: 1.65,
                marginBottom: '1.25rem',
                opacity: 0.95
              }}>
                {currentBio}
              </p>

              {/* Badge Lokasi & CTA Action Buttons Container */}
              <div className="hero-cta-container">
                {/* Badge Lokasi */}
                <div className="hero-cta-badge" style={{ width: 'fit-content' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1.4rem',
                    borderRadius: '999px',
                    background: '#005BAB',
                    color: '#FFFFFF',
                    fontSize: '0.92rem',
                    fontWeight: 400,
                    border: '2.5px solid #005BAB',
                    width: 'fit-content',
                    whiteSpace: 'nowrap'
                  }}>
                    <MapPin size={17} style={{ flexShrink: 0 }} />
                    <span style={{ fontWeight: 400 }}>
                      {(lang === 'en'
                        ? (profile?.domisili_en || profile?.domisili || profile?.tempat_tinggal_en || profile?.tempat_tinggal)
                        : (profile?.domisili || profile?.tempat_tinggal)) || t('hero_location')}
                    </span>
                  </span>
                </div>

                {/* Button Klien Saya (Kuning Soft) */}
                <button
                  onClick={handleScrollToClients}
                  className="hero-cta-clients"
                  style={{
                    padding: '0.65rem 1.4rem',
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    borderRadius: '999px',
                    background: '#FAFFA4',
                    color: '#005BAB', 
                    border: '2.5px solid #005BAB',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(217, 119, 6, 0.15)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Building2 size={16} />
                  <span>{lang === 'en' ? 'My Clients' : 'Lihat Klien Saya'}</span>
                  <ArrowRight size={16} />
                </button>

                

                {/* Button Explore (Jelajahi Karya) */}
                <button onClick={onExploreClick} className="btn-green hero-cta-explore" style={{ padding: '0.65rem 1.4rem', fontSize: '0.92rem' }}>
                  <span>{t('hero_btn_explore')}</span>
                  <ArrowRight size={16} />
                </button>

                {/* Button Contact */}
                {onOpenContact && (
                  <button onClick={onOpenContact} className="btn-secondary hero-cta-contact" style={{ padding: '0.65rem 1.4rem', fontSize: '0.92rem' }}>
                    <MessageSquare size={16} />
                    <span>{t('hero_btn_contact')}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 2-COLUMN SECTION: Proyek Kreatif & Jam Terbang vs Software yang Digunakan */}
          <div className="hero-metrics-software-section" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            alignItems: 'center',
            gap: 'clamp(2rem, 5vw, 4rem)',
            marginTop: '2.25rem',
            paddingTop: '2.25rem',
            paddingBottom: '0.5rem',
            borderTop: '2px solid rgba(0, 91, 171, 0.15)',
            position: 'relative',
            zIndex: 2
          }}>
            {/* Kolom 1: Angka Statistik 2 Kolom x 2 Baris */}
            <div className="hero-metrics-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 3.5vw, 3rem)',
              justifySelf: 'stretch',
              width: '100%',
              maxWidth: '100%',
              paddingLeft: 'clamp(1rem, 2.5vw, 2rem)',
              paddingRight: 'clamp(0.5rem, 1.5vw, 1.5rem)',
              boxSizing: 'border-box'
            }}>
              {/* Item 1: Proyek Kreatif Selesai */}
              <div className="hero-metric-item" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="hero-metric-number" style={{
                  fontSize: 'clamp(2.2rem, 4.2vw, 3.4rem)',
                  fontWeight: 800,
                  color: '#005BAB',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  display: 'flex',
                  alignItems: 'baseline'
                }}>
                  <AnimatedCounter end={totalItems} duration={1600} />
                  <span style={{ color: '#005BAB', marginLeft: '0.1rem' }}>+</span>
                </div>
                <div className="hero-metric-label" style={{
                  fontSize: 'clamp(0.95rem, 1.6vw, 1.25rem)',
                  fontWeight: 500,
                  color: '#005BAB',
                  lineHeight: 1.25,
                  marginTop: '0.45rem'
                }}>
                  {lang === 'en' ? 'Completed Creative' : 'Proyek Kreatif'}
                  <br />
                  <span style={{ fontWeight: 800 }}>{lang === 'en' ? 'Projects' : 'Selesai'}</span>
                </div>
              </div>

              {/* Item 2: Jam Terbang Dunia Kreatif (Statis 4310) */}
              <div className="hero-metric-item" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="hero-metric-number" style={{
                  fontSize: 'clamp(2.2rem, 4.2vw, 3.4rem)',
                  fontWeight: 800,
                  color: '#005BAB',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  display: 'flex',
                  alignItems: 'baseline'
                }}>
                  <AnimatedCounter end={4310} duration={2000} />
                  <span style={{ color: '#005BAB', marginLeft: '0.1rem' }}>+</span>
                </div>
                <div className="hero-metric-label" style={{
                  fontSize: 'clamp(0.95rem, 1.6vw, 1.25rem)',
                  fontWeight: 500,
                  color: '#005BAB',
                  lineHeight: 1.25,
                  marginTop: '0.45rem'
                }}>
                  {lang === 'en' ? 'Flight Hours in' : 'Jam Terbang'}
                  <br />
                  <span style={{ fontWeight: 800 }}>{lang === 'en' ? 'Creative Industry' : 'Dunia Kreatif'}</span>
                </div>
              </div>

              {/* Item 3: Bulan Pengalaman Kerja (23 Bulan) */}
              <div className="hero-metric-item" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="hero-metric-number" style={{
                  fontSize: 'clamp(2.2rem, 4.2vw, 3.4rem)',
                  fontWeight: 800,
                  color: '#005BAB',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  display: 'flex',
                  alignItems: 'baseline'
                }}>
                  <AnimatedCounter end={23} duration={1400} />
                </div>
                <div className="hero-metric-label" style={{
                  fontSize: 'clamp(0.95rem, 1.6vw, 1.25rem)',
                  fontWeight: 500,
                  color: '#005BAB',
                  lineHeight: 1.25,
                  marginTop: '0.45rem'
                }}>
                  {lang === 'en' ? 'Months of Work' : 'Bulan Pengalaman'}
                  <br />
                  <span style={{ fontWeight: 800 }}>{lang === 'en' ? 'Experience' : 'Kerja'}</span>
                </div>
              </div>

              {/* Item 4: Mitra Klien Kolaborasi (Diambil dari total data clients di database) */}
              <div className="hero-metric-item" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="hero-metric-number" style={{
                  fontSize: 'clamp(2.2rem, 4.2vw, 3.4rem)',
                  fontWeight: 800,
                  color: '#005BAB',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  display: 'flex',
                  alignItems: 'baseline'
                }}>
                  <AnimatedCounter end={clients.length > 0 ? clients.length : 24} duration={1500} />
                  <span style={{ color: '#005BAB', marginLeft: '0.1rem' }}>+</span>
                </div>
                <div className="hero-metric-label" style={{
                  fontSize: 'clamp(0.95rem, 1.6vw, 1.25rem)',
                  fontWeight: 500,
                  color: '#005BAB',
                  lineHeight: 1.25,
                  marginTop: '0.45rem'
                }}>
                  {lang === 'en' ? 'Partner Clients' : 'Mitra Klien'}
                  <br />
                  <span style={{ fontWeight: 800 }}>{lang === 'en' ? 'Collaboration' : 'Kolaborasi'}</span>
                </div>
              </div>
            </div>

            {/* Kolom 2: Keahlian Perangkat Lunak / Software yang Digunakan */}
            <div className="hero-software-col" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: '100%'
            }}>
              <h2 style={{
                fontSize: 'clamp(1.35rem, 2.6vw, 1.95rem)',
                fontWeight: 500,
                color: '#005BAB',
                margin: '0 0 1.5rem 0',
                letterSpacing: '-0.02em'
              }}>
                {lang === 'en' ? 'Software Skills & Tools' : 'Keahlian Perangkat Lunak'}
              </h2>

              {/* Software Icons Grid */}
              <div className="hero-software-icons" style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '1.25rem'
              }}>
                {softwareSkills && softwareSkills.length > 0 ? (
                  softwareSkills.map((sk, idx) => (
                    <div
                      key={sk.id || idx}
                      style={{
                        width: 'clamp(62px, 8.5vw, 84px)',
                        height: 'clamp(62px, 8.5vw, 84px)',
                        borderRadius: '22px',
                        overflow: 'hidden',
                        background: '#FFFFFF',
                        border: '2px solid #005BAB',
                        boxShadow: '0 6px 18px rgba(0, 91, 171, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10px',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        cursor: 'default'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 10px 24px rgba(0, 91, 171, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 91, 171, 0.12)';
                      }}
                    >
                      <img
                        src={sk.image}
                        alt={`Software Skill ${idx + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div style={{
                    padding: '1rem 1.5rem',
                    background: '#FFF3DD',
                    borderRadius: '16px',
                    border: '1.5px solid #005BAB',
                    color: '#005BAB',
                    fontSize: '0.9rem',
                    fontWeight: 700
                  }}>
                    {lang === 'en' ? 'Software list is being updated' : 'Keahlian software belum ditambahkan di Admin'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* KLIEN HAMDANI SECTION (Didalam Container Utama) */}
          {clients && clients.length > 0 && (
            <div id="klien-hamdani" style={{
              marginTop: '2.5rem',
              paddingTop: '2rem',
              borderTop: '2px solid rgba(0, 91, 171, 0.15)',
              position: 'relative',
              zIndex: 1
            }}>
              {/* Header Klien */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '999px',
                  background: '#FFF3DD',
                  color: '#005BAB',
                  border: '2px solid #005BAB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  <Building2 size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    color: '#005BAB',
                    margin: 0,
                    lineHeight: 1.25
                  }}>
                    {lang === 'en' ? "Hamdani's Clients" : 'Klien Hamdani'}
                  </h3>
                  <p style={{
                    margin: '0.25rem 0 0 0',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: '#005BAB',
                    opacity: 0.9,
                    lineHeight: 1.45
                  }}>
                    {lang === 'en'
                      ? 'The following are some of the brands, companies, and organizations that have been part of Hamdanis professional journey, whether through freelance projects or corporate employment.'
                      : 'Berikut adalah beberapa brand, perusahaan, dan instansi yang pernah menjadi bagian dari perjalanan profesional Hamdani, baik melalui proyek freelance maupun pengalaman bekerja di perusahaan.'}
                  </p>
                </div>
              </div>

              {/* Grid Logo Klien */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                gap: '1rem',
                maxWidth: '100%'
              }}>
                {clients.map((client) => {
                  const hasName = Boolean(client.name && client.name.trim());
                  return (
                    <div
                      key={client.id || client.name || Math.random()}
                      className="herta-card"
                      title={hasName ? client.name : 'Logo Klien'}
                      style={{
                        aspectRatio: '1 / 1',
                        borderRadius: '28px',
                        background: '#FFFFFF',
                        border: '2.5px solid #005BAB',
                        padding: hasName ? '0.6rem 0.5rem 0.5rem' : '0.6rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: '0 4px 12px rgba(0, 91, 171, 0.06)'
                      }}
                    >
                      {client.logo ? (
                        <div style={{
                          width: '100%',
                          height: hasName ? 'calc(100% - 1.2rem)' : '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}>
                          <WatermarkedImage
                            src={client.logo}
                            alt={hasName ? client.name : 'Client Logo'}
                            objectFit="contain"
                            style={{ width: '100%', height: '100%', borderRadius: '18px' }}
                          />
                        </div>
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '18px',
                          background: '#FFF3DD',
                          color: '#005BAB',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          textAlign: 'center',
                          padding: '0.25rem',
                          wordBreak: 'break-word'
                        }}>
                          {hasName ? client.name : 'Klien'}
                        </div>
                      )}

                      {hasName && (
                        <div style={{
                          marginTop: '0.25rem',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          color: '#005BAB',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '100%'
                        }}>
                          {client.name}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* GALLERY & WORKS (Dimasukkan langsung ke dalam Container Utama) */}
          {children && (
            <div id="gallery-section" style={{
              marginTop: '2.5rem',
              paddingTop: '2.25rem',
              borderTop: '2px solid rgba(0, 91, 171, 0.15)',
              position: 'relative',
              zIndex: 1,
              width: '100%'
            }}>
              {children}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .hero-metrics-software-section {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
            padding-top: 2rem !important;
            margin-top: 2rem !important;
          }
          .hero-metrics-grid {
            max-width: 100% !important;
            justify-content: center !important;
          }
          .hero-software-col {
            align-items: flex-start !important;
          }
        }

        @media (max-width: 640px) {
          .hero-metrics-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 1.5rem 1.25rem !important;
            width: 100% !important;
            max-width: 380px !important;
            margin: 0 auto !important;
            padding-left: 1.5rem !important;
            padding-right: 0.5rem !important;
          }
          .hero-metric-item {
            align-items: flex-start !important;
            text-align: left !important;
            padding-left: 0 !important;
          }
          .hero-metric-number {
            font-size: 1.75rem !important;
          }
          .hero-metric-label {
            font-size: 0.8rem !important;
            line-height: 1.25 !important;
          }
          .hero-software-col {
            align-items: center !important;
            text-align: center !important;
          }
          .hero-software-icons {
            justify-content: center !important;
          }

          .hero-cta-container {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 0.95rem !important;
            width: 100% !important;
          }
          .hero-cta-badge {
            order: 1 !important;
            margin: 0 !important;
            display: flex !important;
            justify-content: center !important;
          }
          .hero-cta-clients {
            order: 2 !important;
          }
          .hero-cta-explore {
            order: 3 !important;
          }
          .hero-cta-contact {
            order: 4 !important;
          }

          .hero-title-br {
            display: block !important;
          }
          .hero-title-sep {
            display: none !important;
          }
          .hero-photo-wrapper {
            margin-top: 0.85rem !important;
          }
          .hero-profile-row {
            flex-direction: column !important;
            text-align: center !important;
          }
          .hero-profile-text {
            text-align: center !important;
          }
          .hero-profile-text > div {
            justify-content: center !important;
          }
          .hero-subtext-br {
            display: block !important;
          }
        }
        @media (min-width: 641px) {
          .hero-cta-container {
            display: flex !important;
            flex-wrap: wrap !important;
            align-items: center !important;
            gap: 0.85rem !important;
          }
          .hero-cta-badge {
            width: fit-content !important;
            margin-bottom: 0.25rem !important;
            order: 1 !important;
          }
          .hero-cta-clients {
            order: 2 !important;
          }
          .hero-cta-explore {
            order: 3 !important;
          }
          .hero-cta-contact {
            order: 4 !important;
          }

          .hero-title-br {
            display: none !important;
          }
          .hero-title-sep {
            display: inline !important;
          }
          .hero-subtext-br {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
