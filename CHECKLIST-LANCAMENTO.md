# Checklist de lançamento

## 1. Conteúdo e placeholders
- [ ] `node build.mjs --strict` termina sem erros (nenhum `[PLACEHOLDER]` por preencher)
- [ ] `site.demo: false` (sem faixa de demonstração nem seletor de temas)
- [ ] `site.noindex: false` (salvo se for intencional)
- [ ] `site.url` é o URL final (com `/` no fim) e o domínio está em `site.customDomain`, se aplicável
- [ ] Avaliações fictícias removidas (`testimonials.items` reais ou `[]`, `isDemo: false`)
- [ ] Todas as imagens placeholder substituídas por fotos reais em WebP (logo, hero, pratos, equipa, galeria, og-image 1200×630, ícones)
- [ ] `alt` descritivo em PT e EN em todas as imagens
- [ ] Ementa, preços e **alergénios confirmados por escrito pelo cliente**
- [ ] Textos revistos pelo cliente nos dois idiomas (sobretudo os nomes dos pratos em inglês)
- [ ] Denominação social, NIF e licença corretos (nada inventado)

## 2. Testes nos dois idiomas
- [ ] `/` e `/en/` abrem; o seletor PT | EN leva à **mesma secção** na outra língua
- [ ] A sugestão de idioma aparece (browser noutra língua), não redireciona, e desaparece ao fechar
- [ ] Páginas `/ementa/` ↔ `/en/menu/` e `/privacidade/` ↔ `/en/privacy/`
- [ ] Um URL inexistente mostra a 404 bilingue, com estilos e links a funcionar

## 3. Temas e secções
- [ ] Ver o site nos 3 temas (`theme.name`) e nos 2 heros (`heroLayout`), se o cliente ainda estiver a escolher
- [ ] Desligar cada secção, uma de cada vez, e confirmar que desaparece do menu, da página e (ementa) do sitemap
- [ ] Desligar `menu.ownPage` e confirmar a ementa completa na página inicial

## 4. Horários e "aberto agora"
- [ ] A tabela de horários mostra o dia de hoje destacado
- [ ] Testar o estado em vários momentos (pode mudar a hora do computador): durante um turno ("Aberto agora · fecha às…"), nos últimos 30 min ("Fecha em breve"), entre turnos ("abre hoje às 19:00"), no dia de descanso ("abre amanhã/terça às…")
- [ ] Um dia de `special` e um período de `closures` aparecem e são respeitados no estado
- [ ] Turno depois da meia-noite (se existir) mostra "Aberto" depois das 00:00
- [ ] Horário igual no site e no Google Business Profile

## 5. Funcionalidades
- [ ] Mapa: antes do clique **não** há pedidos a google.com (DevTools → Network); depois do clique o mapa carrega; "Lembrar" funciona
- [ ] Botões Como chegar (Google Maps, Waze, Apple Maps) levam ao local certo
- [ ] Formulário (se ativo): validação de campos, envio real recebido no email, mensagem de sucesso, honeypot
- [ ] Todos os links: telefone (`tel:`), WhatsApp, email, reservas, entregas, redes sociais
- [ ] **Livro de Reclamações**: link visível no rodapé de todas as páginas, abre https://www.livroreclamacoes.pt, logótipo oficial
- [ ] Filtros da ementa (dieta e alergénios) e navegação por categorias
- [ ] Galeria: abre o lightbox, setas e teclado (← → Esc), o foco volta à imagem ao fechar

## 6. Responsivo e acessibilidade
- [ ] 360 px, 768 px, 1024 px e 1440 px sem scroll horizontal (DevTools → modo dispositivo)
- [ ] Ementa confortável de ler no telemóvel
- [ ] Barra inferior móvel (Ligar | Reservar | Como chegar) não tapa conteúdo
- [ ] Navegar só com o teclado (Tab): "Saltar para o conteúdo", foco visível em tudo, menu móvel abre/fecha
- [ ] Com "reduzir movimento" ativo no sistema, não há animações

## 7. Validação e performance
- [ ] HTML: https://validator.w3.org/nu/ (páginas PT, EN, ementa, privacidade)
- [ ] Dados estruturados: https://search.google.com/test/rich-results e https://validator.schema.org
- [ ] Lighthouse (Chrome DevTools → Lighthouse, modo Mobile e Desktop): Performance, Acessibilidade, Boas práticas e SEO ≥ 95. Se a Performance baixar, o motivo costuma ser imagens pesadas (WebP, ≤ 200 KB)
- [ ] Pré-visualização de partilha: https://www.opengraph.xyz (imagem 1200×630, título e descrição)
- [ ] Consola do browser sem erros (incluindo de CSP)

## 8. Publicação e Google
- [ ] GitHub Pages ativo (main / `/docs`) e **Enforce HTTPS** ligado
- [ ] Domínio próprio: DNS configurado e certificado ativo
- [ ] Google Search Console: propriedade verificada e **`sitemap.xml` submetido**
- [ ] Bing Webmaster Tools (pode importar do Search Console)
- [ ] Google Business Profile com o link do site, link da ementa (`/ementa/`) e link de reservas
- [ ] Ver SEO-FORA-DO-CODIGO.md
