import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { reviewSchema } from "../lib/schemas";

export const getByDateRange = query({
  args: {
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("review")
      .withIndex("by_date", (q) =>
        q.gte("date", args.startDate).lte("date", args.endDate),
      )
      .order("asc")
      .take(1000);
  },
});

export const submit = mutation({
  args: {
    rating: v.number(),
    date: v.number(),
    region: v.string(),
  },
  handler: async (ctx, args) => {
    const validated = reviewSchema.parse(args);
    return await ctx.db.insert("review", validated);
  },
});
