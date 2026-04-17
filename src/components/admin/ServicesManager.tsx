"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ServiceRow } from "@/types/service";

const CATEGORIES = ["Signature", "Group", "Bridal", "Education"] as const;

type DraftService = ServiceRow & { _dirty?: boolean; _new?: boolean };

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function emptyService(): DraftService {
  return {
    id: -Date.now(),
    slug: "",
    title: "",
    category: "Signature",
    description: "",
    features: [],
    price_from: null,
    sort_order: 999,
    is_active: true,
    _new: true,
    _dirty: true,
  };
}

export default function ServicesManager() {
  const [rows, setRows] = useState<DraftService[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services/all");
      if (!res.ok) throw new Error("Failed to load services");
      const data = (await res.json()) as { services: ServiceRow[] };
      const sorted = [...(data.services ?? [])].sort((a, b) => a.sort_order - b.sort_order);
      setRows(sorted.map((s) => ({ ...s })));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const dirty = useMemo(() => rows.some((r) => r._dirty || r._new), [rows]);

  function updateRow(id: number, patch: Partial<DraftService>) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch, _dirty: !r._new ? true : r._dirty } : r)),
    );
  }

  function move(id: number, direction: -1 | 1) {
    setRows((prev) => {
      const idx = prev.findIndex((r) => r.id === id);
      if (idx === -1) return prev;
      const next = idx + direction;
      if (next < 0 || next >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.splice(next, 0, item);
      return copy.map((r, i) => ({ ...r, sort_order: (i + 1) * 10, _dirty: true }));
    });
  }

  function addRow() {
    setRows((prev) => [...prev, { ...emptyService(), sort_order: (prev.length + 1) * 10 }]);
  }

  async function removeRow(row: DraftService) {
    if (row._new) {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      return;
    }
    const confirmed = window.confirm(`Delete "${row.title}"? It will be hidden from the site.`);
    if (!confirmed) return;
    const res = await fetch(`/api/services?id=${row.id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Failed to delete");
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== row.id));
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const toCreate = rows.filter((r) => r._new);
      const toUpdate = rows.filter((r) => !r._new && r._dirty);

      for (const r of toCreate) {
        if (!r.title || !r.slug || !r.category) {
          throw new Error(`New service is missing title/slug/category`);
        }
        const res = await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: r.slug,
            title: r.title,
            category: r.category,
            description: r.description ?? "",
            features: r.features ?? [],
            price_from: r.price_from ?? null,
            sort_order: r.sort_order,
            is_active: r.is_active,
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error ?? "Create failed");
        }
      }

      if (toUpdate.length > 0) {
        const res = await fetch("/api/services", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            updates: toUpdate.map((r) => ({
              id: r.id,
              slug: r.slug,
              title: r.title,
              category: r.category,
              description: r.description,
              features: r.features,
              price_from: r.price_from,
              sort_order: r.sort_order,
              is_active: r.is_active,
            })),
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error ?? "Update failed");
        }
      }

      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-[#6b5d4f] text-sm">Loading services…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#3a322b]">Services & Pricing</h2>
          <p className="text-sm text-[#6b5d4f]">Edit titles, prices (in GBP), categories, and order. Changes save to Supabase.</p>
        </div>
        <div className="flex items-center gap-3">
          {dirty && <span className="text-sm text-orange-600 font-medium">Unsaved changes</span>}
          <button
            type="button"
            onClick={addRow}
            className="px-4 py-2 text-sm rounded border border-[#d4b896] text-[#8b7355] hover:bg-[#faf8f5]"
          >
            + Add service
          </button>
          <button
            type="button"
            disabled={!dirty || saving}
            onClick={save}
            className="px-5 py-2 text-sm rounded bg-gradient-to-br from-[#d4b896] to-[#b49b82] text-white font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">{error}</div>
      )}

      <div className="overflow-x-auto bg-white border border-[#f5f2ed] rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-[#faf8f5] text-[#6b5d4f] text-left">
            <tr>
              <th className="px-3 py-2 w-12">Order</th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Slug</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2 w-24">From £</th>
              <th className="px-3 py-2">Description</th>
              <th className="px-3 py-2 w-20">Active</th>
              <th className="px-3 py-2 w-28"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id} className={`${row._new ? "bg-amber-50/50" : ""} border-t border-[#f5f2ed] align-top`}>
                <td className="px-3 py-2">
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => move(row.id, -1)}
                      className="text-xs px-2 py-0.5 rounded hover:bg-[#f5f2ed] disabled:opacity-30"
                      aria-label="Move up"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={idx === rows.length - 1}
                      onClick={() => move(row.id, 1)}
                      className="text-xs px-2 py-0.5 rounded hover:bg-[#f5f2ed] disabled:opacity-30"
                      aria-label="Move down"
                    >
                      ▼
                    </button>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <input
                    value={row.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      updateRow(row.id, {
                        title,
                        ...(row._new && !row.slug ? { slug: slugify(title) } : {}),
                      });
                    }}
                    className="w-full px-2 py-1 rounded border border-[#f5f2ed] focus:border-[#d4b896] focus:outline-none"
                    placeholder="Service title"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={row.slug}
                    onChange={(e) => updateRow(row.id, { slug: slugify(e.target.value) })}
                    className="w-full px-2 py-1 rounded border border-[#f5f2ed] focus:border-[#d4b896] focus:outline-none font-mono text-xs"
                    placeholder="service-slug"
                  />
                </td>
                <td className="px-3 py-2">
                  <select
                    value={row.category}
                    onChange={(e) => updateRow(row.id, { category: e.target.value })}
                    className="w-full px-2 py-1 rounded border border-[#f5f2ed] focus:border-[#d4b896] focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    step={5}
                    value={row.price_from ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      updateRow(row.id, { price_from: v === "" ? null : Number(v) });
                    }}
                    className="w-full px-2 py-1 rounded border border-[#f5f2ed] focus:border-[#d4b896] focus:outline-none"
                    placeholder="—"
                  />
                </td>
                <td className="px-3 py-2 max-w-[320px]">
                  <textarea
                    value={row.description ?? ""}
                    onChange={(e) => updateRow(row.id, { description: e.target.value })}
                    rows={2}
                    className="w-full px-2 py-1 rounded border border-[#f5f2ed] focus:border-[#d4b896] focus:outline-none text-xs"
                    placeholder="Short description shown on the service card."
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={row.is_active}
                    onChange={(e) => updateRow(row.id, { is_active: e.target.checked })}
                    aria-label="Active"
                  />
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => removeRow(row)}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    {row._new ? "Discard" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
