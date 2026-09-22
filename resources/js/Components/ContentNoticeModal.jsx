import React from 'react';
import { Bell, RefreshCw, X, Sparkles } from 'lucide-react';

export default function ContentNoticeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 40, 80, 0.70)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 99990,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'fadeIn 0.3s ease-out forwards'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#FFF3DD',
          border: '3px solid #005BAB',
          borderRadius: '28px',
          padding: '2.25rem 2rem 2rem 2rem',
          textAlign: 'center',
          boxShadow: '0 25px 60px rgba(0, 91, 171, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button X */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 91, 171, 0.1)',
            border: '1.5px solid #005BAB',
            color: '#005BAB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#005BAB';
            e.currentTarget.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 91, 171, 0.1)';
            e.currentTarget.style.color = '#005BAB';
          }}
          title="Tutup Pemberitahuan"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* Top Decorative Icon Container */}
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            backgroundColor: '#005BAB',
            color: '#FFF3DD',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.15rem',
            border: '3px solid #005BAB',
            boxShadow: '0 6px 16px rgba(0, 91, 171, 0.25)',
            position: 'relative'
          }}
        >
          <Bell size={32} strokeWidth={2.5} />
          <div
            style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              backgroundColor: '#FFF3DD',
              borderRadius: '50%',
              padding: '2px'
            }}
          >
            <Sparkles size={16} color="#005BAB" strokeWidth={3} />
          </div>
        </div>

        {/* Status Badge */}
        <div
          style={{
            backgroundColor: '#005BAB',
            color: '#FFF3DD',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            padding: '0.35rem 1rem',
            borderRadius: '999px',
            textTransform: 'uppercase',
            marginBottom: '1.1rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <RefreshCw size={12} strokeWidth={3} className="spin-slow" />
          <span>Informasi Update Konten</span>
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            color: '#005BAB',
            marginBottom: '0.85rem',
            lineHeight: 1.25,
            letterSpacing: '-0.02em'
          }}
        >
          Tahap Pengisian Konten
        </h2>

        {/* Subtitle / Main Message */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            border: '1.5px solid rgba(0, 91, 171, 0.2)',
            borderRadius: '16px',
            padding: '1.15rem 1.25rem',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 12px rgba(0, 91, 171, 0.05)'
          }}
        >
          <p
            style={{
              fontSize: '0.96rem',
              fontWeight: 700,
              color: '#005BAB',
              lineHeight: 1.6,
              margin: 0
            }}
          >
            Website ini sedang dalam tahap pengisian konten oleh <strong>Hamdani</strong>, harap selalu melakukan refresh untuk melihat konten baru.
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            backgroundColor: '#005BAB',
            color: '#FFFFFF',
            padding: '0.85rem 1.5rem',
            borderRadius: '999px',
            border: '2.5px solid #005BAB',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(0, 91, 171, 0.25)',
            transition: 'transform 0.2s ease, boxShadow 0.2s ease',
            outline: 'none'
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
          <span>Siap, Mengerti!</span>
        </button>
      </div>
    </div>
  );
}
