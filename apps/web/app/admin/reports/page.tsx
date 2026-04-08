'use client';

import { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogBody, DialogFooter,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

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

const TYPE_LABELS: Record<string, string> = {
  fake_listing: 'Fake listing',
  scam_attempt: 'Scam attempt',
  identity_fraud: 'Identity fraud',
  other: 'Other',
};

const STATUS_BADGE: Record<string, 'pending' | 'verified' | 'default'> = {
  pending: 'pending',
  reviewed: 'verified',
  resolved: 'default',
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

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full rounded-[12px]" />
      </div>
    );
  }

  if (error) return <p className="text-danger text-sm">{error}</p>;

  return (
    <div>
      <h1 className="font-brand text-2xl text-text-primary mb-6">
        Report Queue
        <span className="text-sm font-normal text-text-secondary ml-2">
          ({reports.filter((r) => r.status === 'pending').length} pending)
        </span>
      </h1>

      {reports.length === 0 ? (
        <p className="text-text-secondary text-center py-12">
          No pending reports. That's a good sign!
        </p>
      ) : (
        <div className="rounded-[12px] border border-border bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px]">Reporter</TableHead>
                <TableHead className="w-[120px]">Type</TableHead>
                <TableHead className="w-[250px]">Description</TableHead>
                <TableHead className="w-[120px]">Submitted</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[250px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="text-sm text-text-primary">{report.reporter.phone}</div>
                    <Badge variant="secondary" className="mt-1">
                      {report.reporter.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="danger">
                      {TYPE_LABELS[report.reportType] || report.reportType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-text-primary truncate block max-w-[250px]">
                      {report.description || '—'}
                    </span>
                  </TableCell>
                  <TableCell className="text-text-secondary">
                    {timeAgo(report.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_BADGE[report.status] || 'outline'}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1.5">
                      {report.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleAction(report.id, 'review')}
                          loading={processing === report.id}
                        >
                          Mark Reviewed
                        </Button>
                      )}
                      {report.reportedUserId && report.status !== 'resolved' && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setConfirmAction({ reportId: report.id, action: 'suspend_user' })}
                          disabled={processing === report.id}
                        >
                          Suspend User
                        </Button>
                      )}
                      {report.reportedListingId && report.status !== 'resolved' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleAction(report.id, 'suspend_listing')}
                          loading={processing === report.id}
                          className="border-warning text-amber-800"
                        >
                          Suspend Listing
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Suspend User Confirmation Dialog */}
      <Dialog open={!!confirmAction} onClose={() => setConfirmAction(null)}>
        <DialogContent className="max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Suspend User?</DialogTitle>
            <DialogClose onClose={() => setConfirmAction(null)} />
          </DialogHeader>
          <DialogBody>
            <p className="text-sm text-text-secondary leading-relaxed">
              This will immediately log out the user, hide their listings, and prevent new connections. Continue?
            </p>
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setConfirmAction(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => confirmAction && handleAction(confirmAction.reportId, confirmAction.action)}
              loading={!!confirmAction && processing === confirmAction.reportId}
            >
              Suspend
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
