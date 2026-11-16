"use client";

import { HeroSection } from "@/components/home/Hero";
import { PerksBar } from "@/components/home/PerksBar";
import { CategoriesSection } from "@/components/home/Category";
import { BestsellersSection } from "@/components/home/Bestsellers";
import { BrandStorySection } from "@/components/home/BrandStory";
import { NewArrivalsSection } from "@/components/home/NewArrivals";
import { ReviewsSection } from "@/components/home/Reviews";
import type { Product } from "@/app/types/product";
import type { Review } from "@/app/types/review";

export default function Client({
  newArrivals,
  bestsellers,
  reviews,
}: {
  newArrivals: Product[];
  bestsellers: Product[];
  reviews: Review[];
}) {
  return (
    <>
      <HeroSection />
      <PerksBar />
      <CategoriesSection />
      <BestsellersSection products={bestsellers} />
      <BrandStorySection />
      <NewArrivalsSection products={newArrivals} />
      <ReviewsSection reviews={reviews} />
    </>
  );
}
