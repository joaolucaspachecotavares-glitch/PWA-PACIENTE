import { notFound } from "next/navigation";
import { questions } from "@/lib/questions";
import { QuestionScreen } from "@/components/question-screen";
export function generateStaticParams() {
  return questions.map((_, i) => ({ step: String(i + 1) }));
}
export default async function QuestionPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step } = await params;
  if (!/^([1-9]|10)$/.test(step)) notFound();
  return <QuestionScreen key={step} step={Number(step)} />;
}
