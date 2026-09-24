import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Briefcase, Building2 } from 'lucide-react';
import WatermarkedImage from './WatermarkedImage';

export default function ClientShowcase({ clients = [] }) {
  const { lang } = useLanguage();

  if (!clients || clients.length === 0) {
    return null;
  }

  return (
    <section className="reveal-on-scroll reveal-visible" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
      <div className="container" style={{ position: 'relative', zIndex: 10 }}> 
        {/* Section Header */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '36px',
          border: '2.5px solid #005BAB',
          padding: '2rem 1.5rem',
          boxShadow: '0 10px 30px rgba(0, 91, 171, 0.08)',
          maxWidth: '100%',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            marginBottom: '0.65rem'
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
                  ? 'Here is the list of clients, brands, and partners who have collaborated with and entrusted Hamdani for creative projects.'
                  : 'Berikut adalah daftar klien, brand, dan mitra yang pernah bekerja sama serta menggunakan keahlian Hamdani.'}
              </p>
            </div>
          </div>

          {/* Grid Logo Klien (1:1 Ratio Square, Fully Responsive, No Overflow) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
            gap: '1rem',
            marginTop: '1.75rem',
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
      </div>
    </section>
  );
}
