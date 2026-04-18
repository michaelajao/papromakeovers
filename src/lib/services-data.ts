import { createClient } from "@/utils/supabase/server";
import type { ServiceRow, TestimonialRow } from "@/types/service";
import { SEED_SERVICES } from "./services-seed";

export async function getActiveServices(): Promise<ServiceRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services")
      .select("id, slug, title, category, description, features, price_from, sort_order, is_active")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[services-data] No active services in DB — rendering seed data. Visit /admin to add services.",
        );
      }
      return seedFallback();
    }
    return data as ServiceRow[];
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[services-data] Supabase error, falling back to seed:", err);
    }
    return seedFallback();
  }
}

export async function getFeaturedTestimonials(): Promise<TestimonialRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, client_name, quote, rating, service_slug, is_featured, sort_order")
      .eq("is_featured", true)
      .order("sort_order", { ascending: true });
    if (error) return [];
    return (data ?? []) as TestimonialRow[];
  } catch {
    return [];
  }
}

export function groupByCategory(services: ServiceRow[]): Map<string, ServiceRow[]> {
  const map = new Map<string, ServiceRow[]>();
  for (const s of services) {
    const key = s.category;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(s);
  }
  return map;
}

function seedFallback(): ServiceRow[] {
  return SEED_SERVICES.map((s, idx) => ({
    id: idx + 1,
    slug: s.slug,
    title: s.title,
    category: s.category,
    description: s.description,
    features: s.features ?? [],
    price_from: s.price_from,
    sort_order: s.sort_order,
    is_active: true,
  }));
}
