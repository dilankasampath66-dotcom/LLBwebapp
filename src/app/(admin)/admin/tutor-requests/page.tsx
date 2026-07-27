'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Mail, Phone, Calendar } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import { useToast } from '@/hooks/useToast';
import { formatRelativeDate } from '@/lib/utils';

interface TutorRequest {
  id: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  studyYear: number | null;
  tutorNote: string | null;
  createdAt: string;
  image: string | null;
}

export default function TutorRequestsPage() {
  const [requests, setRequests] = useState<TutorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/admin/tutor-applications?status=PENDING');
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (error) {
      // @ts-ignore
      toast('Failed to fetch requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDecision = async (id: string, decision: 'approve' | 'reject', note?: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/tutor-applications/${id}/decide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, note }),
      });

      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r.id !== id));
        // @ts-ignore
        toast(
          `Tutor application ${decision === 'approve' ? 'approved' : 'rejected'}.`,
          decision === 'approve' ? 'success' : 'info'
        );
      } else {
        throw new Error('Failed to process request');
      }
    } catch (error) {
      // @ts-ignore
      toast('Failed to process request', 'error');
    } finally {
      setProcessingId(null);
      if (decision === 'reject') {
        setRejectingId(null);
        setRejectReason('');
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-3xl font-bold mb-8">Tutor Applications</h1>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="pb-12">
      <h1 className="font-serif text-3xl font-bold mb-8">Tutor Applications</h1>

      {requests.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 className="w-12 h-12 text-zinc-500" />}
          title="All caught up"
          description="No pending tutor applications at the moment."
        />
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {requests.map((request) => (
              <motion.div
                key={request.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50, backgroundColor: 'rgba(0,0,0,0)' }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar src={request.image} fallback={request.fullName?.[0] || '?'} size="lg" />
                      <div className="space-y-2 flex-1">
                        <div>
                          <h3 className="font-semibold text-lg">{request.fullName || 'Unknown User'}</h3>
                          <div className="text-sm text-[hsl(220,10%,60%)]">
                            Applied {formatRelativeDate(new Date(request.createdAt))}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-[hsl(220,10%,80%)] pt-2">
                          {request.email && (
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-4 h-4 text-[hsl(220,10%,60%)]" />
                              {request.email}
                            </div>
                          )}
                          {request.phone && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-4 h-4 text-[hsl(220,10%,60%)]" />
                              {request.phone}
                            </div>
                          )}
                          {request.studyYear && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-[hsl(220,10%,60%)]" />
                              Year {request.studyYear}
                            </div>
                          )}
                        </div>

                        {request.tutorNote && (
                          <div className="mt-4 p-3 rounded-md bg-[hsl(220,16%,12%)] border border-[hsl(220,15%,20%)] text-sm">
                            <span className="text-[hsl(220,10%,60%)] block mb-1">Applicant Note:</span>
                            {request.tutorNote}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[140px]">
                      {rejectingId === request.id ? (
                        <div className="space-y-3 w-full md:w-64">
                          <textarea
                            placeholder="Reason for rejection..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="w-full text-sm min-h-[80px] rounded-md border bg-[hsl(220,16%,12%)] border-[hsl(220,15%,20%)] px-3 py-2 text-[hsl(220,10%,92%)] focus:outline-none focus:ring-2 focus:ring-[hsl(345,65%,25%)]"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button
                              variant="danger"
                              size="sm"
                              className="flex-1"
                              isLoading={processingId === request.id}
                              onClick={() => handleDecision(request.id, 'reject', rejectReason)}
                            >
                              Confirm
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setRejectingId(null);
                                setRejectReason('');
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Button
                            variant="primary"
                            className="bg-[hsl(142,60%,40%)] hover:bg-[hsl(142,60%,35%)] text-white w-full border-none"
                            onClick={() => handleDecision(request.id, 'approve')}
                            isLoading={processingId === request.id}
                            disabled={processingId !== null}
                            icon={<CheckCircle2 className="w-4 h-4" />}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full hover:bg-[hsl(0,72%,50%)]/10 hover:text-[hsl(0,72%,50%)] hover:border-[hsl(0,72%,50%)]/50"
                            onClick={() => setRejectingId(request.id)}
                            disabled={processingId !== null}
                            icon={<XCircle className="w-4 h-4" />}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
