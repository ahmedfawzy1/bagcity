import Client from "./Client";
import generateSEO from "@/lib/seo";

export const generateMetadata = async () => {
  return generateSEO({
    title: "About BagCity – Our Atelier, Craft & Materials",
    description:
      "Meet the Parisian atelier behind BagCity. Discover our craft, the artisans who hand-finish every piece, and the vegetable-tanned Italian leather we work with.",
    alternates: {
      canonical: "/about",
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
