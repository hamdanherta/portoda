import React from 'react';
import { Sparkles, Palette, Video, Code, ArrowRight, MapPin, Mail, MessageSquare, Clock, Briefcase, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { infoService } from '../services/infoService';

export default function Hero({ onExploreClick, totalItems = 0, onOpenContact }) {
  const { lang, t } = useLanguage();
  const [profile, setProfile] = React.useState({});
  const [experiences, setExperiences] = React.useState([]);

  React.useEffect(() => {
    const loadInfo = async () => {
      const p = await infoService.getProfile();
      const exps = await infoService.getExperiences();
      setProfile(p || {});
      setExperiences(exps || []);
    };
    loadInfo();
    window.addEventListener('portoda_info_updated', loadInfo);
    return () => window.removeEventListener('portoda_info_updated', loadInfo);
  }, []);

  const getExperienceStats = () => {
    try {
      if (!Array.isArray(experiences) || experiences.length === 0) {
        return { years: '1,9', months: 22 };
      }

      let totalMonths = 0;
      experiences.forEach((exp) => {
        if (exp.duration_months && !isNaN(parseInt(exp.duration_months, 10))) {
          totalMonths += parseInt(exp.duration_months, 10);
        }
      });

      if (totalMonths > 0) {
        const yearsNum = totalMonths === 22 ? '1,9' : (totalMonths / 12).toFixed(1).replace('.', ',');
        return {
          years: yearsNum,
          months: totalMonths
        };
      }

      return { years: '1,9', months: 22 };
    } catch (e) {
      return { years: '1,9', months: 22 };
    }
  };

  const expStats = getExperienceStats();

  return (
    <section style={{ padding: '1.5rem 0 1.5rem' }}>
      <div className="container">
        {/* Main Herta Card Hero & Welcome Container */}
        <div className="herta-card" style={{
          padding: '2.25rem 2rem',
          background: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* TOP WELCOME SECTION: Foto Muka & Bio Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
            marginBottom: '2.5rem',
            paddingBottom: '2rem',
            borderBottom: '2.5px solid #005BAB',
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
                src="/hamdani.jpg"
                alt="Foto Hamdani"
                style={{
                  width: '260px',
                  height: '310px',
                  maxHeight: '320px',
                  objectFit: 'cover',
                  borderRadius: '24px',
                  border: '3px solid #005BAB',
                  boxShadow: '0 8px 24px rgba(0, 91, 171, 0.15)',
                  display: 'block'
                }}
              />
            </div>

            {/* Di Samping Foto: Welcome, Title, Stat Bar, Deskripsi & Lokasi Jambi */}
            <div style={{ flex: 1, minWidth: '280px', textAlign: 'left' }} className="hero-profile-text">
              {/* Row 1: Badges Welcome & Lokasi Jambi */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.9rem',
                  borderRadius: '999px',
                  background: '#FFF3DD',
                  border: '2px solid #005BAB',
                  color: '#005BAB',
                  fontSize: '0.82rem',
                  fontWeight: 800
                }}>
                  <Sparkles size={15} />
                  <span>{t('hero_welcome')}</span>
                </span>

                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.9rem',
                  borderRadius: '999px',
                  background: '#005BAB',
                  color: '#FFFFFF',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  border: '2px solid #005BAB'
                }}>
                  <MapPin size={15} />
                  <span>{(lang === 'en' ? profile?.domisili_en : profile?.domisili) || t('hero_location')}</span>
                </span>
              </div>

              {/* Title Utama */}
              <h1 style={{
                fontSize: 'clamp(1.65rem, 3.2vw, 2.4rem)',
                lineHeight: 1.25,
                fontWeight: 800,
                color: '#005BAB',
                marginBottom: '1rem',
                letterSpacing: '-0.02em'
              }}>
                {profile?.name || 'Hamdani'} — {lang === 'en' ? (profile?.tagline_en || profile?.tagline || t('hero_title')) : (profile?.tagline || t('hero_title'))}
              </h1>

              {/* Deskripsi Singkat */}
              <p style={{
                fontSize: 'clamp(0.92rem, 1.6vw, 1.05rem)',
                color: '#005BAB',
                fontWeight: 600,
                lineHeight: 1.65,
                marginBottom: '1.25rem',
                opacity: 0.95
              }}>
                {lang === 'en' ? (profile?.bio_en || profile?.bio || t('hero_bio')) : (profile?.bio || t('hero_bio'))}
              </p>

              {/* CTA Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                <button onClick={onExploreClick} className="btn-primary" style={{ padding: '0.65rem 1.4rem', fontSize: '0.92rem' }}>
                  <span>{t('hero_btn_explore')}</span>
                  <ArrowRight size={16} />
                </button>
                {onOpenContact && (
                  <button onClick={onOpenContact} className="btn-secondary" style={{ padding: '0.65rem 1.4rem', fontSize: '0.92rem' }}>
                    <MessageSquare size={16} />
                    <span>{t('hero_btn_contact')}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* STATS BAR RATA TENGAH LETS RIGHT ABOVE THE 3 CATEGORY CARDS */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            gap: 'clamp(1rem, 3vw, 2.5rem)',
            flexWrap: 'wrap',
            margin: '1.75rem 0 1.75rem',
            padding: '1.25rem 1.75rem',
            background: '#FFF3DD',
            borderRadius: '24px',
            border: '2.5px solid #005BAB',
            boxShadow: '0 8px 20px rgba(0, 91, 171, 0.08)',
            position: 'relative',
            zIndex: 2,
            transitionDelay: '0.1s'
          }} className="hero-stats-bar reveal-on-scroll">
            {/* Stat 1: Proyek Selesai */}
            <div style={{ textAlign: 'center', minWidth: '120px' }} className="hero-stat-box">
              <div style={{
                fontSize: 'clamp(1.9rem, 3.2vw, 2.6rem)',
                fontWeight: 800,
                color: '#005BAB',
                lineHeight: 1.1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.15rem',
                letterSpacing: '-0.03em'
              }}>
                <span>{totalItems}</span>
                <span style={{ fontSize: '1.7rem', fontWeight: 800, color: '#005BAB' }}>+</span>
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#005BAB', marginTop: '0.25rem', lineHeight: 1.3 }}>
                {t('hero_stat_completed')}
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#005BAB', opacity: 0.85, marginTop: '0.1rem' }}>
                {t('hero_stat_completed_sub')}
              </div>
            </div>

            {/* Divider Vertical */}
            <div style={{ width: '2px', height: '48px', background: '#005BAB', opacity: 0.25 }} className="stat-divider" />

            {/* Stat 2: Jam Terbang */}
            <div style={{ textAlign: 'center', minWidth: '120px' }} className="hero-stat-box">
              <div style={{
                fontSize: 'clamp(1.9rem, 3.2vw, 2.6rem)',
                fontWeight: 800,
                color: '#005BAB',
                lineHeight: 1.1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.2rem',
                letterSpacing: '-0.03em'
              }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#005BAB' }}>±</span>
                <span>4170</span>
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#005BAB', marginTop: '0.25rem', lineHeight: 1.3 }}>
                {t('hero_stat_hours')}
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#005BAB', opacity: 0.85, marginTop: '0.1rem' }}>
                {t('hero_stat_hours_sub')}
              </div>
            </div>

            {/* Divider Vertical */}
            <div style={{ width: '2px', height: '48px', background: '#005BAB', opacity: 0.25 }} className="stat-divider" />

            {/* Stat 3: Pengalaman Kerja */}
            <div style={{ textAlign: 'center', minWidth: '120px' }} className="hero-stat-box hero-stat-box-last">
              <div style={{
                fontSize: 'clamp(1.9rem, 3.2vw, 2.6rem)',
                fontWeight: 800,
                color: '#005BAB',
                lineHeight: 1.1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.2rem',
                letterSpacing: '-0.03em'
              }}>
                <span>{expStats.years}</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#005BAB', marginLeft: '0.1rem' }}>
                  {lang === 'en' ? 'Yrs' : 'Tahun'}
                </span>
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#005BAB', marginTop: '0.25rem', lineHeight: 1.3 }}>
                {t('hero_stat_exp')}
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#005BAB', opacity: 0.85, marginTop: '0.1rem' }}>
                ({expStats.months} {lang === 'en' ? 'Months' : 'Bulan Kerja'})
              </div>
            </div>
          </div>

          {/* TITLE UNTUK 3 SKILL UTAMA (RATA TENGAH) */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem', marginTop: '0.85rem', position: 'relative', zIndex: 1, transitionDelay: '0.15s' }} className="reveal-on-scroll">
            <h2 style={{
              fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)',
              fontWeight: 800,
              color: '#005BAB',
              letterSpacing: '-0.02em',
              margin: 0
            }}>
              {t('hero_skills_title')}
            </h2>
          </div>

          {/* 3 PILLARS STAT CARDS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            position: 'relative',
            zIndex: 1
          }}>
            <div className="herta-card-cream reveal-on-scroll" style={{ padding: '1.25rem', textAlign: 'center', transitionDelay: '0.2s', borderRadius: '22px' }}>
              <div style={{
                display: 'inline-flex',
                padding: '0.6rem',
                borderRadius: '16px',
                background: '#005BAB',
                color: '#FFFFFF',
                marginBottom: '0.6rem',
                border: '2px solid #005BAB'
              }}>
                <Palette size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', color: '#005BAB', marginBottom: '0.2rem' }}>{t('hero_cat_grafis')}</h3>
              <p style={{ fontSize: '0.85rem', color: '#005BAB', fontWeight: 600 }}>{t('hero_cat_grafis_desc')}</p>
            </div>

            <div className="herta-card-cream reveal-on-scroll" style={{ padding: '1.25rem', textAlign: 'center', transitionDelay: '0.3s', borderRadius: '22px' }}>
              <div style={{
                display: 'inline-flex',
                padding: '0.6rem',
                borderRadius: '16px',
                background: '#005BAB',
                color: '#FFFFFF',
                marginBottom: '0.6rem',
                border: '2px solid #005BAB'
              }}>
                <Video size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', color: '#005BAB', marginBottom: '0.2rem' }}>{t('hero_cat_multimedia')}</h3>
              <p style={{ fontSize: '0.85rem', color: '#005BAB', fontWeight: 600 }}>{t('hero_cat_multimedia_desc')}</p>
            </div>

            <div className="herta-card-cream reveal-on-scroll" style={{ padding: '1.25rem', textAlign: 'center', transitionDelay: '0.4s', borderRadius: '22px' }}>
              <div style={{
                display: 'inline-flex',
                padding: '0.6rem',
                borderRadius: '16px',
                background: '#005BAB',
                color: '#FFFFFF',
                marginBottom: '0.6rem',
                border: '2px solid #005BAB'
              }}>
                <Code size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', color: '#005BAB', marginBottom: '0.2rem' }}>{t('hero_cat_aplikasi')}</h3>
              <p style={{ fontSize: '0.85rem', color: '#005BAB', fontWeight: 600 }}>{t('hero_cat_aplikasi_desc')}</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
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
          .hero-stats-bar {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 1.25rem 0.5rem !important;
            padding: 1.25rem 1rem !important;
            justify-items: center !important;
            align-items: center !important;
            border-radius: 24px !important;
          }
          .hero-stats-bar .stat-divider {
            display: none !important;
          }
          .hero-stat-box {
            width: 100% !important;
            min-width: 0 !important;
            text-align: center !important;
          }
          .hero-stat-box-last {
            grid-column: 1 / -1 !important;
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            margin-top: 0.25rem !important;
          }
        }
      `}</style>
    </section>
  );
}
