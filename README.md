# Votação SAB CIO — a apresentação inteira numa página (QR só para votar)

Aplicação de página única que É a sessão: no telão (`#telao`), os 18 passos sequenciais — abertura ANIMADA (multi-agentes resolvendo um problema de negócio, com log de decisões ao vivo), apresentação do Thiago, o cenário da provocação de governança, mecânica, aquecimento, P1–P8 (maturidade de agentes ATÉ estrutura de dados — plataforma governada, lineage), fotografia da sala, síntese em 4 pilares, quem somos, as 9 perguntas e o CTA — navegados com ← → (ou setas do teclado; Enter abre/revela votação). O QR aparece nos passos de votação e serve SÓ para votar: o celular do participante mostra "aguarde", acorda quando uma votação abre, confirma o voto e volta a aguardar. Ao final, a **fotografia de maturidade da sala** (índice geral 1–4 + eixos Agentes & governança e Estrutura de dados + barras das 8 provocações) é calculada dos votos reais.

## Este diretório é um repositório git
A apresentação oficial da sessão é ESTA página web (os PPTX da pasta acima foram descontinuados). Fluxo de trabalho: editar `app.html` → `python build.py` (regera `index.html`) → `git commit`. Para publicar: `gh repo create` + GitHub Pages (branch main, raiz), ou subir `index.html` na infra própria (xmm). `git push` = @devops.

## Arquivos
| Arquivo | Para quê |
|---|---|
| `index.html` | **A página pronta para hospedar** (documento completo). |
| `app.html` | O mesmo conteúdo em formato de fragmento — fonte da demo publicada no claude.ai. Editar os dois juntos (ou editar `app.html` e regerar `index.html` com o wrapper). |
| `setup-supabase.sql` | Cria tabelas + policies no Supabase (rodar no SQL Editor). |
| `build.py` | Regera `index.html` a partir de `app.html` (wrapper standalone). |

## Como colocar no ar (15 minutos)
1. **Supabase:** criar projeto gratuito em supabase.com → SQL Editor → colar e rodar `setup-supabase.sql`.
2. **Config:** em `index.html`, preencher `CONFIG.SUPABASE_URL` e `CONFIG.SUPABASE_ANON_KEY` (Settings → API do projeto). Trocar `PIN_TELAO`.
3. **Hospedar:** subir `index.html` como página estática — mesma infra do hub-ia-v2 (ex.: `votar.apllos.xmm.com.br`) ou qualquer static hosting. Sem build, sem servidor próprio.
4. **Testar:** abrir a URL em 2+ celulares (4G e Wi-Fi) e a URL + `#telao` no notebook (pede o PIN). Votar, revelar, ver as barras.

## Uso no palco
- **Telão:** `https://SUA-URL/#telao` → PIN → apresentação sequencial. Controles: **← / →** (também pelas setas do teclado), e nos passos de votação **Abrir votação** / **Revelar resultado** (Enter alterna). O QR aparece automaticamente nos passos de votação, gerado da própria URL.
- **Celular do participante:** só vota. Mostra "aguarde" fora das votações, abre a pergunta quando você liberar, confirma o voto ("o resultado está no telão") e volta a aguardar. O resultado só aparece no telão quando você revela.
- **Aquecimento:** o passo 5 (setor de origem) testa o QR com a sala logo depois da mecânica.
- **Sem config / ensaio:** sem as chaves do Supabase a página roda em **MODO DEMO** (banner avisa): votos ficam no navegador, com botão "Simular 25 votos" no telão — perfeito para ensaiar sozinho (aba normal = participante, aba `#telao` = facilitador).

## Limites assumidos (honestos)
- **Anonimato real:** nenhum dado pessoal é coletado; o "1 voto por pessoa" usa um id aleatório no navegador — quem limpar o navegador consegue votar de novo. Para enquete de sala, é o padrão do mercado (Slido faz igual no modo anônimo).
- **Segurança:** as policies do banco são abertas (ver comentário no SQL) — projeto Supabase descartável, só para o evento; o PIN do telão é trava de conveniência, não segurança forte.
- **Rede:** celulares usam a própria internet (4G funciona); o telão precisa de internet no notebook. Plano B sem internet: braço levantado (slide 4 do deck já prepara a sala).
- Índice de maturidade da sala = leitura ilustrativa dos votos (rodapé do telão avisa); a régua formal sai de assessment.

## Demo publicada
Uma versão em modo demo está publicada como artifact (link na conversa) para avaliar o visual e ensaiar — a votação de verdade roda na SUA hospedagem, porque a plataforma do claude.ai não aceita escrita de visitantes anônimos.
