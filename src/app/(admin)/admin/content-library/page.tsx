"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2, Edit } from "lucide-react";

type LibraryItem = {
  id: string;
  sessionName?: string;
  caseName?: string;
  caseNo?: string;
  description?: string;
  summary?: string;
  status: string;
  createdBy: { id: string; fullName: string };
  createdAt: string;
};

export default function ContentLibraryPage() {
  const [tab, setTab] = useState<"content" | "judgement">("content");
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchItems();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [tab, search]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content-library?type=${tab}&search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestDelete = async () => {
    if (!deleteModal || !deleteReason.trim()) return;
    setProcessing(true);
    try {
      const res = await fetch(`/api/delete-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: tab.toUpperCase(),
          contentId: deleteModal,
          reason: deleteReason,
        }),
      });
      if (res.ok) {
        setDeleteModal(null);
        setDeleteReason("");
        alert("Delete request submitted successfully.");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to submit request.");
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif text-white mb-2">Content Library</h1>
            <p className="text-slate-400">Manage published study materials and judgements.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 pl-10 pr-4 py-2 rounded-lg text-white focus:outline-none focus:border-amber-500"
            />
          </div>
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

        {loading && items.length === 0 ? (
          <div className="text-center py-12 text-slate-400">Loading library...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
            <p className="text-slate-400">No published items found.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800 border border-slate-700 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="text-xl font-medium text-white mb-1">
                    {tab === "content" ? item.sessionName : `${item.caseName} (${item.caseNo})`}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2 max-w-3xl">
                    {tab === "content" ? item.description : item.summary}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Added by {item.createdBy.fullName} on {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-700 rounded-lg transition-colors" title="Edit">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setDeleteModal(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition-colors"
                    title="Request Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {deleteModal && (
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
                <h3 className="text-2xl font-serif text-white mb-4">Request Deletion</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Please provide a reason for deleting this {tab === "content" ? "content" : "judgement"}. 
                  Super Admins will review your request.
                </p>
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Reason for deletion..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-rose-500 min-h-[100px] mb-6"
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setDeleteModal(null);
                      setDeleteReason("");
                    }}
                    className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRequestDelete}
                    disabled={processing || !deleteReason.trim()}
                    className={`px-6 py-2 rounded-lg text-white bg-rose-600 hover:bg-rose-500 transition-colors ${
                      processing || !deleteReason.trim() ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {processing ? "Submitting..." : "Submit Request"}
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
