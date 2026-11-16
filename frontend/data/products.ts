export type Category = "Tote" | "Crossbody" | "Clutch" | "Backpack" | "Shoulder" | "Top Handle";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  salePrice?: number;
  image: string;
  colors: { name: string; hex: string }[];
  material: string;
  dimensions: string;
  description: string;
  isNew?: boolean;
  isBestseller?: boolean;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: "1",
    slug: "celine-tote-beige",
    name: "Céline Structured Tote",
    category: "Tote",
    price: 480,
    image: "/images/bag-tote.jpg",
    colors: [
      { name: "Beige", hex: "#d6b89a" },
      { name: "Cream", hex: "#f3e8d8" },
      { name: "Camel", hex: "#b88758" },
    ],
    material: "Full-grain Italian leather",
    dimensions: "32 × 28 × 14 cm",
    description:
      "An everyday icon. Hand-finished in supple Italian leather, the Céline Tote balances structured silhouette with effortless wearability — designed to carry your day with quiet confidence.",
    isBestseller: true,
    rating: 4.9,
    reviews: 218,
  },
  {
    id: "2",
    slug: "amelie-crossbody-blush",
    name: "Amélie Chain Crossbody",
    category: "Crossbody",
    price: 320,
    salePrice: 245,
    image: "/images/bag-crossbody.jpg",
    colors: [
      { name: "Blush", hex: "#f4b5b0" },
      { name: "Ivory", hex: "#f3e8d8" },
      { name: "Noir", hex: "#1a1a1a" },
    ],
    material: "Smooth nappa leather",
    dimensions: "20 × 14 × 6 cm",
    description:
      "A romantic essential with delicate gold chain and envelope flap. Perfect for transitioning from afternoon brunch to evening cocktails.",
    isNew: true,
    isBestseller: true,
    rating: 4.8,
    reviews: 142,
  },
  {
    id: "3",
    slug: "soiree-satin-clutch",
    name: "Soirée Satin Clutch",
    category: "Clutch",
    price: 220,
    image: "/images/bag-clutch.jpg",
    colors: [
      { name: "Champagne", hex: "#ead9b8" },
      { name: "Rose", hex: "#e8b8b3" },
    ],
    material: "Lustrous silk-satin",
    dimensions: "26 × 14 × 4 cm",
    description:
      "An evening companion sculpted from lustrous satin and finished with a polished gold kiss-lock. Holds the essentials with understated drama.",
    isNew: true,
    rating: 4.7,
    reviews: 86,
  },
  {
    id: "4",
    slug: "joli-mini-backpack",
    name: "Joli Mini Backpack",
    category: "Backpack",
    price: 360,
    image: "/images/bag-backpack.jpg",
    colors: [
      { name: "Camel", hex: "#b88758" },
      { name: "Beige", hex: "#d6b89a" },
    ],
    material: "Pebbled calfskin",
    dimensions: "22 × 24 × 11 cm",
    description:
      "Hands-free luxury. The Joli pairs a feminine silhouette with practical compartments and signature gold zip pulls.",
    rating: 4.8,
    reviews: 174,
  },
  {
    id: "5",
    slug: "lior-quilted-shoulder",
    name: "Lior Quilted Shoulder",
    category: "Shoulder",
    price: 540,
    salePrice: 430,
    image: "/images/bag-shoulder.jpg",
    colors: [
      { name: "Cream", hex: "#f3e8d8" },
      { name: "Noir", hex: "#1a1a1a" },
    ],
    material: "Quilted lambskin",
    dimensions: "25 × 17 × 8 cm",
    description:
      "Heirloom quilting and a slim chain handle make Lior a timeless statement — the kind of bag passed between generations.",
    isBestseller: true,
    rating: 5.0,
    reviews: 309,
  },
  {
    id: "6",
    slug: "milano-top-handle",
    name: "Milano Top Handle",
    category: "Top Handle",
    price: 620,
    image: "/images/bag-tophandle.jpg",
    colors: [
      { name: "Cognac", hex: "#8b5a2b" },
      { name: "Espresso", hex: "#3d2a1d" },
    ],
    material: "Saffiano leather",
    dimensions: "28 × 22 × 13 cm",
    description:
      "An architectural silhouette with polished gold turn-lock. Tailored proportions for the modern professional.",
    isNew: true,
    rating: 4.9,
    reviews: 98,
  },
  {
    id: "7",
    slug: "petale-bucket",
    name: "Pétale Bucket Bag",
    category: "Shoulder",
    price: 290,
    image: "/images/bag-bucket.jpg",
    colors: [
      { name: "Blush", hex: "#f4b5b0" },
      { name: "Sand", hex: "#d6b89a" },
    ],
    material: "Soft grain leather",
    dimensions: "22 × 26 × 18 cm",
    description:
      "A relaxed silhouette with drawstring closure and elegant gold tips. Soft, romantic, endlessly versatile.",
    rating: 4.6,
    reviews: 67,
  },
  {
    id: "8",
    slug: "cara-hobo",
    name: "Cara Slouchy Hobo",
    category: "Shoulder",
    price: 410,
    image: "/images/bag-hobo.jpg",
    colors: [
      { name: "Cognac", hex: "#8b5a2b" },
      { name: "Camel", hex: "#b88758" },
    ],
    material: "Vegetable-tanned leather",
    dimensions: "38 × 32 × 12 cm",
    description:
      "Effortless slouch meets refined craftsmanship. The Cara molds beautifully with wear — your perfect everyday companion.",
    rating: 4.8,
    reviews: 121,
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const getRelated = (id: string, category: Category) =>
  products.filter((p) => p.id !== id && p.category === category).slice(0, 4);
