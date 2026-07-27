"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function BrandingPage() {
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, setValue, watch } = useForm();
  const watchAllFields = watch();

  useEffect(() => {
    fetch("/api/superadmin/branding")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setValue("headline", data.settings.headline);
          setValue("subtext", data.settings.subtext);
          setValue("logoUrl", data.settings.logoUrl);
          setValue("backgroundUrl", data.settings.backgroundUrl);
        }
        setLoading(false);
      });
  }, [setValue]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/superadmin/branding/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.url) {
      setValue(field, data.url);
    }
  };

  const onSubmit = async (data: any) => {
    await fetch("/api/superadmin/branding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    alert("Saved!");
  };

  if (loading) return <div className="p-8 text-text-primary">Loading...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 text-text-primary">
      <div>
        <h1 className="text-3xl font-playfair font-bold mb-6">Branding Management</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-surface p-6 rounded-xl border border-border">
          <div>
            <label className="block text-sm font-medium mb-1">Headline</label>
            <input
              {...register("headline")}
              className="w-full p-2 bg-background border border-border rounded focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subtext</label>
            <textarea
              {...register("subtext")}
              className="w-full p-2 bg-background border border-border rounded focus:border-primary focus:outline-none"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Logo Upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUpload(e, "logoUrl")}
              className="text-sm text-text-secondary"
            />
            {watchAllFields.logoUrl && <img src={watchAllFields.logoUrl} className="h-12 mt-2" alt="Logo" />}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Background Upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUpload(e, "backgroundUrl")}
              className="text-sm text-text-secondary"
            />
            {watchAllFields.backgroundUrl && <img src={watchAllFields.backgroundUrl} className="h-24 mt-2 object-cover" alt="Background" />}
          </div>
          <button type="submit" className="w-full py-2 bg-primary hover:bg-primary-light text-white rounded font-medium transition-colors">
            Save Changes
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-playfair font-bold mb-6">Live Preview</h2>
        <div className="border border-border rounded-xl overflow-hidden bg-background h-[500px] relative">
          {watchAllFields.backgroundUrl && (
            <div className="absolute inset-0 z-0">
              <img src={watchAllFields.backgroundUrl} alt="BG" className="w-full h-full object-cover opacity-20" />
            </div>
          )}
          <div className="relative z-10 p-8 flex flex-col items-center text-center mt-20">
            {watchAllFields.logoUrl ? (
              <img src={watchAllFields.logoUrl} alt="Logo" className="h-20 mb-6" />
            ) : (
              <div className="h-20 w-20 bg-primary/20 rounded-full mb-6 flex items-center justify-center text-primary font-bold">Logo</div>
            )}
            <h1 className="text-4xl font-playfair font-bold text-text-primary mb-4">
              {watchAllFields.headline || "Headline Here"}
            </h1>
            <p className="text-text-secondary max-w-md">
              {watchAllFields.subtext || "Subtext will appear here."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
