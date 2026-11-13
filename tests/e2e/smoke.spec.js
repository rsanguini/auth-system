// Testes de fumaça: o básico precisa estar de pé. Prioridade P0.
import { test, expect } from '@playwright/test';
import { watchBrowserErrors, goToSignup } from './helpers.js';

test.describe('Carregamento da página', () => {
  test('abre sem erros no console e sem exceções', async ({ page }) => {
    const errors = watchBrowserErrors(page);
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('tem título, idioma e a viewport configurados', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/login/i);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-br');
    await expect(page.locator('meta[name="viewport"]')).toHaveCount(1);
  });

  test('mostra os campos e o botão principal do login', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByLabel('Nome de usuário').first()).toBeVisible();
    await expect(page.locator('#loginSenha')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Acessar' })).toBeVisible();
  });
});

test.describe('Alternar entre Login e Cadastro', () => {
  // No celular o cadastro fica inacessível hoje. Esse comportamento é coberto (e documentado)
  // por BUG-007 em known-bugs-mobile.spec.js. Remover este skip quando o BUG-007 for corrigido.
  test.beforeEach(({ isMobile }) => {
    test.skip(isMobile, 'Coberto por BUG-007 (known-bugs-mobile.spec.js)');
  });

  test('o botão "Cadastre-se" mostra o formulário de cadastro', async ({ page }) => {
    await page.goto('/');
    await goToSignup(page);
    await expect(page.locator('#btnCadastro')).toBeInViewport();
  });

  test('o botão "Login" volta para a tela de login', async ({ page }) => {
    await page.goto('/');
    await goToSignup(page);
    await page.locator('.cadastro_confirm .btn-toggle').click();
    await expect(page.getByRole('heading', { name: 'Login' })).toBeInViewport();
  });
});

test('não tem rolagem horizontal (desktop e celular)', async ({ page }) => {
  await page.goto('/');
  const larguras = await page.evaluate(() => ({
    conteudo: document.documentElement.scrollWidth,
    tela: window.innerWidth,
  }));
  expect(larguras.conteudo).toBeLessThanOrEqual(larguras.tela);
});
