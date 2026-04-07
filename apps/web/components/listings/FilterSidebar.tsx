'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { METRO_MANILA, METRO_MANILA_CITIES } from '../../lib/metro-manila';

const UNIT_TYPES = [
  { value: '', label: 'All types' },
  { value: 'bedspace', label: 'Bedspace' },
  { value: 'room', label: 'Room' },
  { value: 'apartment', label: 'Apartment' },
];

const MIN_RENT = 500;
const MAX_RENT = 20000;
const STEP = 500;

interface FilterSidebarProps {
  currentFilters: {
    city?: string;
    barangay?: string;
    minRent?: string;
    maxRent?: string;
    type?: string;
    view?: string;
  };
}

function RangeSlider({
  min,
  max,
  minVal,
  maxVal,
  step,
  onMinChange,
  onMaxChange,
}: {
  min: number;
  max: number;
  minVal: number;
  maxVal: number;
  step: number;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const minPercent = ((minVal - min) / (max - min)) * 100;
  const maxPercent = ((maxVal - min) / (max - min)) * 100;

  return (
    <div style={{ position: 'relative', height: 40, marginTop: 8 }}>
      {/* Track background */}
      <div
        ref={trackRef}
        style={{
          position: 'absolute',
          top: 16,
          left: 0,
          right: 0,
          height: 4,
          borderRadius: 2,
          backgroundColor: '#E4E6EB',
        }}
      />
      {/* Active track */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: `${minPercent}%`,
          width: `${maxPercent - minPercent}%`,
          height: 4,
          borderRadius: 2,
          backgroundColor: '#2B51E3',
        }}
      />
      {/* Min thumb */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minVal}
        onChange={(e) => {
          const v = Math.min(Number(e.target.value), maxVal - step);
          onMinChange(v);
        }}
        style={{
          position: 'absolute',
          top: 6,
          left: 0,
          width: '100%',
          appearance: 'none',
          WebkitAppearance: 'none',
          background: 'transparent',
          pointerEvents: 'none',
          zIndex: 3,
          height: 20,
          margin: 0,
        }}
        className="range-thumb"
      />
      {/* Max thumb */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxVal}
        onChange={(e) => {
          const v = Math.max(Number(e.target.value), minVal + step);
          onMaxChange(v);
        }}
        style={{
          position: 'absolute',
          top: 6,
          left: 0,
          width: '100%',
          appearance: 'none',
          WebkitAppearance: 'none',
          background: 'transparent',
          pointerEvents: 'none',
          zIndex: 4,
          height: 20,
          margin: 0,
        }}
        className="range-thumb"
      />
      {/* Inline styles for range thumbs */}
      <style>{`
        .range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2B51E3;
          border: 3px solid #FFFFFF;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
          cursor: pointer;
          pointer-events: all;
        }
        .range-thumb::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #2B51E3;
          border: 3px solid #FFFFFF;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
          cursor: pointer;
          pointer-events: all;
        }
      `}</style>
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  height: 40,
  padding: '0 12px',
  borderRadius: 8,
  border: '1px solid #CED0D4',
  fontSize: 14,
  backgroundColor: '#FFFFFF',
  fontFamily: 'NotoSansOsage, sans-serif',
  color: '#050505',
  cursor: 'pointer',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 36,
  padding: '0 10px',
  borderRadius: 6,
  border: '1px solid #CED0D4',
  fontSize: 13,
  fontFamily: 'NotoSansOsage, sans-serif',
  color: '#050505',
  textAlign: 'center',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'NotoSansOsage, sans-serif',
  fontSize: 12,
  fontWeight: 600,
  color: '#65676B',
  textTransform: 'uppercase' as const,
  letterSpacing: 0.5,
  marginBottom: 8,
  display: 'block',
};

export default function FilterSidebar({ currentFilters }: FilterSidebarProps) {
  const router = useRouter();
  const [city, setCity] = useState(currentFilters.city || '');
  const [barangay, setBarangay] = useState(currentFilters.barangay || '');
  const [unitType, setUnitType] = useState(currentFilters.type || '');
  const [minRent, setMinRent] = useState(currentFilters.minRent ? parseInt(currentFilters.minRent) : MIN_RENT);
  const [maxRent, setMaxRent] = useState(currentFilters.maxRent ? parseInt(currentFilters.maxRent) : MAX_RENT);

  const availableBarangays = city ? METRO_MANILA[city] || [] : [];

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    setBarangay(''); // Reset barangay when city changes
  };

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (barangay) params.set('barangay', barangay);
    if (unitType) params.set('type', unitType);
    if (minRent > MIN_RENT) params.set('minRent', String(minRent));
    if (maxRent < MAX_RENT) params.set('maxRent', String(maxRent));
    if (currentFilters.view) params.set('view', currentFilters.view);
    router.push(`/listings?${params.toString()}`);
  }, [city, barangay, unitType, minRent, maxRent, currentFilters.view, router]);

  const clearFilters = useCallback(() => {
    setCity('');
    setBarangay('');
    setUnitType('');
    setMinRent(MIN_RENT);
    setMaxRent(MAX_RENT);
    const params = new URLSearchParams();
    if (currentFilters.view) params.set('view', currentFilters.view);
    router.push(`/listings?${params.toString()}`);
  }, [currentFilters.view, router]);

  const hasFilters = city || barangay || unitType || minRent > MIN_RENT || maxRent < MAX_RENT;

  return (
    <div style={{
      width: 320,
      flexShrink: 0,
      position: 'sticky',
      top: 72,
      alignSelf: 'flex-start',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      paddingTop: 66,
    }}>
      {/* About card (like FB Groups "About" section) */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        border: '1px solid #E4E6EB',
        padding: 20,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        <h2 style={{
          fontFamily: 'Ralgine, serif',
          fontSize: 20,
          color: '#050505',
          margin: '0 0 12px',
        }}>
          Verified Listings
        </h2>
        <p style={{
          fontFamily: 'NotoSansOsage, sans-serif',
          fontSize: 14,
          color: '#65676B',
          lineHeight: 1.5,
          margin: '0 0 16px',
        }}>
          All landlords are verified before their listings appear. Only active listings shown.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <span style={{ fontFamily: 'NotoSansOsage, sans-serif', fontSize: 13, color: '#050505' }}>
              Both sides verified
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2B51E3" strokeWidth="2" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span style={{ fontFamily: 'NotoSansOsage, sans-serif', fontSize: 13, color: '#050505' }}>
              Pasig City
            </span>
          </div>
        </div>
      </div>

      {/* Filters card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        border: '1px solid #E4E6EB',
        padding: 20,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        <div style={{
          fontFamily: 'NotoSansOsage, sans-serif',
          fontSize: 16,
          fontWeight: 600,
          color: '#050505',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span>Filters</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#65676B" strokeWidth="2" strokeLinecap="round">
            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
          </svg>
        </div>

        {/* City */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>City</label>
          <select
            value={city}
            onChange={(e) => handleCityChange(e.target.value)}
            style={selectStyle}
          >
            <option value="">All cities</option>
            {METRO_MANILA_CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Barangay (dependent on city) */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Barangay</label>
          <select
            value={barangay}
            onChange={(e) => setBarangay(e.target.value)}
            disabled={!city}
            style={{
              ...selectStyle,
              opacity: city ? 1 : 0.5,
              cursor: city ? 'pointer' : 'not-allowed',
            }}
          >
            <option value="">{city ? 'All barangays' : 'Select a city first'}</option>
            {availableBarangays.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Unit Type */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Unit Type</label>
          <select
            value={unitType}
            onChange={(e) => setUnitType(e.target.value)}
            style={selectStyle}
          >
            {UNIT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Rent Range */}
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Monthly Rent</label>
          <RangeSlider
            min={MIN_RENT}
            max={MAX_RENT}
            minVal={minRent}
            maxVal={maxRent}
            step={STEP}
            onMinChange={setMinRent}
            onMaxChange={setMaxRent}
          />
          {/* Number inputs */}
          <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <input
                type="number"
                value={minRent}
                min={MIN_RENT}
                max={maxRent - STEP}
                step={STEP}
                onChange={(e) => {
                  const v = Math.min(Number(e.target.value), maxRent - STEP);
                  setMinRent(Math.max(v, MIN_RENT));
                }}
                style={inputStyle}
              />
            </div>
            <span style={{ fontFamily: 'NotoSansOsage, sans-serif', fontSize: 12, color: '#8A8D91' }}>to</span>
            <div style={{ flex: 1 }}>
              <input
                type="number"
                value={maxRent}
                min={minRent + STEP}
                max={MAX_RENT}
                step={STEP}
                onChange={(e) => {
                  const v = Math.max(Number(e.target.value), minRent + STEP);
                  setMaxRent(Math.min(v, MAX_RENT));
                }}
                style={inputStyle}
              />
            </div>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 6,
            fontFamily: 'NotoSansOsage, sans-serif',
            fontSize: 11,
            color: '#8A8D91',
          }}>
            <span>PHP {minRent.toLocaleString()}</span>
            <span>PHP {maxRent.toLocaleString()}</span>
          </div>
        </div>

        {/* Apply button */}
        <button
          onClick={applyFilters}
          style={{
            width: '100%',
            height: 42,
            borderRadius: 8,
            backgroundColor: '#2B51E3',
            color: '#FFFFFF',
            border: 'none',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'NotoSansOsage, sans-serif',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1D4ED8')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2B51E3')}
        >
          Apply Filters
        </button>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            style={{
              width: '100%',
              height: 36,
              marginTop: 8,
              borderRadius: 8,
              backgroundColor: 'transparent',
              color: '#65676B',
              border: 'none',
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'NotoSansOsage, sans-serif',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#E41E3F')}
            onMouseLeave={e => (e.currentTarget.style.color = '#65676B')}
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}
