import { Suspense } from "react";
import Client from "./Client";
import generateSEO from "@/lib/seo";

export const generateMetadata = async () => {
  return generateSEO({
    title: "Sign In to Your Account",
    description:
      "Sign in to your BagCity account to access your orders, wishlist, saved addresses and a faster checkout.",
    alternates: {
      canonical: "/login",
    },
    robots: {
      index: false,
      follow: true,
    },
  });
};

export default function page() {
  return (
    <Suspense fallback={null}>
      <Client />
    </Suspense>
  );
}
