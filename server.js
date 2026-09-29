/* Votação SAB CIO — API mínima + servidor estático da página.
   Endpoints: GET/PUT /api/sessao · GET/POST/DELETE /api/votos|/api/voto */
"use strict";
const express = require("express");
const { Pool } = require("pg");

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const SESSAO = process.env.SESSAO_ID || "sabcio2026";
const PORTA = process.env.PORT || 8080;
const ESTADOS = new Set(["aguardando", "aberta", "resultado"]);

app.use(express.json({ limit: "2kb" }));

async function sessaoAtual() {
  const r = await pool.query("select idx, estado from sessao where id = $1", [SESSAO]);
  if (r.rows.length) return r.rows[0];
  await pool.query("insert into sessao (id) values ($1) on conflict do nothing", [SESSAO]);
  return { idx: 0, estado: "aguardando" };
}

app.get("/api/sessao", async (_req, res) => {
  try { res.json(await sessaoAtual()); }
  catch (e) { res.status(500).json({ erro: "banco indisponível" }); }
});

app.put("/api/sessao", async (req, res) => {
  try {
    const idx = Number.isInteger(req.body.idx) ? req.body.idx : null;
    const estado = ESTADOS.has(req.body.estado) ? req.body.estado : null;
    const r = await pool.query(
      `update sessao set idx = coalesce($2, idx), estado = coalesce($3, estado),
       atualizado_em = now() where id = $1 returning idx, estado`,
      [SESSAO, idx, estado]);
    res.json(r.rows[0] || await sessaoAtual());
  } catch (e) { res.status(500).json({ erro: "banco indisponível" }); }
});

app.post("/api/voto", async (req, res) => {
  try {
    const { pergunta, opcao, votante } = req.body || {};
    if (typeof pergunta !== "string" || pergunta.length > 12 ||
        typeof opcao !== "string" || opcao.length > 2 ||
        typeof votante !== "string" || votante.length > 64)
      return res.status(400).json({ erro: "voto inválido" });
    await pool.query(
      `insert into votos (sessao_id, pergunta, opcao, votante) values ($1,$2,$3,$4)
       on conflict (sessao_id, pergunta, votante) do update set opcao = excluded.opcao`,
      [SESSAO, pergunta, opcao, votante]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ erro: "banco indisponível" }); }
});

app.get("/api/votos", async (_req, res) => {
  try {
    const r = await pool.query("select pergunta, opcao from votos where sessao_id = $1", [SESSAO]);
    res.json(r.rows);
  } catch (e) { res.status(500).json({ erro: "banco indisponível" }); }
});

app.delete("/api/votos", async (_req, res) => {
  try {
    await pool.query("delete from votos where sessao_id = $1", [SESSAO]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ erro: "banco indisponível" }); }
});

app.use(express.static(__dirname, { extensions: ["html"] }));

app.listen(PORTA, () => console.log("Votação SAB CIO no ar em http://localhost:" + PORTA));
