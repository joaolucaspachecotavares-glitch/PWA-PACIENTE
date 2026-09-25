export type Answers = Record<string, string[]>;
export type Question = {
  id: string;
  title: string;
  subtitle: string;
  multiple?: boolean;
  options: string[];
};
export type Professional = {
  id: string;
  name: string;
  role: string;
  initials: string;
  tone: string;
  specialties: string[];
  approach: string;
  price: number;
  rating: string;
  reviews: number;
  mode: string;
  time: string;
  bio: string;
};
