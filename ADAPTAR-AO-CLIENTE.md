# Adaptar o template a um cliente (≈ 30 minutos)

Siga pela ordem. Tudo é feito em `site.config.js`, exceto as imagens.

## Antes de começar: peça ao cliente (por email ou WhatsApp)

- [ ] Nome comercial, slogan e tipo de cozinha
- [ ] Morada completa, telefone fixo/móvel, WhatsApp, email
- [ ] Horário de cada dia (com os turnos), dia de descanso, férias previstas
- [ ] Ementa atual com preços **e alergénios de cada prato** (pedir as fichas técnicas)
- [ ] Prato do dia: preço, o que inclui, dias
- [ ] Logótipo (de preferência SVG ou PNG grande) e 10–20 fotos (pratos, sala, esplanada, equipa)
- [ ] Links: TheFork/Zomato, Uber Eats/Glovo/Bolt Food, Facebook, Instagram, ficha do Google
- [ ] Denominação social, NIF, licença/alvará (se quiser mostrar), email para privacidade
- [ ] Estacionamento, transportes, acessibilidade (rampa, WC adaptado, cadeiras de bebé, animais)

## Passo a passo

| # | Tempo | O quê | Onde (`site.config.js`) |
|---|---|---|---|
| 1 | 2 min | Copiar a pasta do template para uma nova pasta/repositório do cliente | — |
| 2 | 1 min | `site.demo: false`, `site.url` com o URL final, `site.customDomain` se houver | `site` |
| 3 | 2 min | Escolher o tema que combina com o restaurante e, se preciso, a cor da marca | `theme` |
| 4 | 3 min | Ligar/desligar secções e definir o menu do topo | `sections`, `navigation` |
| 5 | 4 min | Nome, slogan, cozinha, morada, coordenadas, contactos, redes, pagamentos | `business` |
| 6 | 3 min | Horário semanal, feriados especiais, férias | `hours` |
| 7 | 3 min | Títulos e descrições para o Google (PT e EN), com a localidade | `seo` |
| 8 | 6 min | Ementa: categorias, pratos, preços, alergénios, dietas, `featured` | `menu` |
| 9 | 2 min | Prato do dia (ou desligar) | `dailySpecial` |
| 10 | 3 min | Textos: hero, sobre nós, equipa, eventos, FAQ | `hero`, `about`, `team`, `events`, `faq` |
| 11 | 2 min | Reservas (método e link) e entregas | `reservations`, `delivery` |
| 12 | — | Avaliações: apagar as fictícias (`items: []`) ou pôr reais com autorização; `isDemo: false` | `testimonials` |
| 13 | 3 min | Imagens: converter para WebP, copiar para `src/assets/img/…`, atualizar caminhos, dimensões e `alt` | ver CONFIGURACAO.md §1 |
| 14 | 1 min | Dados legais e Livro de Reclamações (logótipo oficial) | `legal` |
| 15 | 1 min | `node build.mjs --strict` até não haver erros nem placeholders | — |
| 16 | — | Publicar (README.md) e seguir o CHECKLIST-LANCAMENTO.md | — |

**Dica:** escreva primeiro os textos em PT e traduza para EN no fim, todos de seguida. Peça ao cliente para rever as traduções dos pratos.

---

## Manutenção do dia a dia (para o cliente ou para si)

### Mudar o prato do dia (1 minuto, à segunda-feira)

1. Abra `site.config.js` e procure `week:` (secção 8).
2. Troque os textos de cada dia:
   ```js
   week: {
     tue: { pt: 'Frango assado com batata frita', en: 'Roast chicken with chips' },
     wed: { pt: 'Bacalhau com grão', en: 'Salt cod with chickpeas' },
     …
   },
   ```
3. `node build.mjs` → commit + push (inclua a pasta `docs/`).

**Sem computador:** no GitHub, abra `site.config.js` → ícone do lápis → edite → "Commit changes". Depois alguém tem de correr o build. Para o cliente editar sozinho, configure uma GitHub Action que corra `node build.mjs` a cada push (opcional, ver nota abaixo).

### Mudar um preço ou retirar um prato

Procure o nome do prato (Ctrl+F) em `site.config.js`, altere `price: 14.5` ou apague o bloco `{ … },`. Build → push.

### Fechar para férias ou abrir num feriado

Acrescente em `hours.closures` ou `hours.special`. O site passa a mostrar "Fechado · abre a 16 de agosto às 12:00" e a lista de encerramentos. Atualize também o Google Business Profile.

### Nota: build automático (opcional)

Se quiser que o site se reconstrua sozinho quando o `site.config.js` é editado no GitHub, crie `.github/workflows/build.yml` com um job que corre `node build.mjs` e faz commit de `docs/`. Não está incluído para manter o projeto simples e sem dependências.
