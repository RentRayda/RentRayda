'use client';

import { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogBody, DialogFooter,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

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

function docTypeLabel(type: string): string {
  if (type === 'government_id') return 'Gov ID';
  if (type === 'property_proof') return 'Property';
  return 'Employment';
}

const REJECT_SUGGESTIONS = [
  'ID is not clear',
  'Face does not match selfie',
  'Property proof is not sufficient',
  'ID is expired',
];

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
      if (res.status === 401) { setError('Not authenticated. Please log in.'); return; }
      if (res.status === 403) { setError('Access denied. Admin role required.'); return; }
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

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px] w-full rounded-[12px]" />
      </div>
    );
  }

  if (error) {
    return <p className="text-danger text-sm">{error}</p>;
  }

  return (
    <div>
      <h1 className="font-brand text-2xl text-text-primary mb-6">
        Verification Queue
        <span className="text-sm font-normal text-text-secondary ml-2">
          ({docs.length} pending)
        </span>
      </h1>

      {docs.length === 0 ? (
        <p className="text-text-secondary text-center py-12">
          No pending verifications. All caught up!
        </p>
      ) : (
        <div className="rounded-[12px] border border-border bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">User</TableHead>
                <TableHead className="w-[120px]">Type</TableHead>
                <TableHead className="w-[120px]">Submitted</TableHead>
                <TableHead className="w-[100px]">ID Photo</TableHead>
                <TableHead className="w-[100px]">Selfie</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="text-sm font-medium text-text-primary">{doc.user.phone}</div>
                    <Badge
                      variant={doc.user.role === 'landlord' ? 'default' : 'verified'}
                      className="mt-1"
                    >
                      {doc.user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{docTypeLabel(doc.documentType)}</div>
                    {doc.idType && (
                      <div className="text-xs text-text-tertiary">{doc.idType}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-text-secondary">
                    {timeAgo(doc.createdAt)}
                  </TableCell>
                  <TableCell>
                    {doc.idPhotoUrl ? (
                      <img
                        src={doc.idPhotoUrl}
                        alt="ID"
                        onClick={() => setSelectedDoc(doc)}
                        className="w-[60px] h-[40px] object-cover rounded border border-border cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    ) : (
                      <span className="text-xs text-text-tertiary">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {doc.selfieUrl ? (
                      <img
                        src={doc.selfieUrl}
                        alt="Selfie"
                        onClick={() => setSelectedDoc(doc)}
                        className="w-10 h-10 object-cover rounded-full border border-border cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    ) : (
                      <span className="text-xs text-text-tertiary">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="pending">pending</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(doc.id)}
                        loading={processing === doc.id}
                        className="bg-verified hover:bg-verified/90 text-white"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setRejectDoc(doc)}
                        disabled={processing === doc.id}
                      >
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Side-by-side comparison modal */}
      <Dialog open={!!selectedDoc} onClose={() => setSelectedDoc(null)}>
        <DialogContent className="max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              Document Review — {selectedDoc?.user.phone}
            </DialogTitle>
            <DialogClose onClose={() => setSelectedDoc(null)} />
          </DialogHeader>
          <DialogBody>
            <div className="flex gap-6 justify-center">
              <div className="text-center">
                <p className="text-xs text-text-secondary mb-2">ID Photo</p>
                {selectedDoc?.idPhotoUrl ? (
                  <img
                    src={selectedDoc.idPhotoUrl}
                    alt="ID"
                    className="max-w-[350px] max-h-[400px] rounded-[8px] border border-border"
                  />
                ) : (
                  <p className="text-text-tertiary">Not available</p>
                )}
              </div>
              <div className="text-center">
                <p className="text-xs text-text-secondary mb-2">Selfie</p>
                {selectedDoc?.selfieUrl ? (
                  <img
                    src={selectedDoc.selfieUrl}
                    alt="Selfie"
                    className="max-w-[300px] max-h-[400px] rounded-[8px] border border-border"
                  />
                ) : (
                  <p className="text-text-tertiary">Not available</p>
                )}
              </div>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>

      {/* Reject modal */}
      <Dialog open={!!rejectDoc} onClose={() => { setRejectDoc(null); setRejectReason(''); }}>
        <DialogContent className="max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Reject — {rejectDoc?.user.phone}</DialogTitle>
            <DialogClose onClose={() => { setRejectDoc(null); setRejectReason(''); }} />
          </DialogHeader>
          <DialogBody className="space-y-4">
            <p className="text-sm text-text-secondary">
              Reason (required, will be sent via SMS):
            </p>
            <div className="flex flex-wrap gap-2">
              {REJECT_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setRejectReason(s)}
                  className={`px-3 py-1.5 text-xs rounded-[6px] border transition-colors ${
                    rejectReason === s
                      ? 'border-brand bg-brand-light text-brand-dark'
                      : 'border-border bg-surface text-text-primary hover:bg-background'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="min-h-[80px]"
            />
          </DialogBody>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => { setRejectDoc(null); setRejectReason(''); }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              disabled={!rejectReason}
              loading={!!rejectDoc && processing === rejectDoc.id}
            >
              Reject & Send SMS
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
