import Client from "./Client";
import generateSEO from "@/lib/seo";

export const generateMetadata = async () => {
  return generateSEO({
    title: "Contact BagCity – Customer Care, Press & Wholesale",
    description:
      "Reach the BagCity team for order help, product questions, press enquiries or wholesale partnerships. We reply within one business day.",
    alternates: {
      canonical: "/contact",
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
