import { Suspense } from "react";
import Client from "./Client";
import generateSEO from "@/lib/seo";

export const generateMetadata = async () => {
  return generateSEO({
    title: "Reset Your Password",
    description:
      "Forgot your password? Reset it securely using a one-time code sent to the email on your BagCity account.",
    alternates: {
      canonical: "/forgot-password",
    },
    robots: {
      index: false,
      follow: false,
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
