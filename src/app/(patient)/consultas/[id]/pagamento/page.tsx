"use client";
import { use } from "react";
import { PaymentScreen } from "@/components/payment-screen";

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <PaymentScreen id={id} />;
}
