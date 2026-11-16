import Client from "./Client";
import generateSEO from "@/lib/seo";

export const generateMetadata = async () => {
  return generateSEO({
    title: "Shipping & Returns – Free Returns Within 14 Days",
    description:
      "Complimentary worldwide shipping on orders over $150 and free returns within 14 days. Read our delivery times, carriers, customs and return policy.",
    alternates: {
      canonical: "/shipping-returns",
    },
    robots: {
      index: true,
      follow: true,
    },
  });
};

export default function page() {
  return <Client />;
}
