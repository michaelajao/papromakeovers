"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ServiceRow, TestimonialRow } from "@/types/service";

type DraftTestimonial = TestimonialRow & { _dirty?: boolean; _new?: boolean };
type RowErrors = Record<number, { client_name?: string; quote?: string; server?: string }>;

function emptyTestimonial(): DraftTestimonial {
  return {
    id: -Date.now(),
    client_name: "",
    quote: "",
    rating: 5,
    service_slug: null,
    is_featured: true,
    sort_order: 999,
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

function StarFilled({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.964a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.374 2.45a1 1 0 00-.363 1.118l1.287 3.964c.3.922-.755 1.688-1.54 1.118l-3.374-2.45a1 1 0 00-1.175 0l-3.374 2.45c-.784.57-1.838-.196-1.539-1.118l1.287-3.964a1 1 0 00-.363-1.118l-3.374-2.45c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.95-.69l1.286-3.964z" />
    </svg>
  );
}

const FIELD_CLS =
  "w-full px-2 py-1.5 rounded border border-[#f5f2ed] focus:border-[#7a2e3f] focus:outline-none focus:ring-1 focus:ring-[#7a2e3f]/20 disabled:bg-[#faf8f5] disabled:opacity-70";
const FIELD_ERR = "border-red-400 focus:border-red-500 focus:ring-red-500/20";

function RatingInput({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className="inline-flex items-center gap-1"
      role="radiogroup"
      aria-label="Rating out of 5 stars"
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          onChange(Math.min(5, value + 1));
        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          onChange(Math.max(1, value - 1));
        }
      }}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            disabled={disabled}
            role="radio"
            aria-checked={n === value ? "true" : "false"}
            aria-label={`${n} out of 5 stars`}
            className={`p-0.5 rounded focus-visible:ring-2 focus-visible:ring-[#7a2e3f] focus-visible:ring-offset-1 transition-colors ${
              disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <StarFilled className={`w-5 h-5 ${filled ? "text-[#7a2e3f]" : "text-[#e5ddd1]"}`} />
          </button>
        );
      })}
    </div>
  );
}

export default function TestimonialsManager() {
  const [rows, setRows] = useState<DraftTestimonial[]>([]);
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [rowErrors, setRowErrors] = useState<RowErrors>({});
  const originalById = useRef<Map<number, TestimonialRow>>(new Map());

  const load = useCallback(async () => {
    setLoading(true);
    const [testRes, svcRes] = await Promise.all([
      fetch("/api/testimonials/all"),
      fetch("/api/services"),
    ]);

    // Services dropdown populates regardless of whether testimonials succeeded.
    if (svcRes.ok) {
      try {
        const svcData = (await svcRes.json()) as { services: ServiceRow[] };
        setServices(svcData.services ?? []);
      } catch {
        // ignore services parse errors
      }
    }

    if (!testRes.ok) {
      setError("Failed to load reviews");
      setLoading(false);
      return;
    }
    try {
      const testData = (await testRes.json()) as { testimonials: TestimonialRow[] };
      const sorted = [...(testData.testimonials ?? [])].sort((a, b) => a.sort_order - b.sort_order);
      originalById.current = new Map(sorted.map((s) => [s.id, { ...s }]));
      setRows(sorted.map((s) => ({ ...s })));
      setRowErrors({});
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

  useEffect(() => {
    if (!success) return;
    const t = window.setTimeout(() => setSuccess(null), 3500);
    return () => window.clearTimeout(t);
  }, [success]);

  const dirty = useMemo(() => rows.some((r) => r._dirty || r._new), [rows]);

  function updateRow(id: number, patch: Partial<DraftTestimonial>) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch, _dirty: !r._new ? true : r._dirty } : r)),
    );
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
    setRows((prev) => [...prev, { ...emptyTestimonial(), sort_order: (prev.length + 1) * 10 }]);
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
  }

  async function removeRow(row: DraftTestimonial) {
    if (row._new) {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      return;
    }
    const confirmed = window.confirm(`Delete review from "${row.client_name}"?`);
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/testimonials?id=${row.id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.error ?? "Failed to delete review.");
        return;
      }
      await load();
      setSuccess(`Deleted review from "${row.client_name}".`);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  function validateAll(): RowErrors {
    const errs: RowErrors = {};
    for (const r of rows) {
      if (!r.client_name.trim()) errs[r.id] = { ...errs[r.id], client_name: "Name required" };
      if (!r.quote.trim()) errs[r.id] = { ...errs[r.id], quote: "Quote required" };
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

    setSaving(true);
    const newRowErrors: RowErrors = {};
    let created = 0;
    let updated = 0;
    const idReplacements = new Map<number, TestimonialRow>();

    for (const r of rows.filter((r) => r._new)) {
      try {
        const res = await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_name: r.client_name,
            quote: r.quote,
            rating: r.rating,
            service_slug: r.service_slug ?? null,
            is_featured: r.is_featured,
            sort_order: r.sort_order,
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          newRowErrors[r.id] = { server: err.error ?? "Create failed" };
          continue;
        }
        const { testimonial } = (await res.json()) as { testimonial: TestimonialRow };
        idReplacements.set(r.id, testimonial);
        created++;
      } catch (e) {
        newRowErrors[r.id] = { server: (e as Error).message };
      }
    }

    const toUpdate = rows.filter((r) => !r._new && r._dirty);
    let updateFailed = false;
    if (toUpdate.length > 0) {
      try {
        const res = await fetch("/api/testimonials", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            updates: toUpdate.map((r) => ({
              id: r.id,
              client_name: r.client_name,
              quote: r.quote,
              rating: r.rating,
              service_slug: r.service_slug ?? null,
              is_featured: r.is_featured,
              sort_order: r.sort_order,
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
      if (total > 0) setSuccess(`Saved ${total} review${total === 1 ? "" : "s"}.`);
    } else if (totalFailed > 0) {
      setError(
        `${totalFailed} review${totalFailed === 1 ? "" : "s"} failed to save. Fix the highlighted row${totalFailed === 1 ? "" : "s"} and try again.`,
      );
    }

    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#3a322b]">Reviews</h2>
          <p className="text-sm text-[#6b5d4f]">
            Manage the testimonials shown in the &ldquo;Kind Words&rdquo; section on the home page.
            Toggle <strong>Featured</strong> off to hide a review without deleting it.
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
            + Add review
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
        <div className="flex items-start justify-between gap-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} aria-label="Dismiss" className="text-red-500 hover:text-red-700">✕</button>
        </div>
      )}
      {success && (
        <div className="flex items-start justify-between gap-4 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded text-sm" role="status">
          <span>{success}</span>
          <button type="button" onClick={() => setSuccess(null)} aria-label="Dismiss" className="text-emerald-700 hover:text-emerald-900">✕</button>
        </div>
      )}

      {loading ? (
        <SkeletonList />
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
                      <label className="block text-[11px] uppercase tracking-wider text-[#6b5d4f] mb-1">Client name</label>
                      <input
                        value={row.client_name}
                        disabled={saving}
                        onChange={(e) => updateRow(row.id, { client_name: e.target.value })}
                        className={`${FIELD_CLS} text-base font-medium ${errs.client_name ? FIELD_ERR : ""}`}
                        placeholder="e.g. Adaeze O."
                        aria-invalid={errs.client_name ? "true" : "false"}
                      />
                      {errs.client_name && <p className="mt-1 text-xs text-red-600">{errs.client_name}</p>}
                    </div>
                    <div className="flex flex-col gap-1 pt-5">
                      <button type="button" disabled={idx === 0 || saving} onClick={() => move(row.id, -1)} className="p-1 rounded text-[#7a2e3f] hover:bg-[#faf8f5] disabled:opacity-30" aria-label="Move up">
                        <ChevronUp />
                      </button>
                      <button type="button" disabled={idx === rows.length - 1 || saving} onClick={() => move(row.id, 1)} className="p-1 rounded text-[#7a2e3f] hover:bg-[#faf8f5] disabled:opacity-30" aria-label="Move down">
                        <ChevronDown />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#6b5d4f] mb-1">Quote</label>
                    <textarea
                      value={row.quote}
                      disabled={saving}
                      onChange={(e) => updateRow(row.id, { quote: e.target.value })}
                      rows={3}
                      className={`${FIELD_CLS} text-sm ${errs.quote ? FIELD_ERR : ""}`}
                      placeholder="What the client said about the experience."
                      aria-invalid={errs.quote ? "true" : "false"}
                    />
                    {errs.quote && <p className="mt-1 text-xs text-red-600">{errs.quote}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#6b5d4f] mb-1">Rating</label>
                      <RatingInput value={row.rating} onChange={(n) => updateRow(row.id, { rating: n })} disabled={saving} />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#6b5d4f] mb-1">Service (optional)</label>
                      <select
                        value={row.service_slug ?? ""}
                        disabled={saving}
                        onChange={(e) => updateRow(row.id, { service_slug: e.target.value || null })}
                        aria-label="Linked service"
                        className={`${FIELD_CLS} text-sm`}
                      >
                        <option value="">— None —</option>
                        {services.map((s) => (
                          <option key={s.slug} value={s.slug}>{s.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#f5f2ed]">
                    <label className="flex items-center gap-2 text-sm text-[#5c5048]">
                      <input
                        type="checkbox"
                        checked={row.is_featured}
                        disabled={saving}
                        onChange={(e) => updateRow(row.id, { is_featured: e.target.checked })}
                      />
                      Featured on home
                    </label>
                    <div className="flex items-center gap-2">
                      {!row._new && row._dirty && (
                        <button type="button" onClick={() => revertRow(row.id)} disabled={saving} className="inline-flex items-center gap-1 text-xs text-[#6b5d4f] hover:text-[#3a322b] px-2 py-1 rounded">
                          <UndoIcon /> Revert
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeRow(row)}
                        disabled={saving}
                        aria-label={row._new ? "Discard new review" : "Delete review"}
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
                  <th className="px-3 py-2 w-44">Client name</th>
                  <th className="px-3 py-2">Quote</th>
                  <th className="px-3 py-2 w-36">Rating</th>
                  <th className="px-3 py-2 w-40">Service</th>
                  <th className="px-3 py-2 w-24 text-center">Featured</th>
                  <th className="px-3 py-2 w-32"><span className="sr-only">Row actions</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => {
                  const errs = rowErrors[row.id] ?? {};
                  return (
                    <Fragment key={row.id}>
                      <tr className={`${row._new ? "bg-amber-50/50" : ""} border-t border-[#f5f2ed] align-top`}>
                        <td className="px-3 py-2">
                          <div className="flex flex-col gap-1">
                            <button type="button" disabled={idx === 0 || saving} onClick={() => move(row.id, -1)} className="p-1 rounded text-[#7a2e3f] hover:bg-[#faf8f5] disabled:opacity-30" aria-label="Move up">
                              <ChevronUp />
                            </button>
                            <button type="button" disabled={idx === rows.length - 1 || saving} onClick={() => move(row.id, 1)} className="p-1 rounded text-[#7a2e3f] hover:bg-[#faf8f5] disabled:opacity-30" aria-label="Move down">
                              <ChevronDown />
                            </button>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            value={row.client_name}
                            disabled={saving}
                            onChange={(e) => updateRow(row.id, { client_name: e.target.value })}
                            className={`${FIELD_CLS} ${errs.client_name ? FIELD_ERR : ""}`}
                            placeholder="e.g. Adaeze O."
                            aria-invalid={errs.client_name ? "true" : "false"}
                          />
                          {errs.client_name && <p className="mt-1 text-xs text-red-600">{errs.client_name}</p>}
                        </td>
                        <td className="px-3 py-2">
                          <textarea
                            value={row.quote}
                            disabled={saving}
                            onChange={(e) => updateRow(row.id, { quote: e.target.value })}
                            rows={4}
                            className={`${FIELD_CLS} text-xs ${errs.quote ? FIELD_ERR : ""}`}
                            placeholder="What the client said about the experience."
                            aria-invalid={errs.quote ? "true" : "false"}
                          />
                          {errs.quote && <p className="mt-1 text-xs text-red-600">{errs.quote}</p>}
                        </td>
                        <td className="px-3 py-2">
                          <RatingInput value={row.rating} onChange={(n) => updateRow(row.id, { rating: n })} disabled={saving} />
                        </td>
                        <td className="px-3 py-2">
                          <select
                            value={row.service_slug ?? ""}
                            disabled={saving}
                            onChange={(e) => updateRow(row.id, { service_slug: e.target.value || null })}
                            aria-label="Linked service"
                            className={FIELD_CLS}
                          >
                            <option value="">— None —</option>
                            {services.map((s) => (
                              <option key={s.slug} value={s.slug}>{s.title}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={row.is_featured}
                            disabled={saving}
                            onChange={(e) => updateRow(row.id, { is_featured: e.target.checked })}
                            aria-label="Featured on home"
                          />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {!row._new && row._dirty && (
                              <button type="button" onClick={() => revertRow(row.id)} disabled={saving} className="inline-flex items-center gap-1 text-xs text-[#6b5d4f] hover:text-[#3a322b] px-2 py-1 rounded" title="Revert to saved">
                                <UndoIcon />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeRow(row)}
                              disabled={saving}
                              aria-label={row._new ? "Discard new review" : "Delete review"}
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
                          <td colSpan={7} className="px-3 py-2 text-xs text-red-700 border-t border-red-100">
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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h6m-4 8l-4-4h-1a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-4 4z" />
      </svg>
      <h3 className="font-serif text-xl text-[#3a322b] mb-2">No reviews yet</h3>
      <p className="text-sm text-[#6b5d4f] mb-6 max-w-sm mx-auto">
        Add your first client review to show it in the &ldquo;Kind Words&rdquo; section on the home page.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="px-5 py-2 text-sm rounded bg-[#7a2e3f] text-white font-semibold shadow hover:bg-[#5c1f2c] transition-colors"
      >
        + Add first review
      </button>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="bg-white border border-[#f5f2ed] rounded-lg p-6 space-y-3" aria-label="Loading reviews" aria-busy="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2 animate-pulse">
          <div className="h-4 bg-[#f5f2ed] rounded w-1/4" />
          <div className="h-12 bg-[#f5f2ed] rounded" />
        </div>
      ))}
    </div>
  );
}
