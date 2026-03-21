import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  review: defineTable({
    rating: v.number(),
    date: v.number(),
    // @todo: Should probably be a literal of AWS regions
    region: v.string(),
  }).index("by_date", ["date"]),
});
