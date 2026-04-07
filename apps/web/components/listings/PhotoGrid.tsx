'use client';

interface PhotoGridProps {
  photos: string[];
  alt: string;
}

export default function PhotoGrid({ photos, alt }: PhotoGridProps) {
  if (photos.length === 0) return null;

  const containerStyle: React.CSSProperties = {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F0F2F5',
  };

  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  };

  // 1 photo: full width
  if (photos.length === 1) {
    return (
      <div style={{ ...containerStyle, height: 300 }}>
        <img src={photos[0]} alt={alt} style={imgStyle} />
      </div>
    );
  }

  // 2 photos: side by side
  if (photos.length === 2) {
    return (
      <div style={{ ...containerStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, height: 260 }}>
        <img src={photos[0]} alt={alt} style={imgStyle} />
        <img src={photos[1]} alt={alt} style={imgStyle} />
      </div>
    );
  }

  // 3 photos: 1 large left, 2 stacked right
  if (photos.length === 3) {
    return (
      <div style={{ ...containerStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 3, height: 300 }}>
        <img src={photos[0]} alt={alt} style={{ ...imgStyle, gridRow: '1 / 3' }} />
        <img src={photos[1]} alt={alt} style={imgStyle} />
        <img src={photos[2]} alt={alt} style={imgStyle} />
      </div>
    );
  }

  // 4+ photos: 2x2 grid, last cell has "+N" overlay if > 4
  const remaining = photos.length - 4;
  return (
    <div style={{ ...containerStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 3, height: 300 }}>
      <img src={photos[0]} alt={alt} style={imgStyle} />
      <img src={photos[1]} alt={alt} style={imgStyle} />
      <img src={photos[2]} alt={alt} style={imgStyle} />
      <div style={{ position: 'relative' }}>
        <img src={photos[3]} alt={alt} style={imgStyle} />
        {remaining > 0 && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#FFFFFF',
            fontFamily: 'NotoSansOsage, sans-serif',
            fontSize: 24, fontWeight: 700,
          }}>
            +{remaining}
          </div>
        )}
      </div>
    </div>
  );
}
