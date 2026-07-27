"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function SuperAdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/superadmin/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-text-primary">Loading...</div>;
  if (!data || data.error) return <div className="p-8 text-error">Failed to load dashboard</div>;

  const stats = [
    { label: "Students", value: data.stats.students },
    { label: "Tutors", value: data.stats.tutors },
    { label: "Content", value: data.stats.content },
    { label: "Judgements", value: data.stats.judgements },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-text-primary">
      <h1 className="text-3xl font-playfair font-bold">Platform Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-surface rounded-xl border border-border shadow-sm"
          >
            <h3 className="text-text-secondary text-sm font-medium">{stat.label}</h3>
            <p className="text-3xl font-bold mt-2 text-primary-light">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-surface rounded-xl border border-border p-6 mt-8">
        <h2 className="text-xl font-playfair font-bold mb-4">Recent Audit Logs</h2>
        <div className="space-y-4">
          {data.auditLogs.map((log: any) => (
            <div key={log.id} className="border-b border-border pb-4 last:border-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <p className="font-medium text-sm text-text-primary">{log.action}</p>
                <p className="text-xs text-text-secondary">{log.user?.name || "System"}</p>
              </div>
              <p className="text-xs text-text-secondary mt-2 sm:mt-0">
                {new Date(log.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
          {data.auditLogs.length === 0 && (
            <p className="text-sm text-text-secondary">No recent activity.</p>
          )}
        </div>
      </div>
    </div>
  );
}
