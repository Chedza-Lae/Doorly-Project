import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const API_URL = process.env.VITE_API_BASE_URL || process.env.API_URL || "http://localhost:3001";
const OUT_DIR = path.resolve(process.cwd(), "../docs/screenshots");
const VIEWPORT = { width: 1920, height: 1080 };

const credentials = {
  admin: [{ email: "admin@doorly.pt", password: "Admin123" }],
  providers: [
    { email: "prestador@doorly.pt", password: "123456" },
    { email: "aurora.limpa@doorly.pt", password: "123456" },
    { email: "volt.casa@doorly.pt", password: "123456" },
    { email: "atelier.verde@doorly.pt", password: "123456" },
    { email: "mobifix@doorly.pt", password: "123456" },
  ],
  clients: [
    { email: "cliente.sofia@doorly.pt", password: "123456" },
    { email: "cliente.tiago@doorly.pt", password: "123456" },
    { email: "cliente.ines@doorly.pt", password: "123456" },
  ],
};

const planned = [
  ["01-home.png", "Pagina inicial com hero, pesquisa, categorias e servicos em destaque."],
  ["02-login.png", "Pagina de login com formulario e identidade visual Doorly."],
  ["03-registo.png", "Formulario de registo completo preenchido para demonstracao visual."],
  ["04-servicos.png", "Lista de servicos com filtros, pesquisa, categorias e grelha de resultados."],
  ["05-detalhe-servico.png", "Detalhe de um servico real com imagem, descricao, preco e acoes."],
  ["06-favoritos.png", "Favoritos do cliente autenticado, usando dados reais da base de dados."],
  ["07-chat.png", "Conversa existente entre cliente e prestador."],
  ["08-historico-cliente.png", "Historico/agendamentos do cliente com estados reais."],
  ["09-dashboard-prestador.png", "Dashboard do prestador com estatisticas, propostas e servicos publicados."],
  ["10-criar-servico.png", "Formulario de criacao de servico preenchido para apresentacao."],
  ["11-perfil.png", "Perfil autenticado com informacoes pessoais e profissionais."],
  ["12-admin-dashboard.png", "Painel administrativo em vista geral."],
  ["13-admin-utilizadores.png", "Gestao administrativa de utilizadores."],
  ["14-admin-servicos.png", "Gestao administrativa de servicos por prestador."],
  ["15-agendamento.png", "Formulario de agendamento completo com servico real."],
];

const notes = [];
const generated = [];
const skipped = [];

async function request(pathname, { token, method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_URL}${pathname}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.error || `HTTP ${response.status}`);
  }
  return data;
}

async function login({ email, password }) {
  return request("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

async function firstWorkingLogin(list) {
  for (const item of list) {
    try {
      return await login(item);
    } catch {
      // Try the next documented demo credential.
    }
  }
  return null;
}

function normalizeServices(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.services)) return response.services;
  return [];
}

function sessionStorageScript(session) {
  return ({ token, user }) => {
    window.localStorage.setItem("doorly_token", token);
    window.localStorage.setItem("doorly_user", JSON.stringify({
      id: user.id ?? user.id_utilizador,
      id_utilizador: user.id ?? user.id_utilizador,
      nome: user.nome,
      email: user.email,
      tipo: user.tipo,
      foto_perfil: user.foto_perfil ?? null,
      telefone: user.telefone ?? null,
      localizacao: user.localizacao ?? null,
      profissao: user.profissao ?? null,
      descricao: user.descricao ?? null,
    }));
  };
}

async function createPage(browser, session = null) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    colorScheme: "light",
    reducedMotion: "reduce",
  });

  if (session) {
    await context.addInitScript(sessionStorageScript(session), {
      token: session.token,
      user: session.user,
    });
  }

  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  await page.addStyleTag({
    content: `
      * { cursor: none !important; caret-color: transparent !important; }
      html, body { scrollbar-width: none !important; }
      ::-webkit-scrollbar { display: none !important; }
      .fixed.bottom-5.right-5, .fixed.sm\\:bottom-6 { display: none !important; }
      [aria-label="Centro de Ajuda"] { display: none !important; }
    `,
  }).catch(() => {});
  return page;
}

async function polish(page) {
  await page.addStyleTag({
    content: `
      * { cursor: none !important; caret-color: transparent !important; }
      html, body { scrollbar-width: none !important; }
      ::-webkit-scrollbar { display: none !important; }
      .fixed.bottom-5.right-5, .fixed.sm\\:bottom-6 { display: none !important; }
      [aria-label="Centro de Ajuda"] { display: none !important; }
    `,
  }).catch(() => {});

  await page.evaluate(async () => {
    window.scrollBy(0, 0);
    await document.fonts?.ready?.catch?.(() => {});
    const images = Array.from(document.images);
    await Promise.all(images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
        setTimeout(resolve, 3500);
      });
    }));
  });
  await page.waitForTimeout(900);
}

