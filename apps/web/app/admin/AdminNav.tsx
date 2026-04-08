'use client';

import { usePathname } from 'next/navigation';
import Wordmark from '../../components/Wordmark';

const NAV_LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/verifications', label: 'Verifications' },
  { href: '/admin/reports', label: 'Reports' },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="bg-surface border-b border-border px-5 py-3">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/admin/dashboard" className="no-underline">
            <Wordmark />
          </a>
          <span className="text-sm text-text-tertiary">Admin</span>
        </div>
        <nav className="flex gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm rounded-lg no-underline transition-colors ${
                  isActive
                    ? 'bg-brand-light text-brand-dark font-medium'
                    : 'text-text-secondary hover:bg-background hover:text-text-primary'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
