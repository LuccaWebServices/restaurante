# Guia de configuração

Tudo se faz em **`site.config.js`**. Depois de cada alteração:

```bash
node build.mjs --serve     # gera e pré-visualiza em http://localhost:8080/...
```

Se houver algum erro, o build diz **qual o campo** e **o que está mal**. Corrija e volte a correr.

**Regras de escrita**
- Textos traduzíveis: `{ pt: 'Texto em português', en: 'English text' }`.
- Apóstrofos: dentro de `'...'` use `’` (tipográfico) ou troque para aspas: `"It's"`.
- Preços: número com ponto, `14.5` (aparece "14,50 €" em PT e "€14.50" em EN).
- Horas `"HH:MM"`, turnos `"12:00-15:00"`, datas `"AAAA-MM-DD"`.
- Caminhos de imagens relativos a `src/` (ex.: `'assets/img/pratos/polvo.webp'`).

---

## 1. Logótipo e imagens

Coloque as imagens em `src/assets/img/` (são copiadas para o site no build) e atualize os caminhos e as dimensões (`width`/`height` em píxeis) em `site.config.js`.

| Imagem | Pasta | Tamanho recomendado | Formato | Onde se configura |
|---|---|---|---|---|
| Logótipo | `img/logo/` | altura 96 px (mostrado a 48 px) | SVG ou WebP com transparência | `business.logo.image` |
| Símbolo (ao lado do nome) | `img/logo/` | 64×64 | SVG | `business.logo.mark` |
| Hero | `img/hero/` | 1600×1000 (máx. ~250 KB) | WebP, qualidade 75–80 | `hero.image` |
| Pratos (destaques, prato do dia) | `img/pratos/` | 800×600 (4:3) | WebP | `menu…items[].image`, `dailySpecial.image` |
| Sobre nós | `img/sobre/` | 1000×1200 (5:6) | WebP | `about.image` |
| Equipa | `img/equipa/` | 600×600 (quadrado) | WebP | `team.members[].photo` |
| Galeria | `img/galeria/` | 1200×900 (4:3) | WebP | `gallery.images[]` |
| Partilha em redes (Open Graph) | `img/og/` | **1200×630** | JPG ou PNG (as redes não aceitam SVG nem sempre WebP) | `business.ogImage` |
| Mapa (antes de carregar) | `img/mapa/` | 1200×700 | WebP/SVG | `location.map.placeholder` |
| Favicon e ícones | `img/icons/` | `favicon.svg`, `favicon.ico` (32), `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | SVG/PNG/ICO | substituir os ficheiros com o mesmo nome |

**Converter fotos para WebP:** https://squoosh.app (gratuito, no browser): escolha WebP, qualidade 75–80, redimensione para o tamanho da tabela. Mantenha cada foto abaixo de 200 KB.

**Texto alternativo (`alt`)**: descreva o que se vê ("Polvo à lagareiro com batata a murro"), em PT e EN. É importante para acessibilidade e SEO.

> As imagens atuais são ilustrações SVG geradas por `tools/gerar-placeholders.mjs`. Podem ser regeneradas com `node tools/gerar-placeholders.mjs --force`.

## 2. Ementa e preços

Em `menu.categories`. Cada categoria tem `id` (só minúsculas e hífens), `name` e `items`:

```js
{
  name: { pt: 'Polvo à lagareiro', en: 'Octopus “à lagareiro”' },
  description: { pt: 'Com batata a murro e azeite', en: 'With crushed potatoes and olive oil' }, // opcional
  price: 19.5,
  priceNote: { pt: 'para 2', en: 'for 2' },        // opcional ("por pessoa", "kg", ...)
  diet: ['glutenFree'],                              // vegetarian, vegan, glutenFree, spicy
  allergens: ['molluscs'],                           // OBRIGATÓRIO (use [] se não tiver)
  featured: true,                                    // aparece nos destaques da página inicial
  image: { src: 'assets/img/pratos/polvo.webp', width: 800, height: 600, alt: { pt: '…', en: '…' } }, // opcional
},
```

- **Mudar um preço**: altere o número e corra o build.
- **Retirar um prato**: apague o bloco `{ … },` (ou comente com `//`).
- **Nova categoria**: copie uma categoria existente, mude `id`, `name` e `items`.
- **Ordem**: a ordem no ficheiro é a ordem no site.
- `menu.ownPage: true` (recomendado) cria a página `/ementa/` com a ementa completa (ótima para **QR codes nas mesas**); a página inicial mostra os pratos `featured`. Com `false`, a ementa completa aparece na página inicial.
- **PDF opcional**: coloque o ficheiro em `src/assets/pdf/` e defina `menu.pdf: { pt: 'assets/pdf/ementa.pdf', en: 'assets/pdf/menu-en.pdf' }`. A ementa HTML continua a ser a principal (é a que o Google indexa).

