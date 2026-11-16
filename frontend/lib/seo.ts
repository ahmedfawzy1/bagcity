import type { Metadata } from "next";

const SITE_URL = "https://www.bagcity.shop";
const SITE_NAME = "BagCity";

const defaultSEO: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "BagCity – Premium Leather Bags, Totes & Crossbodies",
  description:
    "Shop BagCity for hand-finished leather bags — totes, crossbodies, clutches and backpacks crafted from vegetable-tanned Italian leather. Worldwide delivery and complimentary shipping over $150.",
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "BagCity – Premium Leather Bags, Totes & Crossbodies",
    siteName: SITE_NAME,
    description:
      "Shop BagCity for hand-finished leather bags — totes, crossbodies, clutches and backpacks crafted from vegetable-tanned Italian leather. Worldwide delivery and complimentary shipping over $150.",
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/images/opengraph.webp`,
        alt: "BagCity – premium leather bags",
      },
    ],
  },
  twitter: {
    creator: "@bagcity_shop",
    site: SITE_URL,
    card: "summary_large_image",
  },
};

export default function generateSEO(props: Metadata = {}): Metadata {
  const seo: Metadata = { ...defaultSEO, ...props };
  if (typeof seo.title === "string" && !seo.title.includes(SITE_NAME)) {
    seo.title += ` | ${SITE_NAME}`;
  }
  seo.openGraph = {
    ...seo.openGraph,
    title: seo.title || undefined,
    description: seo.description || undefined,
  };
  seo.twitter = {
    ...seo.twitter,
    site: seo.openGraph?.url?.toString(),
    title: seo.openGraph.title || undefined,
    images: seo.openGraph.images,
    description: seo.openGraph.description,
  };
  return { ...seo, ...props };
}
