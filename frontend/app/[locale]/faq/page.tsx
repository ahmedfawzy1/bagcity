import Client from "./Client";
import generateSEO from "@/lib/seo";

export const generateMetadata = async () => {
  return generateSEO({
    title: "FAQ – Orders, Shipping, Returns & Leather Care",
    description:
      "Answers to common questions about BagCity bags — sizing, leather care, shipping times, returns, payment methods and order tracking.",
    alternates: {
      canonical: "/faq",
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
