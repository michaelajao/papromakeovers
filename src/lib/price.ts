const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export function formatPriceFrom(price: number | null | undefined): string {
  if (price == null || Number.isNaN(price)) return "";
  return `From ${gbp.format(Number(price))}`;
}

export function formatPrice(price: number | null | undefined): string {
  if (price == null || Number.isNaN(price)) return "";
  return gbp.format(Number(price));
}
