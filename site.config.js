/**
 * ============================================================================
 *  CONFIGURAÇÃO DO SITE — o ÚNICO ficheiro que precisa de editar
 * ============================================================================
 *
 *  Depois de alterar, gere o site com:   node build.mjs
 *  e pré-visualize com:                  node build.mjs --serve
 *
 *  Regras rápidas
 *  - Textos traduzíveis usam sempre { pt: '...', en: '...' }.
 *  - Preços em números com ponto decimal: 14.5  (aparece "14,50 €").
 *  - Horas no formato 24 h "HH:MM". Turnos: "12:00-15:00".
 *  - Datas no formato "AAAA-MM-DD".
 *  - Caminhos de imagens são relativos à pasta src/ (ex.: 'assets/img/pratos/polvo.svg').
 *  - Tudo o que está entre [COLCHETES] é um campo por preencher.
 *
 *  ⚠ DEMO: o restaurante "Lume — Casa de Brasa", a morada, os telefones,
 *  o email e as avaliações abaixo são FICTÍCIOS.
 *
 *  Porquê .js e não .json? Porque permite COMENTÁRIOS (como este) ao lado de
 *  cada campo, vírgulas no fim das linhas e texto com aspas sem escapes.
 *  O build (node build.mjs) lê-o diretamente, valida-o e dá erros claros.
 *  Este ficheiro NÃO é publicado: só o resultado em docs/ vai para o site.
 * ============================================================================
 */

