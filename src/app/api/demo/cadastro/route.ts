import { NextResponse } from "next/server";
import { validateRegistration, type RegistrationInput } from "@/lib/domain";
export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  try {
    const raw = await request.text();
    if (raw.length > 4096)
      return NextResponse.json(
        { errors: { form: "O formulário excede o tamanho permitido." } },
        { status: 413, headers },
      );
    const input = JSON.parse(raw) as RegistrationInput;
    if (!input || typeof input !== "object" || Array.isArray(input))
      throw new Error("invalid body");
    const errors = validateRegistration(input);
    if (Object.keys(errors).length)
      return NextResponse.json({ errors }, { status: 422, headers });
    // Intencionalmente sem persistência, autenticação, cookies ou logs de dados pessoais.
    return NextResponse.json(
      { demo: true, name: input.name.trim().split(/\s+/)[0].slice(0, 40) },
      { headers },
    );
  } catch {
    return NextResponse.json(
      { errors: { form: "Confira os dados informados e tente novamente." } },
      { status: 400, headers },
    );
  }
}
