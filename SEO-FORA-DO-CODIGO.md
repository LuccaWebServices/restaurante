# SEO local: o que fazer fora do código

> **Nota honesta:** nenhum site garante posições no Google. O código deste template segue as boas práticas técnicas (HTML indexável, dados estruturados, velocidade, acessibilidade, idiomas bem marcados), mas a visibilidade de um restaurante depende sobretudo da **ficha no Google**, das **avaliações**, da **proximidade** de quem pesquisa e da **consistência** da informação na internet. Não escreva promessas de resultados no site, na política de privacidade nem em propostas ao cliente.

## 1. Google Business Profile (o mais importante)
- [ ] Reivindicar/verificar a ficha em https://business.google.com
- [ ] Nome igual ao letreiro (sem palavras-chave extra), categoria principal certa ("Restaurante português", "Churrascaria"...) e categorias secundárias
- [ ] Morada, telefone e horário **iguais ao site** (incluindo feriados e horários especiais)
- [ ] Link do site, link da ementa (`/ementa/`), link de reservas
- [ ] **Ementa** carregada na ficha (secção Ementa), com preços
- [ ] Atributos: esplanada, acessibilidade, animais, pagamentos, opções vegetarianas, etc.
- [ ] 20+ fotos reais (pratos, sala, exterior, equipa) e atualizar todos os meses
- [ ] Publicações regulares (prato da semana, eventos, férias)
- [ ] Responder a **todas** as avaliações, boas e más, com educação

## 2. Avaliações
- [ ] Criar o link "pedir avaliação" (Business Profile → Pedir avaliações) e pô-lo em `testimonials.writeReviewUrl`
- [ ] QR code para avaliações na conta/talão e na mesa
- [ ] Pedir pessoalmente aos clientes satisfeitos. **Nunca** comprar avaliações nem oferecer descontos em troca (viola as regras do Google e a lei)
- [ ] No site, só mostrar avaliações reais, com autorização do autor

## 3. Google Search Console e Bing
- [ ] Adicionar a propriedade em https://search.google.com/search-console (com domínio próprio, verificação por DNS)
- [ ] Submeter `https://DOMINIO/sitemap.xml`
- [ ] Inspecionar o URL da página inicial e da ementa → "Pedir indexação"
- [ ] Ver o relatório de "Experiência" e "Melhorias" (dados estruturados) após 2–4 semanas
- [ ] Bing Webmaster Tools: importar do Search Console

> Num site em `utilizador.github.io/repositorio/` o `robots.txt` não é lido (só conta na raiz do domínio). Submeta o sitemap diretamente no Search Console. Com domínio próprio fica tudo normal.

## 4. Plataformas de restaurantes
- [ ] TheFork: ficha completa, fotos, ementa, reservas (ligar ao site em `reservations.external`)
- [ ] Tripadvisor: reivindicar a ficha, fotos, responder a avaliações
- [ ] Zomato (se ainda relevante na zona), Uber Eats, Glovo, Bolt Food: mesmas fotos e descrições
- [ ] Apple Business Connect (Apple Maps) e Bing Places
- [ ] Waze (via Google/Waze Local) e Here WeGo

## 5. Citações locais (NAP consistente)
NAP = Nome, Morada (Address), Telefone (Phone): **exatamente iguais** em todo o lado.
- [ ] Páginas Amarelas / PAI, Guia da Cidade, NiT, Time Out (sugestão de espaço), sites da junta de freguesia e câmara, associações de comércio local
- [ ] Redes sociais com o link do site e o mesmo horário
- [ ] Imprensa e blogs locais (artigos sobre o restaurante com link para o site)

## 6. Conteúdo e manutenção
- [ ] Manter ementa, preços e prato do dia atualizados (o Google valoriza informação fresca e correta)
- [ ] Fotos novas na ficha e na galeria a cada estação
- [ ] Eventos especiais (São Martinho, Santos Populares, menus de Natal) anunciados no site e na ficha
- [ ] QR code nas mesas para `/ementa/` (e `/en/menu/` para turistas)
- [ ] Rever o Search Console uma vez por mês