export default {
  // ---------------------------------------------------------------------------
  // 1. SITE
  // ---------------------------------------------------------------------------
  site: {
    // URL público final, COM barra no fim. Usado no canonical, hreflang, sitemap e Open Graph.
    // GitHub Pages sem domínio: 'https://UTILIZADOR.github.io/REPOSITORIO/'
    // Com domínio próprio:      'https://www.restaurante.pt/'
    url: 'https://utilizador.github.io/restaurante-demo/',

    // Domínio próprio (gera docs/CNAME). Deixe '' se não tiver.
    customDomain: '',

    // true = mostra a faixa "Site de demonstração" e o seletor de temas. Ponha false para o cliente.
    demo: true,

    // true = pede aos motores de busca para NÃO indexar (útil para demos públicas). false para o cliente.
    noindex: false,

    // Assinatura no rodapé (opcional). text: '' para esconder.
    credit: { text: { pt: 'Site por [A SUA MARCA]', en: 'Website by [A SUA MARCA]' }, url: '' },
  },

  // ---------------------------------------------------------------------------
  // 2. TEMA — mude UMA linha para trocar o visual
  // ---------------------------------------------------------------------------
  theme: {
    name: 'tradicional', // 'tradicional' | 'moderno' | 'elegante'

    // Variante do hero. null = usa a do tema (tradicional/elegante: 'image', moderno: 'split').
    heroLayout: null, // null | 'image' | 'split'

    // Sobrepor cores do tema (opcional). Deixe null para usar as cores do tema.
    // O build verifica o contraste (WCAG AA ≥ 4.5:1) e avisa se não cumprir.
    colors: {
      accent: null, //          fundo dos botões principais, ex.: '#9C3A1A'
      accentContrast: null, //  texto sobre o accent, ex.: '#FFFFFF'
      accentText: null, //      cor de destaque usada em texto/links sobre o fundo
    },
  },

  // ---------------------------------------------------------------------------
  // 3. SECÇÕES — true/false para ligar/desligar.
  //    A ORDEM das linhas define a ORDEM das secções na página inicial.
  //    Uma secção desligada desaparece do HTML, do menu, do JSON-LD e do sitemap.
  // ---------------------------------------------------------------------------
  sections: {
    dailySpecial: true, //  Prato do dia / menu executivo
    menu: true, //          Ementa (ver menu.ownPage)
    about: true, //         Sobre nós / história
    team: true, //          Equipa / chef
    gallery: true, //       Galeria
    events: true, //        Eventos e grupos
    testimonials: true, //  Avaliações (fica oculta se a lista estiver vazia)
    reservations: true, //  Reservas
    delivery: true, //      Entrega e take-away
    hours: true, //         Horário
    location: true, //      Localização e mapa
    faq: true, //          Perguntas frequentes
    contact: true, //       Contactos
  },

  // Itens do menu de navegação do topo (só aparecem os de secções ligadas). Ideal: até 6.
  navigation: ['menu', 'about', 'gallery', 'events', 'hours', 'location', 'contact'],

  // Funcionalidades extra
  features: {
    mobileBar: true, //       barra fixa no telemóvel: Ligar | Reservar | Como chegar
    backToTop: true, //       botão "voltar ao topo"
    langSuggestion: true, //  sugere o outro idioma conforme o browser (sem redirecionar)
    animations: true, //      animações suaves ao fazer scroll (respeita "reduzir movimento")
  },

  // ---------------------------------------------------------------------------
  // 4. NEGÓCIO
  // ---------------------------------------------------------------------------
  business: {
    name: 'Lume — Casa de Brasa',
    shortName: 'Lume', // usado no ícone da app e em espaços curtos
    slogan: {
      pt: 'Grelha a carvão, petiscos e vinhos portugueses',
      en: 'Charcoal grill, Portuguese petiscos and wines',
    },
    cuisine: {
      pt: 'Cozinha portuguesa e grelhados na brasa',
      en: 'Portuguese cuisine and charcoal grill',
    },
    // Para o Google (JSON-LD). Em inglês, palavras simples.
    servesCuisine: ['Portuguese', 'Grill', 'Seafood'],
    priceRange: '€€', // €, €€, €€€ ou €€€€
    pricePerPerson: { pt: '15–25 € por pessoa', en: '€15–25 per person' },

    address: {
      street: 'Rua da Fonte Velha, 27', // FICTÍCIA
      postalCode: '2780-000',
      city: 'Oeiras',
      region: 'Lisboa',
      country: 'PT',
      // "Localizado em" (opcional) — ex.: centro comercial, edifício
      locatedIn: { pt: 'Junto ao Largo do Mercado', en: 'Next to the Market Square' },
    },
    // Coordenadas: no Google Maps, clique com o botão direito no local e copie os números.
    geo: { lat: 38.6913, lng: -9.3109 },

    phone: '+351 210 000 000', //      FICTÍCIO — formato internacional
    phoneType: 'landline', //          'landline' | 'mobile' (informação obrigatória sobre o custo da chamada)
    whatsapp: '+351 910 000 000', //   FICTÍCIO — deixe '' se não usar
    email: 'reservas@example.com', //  FICTÍCIO

    social: {
      // Deixe '' nas redes que não usa. Estes links entram no JSON-LD (sameAs).
      facebook: 'https://www.facebook.com/',
      instagram: 'https://www.instagram.com/',
      tiktok: '',
      tripadvisor: '',
      thefork: '',
    },
    // Link da ficha no Google (Google Maps → Partilhar → Copiar link)
    googleBusinessUrl: '',

    // Chaves: cash, multibanco, credit, mbway, nfc, mealCard
    payments: ['cash', 'multibanco', 'credit', 'mbway', 'nfc', 'mealCard'],

    // Imagens de marca (relativas a src/)
    logo: {
      // Se tiver logótipo em imagem, indique o ficheiro (SVG ou WebP). null = nome em texto com o símbolo.
      image: null, // ex.: { src: 'assets/img/logo/logo.svg', width: 180, height: 48 }
      mark: 'assets/img/logo/logo-mark.svg', // símbolo pequeno ao lado do nome
    },
    ogImage: { src: 'assets/img/og/og-image.png', width: 1200, height: 630, alt: { pt: 'Mesa com pratos de grelhados no restaurante Lume', en: 'Table with grilled dishes at Lume restaurant' } },
  },

  // ---------------------------------------------------------------------------
  // 5. HORÁRIO (fuso Europe/Lisbon; a hora de verão é tratada automaticamente)
  // ---------------------------------------------------------------------------
  hours: {
    navLabel: { pt: 'Horário', en: 'Hours' },
    title: { pt: 'Horário', en: 'Opening hours' },
    timezone: 'Europe/Lisbon',
    // Cada dia: lista de turnos. [] = encerrado (dia de descanso).
    // Turno depois da meia-noite: '19:00-01:00' funciona.
    weekly: {
      mon: [],
      tue: ['12:00-15:00', '19:00-22:30'],
      wed: ['12:00-15:00', '19:00-22:30'],
      thu: ['12:00-15:00', '19:00-22:30'],
      fri: ['12:00-15:00', '19:00-23:00'],
      sat: ['12:00-15:30', '19:00-23:00'],
      sun: ['12:00-15:30'],
    },
    // Dias com horário especial (feriados, vésperas...). shifts: [] = encerrado nesse dia.
    special: [
      { date: '2026-12-24', shifts: ['12:00-15:00'], label: { pt: 'Véspera de Natal', en: 'Christmas Eve' } },
      { date: '2026-12-25', shifts: [], label: { pt: 'Dia de Natal', en: 'Christmas Day' } },
      { date: '2026-12-31', shifts: ['12:00-15:00'], label: { pt: 'Véspera de Ano Novo', en: "New Year's Eve" } },
      { date: '2027-01-01', shifts: [], label: { pt: 'Dia de Ano Novo', en: "New Year's Day" } },
    ],
    // Encerramentos por vários dias (férias, obras). Datas inclusivas.
    closures: [
      { from: '2027-01-11', to: '2027-01-18', label: { pt: 'Férias de inverno', en: 'Winter holidays' } },
    ],
    // Nota opcional mostrada por baixo da tabela
    note: {
      pt: 'A cozinha fecha 30 minutos antes do fim de cada turno.',
      en: 'The kitchen closes 30 minutes before the end of each service.',
    },
  },

  // ---------------------------------------------------------------------------
  // 6. SEO — títulos (até ~60 caracteres) e descrições (até ~155) por página
  // ---------------------------------------------------------------------------
  seo: {
    home: {
      title: { pt: 'Lume — Restaurante de grelhados na brasa em Oeiras', en: 'Lume — Charcoal grill restaurant in Oeiras, Portugal' },
      description: {
        pt: 'Restaurante de cozinha portuguesa em Oeiras: grelhados na brasa, peixe fresco, prato do dia ao almoço e vinhos nacionais. Reserve mesa online.',
        en: 'Portuguese restaurant in Oeiras near Lisbon: charcoal-grilled meat and fish, daily lunch menu and Portuguese wines. Book your table online.',
      },
    },
    menu: {
      title: { pt: 'Ementa e preços — Lume, restaurante em Oeiras', en: 'Menu and prices — Lume restaurant in Oeiras' },
      description: {
        pt: 'Consulte a ementa do Lume com preços: entradas, peixe e carne na brasa, opções vegetarianas, sobremesas caseiras e vinhos. Alergénios indicados.',
        en: 'See the Lume menu with prices: starters, charcoal-grilled fish and meat, vegetarian options, homemade desserts and wines. Allergens listed.',
      },
    },
    privacy: {
      title: { pt: 'Política de Privacidade — Lume', en: 'Privacy Policy — Lume' },
      description: {
        pt: 'Como o site do restaurante Lume trata dados pessoais: o que é recolhido, para quê, durante quanto tempo e como exercer os seus direitos.',
        en: 'How the Lume restaurant website handles personal data: what is collected, why, for how long and how to exercise your rights.',
      },
    },
  },

  // ---------------------------------------------------------------------------
  // 7. HERO (topo da página inicial)
  // ---------------------------------------------------------------------------
  hero: {
    image: { src: 'assets/img/hero/hero.svg', width: 1600, height: 1000, alt: { pt: 'Mesa posta com polvo à lagareiro, picanha e vinho tinto', en: 'Table set with roast octopus, picanha and red wine' } },
    eyebrow: { pt: 'Restaurante em Oeiras', en: 'Restaurant in Oeiras' },
    lead: {
      pt: 'Restaurante de cozinha portuguesa em Oeiras, com carne e peixe grelhados na brasa de carvão, petiscos para partilhar e um prato do dia que muda todas as semanas.',
      en: 'A Portuguese restaurant in Oeiras, near Lisbon, serving meat and fish grilled over charcoal, petiscos to share and a lunch dish that changes every week.',
    },
  },

  // ---------------------------------------------------------------------------
  // 8. PRATO DO DIA / MENU EXECUTIVO
  // ---------------------------------------------------------------------------
  dailySpecial: {
    navLabel: { pt: 'Prato do dia', en: 'Daily special' },
    title: { pt: 'Menu do dia ao almoço', en: 'Lunch menu of the day' },
    intro: { pt: 'Comida caseira a preço justo, de terça a sexta.', en: 'Home-style cooking at a fair price, Tuesday to Friday.' },
    price: 11.5,
    includes: {
      pt: ['Sopa do dia', 'Prato do dia', 'Bebida (água, refrigerante ou copo de vinho)', 'Café'],
      en: ['Soup of the day', 'Dish of the day', 'Drink (water, soft drink or glass of wine)', 'Coffee'],
    },
    when: { pt: 'Terça a sexta, ao almoço (12:00–15:00). Exceto feriados.', en: 'Tuesday to Friday, at lunch (12:00–15:00). Except public holidays.' },
    // Prato de cada dia — atualize semanalmente. Dias sem prato: omita a linha.
    // O site destaca automaticamente o prato de hoje.
    week: {
      tue: { pt: 'Frango assado na brasa com batata frita e salada', en: 'Charcoal-roasted chicken with chips and salad' },
      wed: { pt: 'Bacalhau com grão, ovo cozido e azeite', en: 'Salt cod with chickpeas, boiled egg and olive oil' },
      thu: { pt: 'Feijoada à transmontana', en: 'Trás-os-Montes bean and pork stew' },
      fri: { pt: 'Carapaus grelhados com batata cozida e salada de pimentos', en: 'Grilled horse mackerel with boiled potatoes and pepper salad' },
    },
    image: { src: 'assets/img/pratos/prato-do-dia.svg', width: 800, height: 600, alt: { pt: 'Prato do dia servido com sopa e pão', en: 'Dish of the day served with soup and bread' } },
  },

  // ---------------------------------------------------------------------------
  // 9. EMENTA
  //    allergens: gluten, crustaceans, eggs, fish, peanuts, soy, milk, nuts,
  //               celery, mustard, sesame, sulphites, lupin, molluscs
  //    diet:      vegetarian, vegan, glutenFree, spicy
  //    featured: true = aparece nos destaques da página inicial
  // ---------------------------------------------------------------------------
  menu: {
    navLabel: { pt: 'Ementa', en: 'Menu' },
    title: { pt: 'A nossa ementa', en: 'Our menu' },
    intro: {
      pt: 'Produto português, grelha a carvão e receitas de sempre. Os pratos podem variar consoante a época e o mercado.',
      en: 'Portuguese produce, charcoal grill and timeless recipes. Dishes may vary with the season and the market.',
    },
    // true = a ementa completa tem página própria (/ementa/), ótimo para SEO e para QR codes nas mesas.
    //        A página inicial mostra os pratos "featured" e um botão para a ementa.
    // false = a ementa completa aparece na página inicial.
    ownPage: true,
    // PDF opcional para descarregar (coloque em src/assets/pdf/). null = sem PDF.
    pdf: null, // ex.: { pt: 'assets/pdf/ementa.pdf', en: 'assets/pdf/menu-en.pdf' }
    allergyNotice: {
      pt: 'Tem alguma alergia ou intolerância alimentar? Informe-nos antes de fazer o pedido. A nossa equipa pode indicar os ingredientes de cada prato e possíveis contaminações cruzadas.',
      en: 'Do you have a food allergy or intolerance? Please tell us before ordering. Our team can tell you the ingredients of each dish and any possible cross-contamination.',
    },
    categories: [
      {
        id: 'entradas',
        name: { pt: 'Entradas e petiscos', en: 'Starters and petiscos' },
        items: [
          { name: { pt: 'Couvert', en: 'Couvert' }, description: { pt: 'Pão regional, azeitonas temperadas e manteiga', en: 'Regional bread, marinated olives and butter' }, price: 2.5, priceNote: { pt: 'por pessoa', en: 'per person' }, diet: ['vegetarian'], allergens: ['gluten', 'milk'] },
          { name: { pt: 'Queijo de Azeitão com tostas', en: 'Azeitão cheese with toasts' }, description: { pt: 'Queijo amanteigado de ovelha (DOP) servido com tostas e doce de abóbora', en: 'Creamy PDO sheep’s cheese served with toasts and pumpkin jam' }, price: 9.5, diet: ['vegetarian'], allergens: ['milk', 'gluten'] },
          { name: { pt: 'Peixinhos da horta', en: 'Peixinhos da horta (tempura green beans)' }, description: { pt: 'Feijão-verde em polme estaladiço com maionese de alho', en: 'Crispy battered green beans with garlic mayonnaise' }, price: 6.5, diet: ['vegetarian'], allergens: ['gluten', 'eggs'] },
          { name: { pt: 'Amêijoas à Bulhão Pato', en: 'Clams Bulhão Pato' }, description: { pt: 'Amêijoas com azeite, alho, coentros, limão e um toque de vinho branco', en: 'Clams with olive oil, garlic, coriander, lemon and a splash of white wine' }, price: 14.5, diet: ['glutenFree'], allergens: ['molluscs', 'sulphites'], featured: true, image: { src: 'assets/img/pratos/ameijoas.svg', width: 800, height: 600, alt: { pt: 'Tacho de amêijoas à Bulhão Pato com coentros', en: 'Pan of Bulhão Pato clams with coriander' } } },
          { name: { pt: 'Chouriço assado', en: 'Flame-grilled chorizo' }, description: { pt: 'Chouriço de porco assado à mesa', en: 'Pork chorizo flamed at your table' }, price: 7, diet: ['glutenFree'], allergens: ['sulphites'] },
        ],
      },
      {
        id: 'sopas',
        name: { pt: 'Sopas', en: 'Soups' },
        items: [
          { name: { pt: 'Caldo verde', en: 'Caldo verde' }, description: { pt: 'Couve galega, batata e azeite, com rodela de chouriço', en: 'Kale, potato and olive oil soup with a slice of chorizo' }, price: 3.5, diet: ['glutenFree'], allergens: ['sulphites'] },
          { name: { pt: 'Sopa de legumes da horta', en: 'Garden vegetable soup' }, description: { pt: 'Legumes da época, sem natas nem manteiga', en: 'Seasonal vegetables, no cream or butter' }, price: 3, diet: ['vegetarian', 'vegan', 'glutenFree'], allergens: ['celery'] },
        ],
      },
      {
        id: 'peixe',
        name: { pt: 'Peixe', en: 'Fish and seafood' },
        items: [
          { name: { pt: 'Polvo à lagareiro', en: 'Octopus “à lagareiro”' }, description: { pt: 'Polvo assado no forno com batata a murro, alho e muito azeite', en: 'Oven-roasted octopus with crushed potatoes, garlic and plenty of olive oil' }, price: 19.5, diet: ['glutenFree'], allergens: ['molluscs'], featured: true, image: { src: 'assets/img/pratos/polvo.svg', width: 800, height: 600, alt: { pt: 'Polvo à lagareiro com batata a murro', en: 'Roast octopus with crushed potatoes' } } },
          { name: { pt: 'Bacalhau à Brás', en: 'Bacalhau à Brás' }, description: { pt: 'Bacalhau desfiado com batata palha, ovo, cebola e azeitonas', en: 'Shredded salt cod with straw potatoes, egg, onion and olives' }, price: 14.5, diet: ['glutenFree'], allergens: ['fish', 'eggs'] },
          { name: { pt: 'Dourada grelhada', en: 'Grilled sea bream' }, description: { pt: 'Dourada na brasa com legumes salteados e batata cozida', en: 'Charcoal-grilled sea bream with sautéed vegetables and boiled potatoes' }, price: 15, diet: ['glutenFree'], allergens: ['fish'] },
          { name: { pt: 'Arroz de marisco', en: 'Seafood rice' }, description: { pt: 'Arroz malandrinho com camarão, amêijoa e mexilhão (2 pessoas)', en: 'Soupy rice with prawns, clams and mussels (serves 2)' }, price: 36, priceNote: { pt: 'para 2', en: 'for 2' }, diet: ['spicy'], allergens: ['crustaceans', 'molluscs', 'fish', 'celery', 'sulphites'] },
        ],
      },
      {
        id: 'carne',
        name: { pt: 'Carne na brasa', en: 'Meat from the grill' },
        items: [
          { name: { pt: 'Picanha na brasa', en: 'Charcoal-grilled picanha' }, description: { pt: 'Com arroz branco, feijão preto, batata frita e farofa', en: 'With white rice, black beans, chips and farofa' }, price: 16.5, diet: ['glutenFree'], allergens: [], featured: true, image: { src: 'assets/img/pratos/picanha.svg', width: 800, height: 600, alt: { pt: 'Picanha fatiada com arroz, feijão preto e batata frita', en: 'Sliced picanha with rice, black beans and chips' } } },
          { name: { pt: 'Bitoque', en: 'Bitoque steak' }, description: { pt: 'Bife de vaca com ovo estrelado, molho de alho e louro, batata frita e salada', en: 'Beef steak with fried egg, garlic and bay leaf sauce, chips and salad' }, price: 12, diet: ['glutenFree'], allergens: ['eggs', 'sulphites'] },
          { name: { pt: 'Secretos de porco preto', en: 'Black pork “secretos”' }, description: { pt: 'Com migas de espargos e laranja', en: 'With asparagus bread migas and orange' }, price: 17.5, allergens: ['gluten'] },
          { name: { pt: 'Frango piri-piri', en: 'Piri-piri chicken' }, description: { pt: 'Meio frango na brasa com piri-piri caseiro, batata frita e salada', en: 'Half chicken grilled over charcoal with homemade piri-piri, chips and salad' }, price: 11, diet: ['glutenFree', 'spicy'], allergens: [] },
        ],
      },
      {
        id: 'vegetariano',
        name: { pt: 'Vegetariano', en: 'Vegetarian' },
        items: [
          { name: { pt: 'Risotto de cogumelos e espargos', en: 'Mushroom and asparagus risotto' }, description: { pt: 'Com queijo da Serra e vinho branco', en: 'With Serra cheese and white wine' }, price: 13.5, diet: ['vegetarian', 'glutenFree'], allergens: ['milk', 'sulphites', 'celery'] },
          { name: { pt: 'Caril de grão e legumes', en: 'Chickpea and vegetable curry' }, description: { pt: 'Leite de coco, especiarias e arroz basmati', en: 'Coconut milk, spices and basmati rice' }, price: 12, diet: ['vegetarian', 'vegan', 'glutenFree', 'spicy'], allergens: ['mustard'] },
        ],
      },
      {
        id: 'sobremesas',
        name: { pt: 'Sobremesas caseiras', en: 'Homemade desserts' },
        items: [
          { name: { pt: 'Pastel de nata', en: 'Pastel de nata (custard tart)' }, description: { pt: 'Feito cá em casa, com canela', en: 'Baked in-house, with cinnamon' }, price: 1.8, diet: ['vegetarian'], allergens: ['gluten', 'eggs', 'milk'] },
          { name: { pt: 'Arroz-doce', en: 'Portuguese rice pudding' }, description: { pt: 'Com casca de limão e canela', en: 'With lemon zest and cinnamon' }, price: 3.5, diet: ['vegetarian', 'glutenFree'], allergens: ['milk', 'eggs'] },
          { name: { pt: 'Mousse de chocolate', en: 'Chocolate mousse' }, description: { pt: 'Chocolate negro 70%', en: '70% dark chocolate' }, price: 4, diet: ['vegetarian', 'glutenFree'], allergens: ['eggs', 'milk', 'soy'] },
          { name: { pt: 'Bolo de bolacha', en: 'Biscuit cake' }, description: { pt: 'Bolacha Maria, creme de manteiga e café', en: 'Maria biscuits, butter cream and coffee' }, price: 4.5, diet: ['vegetarian'], allergens: ['gluten', 'milk', 'eggs'] },
          { name: { pt: 'Salada de fruta da época', en: 'Seasonal fruit salad' }, description: { pt: 'Fruta fresca cortada no dia', en: 'Fresh fruit cut daily' }, price: 3.5, diet: ['vegetarian', 'vegan', 'glutenFree'], allergens: [] },
        ],
      },
      {
        id: 'bebidas',
        name: { pt: 'Bebidas', en: 'Drinks' },
        items: [
          { name: { pt: 'Água mineral 0,5 L', en: 'Mineral water 0.5 L' }, price: 1.5, allergens: [] },
          { name: { pt: 'Refrigerantes', en: 'Soft drinks' }, price: 2, allergens: [] },
          { name: { pt: 'Sumo de laranja natural', en: 'Fresh orange juice' }, price: 3, allergens: [] },
          { name: { pt: 'Imperial', en: 'Draught beer (20 cl)' }, price: 1.8, allergens: ['gluten'] },
          { name: { pt: 'Café', en: 'Espresso' }, price: 0.9, allergens: [] },
        ],
      },
      {
        id: 'vinhos',
        name: { pt: 'Vinhos', en: 'Wines' },
        items: [
          { name: { pt: 'Vinho da casa (jarro 0,5 L)', en: 'House wine (0.5 L jug)' }, description: { pt: 'Tinto ou branco, Lisboa', en: 'Red or white, Lisbon region' }, price: 6, allergens: ['sulphites'] },
          { name: { pt: 'Vinho Verde branco', en: 'Vinho Verde (white)' }, description: { pt: 'Garrafa 75 cl', en: '75 cl bottle' }, price: 13, allergens: ['sulphites'] },
          { name: { pt: 'Alentejo tinto', en: 'Alentejo red' }, description: { pt: 'Garrafa 75 cl', en: '75 cl bottle' }, price: 16, allergens: ['sulphites'] },
          { name: { pt: 'Douro tinto reserva', en: 'Douro red reserva' }, description: { pt: 'Garrafa 75 cl', en: '75 cl bottle' }, price: 24, allergens: ['sulphites'] },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 10. SOBRE NÓS
  // ---------------------------------------------------------------------------
  about: {
    navLabel: { pt: 'Sobre nós', en: 'About' },
    title: { pt: 'A nossa história', en: 'Our story' },
    paragraphs: {
      pt: [
        'O Lume nasceu em 2009, quando a família Ribeiro decidiu trazer para Oeiras a grelha a carvão das tascas da sua aldeia, no Ribatejo.',
        'Hoje continuamos a acender a brasa todos os dias antes do almoço. Compramos o peixe na lota, a carne a produtores portugueses e os legumes a uma horta vizinha. O resto é paciência, sal grosso e boa companhia.',
        'Somos um restaurante de bairro: quem vem pela primeira vez sai a conhecer o nome de quem o serviu.',
      ],
      en: [
        'Lume opened in 2009, when the Ribeiro family decided to bring the charcoal grill of their village taverns in the Ribatejo to Oeiras.',
        'We still light the grill every day before lunch. We buy fish at the local market, meat from Portuguese producers and vegetables from a neighbouring farm. The rest is patience, coarse salt and good company.',
        'We are a neighbourhood restaurant: first-time guests leave knowing the name of whoever served them.',
      ],
    },
    image: { src: 'assets/img/sobre/sala.svg', width: 1000, height: 1200, alt: { pt: 'Sala do restaurante com mesas de madeira e grelha a carvão ao fundo', en: 'Dining room with wooden tables and the charcoal grill in the background' } },
    highlights: [
      { icon: 'fire', text: { pt: 'Grelha a carvão de azinho', en: 'Holm-oak charcoal grill' } },
      { icon: 'basket', text: { pt: 'Produto português e da época', en: 'Portuguese, seasonal produce' } },
      { icon: 'award', text: { pt: 'Desde 2009 em Oeiras', en: 'In Oeiras since 2009' } },
    ],
  },

  // ---------------------------------------------------------------------------
  // 11. EQUIPA (nomes fictícios)
  // ---------------------------------------------------------------------------
  team: {
    navLabel: { pt: 'Equipa', en: 'Team' },
    title: { pt: 'Quem cozinha e quem serve', en: 'The people behind Lume' },
    intro: { pt: 'Uma equipa pequena, que gosta do que faz.', en: 'A small team that loves what it does.' },
    members: [
      { name: 'Rui Ribeiro', role: { pt: 'Chef e grelhador', en: 'Chef and grill master' }, photo: { src: 'assets/img/equipa/chef.svg', width: 600, height: 600 } },
      { name: 'Helena Ribeiro', role: { pt: 'Sala e vinhos', en: 'Front of house and wines' }, photo: { src: 'assets/img/equipa/sala.svg', width: 600, height: 600 } },
      { name: 'Tiago Matos', role: { pt: 'Pastelaria', en: 'Pastry' }, photo: { src: 'assets/img/equipa/pastelaria.svg', width: 600, height: 600 } },
    ],
  },

  // ---------------------------------------------------------------------------
  // 12. GALERIA — category: 'pratos' | 'espaco' | 'equipa'
  // ---------------------------------------------------------------------------
  gallery: {
    navLabel: { pt: 'Galeria', en: 'Gallery' },
    title: { pt: 'Galeria', en: 'Gallery' },
    intro: { pt: 'Os pratos, a sala e a esplanada.', en: 'Our dishes, dining room and terrace.' },
    categories: {
      pratos: { pt: 'Pratos', en: 'Dishes' },
      espaco: { pt: 'Espaço', en: 'Venue' },
      equipa: { pt: 'Equipa', en: 'Team' },
    },
    images: [
      { src: 'assets/img/galeria/galeria-01.svg', width: 1200, height: 900, category: 'pratos', alt: { pt: 'Picanha a grelhar na brasa', en: 'Picanha grilling over charcoal' } },
      { src: 'assets/img/galeria/galeria-02.svg', width: 1200, height: 900, category: 'espaco', alt: { pt: 'Sala principal ao jantar', en: 'Main dining room at dinner' } },
      { src: 'assets/img/galeria/galeria-03.svg', width: 1200, height: 900, category: 'pratos', alt: { pt: 'Polvo à lagareiro servido à mesa', en: 'Roast octopus served at the table' } },
      { src: 'assets/img/galeria/galeria-04.svg', width: 1200, height: 900, category: 'espaco', alt: { pt: 'Esplanada com guarda-sóis', en: 'Terrace with parasols' } },
      { src: 'assets/img/galeria/galeria-05.svg', width: 1200, height: 900, category: 'equipa', alt: { pt: 'Chef a preparar a grelha', en: 'Chef preparing the grill' } },
      { src: 'assets/img/galeria/galeria-06.svg', width: 1200, height: 900, category: 'pratos', alt: { pt: 'Pastéis de nata acabados de sair do forno', en: 'Freshly baked custard tarts' } },
      { src: 'assets/img/galeria/galeria-07.svg', width: 1200, height: 900, category: 'espaco', alt: { pt: 'Garrafeira com vinhos portugueses', en: 'Wine rack with Portuguese wines' } },
      { src: 'assets/img/galeria/galeria-08.svg', width: 1200, height: 900, category: 'pratos', alt: { pt: 'Amêijoas à Bulhão Pato', en: 'Bulhão Pato clams' } },
    ],
  },

  // ---------------------------------------------------------------------------
  // 13. EVENTOS E GRUPOS
  // ---------------------------------------------------------------------------
  events: {
    navLabel: { pt: 'Grupos', en: 'Groups' },
    title: { pt: 'Grupos, aniversários e eventos', en: 'Groups, birthdays and events' },
    intro: {
      pt: 'Temos sala reservada para grupos até 40 pessoas e preparamos menus fechados à medida.',
      en: 'We have a private room for groups of up to 40 people and prepare set menus to suit you.',
    },
    types: [
      { icon: 'people', title: { pt: 'Jantares de grupo', en: 'Group dinners' }, text: { pt: 'Menus fechados a partir de 22 € por pessoa.', en: 'Set menus from €22 per person.' } },
      { icon: 'cake2', title: { pt: 'Aniversários', en: 'Birthdays' }, text: { pt: 'Traga o bolo ou encomende o nosso.', en: 'Bring your own cake or order one of ours.' } },
      { icon: 'briefcase', title: { pt: 'Eventos de empresa', en: 'Corporate events' }, text: { pt: 'Almoços de equipa e jantares de Natal.', en: 'Team lunches and Christmas dinners.' } },
      { icon: 'basket', title: { pt: 'Catering', en: 'Catering' }, text: { pt: 'Levamos a grelha até si (sob consulta).', en: 'We bring the grill to you (on request).' } },
    ],
    // Como pedem orçamento: 'email' | 'whatsapp' | 'phone'
    contactMethod: 'email',
    ctaLabel: { pt: 'Pedir orçamento', en: 'Request a quote' },
    emailSubject: { pt: 'Pedido de orçamento para grupo', en: 'Group booking enquiry' },
  },

  // ---------------------------------------------------------------------------
  // 14. RESERVAS — escolha UM método em `method`
  // ---------------------------------------------------------------------------
  reservations: {
    navLabel: { pt: 'Reservas', en: 'Bookings' },
    title: { pt: 'Reserve a sua mesa', en: 'Book your table' },
    intro: { pt: 'Ao fim de semana recomendamos reservar.', en: 'We recommend booking at weekends.' },
    // 'external' (TheFork, Zomato...) | 'phone' | 'whatsapp' | 'form' (exige form.enabled: true)
    method: 'external',
    external: { name: 'TheFork', url: 'https://www.thefork.pt/' }, // ← substitua pelo link da página do restaurante
    whatsappMessage: { pt: 'Olá! Gostaria de reservar uma mesa para', en: 'Hello! I would like to book a table for' },
    note: {
      pt: 'Para grupos com mais de 10 pessoas, contacte-nos diretamente. Aceitamos pedidos sem reserva, consoante a disponibilidade.',
      en: 'For groups of more than 10 people, please contact us directly. Walk-ins are welcome, subject to availability.',
    },
  },

  // ---------------------------------------------------------------------------
  // 15. ENTREGA E TAKE-AWAY
  // ---------------------------------------------------------------------------
  delivery: {
    navLabel: { pt: 'Take-away', en: 'Takeaway' },
    title: { pt: 'Take-away e entregas', en: 'Takeaway and delivery' },
    intro: { pt: 'Leve o Lume para casa.', en: 'Take Lume home with you.' },
    takeaway: {
      enabled: true,
      text: {
        pt: 'Encomende por telefone e levante no restaurante. Toda a ementa está disponível para take-away, exceto o arroz de marisco.',
        en: 'Order by phone and pick up at the restaurant. The whole menu is available for takeaway, except the seafood rice.',
      },
    },
    // Plataformas: deixe url '' para esconder. Substitua pelos links da página do restaurante.
    platforms: [
      { name: 'Uber Eats', url: 'https://www.ubereats.com/pt' },
      { name: 'Glovo', url: 'https://glovoapp.com/pt/pt/' },
      { name: 'Bolt Food', url: '' },
    ],
  },

  // ---------------------------------------------------------------------------
  // 16. AVALIAÇÕES — a secção fica OCULTA se `items` estiver vazio.
  //     ⚠ As avaliações abaixo são FICTÍCIAS (isDemo: true mostra um aviso visível).
  //     Para o cliente: use avaliações reais, com autorização, e ponha isDemo: false.
  // ---------------------------------------------------------------------------
  testimonials: {
    navLabel: { pt: 'Avaliações', en: 'Reviews' },
    title: { pt: 'O que dizem os clientes', en: 'What our guests say' },
    isDemo: true,
    googleReviewsUrl: '', //  link "ver todas as avaliações no Google" (opcional)
    writeReviewUrl: '', //    link "deixe a sua avaliação" (Google Business Profile → Pedir avaliações)
    items: [
      { author: 'Marta S.', rating: 5, date: '2026-09', source: 'Google', text: { pt: 'A melhor picanha da zona e um serviço muito simpático. Voltamos sempre.', en: 'The best picanha around and very friendly service. We keep coming back.' } },
      { author: 'James P.', rating: 5, date: '2026-08', source: 'Google', text: { pt: 'Polvo à lagareiro excelente e boa seleção de vinhos portugueses.', en: 'Excellent roast octopus and a good selection of Portuguese wines.' } },
      { author: 'Carlos M.', rating: 4, date: '2026-07', source: 'Google', text: { pt: 'Menu do dia com ótima relação qualidade-preço. Ao fim de semana convém reservar.', en: 'Great-value lunch menu. Book ahead at weekends.' } },
    ],
  },

  // ---------------------------------------------------------------------------
  // 17. LOCALIZAÇÃO
  // ---------------------------------------------------------------------------
  location: {
    navLabel: { pt: 'Localização', en: 'Location' },
    title: { pt: 'Como chegar', en: 'How to find us' },
    // Mapa embutido do Google (só carrega após clique do visitante).
    map: {
      enabled: true,
      zoom: 16,
      placeholder: { src: 'assets/img/mapa/mapa-placeholder.svg', width: 1200, height: 700 },
    },
    // Link direto da ficha no Google Maps (opcional; se vazio usa as coordenadas)
    googleMapsUrl: '',
    parking: {
      pt: ['Parque de estacionamento gratuito a 50 m (Largo do Mercado)', 'Estacionamento gratuito na rua'],
      en: ['Free car park 50 m away (Market Square)', 'Free street parking'],
    },
    transport: {
      pt: ['Comboio: estação de Oeiras (linha de Cascais), 10 min a pé', 'Autocarro: paragem "Fonte Velha", em frente ao restaurante'],
      en: ['Train: Oeiras station (Cascais line), 10-minute walk', 'Bus: "Fonte Velha" stop, opposite the restaurant'],
    },
    accessibility: {
      pt: ['Entrada sem degraus, com rampa', 'Casa de banho adaptada', 'Cadeiras altas para bebé', 'Cães bem-vindos na esplanada'],
      en: ['Step-free entrance with ramp', 'Wheelchair-accessible toilet', 'High chairs for babies', 'Dogs welcome on the terrace'],
    },
  },

  // ---------------------------------------------------------------------------
  // 18. PERGUNTAS FREQUENTES (geram JSON-LD FAQPage)
  // ---------------------------------------------------------------------------
  faq: {
    navLabel: { pt: 'FAQ', en: 'FAQ' },
    title: { pt: 'Perguntas frequentes', en: 'Frequently asked questions' },
    items: [
      { q: { pt: 'Aceitam cartões?', en: 'Do you accept cards?' }, a: { pt: 'Sim. Aceitamos Multibanco, Visa, Mastercard, MB WAY, pagamentos por telemóvel (NFC) e cartão refeição.', en: 'Yes. We accept debit cards, Visa, Mastercard, MB WAY, mobile (NFC) payments and meal cards.' } },
      { q: { pt: 'Aceitam animais?', en: 'Are pets allowed?' }, a: { pt: 'Os cães são bem-vindos na esplanada. Na sala interior só são permitidos cães de assistência.', en: 'Dogs are welcome on the terrace. Only assistance dogs are allowed in the indoor dining room.' } },
      { q: { pt: 'Há opções vegetarianas, veganas ou sem glúten?', en: 'Do you have vegetarian, vegan or gluten-free options?' }, a: { pt: 'Sim. Na ementa assinalamos os pratos vegetarianos, veganos e sem glúten, e indicamos os alergénios de cada prato. Em caso de alergia, fale com a equipa antes de pedir.', en: 'Yes. Vegetarian, vegan and gluten-free dishes are marked on the menu, together with the allergens in each dish. If you have an allergy, please speak to our team before ordering.' } },
      { q: { pt: 'Têm cadeiras para bebé?', en: 'Do you have high chairs?' }, a: { pt: 'Sim, temos cadeiras altas. Se precisar, indique-o ao reservar.', en: 'Yes, we have high chairs. Let us know when you book if you need one.' } },
      { q: { pt: 'É preciso reservar?', en: 'Do I need to book?' }, a: { pt: 'Não é obrigatório, mas recomendamos reservar ao fim de semana e para grupos.', en: 'It is not required, but we recommend booking at weekends and for groups.' } },
      { q: { pt: 'Há estacionamento?', en: 'Is there parking?' }, a: { pt: 'Sim, há um parque gratuito a 50 metros e estacionamento gratuito na rua.', en: 'Yes, there is a free car park 50 metres away and free street parking.' } },
    ],
  },

  // ---------------------------------------------------------------------------
  // 19. CONTACTOS
  // ---------------------------------------------------------------------------
  contact: {
    navLabel: { pt: 'Contactos', en: 'Contact' },
    title: { pt: 'Fale connosco', en: 'Get in touch' },
    intro: { pt: 'Respondemos a emails e mensagens no próprio dia, durante o horário de funcionamento.', en: 'We reply to emails and messages on the same day, during opening hours.' },
  },

  // ---------------------------------------------------------------------------
  // 20. FORMULÁRIO (reservas/contacto via EmailJS) — DESLIGADO por padrão.
  //     Ver CONFIGURACAO.md → "Formulário / EmailJS". Ao ligar, a Política de
  //     Privacidade passa a incluir automaticamente o bloco do formulário.
  // ---------------------------------------------------------------------------
  form: {
    enabled: false,
    maxPeople: 20,
    emailjs: {
      publicKey: '[EMAILJS_PUBLIC_KEY]',
      serviceId: '[EMAILJS_SERVICE_ID]',
      templateId: '[EMAILJS_TEMPLATE_ID]',
    },
    retention: { pt: '[PRAZO DE CONSERVAÇÃO, ex.: 12 meses]', en: '[RETENTION PERIOD, e.g. 12 months]' },
    emailProvider: '[FORNECEDOR DE EMAIL, ex.: Google Workspace]', // onde chegam os pedidos
  },

  // ---------------------------------------------------------------------------
  // 21. LEGAL
  // ---------------------------------------------------------------------------
  legal: {
    legalName: '[DENOMINAÇÃO SOCIAL]', //   ex.: "Lume Restauração, Lda."
    nif: '[NIF]',
    license: '[N.º DE LICENÇA / ALVARÁ]', //  deixe '' para não mostrar
    registeredAddress: '[MORADA DA SEDE]', // se diferente do restaurante
    privacyEmail: '[EMAIL PARA PRIVACIDADE]',
    privacyUpdated: '2026-10-23', //         data da última atualização da política
    showTemplateNotice: true, //            aviso "Modelo base" no topo da política (retire após revisão jurídica)
    complaintsBook: {
      url: 'https://www.livroreclamacoes.pt/Inicio/',
      // Logótipo oficial: descarregue-o em livroreclamacoes.pt e substitua este ficheiro.
      logo: { src: 'assets/img/legal/livro-reclamacoes.svg', width: 160, height: 66 },
    },
  },
};
