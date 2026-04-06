'use client';

import { useState, useCallback } from 'react';

interface PhotoCarouselProps {
  photos: string[];
}

export default function PhotoCarousel({ photos }: PhotoCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  const goTo = useCallback((index: number) => {
    if (index === current) return;
    setFade(false);
    setTimeout(() => {
      setCurrent(index);
      setFade(true);
    }, 150);
  }, [current]);

  const prev = useCallback(() => {
    const next = current === 0 ? photos.length - 1 : current - 1;
    goTo(next);
  }, [current, photos.length, goTo]);

  const next = useCallback(() => {
    const nextIdx = current === photos.length - 1 ? 0 : current + 1;
    goTo(nextIdx);
  }, [current, photos.length, goTo]);

  if (!photos || photos.length === 0) {
    return (
      <div style={{
        width: '100%', height: 400, backgroundColor: '#CED0D4', borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
      }}>
        <span style={{ fontSize: 64, color: '#8A8D91' }}>🏠</span>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Main photo container */}
      <div style={{ position: 'relative', width: '100%', height: 400, borderRadius: 12, overflow: 'hidden', backgroundColor: '#E5E7EB' }}>
        <img
          src={photos[current]}
          alt={`Photo ${current + 1} of ${photos.length}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: fade ? 1 : 0,
            transition: 'opacity 200ms ease-in-out',
          }}
        />

        {/* Left arrow */}
        {photos.length > 1 && (
          <button
            onClick={prev}
            aria-label="Previous photo"
            style={{
              position: 'absolute', top: '50%', left: 12, transform: 'translateY(-50%)',
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFFFFF', fontSize: 18,
              transition: 'background-color 150ms',
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.7)'; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.5)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* Right arrow */}
        {photos.length > 1 && (
          <button
            onClick={next}
            aria-label="Next photo"
            style={{
              position: 'absolute', top: '50%', right: 12, transform: 'translateY(-50%)',
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFFFFF', fontSize: 18,
              transition: 'background-color 150ms',
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.7)'; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.5)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* Photo counter badge */}
        {photos.length > 1 && (
          <div style={{
            position: 'absolute', bottom: 12, right: 12,
            backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 8,
            padding: '4px 10px',
            fontFamily: 'AlteHaasGrotesk, sans-serif',
            fontSize: 13, color: '#FFFFFF', fontWeight: 500,
          }}>
            {current + 1}/{photos.length}
          </div>
        )}
      </div>

      {/* Thumbnail dots */}
      {photos.length > 1 && (
        <div style={{
          display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center',
          overflowX: 'auto', WebkitOverflowScrolling: 'touch',
          paddingBottom: 4,
        }}>
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to photo ${i + 1}`}
              style={{
                width: 48, height: 48, minWidth: 48, borderRadius: 8,
                border: i === current ? '2px solid #2563EB' : '2px solid transparent',
                padding: 0, cursor: 'pointer', overflow: 'hidden',
                opacity: i === current ? 1 : 0.6,
                transition: 'opacity 150ms, border-color 150ms',
                backgroundColor: '#E5E7EB',
              }}
            >
              <img
                src={photo}
                alt={`Thumbnail ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
