-- Votação SAB CIO 2026 — rodar no SQL Editor de um projeto Supabase (plano free serve)
-- Depois: copiar URL do projeto + chave "anon public" para o CONFIG do index.html.

create table if not exists sessao (
  id text primary key,
  idx integer not null default 0,              -- passo atual da apresentação (0-based)
  estado text not null default 'aguardando',   -- aguardando | aberta | resultado
  atualizado_em timestamptz default now()
);

insert into sessao (id) values ('sabcio2026') on conflict do nothing;

create table if not exists votos (
  sessao_id text not null,
  pergunta  text not null,
  opcao     text not null check (char_length(opcao) <= 2),
  votante   text not null check (char_length(votante) <= 64),
  criado_em timestamptz default now(),
  primary key (sessao_id, pergunta, votante)
);

alter table sessao enable row level security;
alter table votos  enable row level security;

-- Plateia anônima precisa ler o estado, votar (insert/upsert) e — no telão — ler os votos.
create policy "sessao_select_publico" on sessao for select using (true);
create policy "sessao_update_publico" on sessao for update using (true) with check (true);
create policy "votos_select_publico"  on votos  for select using (true);
create policy "votos_insert_publico"  on votos  for insert with check (true);
create policy "votos_update_proprio"  on votos  for update using (true) with check (true);
create policy "votos_delete_publico"  on votos  for delete using (true);

-- HONESTIDADE SOBRE SEGURANÇA: estas policies são abertas de propósito — é uma enquete
-- anônima de evento, os dados não são sensíveis e a sessão dura 30 minutos. Quem tiver a
-- URL consegue, tecnicamente, votar mais de uma vez (trocando o id local) ou mexer no
-- estado. Para uma sala de congresso, o risco é aceitável; NÃO reutilizar este projeto
-- Supabase para nada além da enquete, e apagar o projeto (ou as tabelas) após o evento.