## 3. Alergénios

Os 14 alergénios de declaração obrigatória (Regulamento (UE) n.º 1169/2011, Anexo II) usam estes códigos:

| Código | PT | Código | PT |
|---|---|---|---|
| `gluten` | Cereais com glúten | `celery` | Aipo |
| `crustaceans` | Crustáceos | `mustard` | Mostarda |
| `eggs` | Ovos | `sesame` | Sésamo |
| `fish` | Peixe | `sulphites` | Sulfitos |
| `peanuts` | Amendoins | `lupin` | Tremoço |
| `soy` | Soja | `molluscs` | Moluscos |
| `milk` | Leite | `nuts` | Frutos de casca rija |

- **A informação tem de ser confirmada pelo restaurante**, com as fichas técnicas e os rótulos dos fornecedores (ex.: chouriço, molhos, bolachas, vinho). O site só mostra o que estiver na configuração.
- O build recusa incoerências óbvias (prato "sem glúten" com glúten, "vegano" com leite/ovos/peixe).
- O aviso de alergias é configurável em `menu.allergyNotice`.
- Os filtros do site têm um aviso de que são indicativos.

## 4. Prato do dia / menu executivo

Em `dailySpecial`:

```js
price: 11.5,
includes: { pt: ['Sopa', 'Prato do dia', 'Bebida', 'Café'], en: [...] },
when: { pt: 'Terça a sexta, ao almoço…', en: '…' },
week: {
  tue: { pt: 'Frango assado…', en: 'Roast chicken…' },
  wed: { … }, thu: { … }, fri: { … },  // dias sem prato: omita a linha
},
```

O site destaca automaticamente o prato **de hoje** (hora de Lisboa). Atualize a semana à segunda-feira (ver rotina em ADAPTAR-AO-CLIENTE.md). Para desligar: `sections.dailySpecial: false`.

## 5. Horários com vários turnos, folgas, feriados e férias

```js
hours: {
  weekly: {
    mon: [],                                  // dia de descanso
    tue: ['12:00-15:00', '19:00-22:30'],      // dois turnos
    sat: ['12:00-15:30', '19:00-23:00'],
    sun: ['12:00-15:30'],
    // turno depois da meia-noite: '19:00-01:00'
  },
  special: [                                  // um dia com horário diferente
    { date: '2026-12-24', shifts: ['12:00-15:00'], label: { pt: 'Véspera de Natal', en: 'Christmas Eve' } },
    { date: '2026-12-25', shifts: [], label: { pt: 'Natal', en: 'Christmas Day' } }, // fechado
  ],
  closures: [                                 // vários dias seguidos (férias)
    { from: '2027-08-01', to: '2027-08-15', label: { pt: 'Férias', en: 'Holidays' } },
  ],
},
```

- O estado **"Aberto agora / Fecha em breve / Fechado · abre amanhã às 12:00"** é calculado no browser com o fuso `Europe/Lisbon` (a hora de verão é tratada automaticamente) e atualiza-se a cada minuto.
- Feriados e férias passados desaparecem sozinhos da lista; não precisa de os apagar logo.
- Os horários também vão para o Google (JSON-LD `openingHoursSpecification` e `specialOpeningHoursSpecification`). **Mantenha o Google Business Profile com o mesmo horário.**

## 6. Textos PT/EN

