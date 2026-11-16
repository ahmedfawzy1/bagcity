"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getProductReviews,
  createReview,
  checkCanReview,
} from "@/lib/reviews";
import type { Review } from "@/app/types/review";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

type CanReviewState = {
  canReview: boolean;
  hasPurchased: boolean;
  hasReviewed: boolean;
} | null;

export function ProductReviews({ productId }: { productId: string }) {
  const t = useTranslations('REVIEWS');
  const { status } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [canReviewState, setCanReviewState] = useState<CanReviewState>(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadFirstPage = useCallback(async () => {
    setLoadingList(true);
    try {
      const data = await getProductReviews(productId, 1, PAGE_SIZE);
      setReviews(data.reviews);
      setPage(1);
      setTotalPages(data.totalPages);
      setTotalReviews(data.totalReviews);
    } catch {
      toast.error(t('LOAD_ERROR'));
    } finally {
      setLoadingList(false);
    }
  }, [productId, t]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await getProductReviews(productId, 1, PAGE_SIZE);
        if (cancelled) return;
        setReviews(data.reviews);
        setPage(1);
        setTotalPages(data.totalPages);
        setTotalReviews(data.totalReviews);
      } catch {
        if (!cancelled) toast.error(t('LOAD_ERROR'));
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [productId, t]);

  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;
    checkCanReview(productId)
      .then((res) => {
        if (!cancelled) {
          setCanReviewState({
            canReview: res.canReview,
            hasPurchased: res.hasPurchased,
            hasReviewed: res.hasReviewed,
          });
        }
      })
      .catch(() => {
        if (!cancelled) setCanReviewState(null);
      });
    return () => {
      cancelled = true;
    };
  }, [productId, status]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const next = page + 1;
      const data = await getProductReviews(productId, next, PAGE_SIZE);
      setReviews((prev) => [...prev, ...data.reviews]);
      setPage(next);
      setTotalPages(data.totalPages);
      setTotalReviews(data.totalReviews);
    } catch {
      toast.error(t('LOAD_MORE_ERROR'));
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) {
      toast.error(t('RATING_REQUIRED'));
      return;
    }
    if (comment.trim().length === 0) {
      toast.error(t('COMMENT_REQUIRED'));
      return;
    }
    setSubmitting(true);
    try {
      await createReview(productId, {
        rating,
        comment: comment.trim(),
      });
      toast.success(t('REVIEW_SUCCESS'));
      setRating(0);
      setHover(0);
      setComment("");
      setFormOpen(false);
      setCanReviewState((prev) =>
        prev ? { ...prev, canReview: false, hasReviewed: true } : prev,
      );
      await loadFirstPage();
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? t('LOAD_ERROR');
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const canWrite =
    status === "authenticated" && canReviewState?.canReview === true;

  const disabledReason =
    status === "loading"
      ? ""
      : status !== "authenticated"
        ? t('SIGN_IN_TO_REVIEW')
        : !canReviewState
          ? ""
          : canReviewState.hasReviewed
            ? t('ALREADY_REVIEWED')
            : !canReviewState.hasPurchased
              ? t('VERIFIED_ONLY')
              : "";

  return (
    <section className="bg-secondary/40 py-20">
      <div className="container max-w-3xl">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl md:text-4xl">{t('TITLE')}</h2>
          {totalReviews > 0 && (
            <p className="text-xs tracking-luxe uppercase text-muted-foreground">
              {totalReviews} {totalReviews === 1 ? t('REVIEW') : t('REVIEWS_WORD')}
            </p>
          )}
        </div>

        <div className="mt-10 space-y-8">
          {loadingList ? (
            <p className="text-sm text-muted-foreground">{t('LOADING')}</p>
          ) : reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t('NONE')}
            </p>
          ) : (
            reviews.map((r) => (
              <article key={r._id} className="border-b border-border pb-8">
                <div className="flex items-center gap-3">
                  <div className="flex gap-0.5 text-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < Math.round(r.rating) && "fill-current",
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-xs tracking-luxe uppercase text-muted-foreground">
                    {r.name}
                  </p>
                </div>
                <p className="mt-4 leading-relaxed text-foreground">
                  {r.comment}
                </p>
              </article>
            ))
          )}
        </div>

        {page < totalPages && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="outlineLuxe"
              size="lg"
              onClick={loadMore}
              disabled={loadingMore}
            >
              {loadingMore ? t('LOADING_MORE') : t('LOAD_MORE')}
            </Button>
          </div>
        )}

        <div className="mt-12 flex flex-col items-center border-t border-border pt-10">
          {canWrite ? (
            <Button
              variant="luxe"
              size="lg"
              onClick={() => setFormOpen((v) => !v)}
              aria-expanded={formOpen}
            >
              {formOpen ? t('CANCEL') : t('WRITE_REVIEW')}
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0}>
                  <Button variant="luxe" size="lg" disabled>
                    {t('WRITE_REVIEW')}
                  </Button>
                </span>
              </TooltipTrigger>
              {disabledReason && (
                <TooltipContent>{disabledReason}</TooltipContent>
              )}
            </Tooltip>
          )}

          {canWrite && formOpen && (
            <form
              onSubmit={handleSubmit}
              className="mt-8 w-full space-y-4"
            >
              <div>
                <p className="text-xs tracking-luxe uppercase text-foreground">
                  {t('YOUR_RATING')}
                </p>
                <div className="mt-2 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const value = i + 1;
                    const active = (hover || rating) >= value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        onMouseEnter={() => setHover(value)}
                        onMouseLeave={() => setHover(0)}
                        aria-label={`${value} star${value > 1 ? "s" : ""}`}
                        className="text-gold"
                      >
                        <Star
                          className={cn(
                            "h-6 w-6",
                            active && "fill-current",
                          )}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  htmlFor="review-comment"
                  className="text-xs tracking-luxe uppercase text-foreground"
                >
                  {t('YOUR_REVIEW')}
                </label>
                <Textarea
                  id="review-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t('REVIEW_PLACEHOLDER')}
                  className="mt-2 min-h-30"
                  maxLength={1000}
                />
              </div>

              <Button
                type="submit"
                variant="luxe"
                size="lg"
                disabled={submitting}
              >
                {submitting ? t('SUBMITTING') : t('SUBMIT')}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
