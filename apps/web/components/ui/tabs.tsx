'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Tab {
  value: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function Tabs({ tabs, value, onChange, className }: TabsProps) {
  const [tabRects, setTabRects] = React.useState<Record<string, DOMRect>>({});
  const tabsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!tabsRef.current) return;
    const rects: Record<string, DOMRect> = {};
    tabsRef.current.querySelectorAll('[data-tab-value]').forEach((el) => {
      const val = el.getAttribute('data-tab-value')!;
      rects[val] = el.getBoundingClientRect();
    });
    setTabRects(rects);
  }, [tabs]);

  return (
    <div ref={tabsRef} className={cn('relative flex gap-1 border-b border-divider', className)} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          data-tab-value={tab.value}
          aria-selected={value === tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'relative px-4 py-3 text-sm font-medium transition-colors duration-200',
            /* BRAND: 14px label / 500 weight */
            value === tab.value
              ? 'text-brand'
              : 'text-text-tertiary hover:text-text-primary'
          )}
        >
          <span className="flex items-center gap-2">
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                'inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold min-w-[20px]',
                'transition-colors duration-200',
                value === tab.value
                  ? 'bg-brand text-white'
                  : 'bg-background text-text-tertiary'
              )}>
                {tab.count}
              </span>
            )}
          </span>

          {/* Animated underline */}
          {value === tab.value && (
            <motion.span
              layoutId="tab-underline"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand rounded-t-full"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

export { Tabs };
export type { Tab, TabsProps };
