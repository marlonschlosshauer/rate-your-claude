import { fetchQuery } from "convex/nextjs";
import { ImageResponse } from "next/og";
import { RATINGS } from "@/lib/constants";
import { api } from "../../convex/_generated/api";

export const alt = "Today's Claude rating";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

function ratingLabel(value: number): string {
  const r = RATINGS.find((r) => r.value === Math.round(value));
  return r ? r.label : String(value);
}

export const revalidate = 10800;

export default async function Image() {
  const now = new Date();

  const startDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();

  const endDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999,
  ).getTime();

  let rating = null;

  try {
    const reviews = await fetchQuery(api.reviews.getByDateRange, {
      startDate,
      endDate,
    });
    if (reviews.length > 0) {
      rating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    }
  } catch {}

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#2a2118",
          fontFamily: "Inter",
          color: "#ece7df",
        }}
      >
        <div style={{ fontSize: 28, color: "#8a7e72", marginBottom: 16 }}>
          Rate your Claude
        </div>
        <div style={{ fontSize: 64, display: "flex" }}>
          {rating ? (
            <>
              <span>Today Claude was </span>
              <span style={{ color: "#c47a5a", marginLeft: 16 }}>
                {ratingLabel(Math.round(rating))}
              </span>
              <span>.</span>
            </>
          ) : (
            <>
              <span>No ratings </span>
              <span style={{ color: "#c47a5a", marginLeft: 16 }}>(yet)</span>
              <span>.</span>
            </>
          )}
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
