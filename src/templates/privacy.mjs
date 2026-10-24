/**
 * POLÍTICA DE PRIVACIDADE (PT-PT e EN), gerada a partir da configuração.
 *
 * - Reflete o que o site faz de facto: blocos opcionais (formulário, mapa) só
 *   aparecem quando a funcionalidade está ligada em site.config.js.
 * - Campos por preencher estão entre [COLCHETES] (vêm de site.config.js → legal).
 * - Modelo base: recomenda-se revisão por profissional jurídico.
 */
import { esc, tr, dateLabel } from '../build/util.mjs';

export function privacyContent(ctx) {
  const { cfg, lang, ui } = ctx;
  const b = cfg.business;
  const L = cfg.legal;
  const formOn = !!cfg.form?.enabled;
  const mapOn = !!(cfg.sections.location && cfg.location?.map?.enabled);
  const demoOn = !!cfg.site.demo;
  const e = esc;
  const address = `${b.address.street}, ${b.address.postalCode} ${b.address.city}`;
  const updated = dateLabel(L.privacyUpdated, ui.locale);
  const mail = `<a href="mailto:${e(L.privacyEmail)}">${e(L.privacyEmail)}</a>`;
  const notice = L.showTemplateNotice
    ? `<p class="legal-notice" role="note">${ctx.icon('exclamation-triangle')}<span>${lang === 'pt' ? 'Modelo base, recomenda-se revisão por profissional jurídico.' : 'Base template; review by a legal professional is recommended.'}</span></p>`
    : '';

  if (lang === 'pt') return `<!-- Modelo base, recomenda-se revisão por profissional jurídico. -->
${notice}
<p class="lead">Esta política explica como o site de ${e(b.name)} trata dados pessoais. Foi escrita para refletir aquilo que o site faz realmente.</p>

<h2>1. Responsável pelo tratamento</h2>
<p>O responsável pelo tratamento é <strong>${e(L.legalName)}</strong>, NIF ${e(L.nif)}, com sede em ${e(L.registeredAddress)}, que explora o restaurante ${e(b.name)} (${e(address)}).</p>
<p>Contacto para questões de privacidade: ${mail}.</p>

<h2>2. Em resumo</h2>
<ul>
  <li>Este site <strong>não usa cookies</strong>, ferramentas de estatística (analytics), publicidade nem píxeis de redes sociais.</li>
  <li>Só são tratados dados pessoais nas situações descritas abaixo${formOn ? ' (alojamento do site e pedidos enviados pelo formulário' : ' (alojamento do site'}${mapOn ? ' e mapa, apenas se o carregar)' : ')'}.</li>
</ul>

<h2>3. Alojamento do site e dados técnicos</h2>
<p>O site está alojado no <strong>GitHub Pages</strong>, um serviço da GitHub, Inc. (Estados Unidos). Quando visita o site, os servidores da GitHub registam automaticamente dados técnicos, como o endereço IP, a data e hora do pedido e o tipo de browser, necessários para entregar as páginas e proteger o serviço contra abusos. Nós não usamos estes dados para o identificar.</p>
<ul>
  <li><strong>Finalidade:</strong> disponibilizar o site de forma segura.</li>
  <li><strong>Base legal:</strong> interesse legítimo (art. 6.º, n.º 1, alínea f) do RGPD).</li>
  <li><strong>Conservação:</strong> pelo período definido pela GitHub (ver a <a href="https://docs.github.com/pt/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">Declaração de Privacidade da GitHub<span class="visually-hidden"> ${e(ui.newTab)}</span></a>).</li>
  <li><strong>Transferências internacionais:</strong> a GitHub pode tratar dados fora do Espaço Económico Europeu, com as garantias previstas no RGPD (por exemplo, o Quadro de Privacidade de Dados UE-EUA ou cláusulas contratuais-tipo).</li>
</ul>

<h2>4. Preferências guardadas no seu dispositivo</h2>
<p>O site guarda no armazenamento local do browser (<em>localStorage</em>), apenas no seu dispositivo:</p>
<ul>
  <li>o idioma que escolheu (português ou inglês);</li>
${demoOn ? '  <li>o tema visual escolhido na versão de demonstração;</li>\n' : ''}${mapOn ? '  <li>a sua escolha de carregar o mapa automaticamente, se assinalar «Lembrar a minha escolha».</li>\n' : ''}</ul>
<p>Estes dados não são cookies, não são enviados para nenhum servidor e não servem para o identificar. São estritamente necessários para a funcionalidade que pediu. Pode apagá-los a qualquer momento nas definições do browser (dados de sites).</p>
${formOn ? `
<!-- ===== BLOCO OPCIONAL: FORMULÁRIO (ativo porque form.enabled: true) ===== -->
<h2 id="formulario">5. Pedidos de reserva e contacto (formulário)</h2>
<ul>
  <li><strong>Dados:</strong> nome, email, telefone, data e hora pretendidas, número de pessoas e as observações que escrever.</li>
  <li><strong>Finalidade:</strong> responder ao seu pedido e gerir a reserva.</li>
  <li><strong>Base legal:</strong> diligências pré-contratuais a seu pedido (art. 6.º, n.º 1, alínea b) do RGPD).</li>
  <li><strong>Alergias e intolerâncias:</strong> se as indicar nas observações, essa informação pode ser considerada um dado de saúde. Só a indique se quiser; será usada exclusivamente para preparar a sua visita, com base no seu consentimento explícito (art. 9.º, n.º 2, alínea a) do RGPD).</li>
  <li><strong>Conservação:</strong> ${e(tr(cfg.form.retention, 'pt'))}, sendo depois apagados.</li>
  <li><strong>Subcontratantes:</strong> EmailJS (serviço de envio do formulário por email, <a href="https://www.emailjs.com/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">política de privacidade<span class="visually-hidden"> ${e(ui.newTab)}</span></a>) e ${e(cfg.form.emailProvider || '[FORNECEDOR DE EMAIL]')} (receção dos emails). Estes prestadores podem tratar dados fora do Espaço Económico Europeu, com as garantias previstas no RGPD.</li>
  <li>Os dados não são usados para marketing nem partilhados com terceiros para outros fins.</li>
