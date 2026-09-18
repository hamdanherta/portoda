import React, { useState, useEffect } from 'react';
import { WATERMARK_BASE64 } from '../utils/watermarkDataUri';

// In-memory cache for watermarked data URLs to prevent re-processing canvas
const watermarkCache = new Map();

export default function WatermarkedImage({
  src,
  alt = '',
  className = '',
  style = {},
  objectFit = 'contain',
  objectPosition = 'center center',
  watermarkSrc = WATERMARK_BASE64,
  children,
  onClick,
  ...props
}) {
  const [watermarkedSrc, setWatermarkedSrc] = useState(() => watermarkCache.get(src) || null);

  useEffect(() => {
    if (!src) return;

    if (watermarkCache.has(src)) {
      setWatermarkedSrc(watermarkCache.get(src));
      return;
    }

    let isMounted = true;

    const generateWatermark = () => {
      const mainImg = new Image();
      
      // Only set crossOrigin if src is an external URL to prevent CORS canvas taint on same-origin storage files
      const isExternal = src.startsWith('http://') || src.startsWith('https://');
      if (isExternal && !src.includes(window.location.hostname)) {
        mainImg.crossOrigin = 'anonymous';
      }

      mainImg.src = src;

      mainImg.onload = () => {
        const width = mainImg.naturalWidth || 1920;
        const height = mainImg.naturalHeight || 1080;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // 1. Draw original clean image onto canvas
        ctx.drawImage(mainImg, 0, 0, width, height);

        // 2. Load and overlay watermark image (Base64 data URI) across full 100% frame
        const wmImg = new Image();
        wmImg.src = watermarkSrc || WATERMARK_BASE64;

        wmImg.onload = () => {
          // Stretch and fit watermark to full width & height of the image frame
          ctx.drawImage(wmImg, 0, 0, width, height);
          try {
            const dataUrl = canvas.toDataURL('image/png');
            watermarkCache.set(src, dataUrl);
            if (isMounted) {
              setWatermarkedSrc(dataUrl);
            }
          } catch (err) {
            console.warn('Watermark canvas export warning:', err);
            if (isMounted) setWatermarkedSrc(src);
          }
        };

        wmImg.onerror = (err) => {
          console.warn('Watermark image failed to load:', err);
          if (isMounted) setWatermarkedSrc(src);
        };
      };

      mainImg.onerror = (err) => {
        console.warn('Main image failed to load for watermark canvas:', err);
        if (isMounted) setWatermarkedSrc(src);
      };
    };

    generateWatermark();

    return () => {
      isMounted = false;
    };
  }, [src, watermarkSrc]);

  return (
    <div
      className={`watermarked-img-wrapper ${className}`}
      onClick={onClick}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        lineHeight: 0,
        ...style
      }}
    >
      {/* 1. VISIBLE CLEAN IMAGE (What the user sees on screen - 100% Clean) */}
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: objectFit,
          objectPosition: objectPosition,
          display: 'block',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          pointerEvents: 'none'
        }}
        {...props}
      />

      {/* 2. INVISIBLE WATERMARKED OVERLAY (What the browser saves when user right-clicks, saves image, copies, or long-presses) */}
      {watermarkedSrc && (
        <img
          src={watermarkedSrc}
          alt={alt}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: objectFit,
            objectPosition: objectPosition,
            opacity: 0.001,
            zIndex: 10,
            cursor: onClick ? 'pointer' : 'default',
            WebkitTouchCallout: 'default'
          }}
          title={alt}
        />
      )}

      {children}
    </div>
  );
}
