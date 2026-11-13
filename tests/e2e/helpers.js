// Funções de apoio compartilhadas pelos testes.
import { expect } from '@playwright/test';

/**
 * Começa a "escutar" erros do navegador (console, exceções, requisições que falharam).
 * Devolve uma lista que você consulta no fim do teste.
 * Ignora só o favicon (o site ainda não tem um; há um cartão para criar).
 */
export function watchBrowserErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    if (message.location().url.includes('favicon')) return;
    errors.push(`console.error: ${message.text()}`);
  });
  page.on('requestfailed', (request) => {
    if (request.url().includes('favicon')) return;
    errors.push(`requestfailed: ${request.url()}`);
  });
  return errors;
}

/** O script.js usa alert() após o login. Aceita o alerta e guarda a mensagem. */
export function acceptDialogs(page) {
  const messages = [];
  page.on('dialog', async (dialog) => {
    messages.push(dialog.message());
    await dialog.accept();
  });
  return messages;
}

/** Usuário de teste único por execução (nunca usar dados reais em testes). */
export function newTestUser(prefix = 'teste') {
  const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  return {
    username: `${prefix}_${id}`,
    email: `${prefix}.${id}@example.test`,
    password: 'Senha-De-Teste-123!',
  };
}

/** Vai para a tela de cadastro (clicando no botão do painel, como o usuário faria). */
export async function goToSignup(page) {
  await page.getByText('Cadastre-se', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Cadastro' })).toBeInViewport();
}

/** Preenche e envia o cadastro. */
export async function signUp(page, user) {
  await page.locator('#cadastroUsuario').fill(user.username);
  await page.locator('#cadastroEmail').fill(user.email);
  await page.locator('#cadastroSenha').fill(user.password);
  await page.locator('#cadastroConfirmar').fill(user.password);
  await page.locator('#btnCadastro').click();
}
