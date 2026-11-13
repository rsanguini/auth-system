// BUGS CONHECIDOS no celular (viewport 390x844, projeto "chromium-mobile").
// Mesma ideia de known-bugs.spec.js: test.fail() até corrigir; depois, apague a linha.
import { test, expect } from '@playwright/test';

test('BUG-007a: no celular, o login está visível e utilizável', async ({ page }) => {
  test.fail(true, 'BUG-007: o painel azul cobre o formulário no layout de celular');
  await page.goto('/');
  await page.locator('#btnLogin').scrollIntoViewIfNeeded();
  await expect(page.locator('#loginUsuario')).toBeInViewport();
  await expect(page.locator('#btnLogin')).toBeInViewport();
});

test('BUG-007b: no celular, o cadastro pode ser aberto e enviado', async ({ page }) => {
  test.fail(true, 'BUG-007: o formulário de cadastro fica fora da tela no celular');
  await page.goto('/');
  await page.getByText('Cadastre-se', { exact: true }).scrollIntoViewIfNeeded();
  await page.getByText('Cadastre-se', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Cadastro' })).toBeInViewport();
  await expect(page.locator('#btnCadastro')).toBeInViewport();
});
