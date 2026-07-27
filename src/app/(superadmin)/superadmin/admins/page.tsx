"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminsPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const fetchAdmins = () => {
    fetch("/api/superadmin/admins")
      .then((res) => res.json())
      .then((data) => {
        setAdmins(data.admins || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const onSubmit = async (data: any) => {
    const res = await fetch("/api/superadmin/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setIsModalOpen(false);
      reset();
      fetchAdmins();
    } else {
      alert("Error adding admin");
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this admin?")) return;
    const res = await fetch(`/api/superadmin/admins/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchAdmins();
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto text-text-primary">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-playfair font-bold">Admin Accounts</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded transition-colors"
        >
          Add Admin
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="p-4 font-medium text-sm text-text-secondary">Name</th>
                <th className="p-4 font-medium text-sm text-text-secondary">Email</th>
                <th className="p-4 font-medium text-sm text-text-secondary">Created</th>
                <th className="p-4 font-medium text-sm text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b border-border/50 last:border-0">
                  <td className="p-4">{admin.name}</td>
                  <td className="p-4">{admin.email}</td>
                  <td className="p-4 text-sm text-text-secondary">
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDeactivate(admin.id)}
                      className="text-error hover:text-red-400 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {admins.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-text-secondary">
                    No active admins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
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
              <h2 className="text-xl font-playfair font-bold mb-4">Add New Admin</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input required {...register("name")} className="w-full p-2 bg-background border border-border rounded focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input required type="email" {...register("email")} className="w-full p-2 bg-background border border-border rounded focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Temporary Password</label>
                  <input required type="password" {...register("password")} className="w-full p-2 bg-background border border-border rounded focus:border-primary focus:outline-none" />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-text-secondary hover:text-text-primary">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary-light text-white rounded">
                    Create Admin
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
