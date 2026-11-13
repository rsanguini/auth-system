// BUGS CONHECIDOS (desktop). Cada teste descreve o comportamento CORRETO.
//
// `test.fail(true, ...)` significa: "sabemos que este teste falha hoje". A suíte continua verde.
// Quando você corrigir o bug, o teste passa "sem esperar" e o Playwright mostra um erro:
// é o sinal para APAGAR a linha `test.fail(...)` — o teste vira um teste normal que protege
// contra o bug voltar. É o ciclo de TDD: vermelho -> corrigir -> verde.
//
// A lista de bugs, com a explicação de cada um, está em docs/fases/00-fundacao.md.
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { goToSignup, newTestUser, signUp } from './helpers.js';

const toast = (page) => page.locator('#toast');

async function registerAndReturnToLogin(page, user) {
  await page.goto('/');
  await goToSignup(page);
  await signUp(page, user);
  await expect(page.getByRole('heading', { name: 'Login' })).toBeInViewport({ timeout: 5000 });
}

test('BUG-001: Enter dentro do modal não deve disparar o login', async ({ page }) => {
  test.fail(true, 'BUG-001: o Enter global chama fazerLogin() mesmo com o modal aberto');
  await page.goto('/');
  await page.getByText('Esqueci minha senha').click();
  await page.locator('#recuperarUsuario').fill('alguem');
  await page.locator('#recuperarUsuario').press('Enter');

  await expect(page.locator('#erroLoginUsuario')).toBeHidden();
  await expect(toast(page)).not.toHaveText('Preencha todos os campos');
});

test('BUG-002: a mensagem de erro do login volta ao texto certo', async ({ page }) => {
  test.fail(true, 'BUG-002: textContent do erro é sobrescrito e nunca restaurado');
  await page.goto('/');
  await page.locator('#loginUsuario').fill('usuario_que_nao_existe');
  await page.locator('#loginSenha').fill('qualquer');
  await page.locator('#btnLogin').click();
  await expect(page.locator('#erroLoginUsuario')).toBeVisible();

  await page.locator('#loginUsuario').fill('');
  await page.locator('#btnLogin').click();
  await expect(page.locator('#erroLoginUsuario')).toHaveText('Informe seu nome de usuário');
});

test('BUG-003: recuperar senha NUNCA mostra a senha', async ({ page }) => {
  test.fail(true, 'BUG-003: o toast exibe a senha em texto puro (falha de segurança)');
  const user = newTestUser();
  await registerAndReturnToLogin(page, user);

  await page.getByText('Esqueci minha senha').click();
  await page.locator('#recuperarUsuario').fill(user.username);
  await page.getByRole('button', { name: 'Confirmar' }).click();

  await expect(toast(page)).toBeVisible();
  await expect(toast(page)).not.toContainText(user.password);
});

test('BUG-004: login com usuário errado e com senha errada dão a MESMA mensagem', async ({
  page,
}) => {
  test.fail(true, 'BUG-004: mensagens diferentes revelam quais usuários existem (enumeração)');
  const user = newTestUser();
  await registerAndReturnToLogin(page, user);

  await page.locator('#loginUsuario').fill('usuario_que_nao_existe');
  await page.locator('#loginSenha').fill('qualquer-senha');
  await page.locator('#btnLogin').click();
  await expect(toast(page)).toBeVisible();
  const mensagemUsuarioInexistente = await toast(page).innerText();

  await page.locator('#loginUsuario').fill(user.username);
  await page.locator('#loginSenha').fill('senha-errada');
  await page.locator('#btnLogin').click();
  const mensagemSenhaErrada = await toast(page).innerText();

  expect(mensagemSenhaErrada).toBe(mensagemUsuarioInexistente);
});

test('BUG-005: login e cadastro são <form> de verdade', async ({ page }) => {
  test.fail(true, 'BUG-005: não há <form>; quebra gerenciador de senhas, Enter nativo e leitores');
  await page.goto('/');
  await expect(page.locator('form')).toHaveCount(2);
});

test('BUG-006: as fontes Playfair Display e DM Sans são carregadas', async ({ page }) => {
  test.fail(true, 'BUG-006: as fontes são citadas no CSS mas nunca carregadas');
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const fontesCarregadas = await page.evaluate(() => document.fonts.size);
  expect(fontesCarregadas).toBeGreaterThan(0);
});

test('BUG-008: o botão de mostrar/ocultar senha é visível e tem nome acessível', async ({
  page,
}) => {
  test.fail(true, 'BUG-008: o botão nasce vazio (sem ícone, sem texto, sem aria-label)');
  await page.goto('/');
  const botao = page.locator('#loginSenha ~ .toggle-senha');
  await expect(botao).toBeVisible();
  await expect(botao).toHaveAccessibleName(/mostrar|exibir|ocultar/i);
});

test('BUG-009: não há botões de login social "de mentira"', async ({ page }) => {
  test.fail(true, 'BUG-009: Google/Facebook/LinkedIn apontam para "#" e não fazem nada');
  await page.goto('/');
  await expect(page.locator('a.logos[href="#"]')).toHaveCount(0);
});

test('BUG-010: a página não tem violações graves de acessibilidade (axe, WCAG A/AA)', async ({
  page,
}) => {
  test.fail(
    true,
    'BUG-010: axe achou 2 botões sem nome (button-name) e 5 elementos com contraste baixo',
  );
  await page.goto('/');
  const resultado = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const graves = resultado.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
  expect(graves.map((v) => `${v.id} (${v.nodes.length})`)).toEqual([]);
});

test('BUG-011: campos têm o atributo autocomplete correto', async ({ page }) => {
  test.fail(true, 'BUG-011: sem autocomplete, o navegador não sugere nem salva senha direito');
  await page.goto('/');
  await expect(page.locator('#loginSenha')).toHaveAttribute('autocomplete', 'current-password');
  await expect(page.locator('#cadastroSenha')).toHaveAttribute('autocomplete', 'new-password');
  await expect(page.locator('#cadastroEmail')).toHaveAttribute('autocomplete', 'email');
});

test('BUG-012: o site tem favicon', async ({ page }) => {
  test.fail(true, 'BUG-012: sem <link rel="icon">; o navegador pede /favicon.ico e recebe 404');
  await page.goto('/');
  await expect(page.locator('link[rel~="icon"]')).toHaveCount(1);
});

test('BUG-013: a meta description descreve o produto (não "treinamento")', async ({ page }) => {
  test.fail(true, 'BUG-013: a descrição ainda é um texto de treino ("para treinamento de CSS")');
  await page.goto('/');
  const descricao = await page.locator('meta[name="description"]').getAttribute('content');
  expect(descricao).not.toMatch(/treinamento/i);
});
