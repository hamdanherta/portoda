import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

export default function MetadataCopyBtn({ text, label = "Data", style = {} }) {
  const [copied, setCopied] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('portoda_admin_authenticated') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const handleAuthChange = () => {
      if (typeof window !== 'undefined') {
        setIsLoggedIn(localStorage.getItem('portoda_admin_authenticated') === 'true');
      }
    };
    window.addEventListener('portoda_auth_changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('portoda_auth_changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  if (!isLoggedIn || !text) return null;

  const handleCopy = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const copyText = String(text);

    const copyFallback = (t) => {
      const textArea = document.createElement("textarea");
      textArea.value = t;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Fallback copy failed', err);
      }
      document.body.removeChild(textArea);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(copyText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        copyFallback(copyText);
      });
    } else {
      copyFallback(copyText);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="desktop-copy-btn"
      title={copied ? "Tersalin ke Clipboard!" : `Salin ${label}`}
      style={{
        marginLeft: '0.45rem',
        padding: '0.2rem 0.5rem',
        fontSize: '0.72rem',
        fontWeight: 700,
        borderRadius: '6px',
        border: '1.5px solid #005BAB',
        background: copied ? '#DCFCE7' : '#FFFFFF',
        color: copied ? '#15803D' : '#005BAB',
        cursor: 'pointer',
        alignItems: 'center',
        gap: '0.3rem',
        transition: 'all 0.15s ease',
        lineHeight: 1.2,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        ...style
      }}
    >
      {copied ? <Check size={13} color="#15803D" /> : <Copy size={13} color="#005BAB" />}
      <span>{copied ? 'Tersalin' : 'Copy'}</span>
    </button>
  );
}
