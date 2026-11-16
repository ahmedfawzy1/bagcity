import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Category from "../models/category.model.js";
import Color from "../models/color.model.js";
import Product from "../models/product.model.js";
import Review from "../models/review.model.js";

dotenv.config();

const categoriesSeed = [
  { name: "Tote", slug: "tote", description: "Structured everyday totes." },
  { name: "Crossbody", slug: "crossbody", description: "Hands-free chain and strap crossbodies." },
  { name: "Clutch", slug: "clutch", description: "Evening clutches in satin and leather." },
  { name: "Backpack", slug: "backpack", description: "Mini and full-size backpacks." },
  { name: "Shoulder", slug: "shoulder", description: "Shoulder bags, hobos, and bucket silhouettes." },
  { name: "Top Handle", slug: "top-handle", description: "Architectural top-handle bags." },
];

const colorsSeed = [
  { name: "Beige", hexCode: "#d6b89a" },
  { name: "Cream", hexCode: "#f3e8d8" },
  { name: "Camel", hexCode: "#b88758" },
  { name: "Blush", hexCode: "#f4b5b0" },
  { name: "Ivory", hexCode: "#f5ebd9" },
  { name: "Noir", hexCode: "#1a1a1a" },
  { name: "Champagne", hexCode: "#ead9b8" },
  { name: "Rose", hexCode: "#e8b8b3" },
  { name: "Cognac", hexCode: "#8b5a2b" },
  { name: "Espresso", hexCode: "#3d2a1d" },
  { name: "Sand", hexCode: "#d4b594" },
];

const productsSeed = [
  {
    slug: "celine-tote-beige",
    name: "Céline Structured Tote",
    categoryName: "Tote",
    price: 480,
    image: "/images/bag-tote.jpg",
    colorNames: ["Beige", "Cream", "Camel"],
    description:
      "An everyday icon. Hand-finished in supple Italian leather, the Céline Tote balances structured silhouette with effortless wearability — designed to carry your day with quiet confidence.",
    averageRating: 4.9,
  },
  {
    slug: "amelie-crossbody-blush",
    name: "Amélie Chain Crossbody",
    categoryName: "Crossbody",
    price: 245,
    image: "/images/bag-crossbody.jpg",
    colorNames: ["Blush", "Ivory", "Noir"],
    description:
      "A romantic essential with delicate gold chain and envelope flap. Perfect for transitioning from afternoon brunch to evening cocktails.",
    averageRating: 4.8,
  },
  {
    slug: "soiree-satin-clutch",
    name: "Soirée Satin Clutch",
    categoryName: "Clutch",
    price: 220,
    image: "/images/bag-clutch.jpg",
    colorNames: ["Champagne", "Rose"],
    description:
      "An evening companion sculpted from lustrous satin and finished with a polished gold kiss-lock. Holds the essentials with understated drama.",
    averageRating: 4.7,
  },
  {
    slug: "joli-mini-backpack",
    name: "Joli Mini Backpack",
    categoryName: "Backpack",
    price: 360,
    image: "/images/bag-backpack.jpg",
    colorNames: ["Camel", "Beige"],
    description: "Hands-free luxury. The Joli pairs a feminine silhouette with practical compartments and signature gold zip pulls.",
    averageRating: 4.8,
  },
  {
    slug: "lior-quilted-shoulder",
    name: "Lior Quilted Shoulder",
    categoryName: "Shoulder",
    price: 430,
    image: "/images/bag-shoulder.jpg",
    colorNames: ["Cream", "Noir"],
    description: "Heirloom quilting and a slim chain handle make Lior a timeless statement — the kind of bag passed between generations.",
    averageRating: 5.0,
  },
  {
    slug: "milano-top-handle",
    name: "Milano Top Handle",
    categoryName: "Top Handle",
    price: 620,
    image: "/images/bag-tophandle.jpg",
    colorNames: ["Cognac", "Espresso"],
    description: "An architectural silhouette with polished gold turn-lock. Tailored proportions for the modern professional.",
    averageRating: 4.9,
  },
  {
    slug: "petale-bucket",
    name: "Pétale Bucket Bag",
    categoryName: "Shoulder",
    price: 290,
    image: "/images/bag-bucket.jpg",
    colorNames: ["Blush", "Sand"],
    description: "A relaxed silhouette with drawstring closure and elegant gold tips. Soft, romantic, endlessly versatile.",
    averageRating: 4.6,
  },
  {
    slug: "cara-hobo",
    name: "Cara Slouchy Hobo",
    categoryName: "Shoulder",
    price: 410,
    image: "/images/bag-hobo.jpg",
    colorNames: ["Cognac", "Camel"],
    description: "Effortless slouch meets refined craftsmanship. The Cara molds beautifully with wear — your perfect everyday companion.",
    averageRating: 4.8,
  },
];

const reviewsSeed = [
  {
    productSlug: "lior-quilted-shoulder",
    name: "Sophia R.",
    email: "sophia@gmail.com",
    rating: 5,
    comment: "The Lior Quilted is even more beautiful in person. The leather is buttery and the gold chain feels weighty and refined.",
  },
  {
    productSlug: "celine-tote-beige",
    name: "Camille D.",
    email: "camille@gmail.com",
    rating: 5,
    comment: "I've been carrying my Céline tote daily for six months — still flawless. Worth every penny.",
  },
  {
    productSlug: "amelie-crossbody-blush",
    name: "Isabelle M.",
    email: "isabelle@gmail.com",
    rating: 5,
    comment: "Wrapped like a true luxury house. The Amélie crossbody is my new everyday.",
  },
];

async function seed() {
  await connectDB();

  console.log("Clearing existing categories, colors, products, and reviews...");
  await Promise.all([Category.deleteMany({}), Color.deleteMany({}), Product.deleteMany({}), Review.deleteMany({})]);

  console.log("Seeding categories...");
  const categories = await Category.insertMany(categoriesSeed);
  const categoryByName = Object.fromEntries(categories.map((c) => [c.name, c]));

  console.log("Seeding colors...");
  const dedupedColors = Array.from(new Map(colorsSeed.map((c) => [c.name, c])).values());
  const colors = await Color.insertMany(dedupedColors);
  const colorByName = Object.fromEntries(colors.map((c) => [c.name, c]));

  console.log("Seeding products...");
  for (const p of productsSeed) {
    const category = categoryByName[p.categoryName];
    if (!category) {
      console.warn(`Skipping product "${p.name}": category "${p.categoryName}" not found`);
      continue;
    }

    const variants = p.colorNames
      .map((cn) => colorByName[cn])
      .filter(Boolean)
      .map((color) => ({
        color: color._id,
        stock: 25,
      }));

    await Product.create({
      name: p.name,
      slug: p.slug,
      description: p.description,
      category: category._id,
      images: [p.image],
      priceRange: [{ minVariantPrice: p.price, maxVariantPrice: p.price }],
      variants,
      averageRating: p.averageRating,
      availableForSale: true,
    });
  }

  console.log("Seeding reviews...");
  for (const r of reviewsSeed) {
    const product = await Product.findOne({ slug: r.productSlug });
    if (!product) {
      console.warn(`Skipping review for "${r.productSlug}": product not found`);
      continue;
    }
    const review = await Review.create({
      name: r.name,
      email: r.email,
      rating: r.rating,
      comment: r.comment,
      product: product._id,
    });
    product.reviews.push(review._id);
    await product.save();
  }

  console.log(`Seeded ${categories.length} categories, ${colors.length} colors, ${productsSeed.length} products, ${reviewsSeed.length} reviews.`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
