"use client";

import { useState, useEffect, useCallback } from "react";
import { adminApi, ServiceRead } from "@/lib/adminApi";

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("admin_token") ?? "";
}

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg text-sm font-sans shadow-lg flex items-center gap-2 animate-fade-in ${
      type === "success"
        ? "bg-green-500/20 border border-green-500/40 text-green-400"
        : "bg-red-500/20 border border-red-500/40 text-red-400"
    }`}>
      {type === "success"
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
      }
      {message}
    </div>
  );
}

const inputBase = "w-full bg-background-elevated border border-border rounded-md px-4 py-2.5 text-sm text-brand-white placeholder:text-silver-dark focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors";

const emptyForm = { name: "", starting_price: 99, description: "", is_active: true, sort_order: 0 };

type FormData = typeof emptyForm;

function ServiceModal({
  service,
  onSave,
  onClose,
}: {
  service: Partial<ServiceRead> | null;
  onSave: (data: FormData) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormData>(
    service
      ? { name: service.name ?? "", starting_price: service.starting_price ?? 99, description: service.description ?? "", is_active: service.is_active ?? true, sort_order: service.sort_order ?? 0 }
      : emptyForm
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Service name is required."); return; }
    setSaving(true);
    setError("");
    try {
      await onSave(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-background-secondary border border-border rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-display font-semibold text-brand-white">
            {service?.id ? "Edit Service" : "Add New Service"}
          </h2>
          <button onClick={onClose} className="text-silver hover:text-brand-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-silver-dark uppercase tracking-widest font-display">Service Name *</label>
            <input name="name" type="text" required value={form.name} onChange={handleChange} placeholder="e.g. Oil Changes" className={inputBase} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-silver-dark uppercase tracking-widest font-display">Starting Price ($)</label>
              <input name="starting_price" type="number" min="0" step="0.01" value={form.starting_price} onChange={handleChange} className={inputBase} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-silver-dark uppercase tracking-widest font-display">Sort Order</label>
              <input name="sort_order" type="number" min="0" value={form.sort_order} onChange={handleChange} className={inputBase} />
              <p className="text-xs text-silver-dark">Lower = shown first</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-silver-dark uppercase tracking-widest font-display">Description</label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description of this service…"
              className={`${inputBase} resize-none`}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => setForm(p => ({ ...p, is_active: !p.is_active }))}
              className={`w-10 h-6 rounded-full transition-colors duration-200 flex items-center px-0.5 ${form.is_active ? "bg-gold" : "bg-border"}`}
            >
              <div className={`w-5 h-5 rounded-full bg-background transition-transform duration-200 ${form.is_active ? "translate-x-4" : "translate-x-0"}`} />
            </div>
            <span className="text-sm text-silver font-sans">Active (visible on booking page)</span>
          </label>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-gold-gradient text-background font-display font-semibold text-sm rounded-md hover:shadow-gold-glow-strong transition-all disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              {saving ? "Saving…" : "Save Service"}
            </button>
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-border text-silver text-sm rounded-md hover:text-brand-white hover:border-silver transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [modal, setModal] = useState<{ open: boolean; service: Partial<ServiceRead> | null }>({ open: false, service: null });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllServices(getToken());
      setServices(data);
    } catch {
      showToast("Failed to load services", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data: typeof emptyForm) => {
    if (modal.service?.id) {
      await adminApi.updateService(modal.service.id, data, getToken());
      showToast("Service updated.", "success");
    } else {
      await adminApi.createService({ ...data, id: 0 } as ServiceRead, getToken());
      showToast("Service created.", "success");
    }
    setModal({ open: false, service: null });
    await load();
  };

  const handleDelete = async (service: ServiceRead) => {
    if (!confirm(`Delete "${service.name}"? This cannot be undone.`)) return;
    try {
      await adminApi.deleteService(service.id, getToken());
      showToast("Service deleted.", "success");
      await load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to delete", "error");
    }
  };

  const handleToggleActive = async (service: ServiceRead) => {
    try {
      await adminApi.updateService(service.id, { is_active: !service.is_active }, getToken());
      await load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update", "error");
    }
  };

  return (
    <div className="p-8">
      {toast && <Toast message={toast.message} type={toast.type} />}
      {modal.open && (
        <ServiceModal
          service={modal.service}
          onSave={handleSave}
          onClose={() => setModal({ open: false, service: null })}
        />
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-brand-white text-2xl">Services</h1>
          <p className="text-silver text-sm mt-1">Manage your booking services and pricing</p>
        </div>
        <button
          onClick={() => setModal({ open: true, service: null })}
          className="px-5 py-2.5 bg-gold-gradient text-background font-display font-semibold text-sm rounded-md hover:shadow-gold-glow-strong transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          + Add Service
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : services.length === 0 ? (
        <div className="bg-background-secondary border border-border rounded-xl p-12 text-center">
          <p className="text-silver">No services yet.</p>
          <p className="text-silver-dark text-sm mt-1">Click &quot;Add Service&quot; to create your first one.</p>
        </div>
      ) : (
        <div className="bg-background-secondary border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Name", "Starting Price", "Description", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-silver-dark font-display text-xs uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((svc, i) => (
                <tr key={svc.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-background/30"}`}>
                  <td className="px-5 py-4 text-brand-white font-sans font-medium">{svc.name}</td>
                  <td className="px-5 py-4 text-gold font-sans font-semibold">${svc.starting_price}</td>
                  <td className="px-5 py-4 text-silver font-sans text-xs max-w-xs truncate">{svc.description || "—"}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => handleToggleActive(svc)} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-full">
                      {svc.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-border border border-border text-silver-dark text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-silver-dark" />Inactive
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setModal({ open: true, service: svc })}
                        className="px-3 py-1.5 text-xs border border-border text-silver rounded-md hover:border-gold hover:text-gold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(svc)}
                        className="px-3 py-1.5 text-xs border border-border text-silver rounded-md hover:border-red-400 hover:text-red-400 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
