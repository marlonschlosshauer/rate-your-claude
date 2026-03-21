"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RATINGS,
  type PeriodValue,
  getAvailablePeriods,
  getTodayKey,
  periodToTimestamp,
} from "@/lib/periods";

export function ReviewForm() {
  const submit = useMutation(api.reviews.submit);
  const [period, setPeriod] = useState<PeriodValue | "">("");
  const [rating, setRating] = useState<string>("");
  const [hasVoted, setHasVoted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const availablePeriods = getAvailablePeriods();

  useEffect(() => {
    const key = getTodayKey();
    if (typeof window !== "undefined" && localStorage.getItem(key)) {
      setHasVoted(true);
    }
  }, []);

  async function handleSubmit() {
    if (!period || !rating) return;
    setSubmitting(true);
    try {
      const timestamp = periodToTimestamp(period);
      await submit({
        rating: Number(rating),
        date: timestamp,
        region: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      const key = getTodayKey();
      localStorage.setItem(key, "true");
      setHasVoted(true);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (hasVoted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rate your Claude</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500 dark:text-neutral-400">
            {submitted
              ? "Thanks for your rating! Come back tomorrow."
              : "You've already rated today. Come back tomorrow!"}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (availablePeriods.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rate your Claude</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500 dark:text-neutral-400">
            No periods available yet. Check back after 8 AM!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate your Claude</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Period of day</label>
            <Select
              value={period}
              onValueChange={(v) => setPeriod(v as PeriodValue)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a period" />
              </SelectTrigger>
              <SelectContent>
                {availablePeriods.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              How was Claude?
            </label>
            <Select value={rating} onValueChange={setRating}>
              <SelectTrigger>
                <SelectValue placeholder="Select a rating" />
              </SelectTrigger>
              <SelectContent>
                {RATINGS.map((r) => (
                  <SelectItem key={r.value} value={String(r.value)}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!period || !rating || submitting}
          >
            {submitting ? "Submitting..." : "Submit Rating"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
