import Client from "./Client";
import generateSEO from "@/lib/seo";

export const generateMetadata = async () => {
  return generateSEO({
    title: "Our Story – The Atelier Behind BagCity",
    description:
      "From a small Parisian studio to a global atelier — discover the people, the philosophy and the heritage behind every BagCity bag.",
    alternates: {
      canonical: "/our-story",
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
