import Client from "./Client";
import generateSEO from "@/lib/seo";

export const generateMetadata = async () => {
  return generateSEO({
    title: "Your Shopping Bag",
    description:
      "Review the pieces in your shopping bag, apply a promo code and continue to a secure checkout.",
    alternates: {
      canonical: "/cart",
    },
    robots: {
      index: false,
      follow: false,
    },
  });
};

export default function page() {
  return <Client />;
}
