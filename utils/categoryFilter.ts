import type { Product } from '@/data/products';

/** Matches the actual categories used in products.ts */
export type SpecCategory = 'All' | 'Tops' | 'Bottoms' | 'Shoes' | 'Outerwear';

export const SPEC_FILTERS: SpecCategory[] = ['All', 'Tops', 'Bottoms', 'Shoes', 'Outerwear'];

export function productMatchesSpecCategory(p: Product, filter: SpecCategory): boolean {
  if (filter === 'All') return true;
  return p.category === filter;
}
