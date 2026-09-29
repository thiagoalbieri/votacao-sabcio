# Votação SAB CIO — a apresentação inteira numa página (QR só para votar)

Aplicação de página única que É a sessão: no telão (`#telao`), os 18 passos sequenciais — dinâmica da Connect Session (QR já na abertura), apresentação breve do Thiago, os multi-agentes ANIMADOS resolvendo um problema de negócio (log de decisões ao vivo), o cenário da provocação de governança, aquecimento, P1–P9 (maturidade de agentes, estrutura de dados e modelo de governo central × federado), fotografia da sala, síntese em 4 pilares, quem somos, as 9 perguntas e o CTA — navegados com ← → (ou setas do teclado; Enter abre/revela votação). O QR aparece nos passos de votação e serve SÓ para votar: o celular do participante mostra "aguarde", acorda quando uma votação abre, confirma o voto e volta a aguardar. Ao final, a **fotografia de maturidade da sala** (índice geral 1–4 + eixos Agentes & governança e Estrutura de dados + barras das 8 provocações) é calculada dos votos reais.

## Este diretório é um repositório git
A apresentação oficial da sessão é ESTA página web (os PPTX da pasta acima foram descontinuados). Fluxo de trabalho: editar `app.html` → `python build.py` (regera `index.html`) → `git commit`. Deploy: **Docker Compose desta pasta** (Postgres + API + página, tudo junto) na infra própria. `git push` = @devops.

## Arquivos
| Arquivo | Para quê |
|---|---|
| `index.html` | **A página pronta para hospedar** (documento completo). |
| `app.html` | O mesmo conteúdo em formato de fragmento — fonte da demo publicada no claude.ai. Editar os dois juntos (ou editar `app.html` e regerar `index.html` com o wrapper). |
| `build.py` | Regera `index.html` a partir de `app.html` (wrapper standalone). |
| `guia-facilitador.html` + `Guia do Facilitador - SAB CIO 2026.pdf` | Cola de condução: arco 19 passos, leituras por alternativa, faixas de maturidade, Q&A, números com fonte, checklist. Regerar o PDF: `msedge --headless --no-pdf-header-footer --print-to-pdf="Guia....pdf" file:///.../guia-facilitador.html`. |
| `server.js` + `package.json` | API mínima (Express + pg): sessão, votos, upsert — e serve a própria página. |
| `Dockerfile` + `docker-compose.yml` | Stack completo: Postgres 16 + app na porta 8080. |
| `db/init.sql` | Schema do banco — roda sozinho no primeiro start do Postgres. |

## Onde está no ar (produção)
| O quê | URL |
|---|---|
| **Aplicação completa (Railway: app + Postgres gerenciado)** | https://app-production-5c10.up.railway.app — telão: `#telao` |
| Vitrine no GitHub Pages (usa a API da Railway via `CONFIG.API_REMOTA`) | https://thiagoalbieri.github.io/votacao-sabcio/ |

Redeploy após mudanças: `python build.py` → commit → `railway up --service app --detach` (nesta pasta, projeto `votacao-sabcio`). O schema do banco é criado pelo próprio servidor no boot (idempotente). Se o backend mudar de endereço, atualizar `CONFIG.API_REMOTA` em `app.html` para o Pages acompanhar.

## Como colocar no ar (Docker)
1. Nesta pasta: `DB_SENHA=uma-senha-forte docker compose up -d --build` (Windows PowerShell: `$env:DB_SENHA="uma-senha-forte"; docker compose up -d --build`).
2. Página no ar em `http://localhost:8080` — o schema do banco sobe sozinho no primeiro start.
3. Expor na internet pelo caminho de sempre da infra (reverse proxy / subdomínio, ex. `votar.apllos.xmm.com.br` → porta 8080). **HTTPS obrigatório** — câmera de celular só abre link http em alguns aparelhos com aviso.
4. O PIN do telão não fica no código: `CONFIG.PIN_HASH` guarda o SHA-256. Para trocar o PIN, gerar novo hash (comando no comentário do CONFIG) e rebuildar.
5. Testar: URL em 2+ celulares (4G e Wi-Fi) e URL + `#telao` no notebook. A página detecta a API sozinha — se o backend cair, ela avisa (banner MODO DEMO) e o plano B é braço levantado.

## Uso no palco
- **Telão:** `https://SUA-URL/#telao` → PIN → apresentação sequencial. Controles: **← / →** (também pelas setas do teclado), e nos passos de votação **Abrir votação** / **Revelar resultado** (Enter alterna). O QR aparece automaticamente nos passos de votação, gerado da própria URL.
- **Celular do participante:** só vota. Mostra "aguarde" fora das votações, abre a pergunta quando você liberar, confirma o voto ("o resultado está no telão") e volta a aguardar. O resultado só aparece no telão quando você revela.
- **Aquecimento:** o passo 5 (setor de origem) testa o QR com a sala logo depois da mecânica.
- **Sem config / ensaio:** sem as chaves do Supabase a página roda em **MODO DEMO** (banner avisa): votos ficam no navegador, com botão "Simular 25 votos" no telão — perfeito para ensaiar sozinho (aba normal = participante, aba `#telao` = facilitador).

## Se a sala votar maturidade ALTA (o fechamento não depende de nota baixa)
A fotografia mostra uma **leitura automática** conforme o índice (baixa / média / alta). Para o caso alto, o pivô de condução:
1. **Percepção × evidência:** "Deloitte: 21% maduras de fato, 74% acham que estarão em 2 anos — em qual metade está cada resposta?" (a leitura automática já diz isso no telão).
2. **As nove perguntas viram teste, não lição:** "levem ao comitê; se as respostas sustentarem o radar, vocês SÃO os 21% — e adoraríamos conhecer o case de vocês." (humildade que gera credibilidade).
3. **O DMBOK vira elogio:** "nota alta aqui quase sempre significa fundação de dados bem-feita — o convite é projetá-la sobre os agentes; foi exatamente esse salto que fizemos no nosso case."
Nada disso exige mudar slide: os três pivôs usam o que já está no ar. As opções de voto são ancoradas em comportamento ("sei o número exato", "bloqueiam de fato") justamente para conter inflação de autoavaliação.

## Limites assumidos (honestos)
- **Anonimato real:** nenhum dado pessoal é coletado; o "1 voto por pessoa" usa um id aleatório no navegador — quem limpar o navegador consegue votar de novo. Para enquete de sala, é o padrão do mercado (Slido faz igual no modo anônimo).
- **Segurança:** a API é aberta por design (enquete anônima de evento, dados não sensíveis, sessão de 30 min): quem tiver a URL consegue, tecnicamente, votar mais de uma vez ou mexer no estado. O PIN do telão é trava de conveniência (vive no front). Não reutilizar este stack para nada além da enquete; derrubar o container após o evento (`docker compose down -v`).
- **Rede:** celulares usam a própria internet (4G funciona); o telão precisa de internet no notebook. Plano B sem internet: braço levantado (slide 4 do deck já prepara a sala).
- Índice de maturidade da sala = leitura ilustrativa dos votos (rodapé do telão avisa); a régua formal sai de assessment.

## Demo publicada
Uma versão em modo demo está publicada como artifact (link na conversa) para avaliar o visual e ensaiar — a votação de verdade roda na SUA hospedagem, porque a plataforma do claude.ai não aceita escrita de visitantes anônimos.
