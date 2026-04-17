export type ServiceRow = {
  id: number;
  slug: string;
  title: string;
  category: string;
  description: string | null;
  features: string[];
  price_from: number | null;
  sort_order: number;
  is_active: boolean;
};

export type ServiceInput = {
  slug: string;
  title: string;
  category: string;
  description?: string | null;
  features?: string[];
  price_from?: number | null;
  sort_order?: number;
  is_active?: boolean;
};

export type ServicePatch = Partial<ServiceInput> & { id: number };

export type TestimonialRow = {
  id: number;
  client_name: string;
  quote: string;
  rating: number;
  service_slug: string | null;
  is_featured: boolean;
  sort_order: number;
};
