import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isAdult,
  toggleAnswer,
  validateRegistration,
  rankProfessionals,
} from "../src/lib/domain.ts";
import type { Professional } from "../src/lib/types.ts";
const today = new Date(2026, 8, 25);
test("idade: aniversário de 18 anos, véspera, futuro e datas inexistentes", () => {
  assert.equal(isAdult("2008-09-25", today), true);
  assert.equal(isAdult("2008-09-26", today), false);
  assert.equal(isAdult("2008-09-24", today), true);
  assert.equal(isAdult("2027-01-01", today), false);
  assert.equal(isAdult("2000-02-30", today), false);
  assert.equal(isAdult("2008-02-29", today), true);
  assert.equal(isAdult("2007-02-29", today), false);
  assert.equal(isAdult("", today), false);
});
test("a opção de não responder é exclusiva e respostas podem ser desmarcadas", () => {
  assert.deepEqual(toggleAnswer(["Ansiedade"], "Estresse", true), [
    "Ansiedade",
    "Estresse",
  ]);
  assert.deepEqual(toggleAnswer(["Ansiedade"], "Ansiedade", true), []);
  assert.deepEqual(toggleAnswer(["Ansiedade"], "Prefiro não responder", true), [
    "Prefiro não responder",
  ]);
  assert.deepEqual(toggleAnswer(["Prefiro não responder"], "Ansiedade", true), [
    "Ansiedade",
  ]);
  assert.deepEqual(toggleAnswer(["Online"], "Presencial", false), [
    "Presencial",
  ]);
});
test("cadastro rejeita menor mesmo com checkbox marcado e valida dados completos", () => {
  const valid = {
    name: "Teste",
    email: "teste@example.com",
    phone: "(48) 99999-9999",
    password: "exemplo123",
    consent: true,
    birthDate: "2000-01-01",
  };
  assert.deepEqual(validateRegistration(valid, today), {});
  assert.ok(
    validateRegistration({ ...valid, birthDate: "2010-01-01" }, today)
      .birthDate,
  );
  assert.ok(validateRegistration({ ...valid, consent: false }, today).consent);
  assert.ok(validateRegistration({ ...valid, email: "invalid" }, today).email);
});
test("ordenação considera preferências sem alterar fixtures e é estável nos empates", () => {
  const items = [
    {
      id: "a",
      specialties: ["Sono"],
      price: 200,
      mode: "Online",
      time: "09:00",
    },
    {
      id: "b",
      specialties: ["Ansiedade"],
      price: 150,
      mode: "Online",
      time: "19:00",
    },
  ] as Professional[];
  assert.equal(
    rankProfessionals(items, { interests: ["Ansiedade"] })[0].id,
    "b",
  );
  assert.equal(items[0].id, "a");
  assert.deepEqual(
    rankProfessionals(items, {}).map((p) => p.id),
    ["a", "b"],
  );
});
