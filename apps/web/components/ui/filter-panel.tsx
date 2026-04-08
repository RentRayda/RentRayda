'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Select, type SelectOption } from './select';

export interface FilterValues {
  city: string;
  barangay: string;
  unitType: string[];
  minRent: number;
  maxRent: number;
}

interface FilterPanelProps {
  cities: SelectOption[];
  barangays: SelectOption[];
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onApply: () => void;
  onClear: () => void;
  className?: string;
}

const UNIT_TYPES = [
  { value: 'bedspace', label: 'Bedspace' },
  { value: 'room', label: 'Room' },
  { value: 'apartment', label: 'Apartment' },
];

const RENT_MIN = 500;
const RENT_MAX = 20000;
const RENT_STEP = 500;

function FilterPanel({ cities, barangays, values, onChange, onApply, onClear, className }: FilterPanelProps) {
  const updateField = <K extends keyof FilterValues>(key: K, val: FilterValues[K]) => {
    onChange({ ...values, [key]: val });
  };

  const toggleUnitType = (type: string) => {
    const current = values.unitType;
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    updateField('unitType', next);
  };

  const formatPeso = (n: number) => '₱' + n.toLocaleString('en-PH');

  return (
    <div className={cn('space-y-5', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-brand text-base text-text-primary">Filters</h3>
        <button
          onClick={onClear}
          className="text-xs text-brand hover:text-brand-dark transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* City */}
      <Select
        label="City"
        options={cities}
        placeholder="All cities"
        value={values.city}
        onChange={(e) => updateField('city', e.target.value)}
      />

      {/* Barangay */}
      <Select
        label="Barangay"
        options={barangays}
        placeholder="All barangays"
        value={values.barangay}
        onChange={(e) => updateField('barangay', e.target.value)}
        disabled={!values.city}
      />

      {/* Unit type checkboxes */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-text-secondary">Unit type</label>
        <div className="flex flex-wrap gap-2">
          {UNIT_TYPES.map((ut) => (
            <button
              key={ut.value}
              onClick={() => toggleUnitType(ut.value)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                values.unitType.includes(ut.value)
                  ? 'border-brand bg-brand-light text-brand-dark'
                  : 'border-border bg-surface text-text-secondary hover:bg-background'
              )}
            >
              {ut.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-text-secondary">
          Monthly rent
        </label>
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span>{formatPeso(values.minRent)}</span>
          <span className="flex-1 text-center text-text-tertiary">—</span>
          <span>{formatPeso(values.maxRent)}</span>
        </div>
        <div className="space-y-1">
          <input
            type="range"
            min={RENT_MIN}
            max={RENT_MAX}
            step={RENT_STEP}
            value={values.minRent}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v < values.maxRent) updateField('minRent', v);
            }}
            className="w-full accent-brand"
          />
          <input
            type="range"
            min={RENT_MIN}
            max={RENT_MAX}
            step={RENT_STEP}
            value={values.maxRent}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v > values.minRent) updateField('maxRent', v);
            }}
            className="w-full accent-brand"
          />
        </div>
      </div>

      {/* Apply */}
      <Button onClick={onApply} className="w-full">
        Apply filters
      </Button>
    </div>
  );
}

export { FilterPanel };
