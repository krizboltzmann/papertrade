import type { Metadata } from "next";

import { TradeHistoryView } from "@/components/trading/TradeHistoryView";

export const metadata: Metadata = {
  title: "Trade History",
};

export default function TradeHistoryPage() {
  return <TradeHistoryView />;
}
