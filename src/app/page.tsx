import { redirect } from "next/navigation";

// O proxy direciona "/" conforme a sessão; este redirecionamento é o padrão sem sessão.
export default function Home() {
  redirect("/onboarding");
}
