import type { Product as BackendProduct } from "@/app/types/product";
import type { Product as UIProduct, Category as UICategory } from "@/data/products";

const STATIC_CATEGORIES = [
  "Tote",
  "Crossbody",
  "Clutch",
  "Backpack",
  "Shoulder",
  "Top Handle",
] as const;

function toUICategory(name: string | undefined): UICategory {
  return (STATIC_CATEGORIES.find((c) => c === name) ?? "Tote") as UICategory;
}

export function toUIProduct(p: BackendProduct): UIProduct {
  const colors = (p.variants ?? [])
    .map((v) => v.color)
    .filter((c): c is NonNullable<typeof c> => !!c)
    .reduce<{ name: string; hex: string }[]>((acc, c) => {
      if (!acc.some((x) => x.name === c.name)) {
        acc.push({ name: c.name, hex: c.hexCode });
      }
      return acc;
    }, []);

  return {
    id: p._id,
    slug: p.slug,
    name: p.name,
    category: toUICategory(typeof p.category === 'string' ? p.category : p.category?.name),
    price: p.priceRange?.minVariantPrice ?? 0,
    image: p.images?.[0] ?? "",
    colors,
    material: "",
    dimensions: "",
    description: p.description ?? "",
    rating: p.averageRating ?? 0,
    reviews: p.reviews?.length ?? 0,
  };
}
