export const PORTFOLIO_CATEGORIES = [
  "Pavilhões Industriais",
  "Lojas Comerciais",
  "Infraestruturas",
  "Obras Públicas",
  "Construção Habitacional",
] as const;

export type PortfolioCategoryName = (typeof PORTFOLIO_CATEGORIES)[number];

// Mapping between legacy slugs (used by static portfolio data) and full labels
// stored in the database.
import type { PortfolioCategory as LegacySlug } from "./portfolio";

export const slugToCategoryName: Record<LegacySlug, PortfolioCategoryName> = {
  pavilhoes: "Pavilhões Industriais",
  lojas: "Lojas Comerciais",
  infraestruturas: "Infraestruturas",
  "obras-publicas": "Obras Públicas",
  habitacional: "Construção Habitacional",
};
