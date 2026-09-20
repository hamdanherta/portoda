import React from 'react';
import { AlertTriangle, PhoneCall } from 'lucide-react';

export default function MaintenanceModal({ isOpen }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 40, 80, 0.75)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'fadeIn 0.3s ease-out forwards'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#FFF3DD',
          border: '3px solid #005BAB',
          borderRadius: '28px',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          boxShadow: '0 25px 60px rgba(0, 91, 171, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Top Decorative Icon Container */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: '#005BAB',
            color: '#FFF3DD',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            border: '3px solid #005BAB',
            boxShadow: '0 6px 16px rgba(0, 91, 171, 0.25)'
          }}
        >
          <AlertTriangle size={36} strokeWidth={2.5} />
        </div>

        {/* Status Badge */}
        <div
          style={{
            backgroundColor: '#005BAB',
            color: '#FFF3DD',
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            padding: '0.35rem 1rem',
            borderRadius: '999px',
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
            display: 'inline-block'
          }}
        >
          Pemeliharaan Sistem
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            color: '#005BAB',
            marginBottom: '0.85rem',
            lineHeight: 1.25,
            letterSpacing: '-0.02em'
          }}
        >
          Website Sedang Maintenance
        </h2>

        {/* Subtitle / Description */}
        <p
          style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#005BAB',
            lineHeight: 1.6,
            marginBottom: '1.75rem',
            maxWidth: '440px'
          }}
        >
          Mohon maaf atas ketidaknyamanannya. Website Portoda saat ini sedang dalam proses pemeliharaan sistem & pembaruan konten oleh <strong>Hamdani</strong>.
        </p>

        {/* Contact Divider Box */}
        <div
          style={{
            width: '100%',
            paddingTop: '1.5rem',
            borderTop: '2px dashed rgba(0, 91, 171, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <span
            style={{
              fontSize: '0.92rem',
              fontWeight: 800,
              color: '#005BAB',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <PhoneCall size={18} />
            <span>Ada keperluan mendesak? Hubungi Hamdani:</span>
          </span>

          {/* WhatsApp Action Button */}
          <a
            href="https://wa.me/6289652109244"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              backgroundColor: '#005BAB',
              color: '#FFFFFF',
              padding: '0.85rem 1.75rem',
              borderRadius: '999px',
              border: '2.5px solid #005BAB',
              fontWeight: 800,
              fontSize: '1.02rem',
              textDecoration: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(0, 91, 171, 0.25)',
              transition: 'transform 0.2s ease, boxShadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 91, 171, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 91, 171, 0.25)';
            }}
          >
            <img
              src="/walogo.png"
              alt="WhatsApp"
              style={{
                width: '26px',
                height: '26px',
                objectFit: 'contain'
              }}
            />
            <span>Chat WhatsApp Hamdani</span>
          </a>
        </div>
      </div>
    </div>
  );
}