- **Textos do negócio e das secções**: `site.config.js` (cada secção tem `title`, `intro`, `navLabel`).
- **Títulos e descrições para o Google**: `seo.home`, `seo.menu`, `seo.privacy` (título ≈ 60 caracteres, descrição ≈ 155). Inclua naturalmente o tipo de cozinha e a localidade ("restaurante de grelhados em Oeiras"), sem repetir palavras-chave.
- **Textos de interface** (botões, mensagens do formulário, "Hoje", etc.): `src/i18n/ui.mjs`. Raramente é preciso mexer.
- **Âncoras dos URLs** (`#ementa` / `#menu`): `SECTION_IDS` em `src/i18n/ui.mjs`.

## 7. Cores e tema

- `theme.name`: `'tradicional'`, `'moderno'` ou `'elegante'`.
- `theme.heroLayout`: `null` (o do tema), `'image'` (imagem de fundo) ou `'split'` (texto + imagem).
- `theme.colors` (opcional), para usar a cor da marca do cliente:
  - `accent`: fundo dos botões; `accentContrast`: texto sobre os botões; `accentText`: cor de destaque em texto/links.
  - O build **calcula o contraste** e avisa se ficar abaixo de 4.5:1 (WCAG AA). Use https://webaim.org/resources/contrastchecker/ para testar alternativas.
- Para afinar um tema (fontes, raios, sombras, outras cores): `src/css/themes.css`. Se mudar `--bg`, atualize também `THEMES` em `build.mjs`.

## 8. Ligar e desligar secções

```js
sections: {
  dailySpecial: true,
  menu: true,
  about: true,
  team: false,      // ← desligada: sai do HTML, do menu, do JSON-LD e do sitemap
  …
},
navigation: ['menu', 'about', 'gallery', 'events', 'hours', 'location', 'contact'],
```

- **A ordem das linhas em `sections` é a ordem das secções na página.**
- `navigation` define o menu do topo (só aparecem secções ligadas).
- Secções que se escondem sozinhas: avaliações sem `items`, galeria sem imagens, FAQ sem perguntas, entrega sem take-away nem plataformas.
- Extras em `features`: barra móvel, voltar ao topo, sugestão de idioma, animações.

## 9. Reservas

`reservations.method` define **um** método (o site explica-o ao visitante):

| Método | O que acontece | Requisitos |
|---|---|---|
| `'external'` | Botão "Reservar em TheFork" (ou outra) | `reservations.external: { name, url }` com o link **da página do restaurante** |
| `'phone'` | Botão de ligar | `business.phone` |
| `'whatsapp'` | Abre o WhatsApp com mensagem pré-escrita | `business.whatsapp`, `reservations.whatsappMessage` |
| `'form'` | Formulário de pedido de reserva | `form.enabled: true` + EmailJS (secção 13) |

O botão "Reservar" do topo, do hero e da barra móvel segue o método escolhido. O telefone e o WhatsApp aparecem sempre como alternativas.

## 10. Entrega e take-away

```js
delivery: {
  takeaway: { enabled: true, text: { pt: '…', en: '…' } },
  platforms: [
    { name: 'Uber Eats', url: 'https://www.ubereats.com/pt/store/…' },  // link da página do restaurante
    { name: 'Glovo', url: '' },                                          // vazio = escondido
  ],
},
```

## 11. Livro de Reclamações Eletrónico (obrigatório)

- O link está no rodapé de todas as páginas: `legal.complaintsBook.url` (por omissão `https://www.livroreclamacoes.pt/Inicio/`).
- **Logótipo oficial**: descarregue-o em https://www.livroreclamacoes.pt (área de operadores económicos), guarde-o em `src/assets/img/legal/` e atualize `legal.complaintsBook.logo` (`src`, `width`, `height`). O ficheiro atual é um placeholder genérico, não é o logótipo oficial.
- O restaurante tem de estar registado na plataforma e ter também o livro físico no estabelecimento.
- Preencha `legal.legalName`, `legal.nif` e, se aplicável, `legal.license` (**nunca invente números**; deixe `''` se não houver para mostrar).

## 12. Mapa (com consentimento)

