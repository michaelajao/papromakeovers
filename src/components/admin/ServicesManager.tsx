"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ServiceRow } from "@/types/service";

const CATEGORIES = ["Signature", "Group", "Bridal", "Education"] as const;

type DraftService = ServiceRow & { _dirty?: boolean; _new?: boolean };
type RowErrors = Record<number, { title?: string; slug?: string; server?: string }>;

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

function ChevronUp() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
    </svg>
  );
}
function ChevronDown() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a2 2 0 012-2h2a2 2 0 012 2v3" />
    </svg>
  );
}
function UndoIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a6 6 0 010 12H8m-5-12l4-4m-4 4l4 4" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function SlugField({
  row,
  error,
  isUnlocked,
  saving,
  onChange,
  onUnlock,
}: {
  row: DraftService;
  error?: string;
  isUnlocked: boolean;
  saving: boolean;
  onChange: (slug: string) => void;
  onUnlock: () => void;
}) {
  const editable = row._new || isUnlocked;
  const urlPreview = row.slug ? `/?service=${row.slug}#booking` : "";

  if (!editable) {
    // Existing service, slug locked — show as code with a Change button
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <code className="flex-1 px-2 py-1.5 rounded bg-[#faf8f5] border border-[#f5f2ed] font-mono text-xs text-[#5c5048] truncate">
            {row.slug || "—"}
          </code>
          <button
            type="button"
            onClick={onUnlock}
            disabled={saving}
            className="inline-flex items-center gap-1 text-[11px] text-[#8b7355] hover:text-[#7a2e3f] px-2 py-1 rounded border border-[#e5ddd1] hover:border-[#7a2e3f] transition-colors"
            title="Unlock to change (warning: breaks existing links)"
          >
            <LockIcon />
            Change
          </button>
        </div>
        {urlPreview && (
          <p className="text-[10px] text-[#8b7355] font-mono truncate">{urlPreview}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <input
        value={row.slug}
        disabled={saving}
        onChange={(e) => onChange(slugify(e.target.value))}
        className={`${FIELD_CLS} font-mono text-xs ${error ? FIELD_ERR : ""}`}
        placeholder="service-slug"
        aria-invalid={error ? "true" : "false"}
        aria-label="Service slug"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      {!error && urlPreview && (
        <p className="text-[10px] text-[#8b7355] font-mono truncate">{urlPreview}</p>
      )}
      {!row._new && isUnlocked && (
        <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
          ⚠ Changing this breaks any customer links to the old slug and booking-form deep links.
        </p>
      )}
    </div>
  );
}

const FIELD_CLS =
  "w-full px-2 py-1.5 rounded border border-[#f5f2ed] focus:border-[#7a2e3f] focus:outline-none focus:ring-1 focus:ring-[#7a2e3f]/20 disabled:bg-[#faf8f5] disabled:opacity-70";
const FIELD_ERR = "border-red-400 focus:border-red-500 focus:ring-red-500/20";

export default function ServicesManager() {
  const [rows, setRows] = useState<DraftService[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [rowErrors, setRowErrors] = useState<RowErrors>({});
  // IDs whose slug has been explicitly unlocked for editing. Existing services
  // default to locked so admins don't break URLs by accident.
  const [unlockedSlugs, setUnlockedSlugs] = useState<Set<number>>(new Set());
  // IDs where the admin has manually edited the slug — stops the title→slug auto-sync.
  const [manuallyEditedSlugs, setManuallyEditedSlugs] = useState<Set<number>>(new Set());
  // Snapshot of last-loaded rows keyed by id — used for the Revert button.
  const originalById = useRef<Map<number, ServiceRow>>(new Map());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services/all");
      if (!res.ok) throw new Error("Failed to load services");
      const data = (await res.json()) as { services: ServiceRow[] };
      const sorted = [...(data.services ?? [])].sort((a, b) => a.sort_order - b.sort_order);
      originalById.current = new Map(sorted.map((s) => [s.id, { ...s }]));
      setRows(sorted.map((s) => ({ ...s })));
      setRowErrors({});
      setUnlockedSlugs(new Set());
      setManuallyEditedSlugs(new Set());
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

  // Auto-dismiss success banner
  useEffect(() => {
    if (!success) return;
    const t = window.setTimeout(() => setSuccess(null), 3500);
    return () => window.clearTimeout(t);
  }, [success]);

  const dirty = useMemo(() => rows.some((r) => r._dirty || r._new), [rows]);

  function updateRow(id: number, patch: Partial<DraftService>) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch, _dirty: !r._new ? true : r._dirty } : r)),
    );
    // Clear any field-level errors on this row as the user types
    setRowErrors((prev) => {
      if (!prev[id]) return prev;
      const { [id]: _dropped, ...rest } = prev;
      void _dropped;
      return rest;
    });
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
      return copy.map((r, i) => ({ ...r, sort_order: (i + 1) * 10, _dirty: !r._new ? true : r._dirty }));
    });
  }

  function addRow() {
    setRows((prev) => [...prev, { ...emptyService(), sort_order: (prev.length + 1) * 10 }]);
  }

  function revertRow(id: number) {
    const original = originalById.current.get(id);
    if (!original) return;
    setRows((prev) => prev.map((r) => (r.id === id ? { ...original, _dirty: false } : r)));
    setRowErrors((prev) => {
      if (!prev[id]) return prev;
      const { [id]: _dropped, ...rest } = prev;
      void _dropped;
      return rest;
    });
    // Relock the slug when reverting.
    setUnlockedSlugs((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setManuallyEditedSlugs((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function unlockSlug(id: number) {
    setUnlockedSlugs((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  function handleSlugChange(id: number, slug: string) {
    updateRow(id, { slug });
    setManuallyEditedSlugs((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  function handleTitleChange(row: DraftService, title: string) {
    const shouldAutoSync = row._new && !manuallyEditedSlugs.has(row.id);
    updateRow(row.id, {
      title,
      ...(shouldAutoSync ? { slug: slugify(title) } : {}),
    });
  }

  async function removeRow(row: DraftService) {
    if (row._new) {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      return;
    }
    const confirmed = window.confirm(`Delete "${row.title}"? It will be hidden from the site.`);
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/services?id=${row.id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.error ?? "Failed to delete service.");
        return;
      }
      await load();
      setSuccess(`Deleted "${row.title}".`);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  function validateAll(): RowErrors {
    const errs: RowErrors = {};
    for (const r of rows) {
      if (!r.title.trim()) errs[r.id] = { ...errs[r.id], title: "Title required" };
      if (!r.slug.trim()) errs[r.id] = { ...errs[r.id], slug: "Slug required" };
    }
    return errs;
  }

  async function save() {
    setError(null);
    setSuccess(null);
    const localErrs = validateAll();
    if (Object.keys(localErrs).length > 0) {
      setRowErrors(localErrs);
      setError("Fix the highlighted fields, then save again.");
      return;
    }

    // Warn on deactivation of previously-active services
    const deactivating = rows.filter(
      (r) => !r._new && !r.is_active && originalById.current.get(r.id)?.is_active,
    );
    if (deactivating.length > 0) {
      const names = deactivating.map((r) => `"${r.title}"`).join(", ");
      const ok = window.confirm(
        `You're deactivating ${deactivating.length} service${deactivating.length === 1 ? "" : "s"}: ${names}. They'll disappear from the public site and the booking form immediately. Continue?`,
      );
      if (!ok) return;
    }

    setSaving(true);
    const newRowErrors: RowErrors = {};
    let created = 0;
    let updated = 0;
    const idReplacements = new Map<number, ServiceRow>();

    // Create new services one at a time so we can recover from partial failure.
    for (const r of rows.filter((r) => r._new)) {
      try {
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
          newRowErrors[r.id] = { server: err.error ?? "Create failed" };
          continue;
        }
        const { service } = (await res.json()) as { service: ServiceRow };
        idReplacements.set(r.id, service);
        created++;
      } catch (e) {
        newRowErrors[r.id] = { server: (e as Error).message };
      }
    }

    // Update existing (batch) — if the server returns an error with an id,
    // we surface it per-row; otherwise as a top-level banner.
    const toUpdate = rows.filter((r) => !r._new && r._dirty);
    let updateFailed = false;
    if (toUpdate.length > 0) {
      try {
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
          updateFailed = true;
          const err = await res.json().catch(() => ({}));
          if (typeof err.id === "number") {
            newRowErrors[err.id] = { server: err.error ?? "Update failed" };
          } else {
            setError(err.error ?? "Some updates failed. Please retry.");
          }
        } else {
          updated = toUpdate.length;
        }
      } catch (e) {
        updateFailed = true;
        setError((e as Error).message);
      }
    }

    // Apply results to local state atomically.
    setRows((prev) =>
      prev.map((r) => {
        const replacement = idReplacements.get(r.id);
        if (replacement) {
          originalById.current.set(replacement.id, replacement);
          return { ...replacement, _dirty: false, _new: false };
        }
        if (!r._new && r._dirty && !updateFailed && !newRowErrors[r.id]) {
          originalById.current.set(r.id, { ...r });
          return { ...r, _dirty: false };
        }
        return r;
      }),
    );

    setRowErrors(newRowErrors);
    const totalFailed = Object.keys(newRowErrors).length;
    if (totalFailed === 0 && !updateFailed) {
      const total = created + updated;
      if (total > 0) {
        setSuccess(`Saved ${total} service${total === 1 ? "" : "s"}.`);
      }
    } else if (totalFailed > 0) {
      setError(
        `${totalFailed} service${totalFailed === 1 ? "" : "s"} failed to save. Fix the highlighted row${totalFailed === 1 ? "" : "s"} and try again.`,
      );
    }

    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#3a322b]">Services & Pricing</h2>
          <p className="text-sm text-[#6b5d4f]">
            Edit titles, prices (in GBP), categories, and order. Drag-handle buttons reorder; saved changes publish immediately.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {dirty && <span className="text-sm text-orange-600 font-medium">Unsaved changes</span>}
          <button
            type="button"
            onClick={addRow}
            disabled={saving}
            className="px-4 py-2 text-sm rounded border border-[#7a2e3f] text-[#7a2e3f] hover:bg-[#7a2e3f] hover:text-white transition-colors disabled:opacity-50"
          >
            + Add service
          </button>
          <button
            type="button"
            disabled={!dirty || saving}
            onClick={save}
            className="px-5 py-2 text-sm rounded bg-[#7a2e3f] text-white font-semibold shadow hover:bg-[#5c1f2c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {error && (
        <div
          className="flex items-start justify-between gap-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm"
          role="alert"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            aria-label="Dismiss"
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}
      {success && (
        <div
          className="flex items-start justify-between gap-4 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded text-sm"
          role="status"
        >
          <span>{success}</span>
          <button
            type="button"
            onClick={() => setSuccess(null)}
            aria-label="Dismiss"
            className="text-emerald-700 hover:text-emerald-900"
          >
            ✕
          </button>
        </div>
      )}

      {loading ? (
        <SkeletonTable />
      ) : rows.length === 0 ? (
        <EmptyState onAdd={addRow} />
      ) : (
        <>
          {/* Mobile card layout */}
          <div className="lg:hidden space-y-3">
            {rows.map((row, idx) => {
              const errs = rowErrors[row.id] ?? {};
              return (
                <div
                  key={row.id}
                  className={`${row._new ? "bg-amber-50/50" : "bg-white"} border ${errs.server ? "border-red-300" : "border-[#f5f2ed]"} rounded-lg p-4 space-y-3`}
                >
                  {errs.server && (
                    <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded px-2 py-1">
                      {errs.server}
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <input
                        value={row.title}
                        disabled={saving}
                        onChange={(e) => handleTitleChange(row, e.target.value)}
                        className={`${FIELD_CLS} text-base font-medium ${errs.title ? FIELD_ERR : ""}`}
                        placeholder="Service title"
                        aria-invalid={errs.title ? "true" : "false"}
                      />
                      {errs.title && <p className="mt-1 text-xs text-red-600">{errs.title}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        disabled={idx === 0 || saving}
                        onClick={() => move(row.id, -1)}
                        className="p-1 rounded text-[#7a2e3f] hover:bg-[#faf8f5] disabled:opacity-30"
                        aria-label="Move up"
                      >
                        <ChevronUp />
                      </button>
                      <button
                        type="button"
                        disabled={idx === rows.length - 1 || saving}
                        onClick={() => move(row.id, 1)}
                        className="p-1 rounded text-[#7a2e3f] hover:bg-[#faf8f5] disabled:opacity-30"
                        aria-label="Move down"
                      >
                        <ChevronDown />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#6b5d4f] mb-1">Category</label>
                      <select
                        value={row.category}
                        disabled={saving}
                        onChange={(e) => updateRow(row.id, { category: e.target.value })}
                        aria-label="Category"
                        className={`${FIELD_CLS} text-sm`}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#6b5d4f] mb-1">From (£)</label>
                      <input
                        type="number"
                        min={0}
                        step={5}
                        value={row.price_from ?? ""}
                        disabled={saving}
                        onChange={(e) => {
                          const v = e.target.value;
                          updateRow(row.id, { price_from: v === "" ? null : Number(v) });
                        }}
                        className={`${FIELD_CLS} text-sm`}
                        placeholder="—"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#6b5d4f] mb-1">
                      Slug <span className="normal-case tracking-normal text-[#8b7355]">(URL identifier)</span>
                    </label>
                    <SlugField
                      row={row}
                      error={errs.slug}
                      isUnlocked={unlockedSlugs.has(row.id)}
                      saving={saving}
                      onChange={(slug) => handleSlugChange(row.id, slug)}
                      onUnlock={() => unlockSlug(row.id)}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#6b5d4f] mb-1">Description</label>
                    <textarea
                      value={row.description ?? ""}
                      disabled={saving}
                      onChange={(e) => updateRow(row.id, { description: e.target.value })}
                      rows={3}
                      className={`${FIELD_CLS} text-sm`}
                      placeholder="Short description shown on the service card."
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#f5f2ed]">
                    <label className="flex items-center gap-2 text-sm text-[#5c5048]">
                      <input
                        type="checkbox"
                        checked={row.is_active}
                        disabled={saving}
                        onChange={(e) => updateRow(row.id, { is_active: e.target.checked })}
                      />
                      Active on site
                    </label>
                    <div className="flex items-center gap-2">
                      {!row._new && row._dirty && (
                        <button
                          type="button"
                          onClick={() => revertRow(row.id)}
                          disabled={saving}
                          className="inline-flex items-center gap-1 text-xs text-[#6b5d4f] hover:text-[#3a322b] px-2 py-1 rounded"
                        >
                          <UndoIcon /> Revert
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeRow(row)}
                        disabled={saving}
                        aria-label={row._new ? "Discard new service" : "Delete service"}
                        className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded"
                      >
                        {row._new ? "Discard" : <><TrashIcon /> Delete</>}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop table layout */}
          <div className="hidden lg:block overflow-x-auto bg-white border border-[#f5f2ed] rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-[#faf8f5] text-[#6b5d4f] text-left">
                <tr>
                  <th className="px-3 py-2 w-12">Order</th>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Slug</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2 w-24">From £</th>
                  <th className="px-3 py-2">Description</th>
                  <th className="px-3 py-2 w-20 text-center">Active</th>
                  <th className="px-3 py-2 w-36"><span className="sr-only">Row actions</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => {
                  const errs = rowErrors[row.id] ?? {};
                  return (
                    <Fragment key={row.id}>
                      <tr
                        className={`${row._new ? "bg-amber-50/50" : ""} border-t border-[#f5f2ed] align-top`}
                      >
                        <td className="px-3 py-2">
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              disabled={idx === 0 || saving}
                              onClick={() => move(row.id, -1)}
                              className="p-1 rounded text-[#7a2e3f] hover:bg-[#faf8f5] disabled:opacity-30"
                              aria-label="Move up"
                            >
                              <ChevronUp />
                            </button>
                            <button
                              type="button"
                              disabled={idx === rows.length - 1 || saving}
                              onClick={() => move(row.id, 1)}
                              className="p-1 rounded text-[#7a2e3f] hover:bg-[#faf8f5] disabled:opacity-30"
                              aria-label="Move down"
                            >
                              <ChevronDown />
                            </button>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            value={row.title}
                            disabled={saving}
                            onChange={(e) => handleTitleChange(row, e.target.value)}
                            className={`${FIELD_CLS} ${errs.title ? FIELD_ERR : ""}`}
                            placeholder="Service title"
                            aria-invalid={errs.title ? "true" : "false"}
                          />
                          {errs.title && <p className="mt-1 text-xs text-red-600">{errs.title}</p>}
                        </td>
                        <td className="px-3 py-2 max-w-[220px]">
                          <SlugField
                            row={row}
                            error={errs.slug}
                            isUnlocked={unlockedSlugs.has(row.id)}
                            saving={saving}
                            onChange={(slug) => handleSlugChange(row.id, slug)}
                            onUnlock={() => unlockSlug(row.id)}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <select
                            value={row.category}
                            disabled={saving}
                            onChange={(e) => updateRow(row.id, { category: e.target.value })}
                            aria-label="Category"
                            className={FIELD_CLS}
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
                            disabled={saving}
                            onChange={(e) => {
                              const v = e.target.value;
                              updateRow(row.id, { price_from: v === "" ? null : Number(v) });
                            }}
                            className={FIELD_CLS}
                            placeholder="—"
                          />
                        </td>
                        <td className="px-3 py-2 max-w-[320px]">
                          <textarea
                            value={row.description ?? ""}
                            disabled={saving}
                            onChange={(e) => updateRow(row.id, { description: e.target.value })}
                            rows={4}
                            className={`${FIELD_CLS} text-xs`}
                            placeholder="Short description shown on the service card."
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={row.is_active}
                            disabled={saving}
                            onChange={(e) => updateRow(row.id, { is_active: e.target.checked })}
                            aria-label="Active on site"
                          />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {!row._new && row._dirty && (
                              <button
                                type="button"
                                onClick={() => revertRow(row.id)}
                                disabled={saving}
                                className="inline-flex items-center gap-1 text-xs text-[#6b5d4f] hover:text-[#3a322b] px-2 py-1 rounded"
                                title="Revert to saved"
                              >
                                <UndoIcon />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeRow(row)}
                              disabled={saving}
                              aria-label={row._new ? "Discard new service" : "Delete service"}
                              title={row._new ? "Discard" : "Delete"}
                              className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-50"
                            >
                              {row._new ? <span className="text-xs">Discard</span> : <TrashIcon />}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {errs.server && (
                        <tr className="bg-red-50">
                          <td colSpan={8} className="px-3 py-2 text-xs text-red-700 border-t border-red-100">
                            {errs.server}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="bg-white border border-dashed border-[#d4b896] rounded-lg py-16 text-center">
      <svg className="w-12 h-12 mx-auto text-[#d4b896] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h8m-8 6h16" />
      </svg>
      <h3 className="font-serif text-xl text-[#3a322b] mb-2">No services yet</h3>
      <p className="text-sm text-[#6b5d4f] mb-6 max-w-sm mx-auto">
        Add your first service to make it available on the public site and in the booking form.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="px-5 py-2 text-sm rounded bg-[#7a2e3f] text-white font-semibold shadow hover:bg-[#5c1f2c] transition-colors"
      >
        + Add first service
      </button>
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="bg-white border border-[#f5f2ed] rounded-lg p-6 space-y-3" aria-label="Loading services" aria-busy="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 animate-pulse">
          <div className="w-10 h-8 bg-[#f5f2ed] rounded" />
          <div className="flex-1 h-8 bg-[#f5f2ed] rounded" />
          <div className="w-24 h-8 bg-[#f5f2ed] rounded" />
          <div className="w-32 h-8 bg-[#f5f2ed] rounded" />
        </div>
      ))}
    </div>
  );
}
