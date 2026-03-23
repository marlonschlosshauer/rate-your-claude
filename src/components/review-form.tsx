"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
        <CardContent>
          <p className="text-sand-500 text-center">
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
        <CardContent>
          <p className="text-sand-500">
            No periods available yet. Check back after 8 AM!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Period of day</label>
            <RadioGroup
              value={period}
              onValueChange={(v) => setPeriod(v as PeriodValue)}
              className="flex flex-wrap gap-x-4 gap-y-2"
            >
              {availablePeriods.map((p) => (
                <div key={p.value} className="flex items-center gap-2">
                  <RadioGroupItem value={p.value} id={`period-${p.value}`} />
                  <label
                    htmlFor={`period-${p.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {p.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">How was Claude?</label>
            <RadioGroup
              value={rating}
              onValueChange={setRating}
              className="flex flex-wrap gap-x-4 gap-y-2"
            >
              {RATINGS.map((r) => (
                <div key={r.value} className="flex items-center gap-2">
                  <RadioGroupItem
                    value={String(r.value)}
                    id={`rating-${r.value}`}
                  />
                  <label
                    htmlFor={`rating-${r.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {r.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Button
            className="m-auto"
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
