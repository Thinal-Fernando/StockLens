import { Schema, model, models, type Model } from "mongoose";

export interface WatchlistItem {
  userId: string; // Better Auth user id
  symbol: string;
  company: string;
  market: Market;
  addedAt: Date;
}

const WatchlistSchema = new Schema<WatchlistItem>({
  userId: { type: String, required: true, index: true },
  symbol: { type: String, required: true, uppercase: true, trim: true },
  company: { type: String, required: true, trim: true },
  market: { type: String, enum: ["US", "CSE"], default: "US", required: true },
  addedAt: { type: Date, default: Date.now },
});

// One row per (user, symbol) — makes "add" idempotent.
WatchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

// `models.Watchlist` guard avoids "OverwriteModelError" on hot reload.
export const Watchlist: Model<WatchlistItem> =
  (models.Watchlist as Model<WatchlistItem>) ||
  model<WatchlistItem>("Watchlist", WatchlistSchema);
