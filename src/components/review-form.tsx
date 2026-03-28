"use client";

import { useState, useTransition } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RATINGS } from "@/lib/constants";

export function ReviewForm() {
  const submit = useMutation(api.reviews.submit);
  const [rating, setRating] = useState<string>("");
  const [hasVoted, setHasVoted] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit() {
    if (!rating) return;

    startTransition(async () => {
      await submit({
        rating: Number(rating),
        date: Date.now(),
      });

      startTransition(() => {
        setHasVoted(true);
      });
    });
  }

  if (hasVoted) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center min-h-[107px]">
          <p className="text-sand-500 text-center">
            Thanks for your rating! Come back tomorrow.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-6 m-auto max-w-[460px]">
          <div className="flex flex-col gap-2 justify-center">
            <RadioGroup
              value={rating}
              onValueChange={setRating}
              className="flex flex-wrap gap-x-4 gap-y-2 justify-center"
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
            disabled={!rating || isPending}
          >
            {isPending ? "Submitting..." : "Submit Rating"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