- `location.map.enabled: true`: aparece uma imagem com o botão **"Carregar mapa"**. O iframe do Google Maps **só é carregado depois do clique**. Antes disso não é enviado nada à Google e não há cookies de terceiros.
- O visitante pode marcar "Lembrar a minha escolha" (guardado em `localStorage`, só no dispositivo dele).
- O mapa usa `business.geo` (latitude/longitude). Para obter: Google Maps → clique com o botão direito no local → clique nas coordenadas para copiar.
- `location.googleMapsUrl` (opcional): link da ficha do restaurante, usado em "Como chegar".
- Com o mapa ligado, a CSP autoriza `https://www.google.com` e a Política de Privacidade inclui automaticamente o bloco do mapa. Com o mapa desligado, ambos desaparecem.

## 13. Formulário (EmailJS)

Desligado por padrão. Para ligar:

1. Crie conta em https://www.emailjs.com (o plano gratuito chega para um restaurante).
2. **Email Services → Add New Service** → ligue o email do restaurante → copie o **Service ID**.
3. **Email Templates → Create New Template**. Use estas variáveis:
   ```
   Assunto: Pedido de reserva — {{name}} — {{date}} {{time}}
   Nome: {{name}}
   Email: {{email}}
   Telefone: {{phone}}
   Data: {{date}}  Hora: {{time}}  Pessoas: {{people}}
   Observações: {{notes}}
   Idioma: {{language}} · Página: {{page}}
   ```
   Em "Reply To" ponha `{{email}}`. Copie o **Template ID**.
4. **Account → General** → copie a **Public Key**.
5. **Account → Security**: mantenha **desligada** a opção "Allow EmailJS API for non-browser applications" e, se a opção existir no seu plano, restrinja os pedidos ao domínio do site.
6. Em `site.config.js`:
   ```js
   form: {
     enabled: true,
     maxPeople: 20,
     emailjs: { publicKey: '…', serviceId: '…', templateId: '…' },
     retention: { pt: '12 meses', en: '12 months' },
     emailProvider: 'Google Workspace (Google Ireland Limited)', // onde chegam os emails
   },
   ```
   Para ser o método de reserva: `reservations.method: 'form'`. Caso contrário o formulário aparece na secção Contactos.
7. `node build.mjs` e teste um envio real.

O formulário tem validação acessível (mensagens por campo), campo isco (honeypot) e bloqueio de envios instantâneos contra spam, e consentimento RGPD obrigatório com link para a política. A política passa a incluir automaticamente o bloco "Pedidos de reserva e contacto", com o prazo de conservação (`form.retention`) e o fornecedor de email (`form.emailProvider`).

## 14. Domínio próprio

Ver README.md → "Domínio próprio". Resumo: `site.url` + `site.customDomain` → build → DNS → GitHub Pages "Custom domain" → "Enforce HTTPS".

## 15. Privacidade, cookies e analytics

- O site **não usa cookies** nem analytics, por isso **não precisa de banner de cookies**. Só guarda no `localStorage`: idioma, mapa aceite e (na demo) o tema.
- A Política de Privacidade (`/privacidade/`, `/en/privacy/`) é gerada a partir da configuração. Os dados do responsável vêm de `legal.*`. É um **modelo base**: recomenda-se revisão por um profissional jurídico. Depois, ponha `legal.showTemplateNotice: false`.
- **Se um dia adicionar analytics**: há um comentário no `<head>` (`src/templates/layout.mjs`) a indicar onde entra o banner de consentimento, e um bloco comentado em `src/templates/privacy.mjs` para a política. O script só pode carregar depois do consentimento, e a CSP tem de autorizar o domínio da ferramenta.

## 16. Antes de entregar ao cliente

- `site.demo: false` (remove a faixa de demonstração e o seletor de temas).
- `testimonials.isDemo: false` e avaliações reais (com autorização), ou `items: []`.
- `node build.mjs --strict` para garantir que não ficou nenhum `[PLACEHOLDER]`.
- Siga o [CHECKLIST-LANCAMENTO.md](CHECKLIST-LANCAMENTO.md).
