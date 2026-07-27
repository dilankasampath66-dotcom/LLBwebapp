"use client";

export default function ExportsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto text-text-primary">
      <h1 className="text-3xl font-playfair font-bold mb-6">Data Exports</h1>
      <p className="text-text-secondary mb-8">
        Download platform data in CSV format for analysis or backup. Password hashes and sensitive credentials are automatically excluded.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-surface border border-border p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-2">Users Export</h2>
          <p className="text-sm text-text-secondary mb-6">
            Includes all registered users (Students, Tutors, Admins) with their current status and creation dates.
          </p>
          <a
            href="/api/superadmin/export/users"
            download
            className="inline-block bg-primary hover:bg-primary-light text-white px-4 py-2 rounded transition font-medium"
          >
            Download Users CSV
          </a>
        </div>

        <div className="bg-surface border border-border p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-2">Content Export</h2>
          <p className="text-sm text-text-secondary mb-6">
            Includes metadata for all content and judgements on the platform, including soft-deleted items.
          </p>
          <a
            href="/api/superadmin/export/content"
            download
            className="inline-block bg-primary hover:bg-primary-light text-white px-4 py-2 rounded transition font-medium"
          >
            Download Content CSV
          </a>
        </div>
      </div>
    </div>
  );
}
