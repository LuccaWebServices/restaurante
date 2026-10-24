# Template de site para restaurante (PT-PT / EN)

Site estático, bilingue e rápido para restaurantes locais em Portugal. Todo o conteúdo vem de **um único ficheiro de configuração** (`site.config.js`). Um script Node **sem dependências** gera o HTML final para a pasta `docs/`, que é publicada no **GitHub Pages**.

- 3 temas completos (tradicional, moderno, elegante) + 2 layouts de hero, trocáveis numa linha
- 13 secções, cada uma ligável/desligável (desaparece do HTML, do menu, do JSON-LD e do sitemap)
- Ementa em HTML real, com os 14 alergénios da UE, etiquetas de dieta e filtros
- "Aberto agora / Fecha às… / Abre às…" calculado no fuso Europe/Lisbon, com vários turnos, feriados e férias
- SEO: títulos e descrições por página e idioma, canonical, hreflang, Open Graph, JSON-LD (Restaurant, Menu, FAQPage, BreadcrumbList, WebSite), sitemap com alternates
- RGPD: sem cookies, sem analytics, fontes self-hosted, mapa só com clique, política de privacidade gerada a partir do que está ativo
- Livro de Reclamações Eletrónico no rodapé (obrigatório)

> A demo usa um restaurante **fictício** ("Lume — Casa de Brasa"). Morada, contactos e avaliações são inventados.

---

## Estrutura de pastas

```
.
├── site.config.js           ← A CONFIGURAÇÃO (o único ficheiro a editar no dia a dia)
├── build.mjs                ← gera o site:  node build.mjs
├── package.json             ← só atalhos (npm run build / serve); sem dependências
├── docs/                    ← SITE GERADO (é isto que o GitHub Pages publica). Não editar à mão.
├── src/
│   ├── templates/           ← HTML das páginas e secções (funções JS com template strings)
│   │   ├── layout.mjs       ←   <head>, cabeçalho, rodapé, barra móvel
│   │   ├── sections.mjs     ←   todas as secções da página inicial
│   │   ├── pages.mjs        ←   página inicial, ementa, privacidade, 404
│   │   └── privacy.mjs      ←   texto da Política de Privacidade (PT/EN)
│   ├── i18n/ui.mjs          ← textos de interface PT/EN, âncoras, alergénios, dietas
│   ├── build/               ← validação, horários, JSON-LD, utilitários
│   ├── css/                 ← fonts, themes (os 3 temas), base, components, sections
│   ├── js/main.js           ← JavaScript do site (vanilla)
│   └── assets/
│       ├── img/             ← logo, hero, pratos, sobre, equipa, galeria, mapa, og, legal, icons
│       ├── fonts/           ← Lora, Inter, Playfair Display (woff2, self-hosted)
│       ├── icons/           ← ícones SVG (Bootstrap Icons + 4 próprios) → sprite automático
│       ├── vendor/bootstrap ← Bootstrap 5.3.3 (local)
│       └── pdf/             ← (opcional) ementa em PDF
├── tools/gerar-placeholders.mjs  ← gera as imagens placeholder da demo
├── README.md · CONFIGURACAO.md · ADAPTAR-AO-CLIENTE.md
├── CHECKLIST-LANCAMENTO.md · SEO-FORA-DO-CODIGO.md · CREDITOS.md
```

### Páginas geradas

| Página | PT (padrão) | EN |
|---|---|---|
| Inicial | `/` | `/en/` |
| Ementa (se `menu.ownPage: true`) | `/ementa/` | `/en/menu/` |
| Política de Privacidade | `/privacidade/` | `/en/privacy/` |
| 404 bilingue | `/404.html` | (a mesma) |

Mais: `sitemap.xml`, `robots.txt`, `site.webmanifest`, `favicon.ico`, `.nojekyll` e `CNAME` (se houver domínio).

---

## Requisitos

