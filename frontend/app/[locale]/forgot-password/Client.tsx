"use client";

import { useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

type Step = "email" | "otp" | "password";
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
  const requestOtp = useAuthStore((s) => s.requestOtp);
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const resetPassword = useAuthStore((s) => s.resetPassword);
  const isRequestingOtp = useAuthStore((s) => s.isRequestingOtp);
  const isVerifyingOtp = useAuthStore((s) => s.isVerifyingOtp);
  const isResettingPassword = useAuthStore((s) => s.isResettingPassword);

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = password.length > 0 ? passwordStrength(password) : null;

  const handleRequestOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    const ok = await requestOtp(trimmed);
    if (ok) {
      setEmail(trimmed);
      setStep("otp");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error(t('OTP_LENGTH_ERROR'));
      return;
    }
    const ok = await verifyOtp(email, otp);
    if (ok) setStep("password");
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error(t('PASSWORD_TOO_SHORT'), { description: t('PASSWORD_TOO_SHORT_DESC') });
      return;
    }
    if (password !== confirm) {
      toast.error(t('PASSWORDS_MISMATCH'));
      return;
    }
    const ok = await resetPassword(email, otp, password);
    if (ok) {
      router.push("/login");
    }
  };

  const handleResend = async () => {
    if (isRequestingOtp) return;
    await requestOtp(email);
  };

  const stepTitle = {
    email: t('FORGOT_TITLE'),
    otp: t('OTP_TITLE'),
    password: t('NEW_PASSWORD_TITLE'),
  }[step];

  const stepDesc = {
    email: t('FORGOT_DESC'),
    otp: t('OTP_DESC', { email }),
    password: t('NEW_PASSWORD_DESC'),
  }[step];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-cream flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md border border-border bg-background shadow-elegant px-10 py-12">
        <div className="mb-8 text-center">
          <p className="text-xs tracking-luxe uppercase text-muted-foreground">{t('BRAND')}</p>
          <h1 className="mt-3 font-serif text-3xl">{stepTitle}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{stepDesc}</p>
        </div>

        {step === "email" && (
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div>
              <Label htmlFor="email">{t('EMAIL_ADDRESS')}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 h-12 rounded-none"
              />
            </div>
            <Button type="submit" variant="luxe" size="lg" className="w-full" disabled={isRequestingOtp}>
              {isRequestingOtp ? <Loader2 className="h-4 w-4 animate-spin" /> : t('SEND_CODE')}
            </Button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <Label htmlFor="otp">{t('OTP_LABEL')}</Label>
              <Input
                id="otp"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                autoComplete="one-time-code"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="mt-2 h-12 rounded-none tracking-[0.5em] text-center text-lg"
              />
            </div>
            <Button type="submit" variant="luxe" size="lg" className="w-full" disabled={isVerifyingOtp}>
              {isVerifyingOtp ? <Loader2 className="h-4 w-4 animate-spin" /> : t('VERIFY_CODE')}
            </Button>
            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setStep("email")}
                className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline transition-smooth"
              >
                {t('USE_DIFFERENT_EMAIL')}
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={isRequestingOtp}
                className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline transition-smooth disabled:opacity-60"
              >
                {isRequestingOtp ? t('SENDING') : t('RESEND_CODE')}
              </button>
            </div>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <Label htmlFor="password">{t('NEW_PASSWORD_LABEL')}</Label>
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
              <Label htmlFor="confirm">{t('CONFIRM_PASSWORD')}</Label>
              <div className="relative mt-2">
                <Input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
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

            <Button type="submit" variant="luxe" size="lg" className="w-full" disabled={isResettingPassword}>
              {isResettingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : t('RESET_PASSWORD')}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t('REMEMBERED')}{" "}
          <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline transition-smooth">
            {t('BACK_TO_SIGNIN')}
          </Link>
        </p>
      </div>
    </div>
  );
}
