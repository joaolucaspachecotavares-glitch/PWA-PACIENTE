import type { Metadata } from "next";
import { ResultsScreen } from "@/components/results-screen";

export const metadata: Metadata = { title: "Seus resultados" };

export default function ResultsPage() {
  return <ResultsScreen />;
}