async function goto(page, pathname) {
  await page.goto(`${FRONTEND_URL}${pathname}`, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle").catch(() => {});
  await polish(page);
}

async function visibleText(page) {
  return page.locator("body").innerText({ timeout: 5000 }).catch(() => "");
}

function hasErrorLikeText(text) {
  return /erro|credenciais|token|indisponivel|indisponível|falha/i.test(text);
}

async function screenshot(page, filename, description) {
  const filePath = path.join(OUT_DIR, filename);
  await polish(page);
  await page.screenshot({ path: filePath, fullPage: false, animations: "disabled" });
  generated.push({ filename, description });
}

function skip(filename, description, reason) {
  skipped.push({ filename, description, reason });
  notes.push(`${filename}: ${reason}`);
}

async function capture(browser, filename, description, pathname, { session, prepare, requireData = true } = {}) {
  const page = await createPage(browser, session);
  try {
    await goto(page, pathname);
    if (prepare) await prepare(page);
    const text = await visibleText(page);
    if (requireData && hasErrorLikeText(text)) {
      throw new Error("a pagina apresentou mensagem de erro ou dados indisponiveis");
    }
    await screenshot(page, filename, description);
  } catch (error) {
    skip(filename, description, error.message);
  } finally {
    await page.context().close();
  }
}

async function chooseClient(clients, predicate) {
  for (const session of clients) {
    try {
      const result = await predicate(session);
      if (result) return { session, result };
    } catch {
      // Keep looking for a client with matching real data.
    }
  }
  return { session: clients[0] || null, result: null };
}

async function chooseProvider(providers) {
  for (const session of providers) {
    try {
      const services = await request("/api/servicos/me", { token: session.token });
      if (Array.isArray(services) && services.length > 0) return { session, services };
    } catch {
      // Keep looking.
    }
  }
  return { session: providers[0] || null, services: [] };
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  const admin = await firstWorkingLogin(credentials.admin);
  const providers = (await Promise.all(credentials.providers.map((item) => login(item).catch(() => null)))).filter(Boolean);
  const clients = (await Promise.all(credentials.clients.map((item) => login(item).catch(() => null)))).filter(Boolean);

  const services = normalizeServices(await request("/api/servicos").catch(() => []));
  const service = services.find((item) => item.imagem_url) || services[0] || null;

  if (!service) {
    notes.push("Nao foi encontrado nenhum servico real na API publica.");
  }

  const favoriteChoice = await chooseClient(clients, async (session) => {
    const favorites = await request("/api/favorites", { token: session.token });
    return Array.isArray(favorites) && favorites.length > 0 ? favorites : null;
  });

  const chatChoice = await chooseClient(clients, async (session) => {
    const inbox = await request("/api/messages/inbox", { token: session.token });
    return Array.isArray(inbox) && inbox.length > 0 ? inbox[0] : null;
  });

  const historyChoice = await chooseClient(clients, async (session) => {
    const bookings = await request("/api/agendamentos/me", { token: session.token });
    return Array.isArray(bookings) && bookings.length > 0 ? bookings : null;
  });

  const { session: providerSession } = await chooseProvider(providers);

  await capture(browser, "01-home.png", planned[0][1], "/", { requireData: true });
  await capture(browser, "02-login.png", planned[1][1], "/login", { requireData: false });
  await capture(browser, "03-registo.png", planned[2][1], "/register", {
    requireData: false,
    prepare: async (page) => {
      await page.getByRole("button", { name: /prestador/i }).click();
      await page.locator("input").nth(0).fill("Ines Martins");
      await page.locator("input").nth(1).fill("ines.martins@doorly.pt");
      await page.locator("input").nth(2).fill("Doorly2026!");
      await page.locator("input").nth(3).fill("Doorly2026!");
      await page.locator("input[type='checkbox']").nth(0).check();
      await page.locator("input[type='checkbox']").nth(1).check();
      await page.evaluate(() => window.scrollTo(0, 130));
    },
  });
  await capture(browser, "04-servicos.png", planned[3][1], "/services", {
    session: favoriteChoice.session,
    requireData: true,
    prepare: async (page) => {
      await page.locator("input[type='text']").first().fill("Lisboa");
      await page.waitForTimeout(500);
    },
  });

  if (service) {
    await capture(browser, "05-detalhe-servico.png", planned[4][1], `/service/${service.id_servico}`, {
      session: clients[0],
      requireData: true,
    });
  } else {
    skip("05-detalhe-servico.png", planned[4][1], "sem servicos reais disponiveis");
  }

  if (favoriteChoice.result) {
    await capture(browser, "06-favoritos.png", planned[5][1], "/favorites", {
      session: favoriteChoice.session,
      requireData: true,
    });
  } else {
    skip("06-favoritos.png", planned[5][1], "nenhum cliente demo autenticavel tinha favoritos reais");
  }

  if (chatChoice.result) {
    await capture(
      browser,
      "07-chat.png",
      planned[6][1],
      `/messages/thread?service_id=${chatChoice.result.id_servico}&other_id=${chatChoice.result.other_id}`,
      { session: chatChoice.session, requireData: true }
    );
  } else {
    skip("07-chat.png", planned[6][1], "nenhum cliente demo autenticavel tinha conversas reais");
  }

  if (historyChoice.result) {
    await capture(browser, "08-historico-cliente.png", planned[7][1], "/historico", {
      session: historyChoice.session,
      requireData: true,
    });
  } else {
    skip("08-historico-cliente.png", planned[7][1], "nenhum cliente demo autenticavel tinha agendamentos reais");
  }

  if (providerSession) {
    await capture(browser, "09-dashboard-prestador.png", planned[8][1], "/prestador/dashboard", {
      session: providerSession,
      requireData: true,
    });

    await capture(browser, "10-criar-servico.png", planned[9][1], "/prestador/dashboard", {
      session: providerSession,
      requireData: true,
      prepare: async (page) => {
        await page.locator("aside form").scrollIntoViewIfNeeded();
        const form = page.locator("aside form");
        await form.locator("input:not([type='file']):not([type='checkbox'])").nth(0).fill("Organizacao premium de interiores");
        await form.locator("textarea").first().fill("Servico de organizacao e arrumacao para casas, closets e escritorios, com plano personalizado e acabamento profissional.");
        await form.locator("input:not([type='file']):not([type='checkbox'])").nth(1).fill("Organizacao");
        await form.locator("input:not([type='file']):not([type='checkbox'])").nth(2).fill("45");
        await form.locator("input:not([type='file']):not([type='checkbox'])").nth(3).fill("Lisboa");
      },
    });

    await capture(browser, "11-perfil.png", planned[10][1], "/perfil", {
      session: providerSession,
      requireData: true,
      prepare: async (page) => {
        await page.locator("input").nth(2).fill("912 345 678").catch(() => {});
        await page.locator("input").nth(3).fill("Lisboa").catch(() => {});
        await page.locator("input").nth(4).fill("Prestador certificado").catch(() => {});
        await page.locator("textarea").first().fill("Profissional Doorly com experiencia em servicos ao domicilio, foco em pontualidade, comunicacao clara e acabamento cuidado.").catch(() => {});
      },
    });
  } else {
    skip("09-dashboard-prestador.png", planned[8][1], "nao foi possivel autenticar prestador demo");
    skip("10-criar-servico.png", planned[9][1], "nao foi possivel autenticar prestador demo");
    skip("11-perfil.png", planned[10][1], "nao foi possivel autenticar prestador demo");
  }

  if (admin) {
    await capture(browser, "12-admin-dashboard.png", planned[11][1], "/admin", {
      session: admin,
      requireData: true,
    });
    await capture(browser, "13-admin-utilizadores.png", planned[12][1], "/admin", {
      session: admin,
      requireData: true,
      prepare: async (page) => {
        await page.getByRole("heading", { name: "Utilizadores registados" }).scrollIntoViewIfNeeded();
      },
    });
    await capture(browser, "14-admin-servicos.png", planned[13][1], "/admin", {
      session: admin,
      requireData: true,
      prepare: async (page) => {
        await page.getByRole("heading", { name: "Prestadores e serviços" }).scrollIntoViewIfNeeded();
      },
    });
  } else {
    skip("12-admin-dashboard.png", planned[11][1], "nao foi possivel autenticar admin demo");
    skip("13-admin-utilizadores.png", planned[12][1], "nao foi possivel autenticar admin demo");
    skip("14-admin-servicos.png", planned[13][1], "nao foi possivel autenticar admin demo");
  }

  if (service && clients[0]) {
    await capture(browser, "15-agendamento.png", planned[14][1], `/booking/new?service_id=${service.id_servico}`, {
      session: clients[0],
      requireData: true,
      prepare: async (page) => {
        await page.locator("textarea").first().fill("Pretendo confirmar disponibilidade para a proxima semana. A morada e os detalhes finais serao enviados por mensagem.");
      },
    });
  } else {
    skip("15-agendamento.png", planned[14][1], "sem cliente autenticado ou servico real disponivel");
  }

  await browser.close();

  const generatedNames = new Set(generated.map((item) => item.filename));
  const readme = [
    "# Doorly Screenshots",
    "",
    "Capturas geradas automaticamente com Playwright em 1920x1080 para a defesa da PAP.",
    "",
    "## Imagens",
    "",
    ...planned.map(([filename, description]) => {
      if (generatedNames.has(filename)) return `- ${filename} - ${description}`;
      const item = skipped.find((entry) => entry.filename === filename);
      return `- ${filename} - Nao gerada: ${item?.reason || "motivo nao registado"}.`;
    }),
    "",
    "## Observacoes",
    "",
    notes.length ? notes.map((note) => `- ${note}`).join("\n") : "- Todas as capturas planeadas foram geradas.",
    "",
  ].join("\n");

  await fs.writeFile(path.join(OUT_DIR, "README.md"), readme, "utf8");

  console.log(JSON.stringify({
    generated: generated.map((item) => item.filename),
    skipped,
    readme: path.join(OUT_DIR, "README.md"),
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
