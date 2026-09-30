"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useContext, useState, type ReactNode } from "react";
import { ApiError } from "@/lib/api";
import type { Answers } from "@/lib/api-types";

type JourneyState = {
  /** Respostas do questionário antes do cadastro: somente em memória, nunca em storage. */
  answers: Answers;
  setAnswer: (id: string, values: string[]) => void;
  clearAnswers: () => void;
};

const JourneyContext = createContext<JourneyState | null>(null);

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: true,
        retry: (count, error) =>
          !(error instanceof ApiError && error.status >= 400 && error.status < 500) && count < 2,
      },
    },
  });
}

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(makeQueryClient);
  const [answers, setAnswers] = useState<Answers>({});
  return (
    <QueryClientProvider client={client}>
      <JourneyContext.Provider
        value={{
          answers,
          setAnswer: (id, values) => setAnswers((p) => ({ ...p, [id]: values })),
          clearAnswers: () => setAnswers({}),
        }}
      >
        {children}
      </JourneyContext.Provider>
    </QueryClientProvider>
  );
}

export function useJourney() {
  const context = useContext(JourneyContext);
  if (!context) throw new Error("Providers é obrigatório.");
  return context;
}
