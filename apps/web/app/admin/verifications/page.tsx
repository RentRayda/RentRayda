'use client';

import { useState, useEffect, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface VerificationDoc {
  id: string;
  userId: string;
  documentType: string;
  idType: string | null;
  status: string;
  createdAt: string;
  idPhotoUrl: string | null;
  selfieUrl: string | null;
  user: {
    id: string;
    phone: string;
    role: string;
  };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function VerificationsPage() {
  const [docs, setDocs] = useState<VerificationDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<VerificationDoc | null>(null);
  const [rejectDoc, setRejectDoc] = useState<VerificationDoc | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchQueue = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/verification-queue`, {
        credentials: 'include',
      });
      if (res.status === 401) {
        setError('Not authenticated. Please log in.');
        return;
      }
      if (res.status === 403) {
        setError('Access denied. Admin role required.');
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch');
      const { data } = await res.json();
      setDocs(data);
    } catch {
      setError('Failed to load verification queue.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchQueue(); }, [fetchQueue]);

  const handleApprove = async (docId: string) => {
    setProcessing(docId);
    try {
      const res = await fetch(`${API_URL}/api/admin/verifications/${docId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'approve' }),
      });
      if (!res.ok) throw new Error('Failed');
      setDocs((prev) => prev.filter((d) => d.id !== docId));
    } catch {
      alert('Failed to approve. Try again.');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!rejectDoc || !rejectReason) return;
    setProcessing(rejectDoc.id);
    try {
      const res = await fetch(`${API_URL}/api/admin/verifications/${rejectDoc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'reject', reason: rejectReason }),
      });
      if (!res.ok) throw new Error('Failed');
      setDocs((prev) => prev.filter((d) => d.id !== rejectDoc.id));
      setRejectDoc(null);
      setRejectReason('');
    } catch {
      alert('Failed to reject. Try again.');
    } finally {
      setProcessing(null);
    }
  };

  const REJECT_SUGGESTIONS = [
    'ID is not clear',
    'Face does not match selfie',
    'Property proof is not sufficient',
    'ID is expired',
  ];

  if (loading) {
    return <p style={{ color: '#65676B' }}>Loading verification queue...</p>;
  }

  if (error) {
    return <p style={{ color: '#E41E3F' }}>{error}</p>;
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 600, color: '#050505', marginBottom: 24 }}>
        Verification Queue
        <span style={{ fontSize: 14, fontWeight: 400, color: '#65676B', marginLeft: 8 }}>
          ({docs.length} pending)
        </span>
      </h1>

      {docs.length === 0 ? (
        <p style={{ color: '#65676B', textAlign: 'center', padding: 48 }}>
          No pending verifications. All caught up!
        </p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#FFFFFF', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #CED0D4', textAlign: 'left' }}>
              <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 500, color: '#65676B', width: 200 }}>User</th>
              <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 500, color: '#65676B', width: 120 }}>Type</th>
              <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 500, color: '#65676B', width: 120 }}>Submitted</th>
              <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 500, color: '#65676B', width: 100 }}>ID Photo</th>
              <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 500, color: '#65676B', width: 100 }}>Selfie</th>
              <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 500, color: '#65676B', width: 100 }}>Status</th>
              <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 500, color: '#65676B', width: 200 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => (
              <tr key={doc.id} style={{ borderBottom: '1px solid #E4E6EB' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#050505' }}>{doc.user.phone}</div>
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: 11,
                      fontWeight: 500,
                      padding: '2px 8px',
                      borderRadius: 9999,
                      backgroundColor: doc.user.role === 'landlord' ? '#DBEAFE' : '#D1FAE5',
                      color: doc.user.role === 'landlord' ? '#1D4ED8' : '#059669',
                      marginTop: 4,
                    }}
                  >
                    {doc.user.role}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 14, color: '#374151' }}>
                  {doc.documentType === 'government_id' ? 'Gov ID' : doc.documentType === 'property_proof' ? 'Property' : 'Employment'}
                  {doc.idType && <div style={{ fontSize: 12, color: '#8A8D91' }}>{doc.idType}</div>}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 14, color: '#65676B' }}>
                  {timeAgo(doc.createdAt)}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {doc.idPhotoUrl ? (
                    <img
                      src={doc.idPhotoUrl}
                      alt="ID"
                      onClick={() => setSelectedDoc(doc)}
                      style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4, cursor: 'pointer', border: '1px solid #CED0D4' }}
                    />
                  ) : (
                    <span style={{ fontSize: 12, color: '#8A8D91' }}>N/A</span>
                  )}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {doc.selfieUrl ? (
                    <img
                      src={doc.selfieUrl}
                      alt="Selfie"
                      onClick={() => setSelectedDoc(doc)}
                      style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 20, cursor: 'pointer', border: '1px solid #CED0D4' }}
                    />
                  ) : (
                    <span style={{ fontSize: 12, color: '#8A8D91' }}>N/A</span>
                  )}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: 12, fontWeight: 500, padding: '2px 8px', borderRadius: 9999, backgroundColor: '#FEF3C7', color: '#92400E' }}>
                    pending
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => handleApprove(doc.id)}
                      disabled={processing === doc.id}
                      style={{
                        padding: '6px 12px', fontSize: 13, fontWeight: 500,
                        backgroundColor: '#31A24C', color: '#FFFFFF', border: 'none',
                        borderRadius: 6, cursor: 'pointer', opacity: processing === doc.id ? 0.5 : 1,
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setRejectDoc(doc)}
                      disabled={processing === doc.id}
                      style={{
                        padding: '6px 12px', fontSize: 13, fontWeight: 500,
                        backgroundColor: '#E41E3F', color: '#FFFFFF', border: 'none',
                        borderRadius: 6, cursor: 'pointer', opacity: processing === doc.id ? 0.5 : 1,
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Side-by-side comparison modal */}
      {selectedDoc && (
        <div
          onClick={() => setSelectedDoc(null)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF', borderRadius: 12, padding: 24,
              maxWidth: 800, width: '90%', maxHeight: '80vh', overflow: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#050505' }}>
                Document Review — {selectedDoc.user.phone}
              </h2>
              <button
                onClick={() => setSelectedDoc(null)}
                style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#65676B' }}
              >
                ×
              </button>
            </div>
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 12, color: '#65676B', marginBottom: 8 }}>ID Photo</p>
                {selectedDoc.idPhotoUrl ? (
                  <img src={selectedDoc.idPhotoUrl} alt="ID" style={{ maxWidth: 350, maxHeight: 400, borderRadius: 8, border: '1px solid #CED0D4' }} />
                ) : (
                  <p style={{ color: '#8A8D91' }}>Not available</p>
                )}
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 12, color: '#65676B', marginBottom: 8 }}>Selfie</p>
                {selectedDoc.selfieUrl ? (
                  <img src={selectedDoc.selfieUrl} alt="Selfie" style={{ maxWidth: 300, maxHeight: 400, borderRadius: 8, border: '1px solid #CED0D4' }} />
                ) : (
                  <p style={{ color: '#8A8D91' }}>Not available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject modal */}
      {rejectDoc && (
        <div
          onClick={() => { setRejectDoc(null); setRejectReason(''); }}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF', borderRadius: 12, padding: 24,
              maxWidth: 480, width: '90%',
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#050505', marginBottom: 16 }}>
              Reject — {rejectDoc.user.phone}
            </h2>
            <p style={{ fontSize: 14, color: '#65676B', marginBottom: 12 }}>
              Reason (required, will be sent via SMS):
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {REJECT_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setRejectReason(s)}
                  style={{
                    padding: '4px 12px', fontSize: 13, border: '1px solid #CED0D4',
                    borderRadius: 6, backgroundColor: rejectReason === s ? '#DBEAFE' : '#FFFFFF',
                    cursor: 'pointer', color: '#374151',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              style={{
                width: '100%', height: 80, padding: 12, fontSize: 14,
                border: '1px solid #CED0D4', borderRadius: 8, resize: 'none',
                fontFamily: 'inherit',
              }}
            />
            <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setRejectDoc(null); setRejectReason(''); }}
                style={{
                  padding: '8px 16px', fontSize: 14, border: '1px solid #CED0D4',
                  borderRadius: 8, backgroundColor: '#FFFFFF', cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason || processing === rejectDoc.id}
                style={{
                  padding: '8px 16px', fontSize: 14, fontWeight: 500,
                  backgroundColor: '#E41E3F', color: '#FFFFFF', border: 'none',
                  borderRadius: 8, cursor: 'pointer',
                  opacity: !rejectReason || processing === rejectDoc.id ? 0.5 : 1,
                }}
              >
                Reject & Send SMS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
