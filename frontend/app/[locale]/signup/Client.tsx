"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
import { signIn } from "next-auth/react";
import axios from "axios";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";

type StrengthLabel = "WEAK" | "FAIR" | "GOOD" | "STRONG";

function passwordStrength(pw: string): { score: number; label: StrengthLabel; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: "WEAK", color: "bg-destructive" };
  if (score === 2) return { score, label: "FAIR", color: "bg-yellow-500" };
  if (score === 3) return { score, label: "GOOD", color: "bg-amber-500" };
  return { score, label: "STRONG", color: "bg-green-600" };
}

export default function Client() {
  const t = useTranslations('AUTH');
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallback = searchParams.get("callbackUrl") || "/";
  // Prevent open redirect — only allow relative paths
  const callbackUrl = rawCallback.startsWith("/") && !rawCallback.startsWith("//") ? rawCallback : "/";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const strength = password.length > 0 ? passwordStrength(password) : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const first_name = (form.elements.namedItem("firstName") as HTMLInputElement).value.trim();
    const last_name = (form.elements.namedItem("lastName") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const confirm = (form.elements.namedItem("confirm") as HTMLInputElement).value;

    if (password !== confirm) {
      toast.error(t('PASSWORDS_MISMATCH'), { description: t('PASSWORDS_MISMATCH_DESC') });
      return;
    }
    if (password.length < 8) {
      toast.error(t('PASSWORD_TOO_SHORT'), { description: t('PASSWORD_MIN_LENGTH_DESC') });
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/auth/signup", { first_name, last_name, email, password });

      const result = await signIn("credentials", { email, password, redirect: false });

      if (result?.error) {
        toast.success(t('SIGNUP_SUCCESS'), { description: t('SIGNUP_SUCCESS_DESC_CONTINUE') });
        router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        return;
      }

      toast.success(t('SIGNUP_SUCCESS'), { description: t('SIGNUP_SUCCESS_DESC') });
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? (err.response.data.message as string)
          : t('SOMETHING_WRONG');
      toast.error(t('SIGNUP_ERROR'), { description: message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-cream flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md border border-border bg-background shadow-elegant px-10 py-12">
        <div className="mb-8 text-center">
          <p className="text-xs tracking-luxe uppercase text-muted-foreground">{t('BRAND')}</p>
          <h1 className="mt-3 font-serif text-3xl">{t('SIGNUP_TITLE')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t('SIGNUP_DESC')}</p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full rounded-none gap-3"
          onClick={handleGoogle}
          disabled={googleLoading || loading}
        >
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {t('GOOGLE')}
        </Button>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <p className="text-xs text-muted-foreground">{t('OR_EMAIL')}</p>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">{t('FIRST_NAME')}</Label>
              <Input id="firstName" autoComplete="given-name" required className="mt-2 h-12 rounded-none" />
            </div>
            <div>
              <Label htmlFor="lastName">{t('LAST_NAME')}</Label>
              <Input id="lastName" autoComplete="family-name" required className="mt-2 h-12 rounded-none" />
            </div>
          </div>

          <div>
            <Label htmlFor="email">{t('EMAIL_ADDRESS')}</Label>
            <Input id="email" type="email" autoComplete="email" required className="mt-2 h-12 rounded-none" />
          </div>

          <div>
            <Label htmlFor="password">{t('PASSWORD')}</Label>
            <div className="relative mt-2">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-none pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? t('HIDE_PASSWORD') : t('SHOW_PASSWORD')}
                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-smooth"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {strength && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        i <= strength.score ? strength.color : "bg-border"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{t(`STRENGTH_${strength.label}`)}</p>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="confirm">{t('CONFIRM_PASSWORD_LABEL')}</Label>
            <div className="relative mt-2">
              <Input
                id="confirm"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                required
                className="h-12 rounded-none pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? t('HIDE_PASSWORD') : t('SHOW_PASSWORD')}
                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-smooth"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" variant="luxe" size="lg" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('SIGNUP_BUTTON')}
          </Button>

          <p className="text-center text-xs text-muted-foreground leading-relaxed">
            {t('PRIVACY_TERMS')}{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground transition-smooth">
              {t('PRIVACY_POLICY')}
            </Link>{" "}
            {t('AND')}{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-foreground transition-smooth">
              {t('TERMS')}
            </Link>
            .
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t('ALREADY_ACCOUNT')}{" "}
          <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline transition-smooth">
            {t('SIGNIN_BUTTON')}
          </Link>
        </p>
      </div>
    </div>
  );
}
