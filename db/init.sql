-- Votação SAB CIO 2026 — schema (Postgres via Docker; roda sozinho no primeiro start)

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
