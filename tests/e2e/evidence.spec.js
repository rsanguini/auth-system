// Gera "prints" (screenshots) de cada estado importante em artifacts/auto-qa/screenshots/.
// Não compara nada: serve de evidência para o relatório de QA e para você VER o que o teste viu.
// (A comparação automática entre prints está em visual.spec.js.)
import { test, expect } from '@playwright/test';
import { goToSignup, newTestUser, signUp } from './helpers.js';

const DIR = 'artifacts/auto-qa/screenshots';
const shot = (page, testInfo, name) =>
  page.screenshot({
    path: `${DIR}/${name}-${testInfo.project.name}.png`,
    fullPage: true,
    animations: 'disabled',
  });

test('print: login inicial', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  await shot(page, testInfo, 'login-inicial');
});

test('print: login com erros de validação', async ({ page, isMobile }, testInfo) => {
  test.skip(isMobile, 'BUG-007: formulário inacessível no celular');
  await page.goto('/');
  await page.locator('#btnLogin').click();
  await expect(page.locator('#erroLoginUsuario')).toBeVisible();
  await shot(page, testInfo, 'login-erros');
});

test('print: modal de recuperação aberto', async ({ page, isMobile }, testInfo) => {
  test.skip(isMobile, 'BUG-007: formulário inacessível no celular');
  await page.goto('/');
  await page.getByText('Esqueci minha senha').click();
  await expect(page.locator('#modalSenha')).toBeVisible();
  await shot(page, testInfo, 'modal-recuperar');
});

test('print: cadastro vazio, com erros e preenchido', async ({ page, isMobile }, testInfo) => {
  test.skip(isMobile, 'BUG-007: formulário inacessível no celular');
  await page.goto('/');
  await goToSignup(page);
  await shot(page, testInfo, 'cadastro-inicial');

  await page.locator('#btnCadastro').click();
  await expect(page.locator('#erroCadastroUsuario')).toBeVisible();
  await shot(page, testInfo, 'cadastro-erros');

  await signUp(page, newTestUser());
  await expect(page.locator('#toast')).toContainText('Conta criada');
  await shot(page, testInfo, 'cadastro-sucesso');
});
