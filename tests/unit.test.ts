import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { toggleOption } from "../src/lib/answers.ts";
import { safeInternalPath } from "../src/lib/routes.ts";
import { buildCalendarFile, formatCpfInput, formatMoney, formatPrice, isAdult, maskPhone, onlyDigits } from "../src/lib/format.ts";

describe("idade mínima (verificação imediata na tela)", () => {
  // 12:00 UTC = 09:00 em Brasília
  const today = new Date("2026-09-26T12:00:00Z");
  it("bloqueia antes dos 18 e libera no aniversário", () => {
    assert.equal(isAdult("2008-09-27", today), false);
    assert.equal(isAdult("2008-09-26", today), true);
  });
  it("usa a data de Brasília, não a UTC", () => {
    // 01:00 UTC do dia 27 ainda é dia 26 em Brasília.
    assert.equal(isAdult("2008-09-27", new Date("2026-09-27T01:00:00Z")), false);
  });
  it("rejeita formatos inválidos", () => {
    assert.equal(isAdult("26/09/2000", today), false);
    assert.equal(isAdult("", today), false);
  });
});

describe("formatação", () => {
  it("formata valores em reais", () => {
    assert.equal(formatMoney(15000).replace(/\s/g, " "), "R$ 150,00");
    assert.equal(formatPrice(15000), "R$ 150");
    assert.equal(formatPrice(15050).replace(/\s/g, " "), "R$ 150,50");
  });
  it("aplica máscara de celular e extrai dígitos", () => {
    assert.equal(maskPhone("48999990000"), "(48) 99999-0000");
    assert.equal(maskPhone("4833330000"), "(48) 3333-0000");
    assert.equal(onlyDigits("(48) 99999-0000"), "48999990000");
  });
  it("aplica máscara de CPF durante a digitação", () => {
    assert.equal(formatCpfInput("52998224725"), "529.982.247-25");
    assert.equal(formatCpfInput("5299"), "529.9");
  });
});

describe("seleção de respostas", () => {
  const options = [
    { code: "ansiedade", label: "Ansiedade", exclusive: false },
    { code: "sono", label: "Sono", exclusive: false },
    { code: "skip", label: "Prefiro não responder", exclusive: true },
  ];
  it("pergunta única mantém uma opção", () => {
    assert.deepEqual(toggleOption(["ansiedade"], options[1], false, options), ["sono"]);
  });
  it("opção exclusiva substitui as demais e vice-versa", () => {
    assert.deepEqual(toggleOption(["ansiedade", "sono"], options[2], true, options), ["skip"]);
    assert.deepEqual(toggleOption(["skip"], options[0], true, options), ["ansiedade"]);
  });
  it("alterna opções comuns", () => {
    assert.deepEqual(toggleOption(["ansiedade"], options[1], true, options), ["ansiedade", "sono"]);
    assert.deepEqual(toggleOption(["ansiedade", "sono"], options[0], true, options), ["sono"]);
  });
});

describe("arquivo de calendário", () => {
  it("gera evento sem dados sensíveis", () => {
    const ics = buildCalendarFile({
      id: "abc",
      startsAt: "2026-10-01T22:00:00.000Z",
      endsAt: "2026-10-01T22:50:00.000Z",
      professionalName: "Ana Martins",
    });
    assert.match(ics, /DTSTART:20261001T220000Z/);
    assert.match(ics, /SUMMARY:Consulta com Ana Martins/);
    assert.ok(!/ansiedade|resumo/i.test(ics));
  });
});

describe("renovação da sessão num 401", () => {
  it("renova em /auth/me e nas rotas do app, mas não no login, cadastro ou refresh", async () => {
    const { shouldRefreshOn401 } = await import("../src/lib/session.ts");
    assert.equal(shouldRefreshOn401("/auth/me"), true);
    assert.equal(shouldRefreshOn401("/appointments"), true);
    assert.equal(shouldRefreshOn401("/auth/login"), false);
    assert.equal(shouldRefreshOn401("/auth/refresh"), false);
    assert.equal(shouldRefreshOn401("/auth/patient/register"), false);
  });
});

describe("destino interno seguro", () => {
  it("mantém caminhos internos com busca e âncora", () => {
    assert.equal(safeInternalPath("/agenda?x=1#a", "/inicio"), "/agenda?x=1#a");
  });
  it("recusa destinos que o parser de URL leva a outro host", () => {
    for (const value of [null, undefined, "", "https://mal.example", "//mal.example", "/\\mal.example", "/\tmal.example", "/\n/mal.example", "/ /mal.example"]) {
      assert.equal(safeInternalPath(value, "/inicio"), "/inicio", JSON.stringify(value));
    }
  });
});
