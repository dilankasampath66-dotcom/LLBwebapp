"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Content = {
  id: string;
  sessionName?: string;
  caseName?: string;
  caseNo?: string;
  description?: string;
  summary?: string;
  status: string;
  createdBy: { id: string; fullName: string; email: string };
  createdAt: string;
};

export default function ContentQueuePage() {
  const [tab, setTab] = useState<"content" | "judgement">("content");
  const [items, setItems] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionNote, setActionNote] = useState("");
  const [actionModal, setActionModal] = useState<{ id: string; type: "approve" | "reject" } | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [tab]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content-queue?type=${tab}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!actionModal) return;
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/content/${actionModal.id}/decide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision: actionModal.type,
          type: tab.toUpperCase(),
          note: actionNote,
        }),
      });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== actionModal.id));
        setActionModal(null);
        setActionNote("");
      } else {
        alert("Action failed.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 text-slate-200">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-serif text-white mb-2">Content Queue</h1>
          <p className="text-slate-400">Review and approve pending study content and judgements.</p>
        </div>

        <div className="flex space-x-4 border-b border-slate-700 pb-2">
          <button
            onClick={() => setTab("content")}
            className={`px-4 py-2 font-medium transition-colors ${
              tab === "content" ? "text-amber-400 border-b-2 border-amber-400" : "text-slate-400 hover:text-white"
            }`}
          >
            Study Content
          </button>
          <button
            onClick={() => setTab("judgement")}
            className={`px-4 py-2 font-medium transition-colors ${
              tab === "judgement" ? "text-amber-400 border-b-2 border-amber-400" : "text-slate-400 hover:text-white"
            }`}
          >
            Judgements
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading queue...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
            <p className="text-slate-400">No pending items in this queue.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden"
                >
                  <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-medium text-white">
                        {tab === "content" ? item.sessionName : `${item.caseName} (${item.caseNo})`}
                      </h3>
                      <p className="text-sm text-slate-400 mt-1">
                        Submitted by <span className="text-slate-300">{item.createdBy.fullName}</span> on{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                      >
                        {expandedId === item.id ? "Hide Preview" : "Preview"}
                      </button>
                      <button
                        onClick={() => setActionModal({ id: item.id, type: "approve" })}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setActionModal({ id: item.id, type: "reject" })}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-700 bg-slate-900/50 p-6 overflow-hidden"
                      >
                        <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">
                          {tab === "content" ? "Description" : "Summary"}
                        </h4>
                        <p className="text-slate-300 whitespace-pre-wrap">
                          {tab === "content" ? item.description : item.summary}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <AnimatePresence>
          {actionModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-slate-800 border border-slate-700 p-6 rounded-xl w-full max-w-md shadow-xl"
              >
                <h3 className="text-2xl font-serif text-white mb-4">
                  {actionModal.type === "approve" ? "Approve" : "Reject"} {tab === "content" ? "Content" : "Judgement"}
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                  Add an optional note explaining your decision. This will be visible to the submitter.
                </p>
                <textarea
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder="Enter your note here..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-amber-500 min-h-[100px] mb-6"
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setActionModal(null);
                      setActionNote("");
                    }}
                    className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAction}
                    disabled={processing}
                    className={`px-6 py-2 rounded-lg text-white transition-colors ${
                      actionModal.type === "approve"
                        ? "bg-emerald-600 hover:bg-emerald-500"
                        : "bg-rose-600 hover:bg-rose-500"
                    } ${processing ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {processing ? "Processing..." : "Confirm"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
