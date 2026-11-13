// TESTES VISUAIS: comparam o print de agora com um print "de referência" (baseline).
// Se a tela mudar sem querer (cor, espaçamento, quebra de layout), o teste falha e mostra a diferença.
//
// Como usar:
//   1. Primeira vez (gera as imagens de referência NO SEU computador): npm run test:visual:update
//   2. Depois do primeiro commit de referência, a cada mudança visual: npm run test:visual
//   3. Se a mudança foi proposital, atualize: npm run test:visual:update  e commite as imagens.
// As imagens ficam em tests/e2e/visual.spec.js-snapshots/ e dependem do sistema operacional
// (por isso o nome do arquivo termina com -win32, -darwin ou -linux).
import { test, expect } from '@playwright/test';
import { goToSignup } from './helpers.js';

test('visual: tela de login', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('login.png', { fullPage: true });
});

test('visual: tela de cadastro', async ({ page, isMobile }) => {
  test.skip(isMobile, 'BUG-007: o cadastro não é alcançável no celular');
  await page.goto('/');
  await goToSignup(page);
  await expect(page).toHaveScreenshot('cadastro.png', { fullPage: true });
});
