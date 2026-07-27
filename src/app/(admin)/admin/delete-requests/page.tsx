"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock } from "lucide-react";

type DeleteRequest = {
  id: string;
  contentType: string;
  contentId: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "DENIED";
  decisionNote?: string;
  requestedBy: { id: string; fullName: string };
  decidedBy?: { id: string; fullName: string };
  createdAt: string;
};

export default function DeleteRequestsPage() {
  const [requests, setRequests] = useState<DeleteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/delete-requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "DENIED":
        return <XCircle className="w-5 h-5 text-rose-500" />;
      default:
        return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 text-slate-200">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-serif text-white mb-2">Delete Requests</h1>
          <p className="text-slate-400">Track the status of your submitted deletion requests.</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
            <p className="text-slate-400">No delete requests found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800 border border-slate-700 p-6 rounded-xl flex flex-col md:flex-row gap-6"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300 border border-slate-600">
                      {req.contentType}
                    </span>
                    <span className="text-sm text-slate-400">ID: {req.contentId}</span>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Reason for deletion:</h3>
                  <p className="text-slate-300 bg-slate-900/50 p-3 rounded-lg text-sm mb-4">
                    {req.reason}
                  </p>
                  <p className="text-xs text-slate-500">
                    Requested by {req.requestedBy.fullName} on {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="w-full md:w-64 flex flex-col justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      {getStatusIcon(req.status)}
                      <span className="font-medium capitalize text-white">
                        {req.status.toLowerCase()}
                      </span>
                    </div>
                    {req.status !== "PENDING" && req.decisionNote && (
                      <div className="mt-2 text-sm">
                        <span className="text-slate-400 block mb-1">Super Admin Note:</span>
                        <p className="text-slate-300 italic">"{req.decisionNote}"</p>
                      </div>
                    )}
                  </div>
                  {req.decidedBy && (
                    <div className="text-xs text-slate-500 mt-4">
                      Reviewed by {req.decidedBy.fullName}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
