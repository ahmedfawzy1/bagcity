import Client from "./Client";
import generateSEO from "@/lib/seo";

export const generateMetadata = async () => {
  return generateSEO({
    title: "Secure Checkout",
    description:
      "Complete your BagCity order with secure payment, encrypted card processing and worldwide shipping.",
    alternates: {
      canonical: "/checkout",
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
