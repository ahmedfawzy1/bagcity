import { Suspense } from "react";
import Client from "./Client";
import generateSEO from "@/lib/seo";

export const generateMetadata = async () => {
  return generateSEO({
    title: "Create Your Account",
    description:
      "Join BagCity for a personalised shopping experience, faster checkout, order tracking and early access to new releases.",
    alternates: {
      canonical: "/signup",
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