</ul>
<!-- ===== /BLOCO OPCIONAL: FORMULÁRIO ===== -->
` : '<!-- BLOCO OPCIONAL: FORMULÁRIO — omitido (form.enabled: false). -->'}
${mapOn ? `
<!-- ===== BLOCO OPCIONAL: MAPA (ativo porque location.map.enabled: true) ===== -->
<h2 id="mapa">${formOn ? '6' : '5'}. Mapa da Google</h2>
<p>O mapa da Google <strong>só é carregado se clicar em «Carregar mapa»</strong>. Até lá, nenhum dado é enviado à Google. Ao carregá-lo, a Google Ireland Limited recebe o seu endereço IP e pode definir cookies, enquanto responsável pelo tratamento independente, nos termos da <a href="https://policies.google.com/privacy?hl=pt-PT" target="_blank" rel="noopener noreferrer">Política de Privacidade da Google<span class="visually-hidden"> ${e(ui.newTab)}</span></a>.</p>
<p><strong>Base legal:</strong> o seu consentimento (art. 6.º, n.º 1, alínea a) do RGPD). Se assinalou «Lembrar a minha escolha», pode retirar o consentimento apagando os dados deste site no browser.</p>
<!-- ===== /BLOCO OPCIONAL: MAPA ===== -->
` : '<!-- BLOCO OPCIONAL: MAPA — omitido (mapa desligado). -->'}
<!-- ===== BLOCO OPCIONAL: ANALYTICS (desligado) =====
  Se no futuro adicionar estatísticas (ex.: Google Analytics, Plausible), acrescente aqui:
  <h2 id="analytics">Estatísticas de utilização</h2>
  <p>Usamos [FERRAMENTA DE ANALYTICS] para perceber como o site é utilizado. [Só é ativada com o seu
  consentimento, dado no banner de cookies.] Dados: [DADOS]. Base legal: consentimento (art. 6.º, n.º 1, a) RGPD).
  Conservação: [PRAZO]. Subcontratante: [EMPRESA]. Pode retirar o consentimento em [COMO].</p>
  Lembre-se de adicionar também o banner de consentimento (ver comentário no <head>).
===== /BLOCO OPCIONAL: ANALYTICS ===== -->

<h2>Ligações para outros serviços</h2>
<p>O site tem ligações para serviços de terceiros (por exemplo, plataformas de reserva e de entregas, WhatsApp, redes sociais e aplicações de mapas). Ao clicar, sai deste site e passa a aplicar-se a política de privacidade desse serviço.</p>

<h2>Os seus direitos</h2>
<p>Nos termos do RGPD, pode pedir o acesso, a retificação, o apagamento, a limitação do tratamento e a portabilidade dos seus dados, opor-se ao tratamento e retirar o consentimento a qualquer momento, sem afetar o tratamento já realizado. Para isso, escreva para ${mail}. Respondemos no prazo máximo de um mês.</p>

<h2>Reclamações</h2>
<p>Se considerar que os seus dados não foram tratados corretamente, pode apresentar reclamação à <a href="https://www.cnpd.pt/" target="_blank" rel="noopener noreferrer">Comissão Nacional de Proteção de Dados (CNPD)<span class="visually-hidden"> ${e(ui.newTab)}</span></a>.</p>

<h2>Alterações a esta política</h2>
<p>Esta política pode ser atualizada quando o site mudar. Última atualização: <time datetime="${e(L.privacyUpdated)}">${e(updated)}</time>.</p>`;

  return `<!-- Base template; review by a legal professional is recommended. -->
${notice}
<p class="lead">This policy explains how the ${e(b.name)} website handles personal data. It was written to reflect what the website actually does.</p>

<h2>1. Data controller</h2>
<p>The data controller is <strong>${e(L.legalName)}</strong>, tax number (NIF) ${e(L.nif)}, registered at ${e(L.registeredAddress)}, which operates the restaurant ${e(b.name)} (${e(address)}).</p>
<p>Privacy contact: ${mail}.</p>

<h2>2. In short</h2>
<ul>
  <li>This website <strong>does not use cookies</strong>, analytics tools, advertising or social media pixels.</li>
  <li>Personal data is only processed in the situations described below${formOn ? ' (website hosting and requests sent through the form' : ' (website hosting'}${mapOn ? ' and the map, only if you load it)' : ')'}.</li>
</ul>

<h2>3. Website hosting and technical data</h2>
<p>The website is hosted on <strong>GitHub Pages</strong>, a service of GitHub, Inc. (United States). When you visit the website, GitHub’s servers automatically log technical data such as your IP address, the date and time of the request and your browser type, which are needed to deliver the pages and protect the service against abuse. We do not use this data to identify you.</p>
<ul>
  <li><strong>Purpose:</strong> to provide the website securely.</li>
  <li><strong>Legal basis:</strong> legitimate interest (Article 6(1)(f) GDPR).</li>
  <li><strong>Retention:</strong> for the period set by GitHub (see the <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub Privacy Statement<span class="visually-hidden"> ${e(ui.newTab)}</span></a>).</li>
  <li><strong>International transfers:</strong> GitHub may process data outside the European Economic Area, with the safeguards provided for in the GDPR (for example, the EU-US Data Privacy Framework or standard contractual clauses).</li>
</ul>

<h2>4. Preferences stored on your device</h2>
<p>The website stores the following in your browser’s local storage (<em>localStorage</em>), on your device only:</p>
<ul>
  <li>the language you chose (Portuguese or English);</li>
${demoOn ? '  <li>the visual theme chosen in the demo version;</li>\n' : ''}${mapOn ? '  <li>your choice to load the map automatically, if you tick “Remember my choice”.</li>\n' : ''}</ul>
<p>This data is not a cookie, is never sent to any server and cannot identify you. It is strictly necessary for the feature you asked for. You can delete it at any time in your browser settings (site data).</p>
${formOn ? `
<!-- ===== OPTIONAL BLOCK: FORM (active because form.enabled: true) ===== -->
<h2 id="form">5. Booking and contact requests (form)</h2>
<ul>
  <li><strong>Data:</strong> name, email, phone, requested date and time, number of guests and any notes you write.</li>
  <li><strong>Purpose:</strong> to reply to your request and manage your booking.</li>
  <li><strong>Legal basis:</strong> steps taken at your request prior to entering into a contract (Article 6(1)(b) GDPR).</li>
  <li><strong>Allergies and intolerances:</strong> if you mention them in the notes, this may be health data. Only include it if you wish; it will be used solely to prepare for your visit, based on your explicit consent (Article 9(2)(a) GDPR).</li>
  <li><strong>Retention:</strong> ${e(tr(cfg.form.retention, 'en'))}, after which it is deleted.</li>
  <li><strong>Processors:</strong> EmailJS (form-to-email service, <a href="https://www.emailjs.com/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">privacy policy<span class="visually-hidden"> ${e(ui.newTab)}</span></a>) and ${e(cfg.form.emailProvider || '[EMAIL PROVIDER]')} (email delivery). These providers may process data outside the European Economic Area, with the safeguards provided for in the GDPR.</li>
  <li>Your data is not used for marketing or shared with third parties for any other purpose.</li>
