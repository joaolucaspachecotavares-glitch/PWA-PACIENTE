import { notFound } from "next/navigation";
import { QuestionScreen } from "@/components/question-screen";

export function generateStaticParams() {
  return Array.from({ length: 10 }, (_, i) => ({ step: String(i + 1) }));
}

export default async function QuestionPage({ params }: { params: Promise<{ step: string }> }) {
  const { step } = await params;
  if (!/^([1-9]|10)$/.test(step)) notFound();
  return <QuestionScreen key={step} step={Number(step)} />;
}
