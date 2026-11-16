import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import generateSEO from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Page Not Found",
  description:
    "The page you're looking for doesn't exist or has been moved. Return home or browse the BagCity collection.",
  robots: {
    index: false,
    follow: true,
  },
});

export default async function NotFound() {
  const t = await getTranslations("NOT_FOUND");
  return (
    <div className="flex flex-1 items-center justify-center py-32">
      <div className="text-center">
        <p className="text-xs tracking-luxe uppercase text-muted-foreground">{t("CODE")}</p>
        <h1 className="mt-4 font-serif text-5xl md:text-6xl">{t("TITLE")}</h1>
        <p className="mt-4 text-muted-foreground">{t("DESC")}</p>
        <Button asChild variant="luxe" size="lg" className="mt-8">
          <Link href="/">{t("HOME")}</Link>
        </Button>
      </div>
    </div>
  );
}
