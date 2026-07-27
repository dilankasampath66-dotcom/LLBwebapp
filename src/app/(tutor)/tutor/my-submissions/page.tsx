'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatRelativeDate, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Eye, MessageSquareWarning } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MySubmissionsPage() {
  const [activeTab, setActiveTab] = useState<'content' | 'judgements'>('content');
  const [submissions, setSubmissions] = useState<{ content: any[]; judgements: any[] }>({ content: [], judgements: [] });
  const [loading, setLoading] = useState(true);
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/tutor/my-submissions')
      .then((res) => res.json())
      .then((data) => setSubmissions(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleNote = (id: string) => {
    setExpandedNotes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-900/30 text-green-400 border-green-900">Approved</Badge>;
      case 'PENDING_REVIEW':
        return <Badge className="bg-amber-900/30 text-amber-400 border-amber-900">Pending</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-900/30 text-red-400 border-red-900">Rejected</Badge>;
      case 'DRAFT':
      default:
        return <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700">Draft</Badge>;
    }
  };

  const renderTable = (items: any[], type: 'content' | 'judgements') => {
    if (items.length === 0) {
      return (
        <div className="text-center py-12 border border-zinc-800 rounded-lg bg-zinc-900/50">
          <p className="text-zinc-400">No {type === 'content' ? 'study content' : 'judgements'} submitted yet.</p>
          <Button asChild className="mt-4 bg-maroon-700 hover:bg-maroon-600">
            <Link href={type === 'content' ? '/tutor/content/new' : '/tutor/judgements/new'}>
              Add {type === 'content' ? 'Content' : 'Judgement'}
            </Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 text-sm font-medium text-zinc-400">
              <th className="pb-3 pl-4">Title / Name</th>
              <th className="pb-3 px-4">Level</th>
              <th className="pb-3 px-4">Status</th>
              <th className="pb-3 px-4">Last Updated</th>
              <th className="pb-3 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {items.map((item) => (
              <tr key={item.id} className="group hover:bg-zinc-900/50 transition-colors">
                <td className="py-4 pl-4 align-top">
                  <div>
                    <p className="font-medium text-zinc-200">
                      {type === 'content' ? item.sessionName || 'Untitled Session' : item.caseName}
                    </p>
                    {item.status === 'REJECTED' && item.reviewNote && (
                      <div className="mt-2">
                        <button 
                          onClick={() => toggleNote(item.id)}
                          className="flex items-center text-xs text-red-400 hover:text-red-300 transition-colors"
                        >
                          <MessageSquareWarning className="h-3 w-3 mr-1" />
                          {expandedNotes[item.id] ? 'Hide review note' : 'View review note'}
                        </button>
                        {expandedNotes[item.id] && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-2 p-3 bg-red-950/20 border border-red-900/30 rounded-md text-sm text-zinc-300"
                          >
                            {item.reviewNote}
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded bg-zinc-800 text-xs text-zinc-300">
                    {item.level || '-'}
                  </span>
                </td>
                <td className="py-4 px-4 align-top">
                  {getStatusBadge(item.status)}
                </td>
                <td className="py-4 px-4 align-top text-sm text-zinc-400">
                  {formatRelativeDate(new Date(item.updatedAt))}
                </td>
                <td className="py-4 pr-4 align-top text-right">
                  <div className="flex justify-end gap-2">
                    {item.status === 'APPROVED' ? (
                      <Button variant="ghost" size="sm" asChild className="text-zinc-400 hover:text-zinc-200">
                        <Link href={type === 'content' ? `/content/${item.id}` : `/judgements/${item.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" asChild className="border-zinc-700 hover:bg-zinc-800">
                        <Link href={type === 'content' ? `/tutor/content/${item.id}/edit` : `/tutor/judgements/${item.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div className="flex gap-4 mb-6 border-b border-zinc-800">
        <button
          onClick={() => setActiveTab('content')}
          className={cn(
            'px-4 py-2 font-medium text-sm transition-colors border-b-2',
            activeTab === 'content'
              ? 'border-maroon-500 text-maroon-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          )}
        >
          Study Content ({submissions.content.length})
        </button>
        <button
          onClick={() => setActiveTab('judgements')}
          className={cn(
            'px-4 py-2 font-medium text-sm transition-colors border-b-2',
            activeTab === 'judgements'
              ? 'border-maroon-500 text-maroon-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          )}
        >
          Judgements ({submissions.judgements.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-maroon-600 border-t-transparent" />
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          {activeTab === 'content' ? renderTable(submissions.content, 'content') : renderTable(submissions.judgements, 'judgements')}
        </div>
      )}
    </div>
  );
}