Só o **Node.js 18 ou superior** (https://nodejs.org, versão LTS). Não há `npm install`: o projeto não tem dependências.

## Gerar o site

```bash
node build.mjs            # gera docs/
node build.mjs --serve    # gera e abre a pré-visualização em http://localhost:8080/<caminho>/
node build.mjs --strict   # falha se ainda houver [PLACEHOLDERS] (use antes de lançar)
```

O build:
1. valida `site.config.js` e, se faltar algo, mostra **erros claros com o caminho do campo** (ex.: `menu.categories[2].items[0].price: preço em falta…`);
2. verifica o contraste das cores sobrepostas (WCAG AA);
3. gera todas as páginas PT e EN, o sitemap e o resto;
4. lista os `[PLACEHOLDERS]` que ainda aparecem no site.

> O servidor de pré-visualização usa o mesmo caminho do `site.url` (ex.: `/restaurante-demo/`), para simular o GitHub Pages. Abrir os ficheiros diretamente (`file://`) também funciona na maior parte, mas os links para pastas (`ementa/`) abrem listagens de diretório: use `--serve`.

## Trocar de tema

Em `site.config.js`:

```js
theme: {
  name: 'moderno',      // 'tradicional' | 'moderno' | 'elegante'
  heroLayout: null,     // null (do tema) | 'image' | 'split'
  colors: { accent: null, accentContrast: null, accentText: null },
},
```

Corra `node build.mjs`. Com `site.demo: true` aparece também um seletor de tema no topo, útil para mostrar as 3 variantes a um lead sem fazer build.

## Publicar no GitHub Pages (passo a passo)

1. **Crie o repositório** em https://github.com/new (ex.: `restaurante-demo`). Pode ser público (o plano gratuito só publica Pages a partir de repositórios públicos).
2. **Defina o URL** em `site.config.js` → `site.url: 'https://UTILIZADOR.github.io/restaurante-demo/'` (com `/` no fim) e corra `node build.mjs`.
3. **Envie os ficheiros** (incluindo a pasta `docs/`, que tem de estar commitada):
   ```bash
   git init
   git add .
   git commit -m "Site do restaurante"
   git branch -M main
   git remote add origin https://github.com/UTILIZADOR/restaurante-demo.git
   git push -u origin main
   ```
   (Sem linha de comandos: no GitHub, "Add file → Upload files" e arraste tudo, ou use o GitHub Desktop.)
4. No repositório: **Settings → Pages → Build and deployment → Source: "Deploy from a branch" → Branch: `main` / pasta `/docs` → Save.**
5. Em 1–2 minutos o site fica em `https://UTILIZADOR.github.io/restaurante-demo/`.
6. **Atualizar**: edite `site.config.js` → `node build.mjs` → commit e push (inclua sempre `docs/`).

### Domínio próprio

1. `site.url: 'https://www.restaurante.pt/'` e `site.customDomain: 'www.restaurante.pt'` → `node build.mjs` (gera `docs/CNAME`).
2. No fornecedor do domínio, crie um registo **CNAME** `www` → `UTILIZADOR.github.io`. Para o domínio sem `www`, crie registos **A** para `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
3. GitHub → Settings → Pages → Custom domain → `www.restaurante.pt` → Save; quando ficar disponível, ative **Enforce HTTPS**.

Os links internos são todos relativos, por isso funcionam na raiz, numa subpasta e com domínio próprio sem mexer em nada. Só `canonical`, `hreflang`, Open Graph, sitemap e JSON-LD usam URLs absolutos (exigência das normas), e esses vêm de `site.url`.

---

## Decisões técnicas (resumo)

- **`site.config.js` em vez de JSON**: permite comentários ao lado de cada campo (o ficheiro serve de manual), vírgulas finais e textos com aspas sem escapes. Não é publicado: só o resultado em `docs/` vai para o site.
- **Bootstrap 5.3.3 local** (CSS + bundle JS para menu móvel, acordeão e modal). Sem jQuery e sem CDN, por isso não há SRI a gerir nem pedidos a terceiros.
- **Ícones**: SVG inline num sprite gerado por página, só com os ícones usados (não carrega a fonte de 100 KB+ do Bootstrap Icons).
- **CSP por meta tag**: `script-src 'self'` + hash do único script inline (calculado no build). O mapa (`frame-src`) e o EmailJS (`connect-src`) só são autorizados quando estão ligados.
- **Performance**: CSS num só ficheiro com cache-busting, JS com `defer`, fontes woff2 só do tema ativo com `preload` e `font-display: swap`, imagens com `width`/`height`, `loading="lazy"` e `fetchpriority="high"` no hero.
- **404**: usa `<base href>` derivado de `site.url`, para os caminhos funcionarem em qualquer URL inexistente.

Ver também: [CONFIGURACAO.md](CONFIGURACAO.md) · [ADAPTAR-AO-CLIENTE.md](ADAPTAR-AO-CLIENTE.md) · [CHECKLIST-LANCAMENTO.md](CHECKLIST-LANCAMENTO.md) · [SEO-FORA-DO-CODIGO.md](SEO-FORA-DO-CODIGO.md) · [CREDITOS.md](CREDITOS.md)
