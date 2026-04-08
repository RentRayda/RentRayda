'use client';

/**
 * SVG wave dividers between sections. Pure CSS — zero JS, zero GPU cost.
 * Use flip={true} for bottom-of-section placement.
 */
export function WaveDivider({
  topColor = '#2D79BF',
  bottomColor = '#FFFFFF',
  flip = false,
}: {
  topColor?: string;
  bottomColor?: string;
  flip?: boolean;
}) {
  return (
    <div style={{
      width: '100%',
      lineHeight: 0,
      overflow: 'hidden',
      transform: flip ? 'rotate(180deg)' : undefined,
    }}>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        style={{ width: '100%', height: 'clamp(40px, 5vw, 80px)', display: 'block' }}
      >
        <path
          d="M0,0 L0,40 Q360,80 720,40 Q1080,0 1440,40 L1440,0 Z"
          fill={topColor}
        />
        <rect y="40" width="1440" height="40" fill={bottomColor} />
      </svg>
    </div>
  );
}

export function AngleDivider({
  topColor = '#050505',
  bottomColor = '#FFFFFF',
}: {
  topColor?: string;
  bottomColor?: string;
}) {
  return (
    <div style={{ width: '100%', lineHeight: 0, overflow: 'hidden' }}>
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        style={{ width: '100%', height: 'clamp(30px, 4vw, 60px)', display: 'block' }}
      >
        <polygon points="0,0 1440,60 1440,0" fill={topColor} />
        <polygon points="0,0 0,60 1440,60" fill={bottomColor} />
      </svg>
    </div>
  );
}
