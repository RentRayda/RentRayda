'use client';

import { useState, useEffect, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Metrics {
  totalUsers: number;
  totalLandlords: number;
  totalTenants: number;
  verifiedLandlords: number;
  verifiedTenants: number;
  pendingVerifications: number;
  activeListings: number;
  draftListings: number;
  totalConnections: number;
  connectionsThisWeek: number;
  pendingReports: number;
}

function MetricCard({ value, label, color }: { value: number; label: string; color?: string }) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #F3F4F6',
    }}>
      <p style={{ fontSize: 36, fontWeight: 700, color: color || '#1A1A2E', margin: '0 0 4px' }}>
        {value.toLocaleString()}
      </p>
      <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>{label}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/metrics`, { credentials: 'include' });
      if (res.status === 401) { setError('Not authenticated.'); return; }
      if (res.status === 403) { setError('Admin access required.'); return; }
      if (!res.ok) throw new Error('Failed');
      const { data } = await res.json();
      setMetrics(data);
    } catch { setError('Failed to load metrics.'); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchMetrics(); }, [fetchMetrics]);

  if (loading) return <p style={{ color: '#6B7280' }}>Loading metrics...</p>;
  if (error) return <p style={{ color: '#DC2626' }}>{error}</p>;
  if (!metrics) return null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#1A1A2E', margin: 0 }}>Dashboard</h1>
        <button
          onClick={fetchMetrics}
          style={{
            padding: '8px 16px', fontSize: 14, fontWeight: 500,
            backgroundColor: '#2B51E3', color: '#FFFFFF', border: 'none',
            borderRadius: 8, cursor: 'pointer',
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Users */}
      <h2 style={{ fontSize: 14, fontWeight: 500, color: '#6B7280', letterSpacing: 1, marginBottom: 12 }}>USERS</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <MetricCard value={metrics.totalUsers} label="Total Users" />
        <MetricCard value={metrics.totalLandlords} label="Landlords" />
        <MetricCard value={metrics.totalTenants} label="Tenants" />
        <MetricCard value={metrics.verifiedLandlords} label="Verified Landlords" color="#16A34A" />
        <MetricCard value={metrics.verifiedTenants} label="Verified Tenants" color="#16A34A" />
        <MetricCard value={metrics.pendingVerifications} label="Pending Verifications" color="#D97706" />
      </div>

      {/* Listings */}
      <h2 style={{ fontSize: 14, fontWeight: 500, color: '#6B7280', letterSpacing: 1, marginBottom: 12 }}>LISTINGS</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <MetricCard value={metrics.activeListings} label="Active Listings" color="#16A34A" />
        <MetricCard value={metrics.draftListings} label="Draft Listings" color="#6B7280" />
      </div>

      {/* Connections */}
      <h2 style={{ fontSize: 14, fontWeight: 500, color: '#6B7280', letterSpacing: 1, marginBottom: 12 }}>CONNECTIONS</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <MetricCard value={metrics.totalConnections} label="Total Connections" color="#2B51E3" />
        <MetricCard value={metrics.connectionsThisWeek} label="This Week" color="#2B51E3" />
      </div>

      {/* Reports */}
      <h2 style={{ fontSize: 14, fontWeight: 500, color: '#6B7280', letterSpacing: 1, marginBottom: 12 }}>REPORTS</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <MetricCard value={metrics.pendingReports} label="Pending Reports" color={metrics.pendingReports > 0 ? '#DC2626' : '#6B7280'} />
      </div>

      {/* Quick Links */}
      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <a href="/admin/verifications" style={{
          padding: '10px 20px', fontSize: 14, fontWeight: 500,
          backgroundColor: '#EBF0FC', color: '#2B51E3', borderRadius: 8,
          textDecoration: 'none',
        }}>
          → Verification Queue ({metrics.pendingVerifications})
        </a>
        <a href="/admin/reports" style={{
          padding: '10px 20px', fontSize: 14, fontWeight: 500,
          backgroundColor: metrics.pendingReports > 0 ? '#FEE2E2' : '#F3F4F6',
          color: metrics.pendingReports > 0 ? '#DC2626' : '#6B7280', borderRadius: 8,
          textDecoration: 'none',
        }}>
          → Report Queue ({metrics.pendingReports})
        </a>
      </div>
    </div>
  );
}
