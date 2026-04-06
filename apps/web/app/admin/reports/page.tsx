'use client';

import { useState, useEffect, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Report {
  id: string;
  reportType: string;
  description: string | null;
  status: string;
  reportedUserId: string | null;
  reportedListingId: string | null;
  createdAt: string;
  reporter: { id: string; phone: string; role: string };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#FEF3C7', text: '#92400E' },
  reviewed: { bg: '#D1FAE5', text: '#059669' },
  resolved: { bg: '#DBEAFE', text: '#1D4ED8' },
};

const TYPE_LABELS: Record<string, string> = {
  fake_listing: 'Fake listing',
  scam_attempt: 'Scam attempt',
  identity_fraud: 'Identity fraud',
  other: 'Other',
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ reportId: string; action: string } | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/reports`, { credentials: 'include' });
      if (res.status === 401) { setError('Not authenticated.'); return; }
      if (res.status === 403) { setError('Admin access required.'); return; }
      if (!res.ok) throw new Error('Failed');
      const { data } = await res.json();
      setReports(data);
    } catch { setError('Failed to load reports.'); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const handleAction = async (reportId: string, action: string) => {
    setProcessing(reportId);
    try {
      const res = await fetch(`${API_URL}/api/admin/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error('Failed');
      await fetchReports();
    } catch { alert('Action failed.'); } finally {
      setProcessing(null);
      setConfirmAction(null);
    }
  };

  if (loading) return <p style={{ color: '#65676B' }}>Loading reports...</p>;
  if (error) return <p style={{ color: '#E41E3F' }}>{error}</p>;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 600, color: '#050505', marginBottom: 24 }}>
        Report Queue
        <span style={{ fontSize: 14, fontWeight: 400, color: '#65676B', marginLeft: 8 }}>
          ({reports.filter((r) => r.status === 'pending').length} pending)
        </span>
      </h1>

      {reports.length === 0 ? (
        <p style={{ color: '#65676B', textAlign: 'center', padding: 48 }}>
          No pending reports. That's a good sign!
        </p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#FFFFFF', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #CED0D4', textAlign: 'left' }}>
              <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 500, color: '#65676B', width: 160 }}>Reporter</th>
              <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 500, color: '#65676B', width: 120 }}>Type</th>
              <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 500, color: '#65676B', width: 250 }}>Description</th>
              <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 500, color: '#65676B', width: 120 }}>Submitted</th>
              <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 500, color: '#65676B', width: 100 }}>Status</th>
              <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 500, color: '#65676B', width: 250 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => {
              const statusColor = STATUS_COLORS[report.status] || STATUS_COLORS.pending;
              return (
                <tr key={report.id} style={{ borderBottom: '1px solid #E4E6EB' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: 14, color: '#050505' }}>{report.reporter.phone}</div>
                    <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 9999, backgroundColor: '#E4E6EB', color: '#65676B' }}>
                      {report.reporter.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 13, fontWeight: 500, padding: '2px 8px', borderRadius: 9999, backgroundColor: '#FEE2E2', color: '#E41E3F' }}>
                      {TYPE_LABELS[report.reportType] || report.reportType}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14, color: '#374151', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {report.description || '—'}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14, color: '#65676B' }}>{timeAgo(report.createdAt)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 12, fontWeight: 500, padding: '2px 8px', borderRadius: 9999, backgroundColor: statusColor.bg, color: statusColor.text }}>
                      {report.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {report.status === 'pending' && (
                        <button
                          onClick={() => handleAction(report.id, 'review')}
                          disabled={processing === report.id}
                          style={{ padding: '4px 10px', fontSize: 12, fontWeight: 500, backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                        >
                          Mark Reviewed
                        </button>
                      )}
                      {report.reportedUserId && report.status !== 'resolved' && (
                        <button
                          onClick={() => setConfirmAction({ reportId: report.id, action: 'suspend_user' })}
                          disabled={processing === report.id}
                          style={{ padding: '4px 10px', fontSize: 12, fontWeight: 500, backgroundColor: '#E41E3F', color: '#FFFFFF', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                        >
                          Suspend User
                        </button>
                      )}
                      {report.reportedListingId && report.status !== 'resolved' && (
                        <button
                          onClick={() => handleAction(report.id, 'suspend_listing')}
                          disabled={processing === report.id}
                          style={{ padding: '4px 10px', fontSize: 12, fontWeight: 500, backgroundColor: '#F7B928', color: '#FFFFFF', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                        >
                          Suspend Listing
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Suspend User Confirmation Dialog */}
      {confirmAction && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 12, padding: 24, maxWidth: 420, width: '90%' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#050505', marginBottom: 12 }}>Suspend User?</h2>
            <p style={{ fontSize: 14, color: '#65676B', lineHeight: 1.5 }}>
              This will immediately log out the user, hide their listings, and prevent new connections. Continue?
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setConfirmAction(null)}
                style={{ padding: '8px 16px', fontSize: 14, border: '1px solid #CED0D4', borderRadius: 8, backgroundColor: '#FFFFFF', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(confirmAction.reportId, confirmAction.action)}
                disabled={processing === confirmAction.reportId}
                style={{ padding: '8px 16px', fontSize: 14, fontWeight: 500, backgroundColor: '#E41E3F', color: '#FFFFFF', border: 'none', borderRadius: 8, cursor: 'pointer' }}
              >
                Suspend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
