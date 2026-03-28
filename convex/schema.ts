import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  review: defineTable({
    rating: v.number(),
    date: v.number(),
  }).index("by_date", ["date"]),
});
