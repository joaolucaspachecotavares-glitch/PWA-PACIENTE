"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Answers } from "@/lib/types";

type JourneyState = {
  answers: Answers;
  setAnswer: (id: string, values: string[]) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  name: string;
  setName: (name: string) => void;
  reset: () => void;
};
const JourneyContext = createContext<JourneyState | null>(null);
export function JourneyProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [name, setName] = useState("");
  return (
    <JourneyContext.Provider
      value={{
        answers,
        setAnswer: (id, values) => setAnswers((p) => ({ ...p, [id]: values })),
        favorites,
        toggleFavorite: (id) =>
          setFavorites((p) =>
            p.includes(id) ? p.filter((v) => v !== id) : [...p, id],
          ),
        name,
        setName,
        reset: () => {
          setAnswers({});
          setFavorites([]);
          setName("");
        },
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
}
export function useJourney() {
  const context = useContext(JourneyContext);
  if (!context) throw new Error("JourneyProvider é obrigatório.");
  return context;
}
