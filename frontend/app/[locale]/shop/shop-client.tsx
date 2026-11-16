"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { ProductCard } from "@/components/product/product-card";
import { products, type Category } from "@/data/products";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories: Category[] = [
  "Tote",
  "Crossbody",
  "Clutch",
  "Backpack",
  "Shoulder",
  "Top Handle",
];

export function ShopClient() {
  const params = useSearchParams();
  const router = useRouter();
  const initialCat = params.get("category") as Category | null;
  const q = params.get("q")?.toLowerCase() ?? "";

  const [activeCats, setActiveCats] = useState<Category[]>(initialCat ? [initialCat] : []);
  const [price, setPrice] = useState<[number, number]>([0, 800]);
  const [sort, setSort] = useState("popularity");

  const toggleCat = (c: Category) =>
    setActiveCats((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const effectivePrice = p.salePrice ?? p.price;
      const inCat = activeCats.length === 0 || activeCats.includes(p.category);
      const inPrice = effectivePrice >= price[0] && effectivePrice <= price[1];
      const inQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q);
      return inCat && inPrice && inQuery;
    });
    switch (sort) {
      case "newest":
        list = [...list].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
        break;
      case "priceAsc":
        list = [...list].sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
        break;
      case "priceDesc":
        list = [...list].sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
        break;
      default:
        list = [...list].sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [activeCats, price, sort, q]);

  return (
    <>
      <section className="border-b border-border gradient-soft">
        <div className="container py-16 text-center">
          <p className="text-xs tracking-luxe uppercase text-muted-foreground">The collection</p>
          <h1 className="mt-3 font-serif text-5xl md:text-6xl">Shop All Bags</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Hand-finished pieces designed to be carried season after season.
          </p>
          {q && (
            <p className="mt-4 text-sm">
              Showing results for <span className="italic">&ldquo;{q}&rdquo;</span>
            </p>
          )}
        </div>
      </section>

      <section className="container py-12">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-10">
            <div>
              <h3 className="text-xs tracking-luxe uppercase text-foreground">Category</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {categories.map((c) => (
                  <li key={c}>
                    <label className="flex cursor-pointer items-center gap-3 text-muted-foreground hover:text-foreground transition-smooth">
                      <input
                        type="checkbox"
                        checked={activeCats.includes(c)}
                        onChange={() => toggleCat(c)}
                        className="h-4 w-4 accent-gold"
                      />
                      {c}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs tracking-luxe uppercase text-foreground">Price</h3>
              <div className="mt-6 px-1">
                <Slider
                  min={0}
                  max={800}
                  step={20}
                  value={price}
                  onValueChange={(v) => setPrice([v[0], v[1]] as [number, number])}
                />
                <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                  <span>${price[0]}</span>
                  <span>${price[1]}+</span>
                </div>
              </div>
            </div>

            <Button
              variant="ghostLuxe"
              size="sm"
              onClick={() => {
                setActiveCats([]);
                setPrice([0, 800]);
                router.replace("/shop");
              }}
              className="px-0"
            >
              Clear filters
            </Button>
          </aside>

          <div>
            <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
              <p className="text-sm text-muted-foreground">{filtered.length} pieces</p>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[200px] rounded-none border-0 border-b border-transparent text-xs tracking-luxe uppercase focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="priceAsc">Price: Low to High</SelectItem>
                  <SelectItem value="priceDesc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filtered.length === 0 ? (
              <p className="py-20 text-center text-muted-foreground">
                No bags match your filters.
              </p>
            ) : (
              <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