</ul>
<!-- ===== /OPTIONAL BLOCK: FORM ===== -->
` : '<!-- OPTIONAL BLOCK: FORM — omitted (form.enabled: false). -->'}
${mapOn ? `
<!-- ===== OPTIONAL BLOCK: MAP (active because location.map.enabled: true) ===== -->
<h2 id="mapa">${formOn ? '6' : '5'}. Google map</h2>
<p>The Google map <strong>is only loaded if you click “Load map”</strong>. Until then, no data is sent to Google. When it loads, Google Ireland Limited receives your IP address and may set cookies, as an independent controller, under the <a href="https://policies.google.com/privacy?hl=en" target="_blank" rel="noopener noreferrer">Google Privacy Policy<span class="visually-hidden"> ${e(ui.newTab)}</span></a>.</p>
<p><strong>Legal basis:</strong> your consent (Article 6(1)(a) GDPR). If you ticked “Remember my choice”, you can withdraw consent by deleting this website’s data in your browser.</p>
<!-- ===== /OPTIONAL BLOCK: MAP ===== -->
` : '<!-- OPTIONAL BLOCK: MAP — omitted (map disabled). -->'}
<!-- ===== OPTIONAL BLOCK: ANALYTICS (disabled) =====
  If you add analytics in the future, add a section here describing the tool, the data,
  the legal basis (consent), retention, the processor and how to withdraw consent,
  and add the consent banner (see the comment in <head>).
===== /OPTIONAL BLOCK: ANALYTICS ===== -->

<h2>Links to other services</h2>
<p>The website links to third-party services (for example, booking and delivery platforms, WhatsApp, social media and map apps). When you click them, you leave this website and that service’s privacy policy applies.</p>

<h2>Your rights</h2>
<p>Under the GDPR you may request access to, rectification, erasure, restriction and portability of your data, object to processing and withdraw consent at any time, without affecting processing already carried out. To do so, write to ${mail}. We reply within one month at the latest.</p>

<h2>Complaints</h2>
<p>If you believe your data has not been handled correctly, you may lodge a complaint with the Portuguese data protection authority, the <a href="https://www.cnpd.pt/" target="_blank" rel="noopener noreferrer">Comissão Nacional de Proteção de Dados (CNPD)<span class="visually-hidden"> ${e(ui.newTab)}</span></a>.</p>

<h2>Changes to this policy</h2>
<p>This policy may be updated when the website changes. Last updated: <time datetime="${e(L.privacyUpdated)}">${e(updated)}</time>.</p>`;
}
