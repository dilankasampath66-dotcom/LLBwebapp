"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DeleteApprovalsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<any>(null); // Request obj
  const [note, setNote] = useState("");

  const fetchRequests = () => {
    fetch("/api/superadmin/delete-approvals")
      .then((res) => res.json())
      .then((data) => {
        setRequests(data.deleteRequests || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, action: "APPROVE" | "DENY") => {
    const res = await fetch(`/api/superadmin/delete-approvals/${id}/decide`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, note }),
    });
    if (res.ok) {
      setActiveModal(null);
      setNote("");
      fetchRequests();
    } else {
      alert("Error processing action");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto text-text-primary">
      <h1 className="text-3xl font-playfair font-bold mb-6">Delete Approvals Queue</h1>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-surface border border-border p-5 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <p className="text-sm text-warning font-medium mb-1">Delete Request</p>
                <h3 className="font-bold text-lg">
                  {req.content?.title || req.judgement?.title || "Unknown Resource"}
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  Requested by: {req.requestedBy?.name} ({req.requestedBy?.email})
                </p>
                <p className="text-sm text-text-secondary mt-1 max-w-xl truncate">
                  Reason: {req.reason}
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-2">
                <button
                  onClick={() => setActiveModal({ ...req, action: "DENY" })}
                  className="px-4 py-2 border border-border text-text-primary rounded hover:bg-background transition"
                >
                  Deny
                </button>
                <button
                  onClick={() => setActiveModal({ ...req, action: "APPROVE" })}
                  className="px-4 py-2 bg-error hover:bg-red-600 text-white rounded transition"
                >
                  Approve (Delete)
                </button>
              </div>
            </div>
          ))}
          {requests.length === 0 && (
            <div className="text-center p-8 bg-surface border border-border rounded-xl text-text-secondary">
              No pending delete requests.
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-surface border border-border p-6 rounded-xl w-full max-w-md shadow-xl"
            >
              <h2 className="text-xl font-playfair font-bold mb-2">
                {activeModal.action === "APPROVE" ? "Confirm Deletion" : "Deny Request"}
              </h2>
              <p className="text-sm text-text-secondary mb-4">
                Resource: {activeModal.content?.title || activeModal.judgement?.title}
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Admin Note (Optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-2 bg-background border border-border rounded focus:border-primary focus:outline-none text-sm"
                  rows={3}
                  placeholder="Reason for approval/denial..."
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 text-text-secondary hover:text-text-primary">
                  Cancel
                </button>
                <button
                  onClick={() => handleAction(activeModal.id, activeModal.action)}
                  className={`px-4 py-2 rounded text-white ${activeModal.action === "APPROVE" ? "bg-error hover:bg-red-600" : "bg-primary hover:bg-primary-light"}`}
                >
                  {activeModal.action === "APPROVE" ? "Confirm Delete" : "Confirm Deny"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
