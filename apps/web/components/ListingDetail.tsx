'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Bed, Calendar, Wifi, Wind, Droplets, Zap, Shield, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Wordmark from './Wordmark';

/* ── Types ── */
interface ListingData {
  id: string;
  monthlyRent: number;
  unitType: string;
  barangay: string;
  city: string;
  beds?: number;
  advanceDeposit?: number;
  description: string | null;
  inclusions?: string[];
  images: string[];
  landlordName: string;
  landlordInitials: string;
  isVerified: boolean;
  lastActiveAt: string | null;
}

/* ── Helpers ── */
function formatPeso(n: number) { return '₱' + n.toLocaleString('en-PH'); }

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'Recently';
  const hours = Math.floor((Date.now() - new Date(dateStr).getTime()) / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function getInclusionIcon(name: string) {
  switch (name.toLowerCase()) {
    case 'wifi': return <Wifi className="w-4 h-4" />;
    case 'ac': case 'aircon': return <Wind className="w-4 h-4" />;
    case 'water': return <Droplets className="w-4 h-4" />;
    case 'electricity': return <Zap className="w-4 h-4" />;
    default: return null;
  }
}

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: EASE },
});

/* ── Component ── */
export default function ListingDetail({ listing }: { listing: ListingData }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const images = listing.images.length > 0 ? listing.images : ['/placeholder.svg?height=600&width=800'];
  const next = () => setCurrentImage((p) => (p + 1) % images.length);
  const prev = () => setCurrentImage((p) => (p - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-border">
        <div className="max-w-[var(--max-width)] mx-auto px-[var(--space-gutter)]">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button
              onClick={() => window.history.back()}
              className="w-10 h-10 rounded-full hover:bg-background flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-text-primary" />
            </button>
            <Wordmark />
            <div className="w-10" />
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-[var(--max-width)] mx-auto px-[var(--space-gutter)] py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8 md:space-y-10">

            {/* Photo Gallery */}
            <motion.section {...fadeInUp()}>
              <div className="space-y-4">
                {/* Hero Image */}
                <div
                  className="relative aspect-[4/3] md:aspect-[16/9] w-full rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => setGalleryOpen(true)}
                >
                  <img
                    src={images[currentImage]}
                    alt={`${listing.unitType} in ${listing.barangay}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); prev(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/90 hover:bg-surface shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); next(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/90 hover:bg-surface shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {images.slice(0, 4).map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImage(i)}
                        className={`relative aspect-square rounded-xl overflow-hidden transition-all ${
                          currentImage === i
                            ? 'ring-2 ring-brand ring-offset-2'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.section>

            {/* Price & Type */}
            <motion.section {...fadeInUp(0.1)}>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <h2 className="font-display font-bold text-4xl md:text-5xl text-text-primary mb-2">
                    {formatPeso(listing.monthlyRent)}
                    <span className="text-2xl text-text-secondary font-normal">/mo</span>
                  </h2>
                  <p className="font-heading text-lg text-text-secondary">
                    {listing.unitType} in {listing.barangay}, {listing.city}
                  </p>
                </div>
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-brand-light text-brand-dark w-fit">
                  {listing.unitType}
                </span>
              </div>
            </motion.section>

            {/* Verified Landlord */}
            <motion.section {...fadeInUp(0.2)}>
              <div className="bg-surface border border-border rounded-2xl p-6">
                <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-[0.15em] mb-5">
                  Landlord Information
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white font-semibold text-lg">
                    {listing.landlordInitials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-text-primary text-lg">{listing.landlordName}</h4>
                      {listing.isVerified && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-verified-light text-verified border border-verified-border">
                          <Shield className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary">Active {timeAgo(listing.lastActiveAt)}</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Details Grid */}
            <motion.section {...fadeInUp(0.3)}>
              <div className="bg-surface border border-border rounded-2xl p-6">
                <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-[0.15em] mb-6">
                  Property Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {listing.beds !== undefined && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center shrink-0">
                        <Bed className="w-5 h-5 text-brand" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-text-primary">{listing.beds}</p>
                        <p className="text-sm text-text-secondary">Bed{listing.beds !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  )}
                  {listing.advanceDeposit !== undefined && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5 text-brand" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-text-primary">{listing.advanceDeposit}</p>
                        <p className="text-sm text-text-secondary">Months Deposit</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-brand" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text-primary">{listing.barangay}</p>
                      <p className="text-sm text-text-secondary">{listing.city}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Inclusions */}
            {listing.inclusions && listing.inclusions.length > 0 && (
              <motion.section {...fadeInUp(0.4)}>
                <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-[0.15em] mb-4">
                  What&apos;s Included
                </h3>
                <div className="flex flex-wrap gap-2">
                  {listing.inclusions.map((inc, i) => (
                    <div key={i} className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-full text-sm font-medium text-text-primary">
                      {getInclusionIcon(inc)}
                      {inc}
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Description */}
            {listing.description && (
              <motion.section {...fadeInUp(0.5)}>
                <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-[0.15em] mb-4">
                  About This Space
                </h3>
                <p className="text-base leading-relaxed text-text-primary">
                  {listing.description}
                </p>
              </motion.section>
            )}
          </div>

          {/* Right Column — Sticky CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Connect CTA */}
              <motion.div {...fadeInUp(0.6)} className="bg-surface border border-border rounded-2xl p-6 md:p-8">
                <h3 className="font-display font-bold text-2xl text-text-primary mb-3">
                  Want to connect?
                </h3>
                <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                  Download the RentRayda app to message verified landlords, schedule viewings, and secure your next rental safely.
                </p>
                <a
                  href="https://play.google.com/store/apps/details?id=ph.rentrayda.app"
                  className="flex items-center justify-center w-full h-12 text-base font-semibold rounded-full bg-brand hover:bg-brand-dark text-white shadow-lg shadow-brand/20 no-underline transition-colors"
                >
                  Download RentRayda
                </a>
              </motion.div>

              {/* Trust Box */}
              <motion.div {...fadeInUp(0.7)} className="bg-brand-light/50 border border-brand/20 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-text-primary text-sm mb-1.5">Protected by RentRayda</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      All landlords are verified. Never send money before viewing the property. Report suspicious activity immediately.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Fullscreen Gallery */}
      {galleryOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
          <button
            onClick={() => setGalleryOpen(false)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-5xl mx-auto px-4">
            <img
              src={images[currentImage]}
              alt="Full size property"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            {images.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {currentImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
