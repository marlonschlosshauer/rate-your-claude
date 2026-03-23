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
import { Card, CardContent } from "@/components/ui/card";
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
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${d}.${m}`;
}

interface ChartDataPoint {
  label: string;
  dateLabel: string;
  period: string;
  avg: number | null;
  count: number;
}

function buildChartData(
  reviews: Array<{ date: number; rating: number }>,
): ChartDataPoint[] {
  const now = new Date();
  const points: ChartDataPoint[] = [];

  for (let dayOffset = -2; dayOffset <= 0; dayOffset++) {
    const day = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + dayOffset,
    );
    const dayStr = formatDate(day);

    for (let i = 0; i < PERIODS.length; i++) {
      const period = PERIODS[i];
      const periodTime = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
        period.hour,
      ).getTime();

      const matching = reviews.filter((r) => r.date === periodTime);
      const avg =
        matching.length > 0
          ? matching.reduce((sum, r) => sum + r.rating, 0) / matching.length
          : null;

      points.push({
        label: `${dayStr} ${period.label}`,
        dateLabel: i === 0 ? dayStr : "",
        period: period.label,
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
        <CardContent className="h-[300px]">
          <p className="text-sand-500">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  const data = buildChartData(reviews);
  const hasData = data.some((d) => d.avg !== null);

  return (
    <Card>
      <CardContent>
        {!hasData ? (
          <p className="text-sand-500">No ratings yet for the past 3 days.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 80, bottom: 5, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#8a7e72"
                strokeOpacity={0.6}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                height={40}
                stroke="#8a7e72"
                interval={0}
                tickFormatter={(_value, index) => {
                  const point = data[index];
                  return point?.dateLabel || "";
                }}
              />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tickFormatter={(v) => ratingLabel(v)}
                tick={{ fontSize: 11 }}
                width={120}
                stroke="#8a7e72"
              />
              <Tooltip
                formatter={(value) => [
                  `${Number(value).toFixed(2)} — ${ratingLabel(Number(value))}`,
                  "Avg Rating",
                ]}
                labelFormatter={(_label, payload) => {
                  const point = payload?.[0]?.payload as
                    | ChartDataPoint
                    | undefined;
                  return point ? `${point.period}` : "";
                }}
                contentStyle={{
                  backgroundColor: "#3d3329",
                  border: "1px solid #554a3f",
                  borderRadius: "8px",
                  color: "#ece7df",
                }}
              />
              <Line
                type="monotone"
                dataKey="avg"
                stroke="#c47a5a"
                strokeWidth={2}
                dot={{ r: 4, fill: "#c47a5a" }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
