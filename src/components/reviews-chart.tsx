"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PERIODS, RATINGS } from "@/lib/periods";

function getDateRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  end.setHours(23, 59, 59, 999);
  return { startDate: start.getTime(), endDate: end.getTime() };
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface ChartDataPoint {
  label: string;
  avg: number | null;
  count: number;
}

function buildChartData(
  reviews: Array<{ date: number; rating: number }>
): ChartDataPoint[] {
  const now = new Date();
  const points: ChartDataPoint[] = [];

  for (let dayOffset = -2; dayOffset <= 0; dayOffset++) {
    const day = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + dayOffset
    );
    const dayStr = formatDate(day);

    for (const period of PERIODS) {
      const periodTime = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
        period.hour
      ).getTime();

      const matching = reviews.filter((r) => r.date === periodTime);
      const avg =
        matching.length > 0
          ? matching.reduce((sum, r) => sum + r.rating, 0) / matching.length
          : null;

      points.push({
        label: `${dayStr} ${period.label}`,
        avg: avg !== null ? Math.round(avg * 100) / 100 : null,
        count: matching.length,
      });
    }
  }

  return points;
}

function ratingLabel(value: number): string {
  const r = RATINGS.find((r) => r.value === Math.round(value));
  return r ? r.label : String(value);
}

export function ReviewsChart() {
  const { startDate, endDate } = getDateRange();
  const reviews = useQuery(api.reviews.getByDateRange, { startDate, endDate });

  if (reviews === undefined) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500 dark:text-neutral-400">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  const data = buildChartData(reviews);
  const hasData = data.some((d) => d.avg !== null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Ratings</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <p className="text-neutral-500 dark:text-neutral-400">
            No ratings yet for the past 3 days.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                angle={-35}
                textAnchor="end"
                height={80}
                stroke="#888"
              />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tickFormatter={(v) => ratingLabel(v)}
                tick={{ fontSize: 11 }}
                width={120}
                stroke="#888"
              />
              <Tooltip
                formatter={(value) => [
                  `${Number(value).toFixed(2)} — ${ratingLabel(Number(value))}`,
                  "Avg Rating",
                ]}
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  color: "#eee",
                }}
              />
              <Line
                type="monotone"
                dataKey="avg"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 4, fill: "#f97316" }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
