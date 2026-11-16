// Fluxos de cadastro, login, medidor de senha e modal, como funcionam HOJE (banco em memória).
// Prioridade P0/P1. Quando o backend existir (Fases 2 a 5), estes testes serão reescritos
// para falar com a API de verdade.
import { test, expect } from '@playwright/test';
import { acceptDialogs, goToSignup, newTestUser, signUp } from './helpers.js';

const toast = (page) => page.locator('#toast');

test.describe('Cadastro', () => {
  test('formulário vazio mostra os erros e o aviso', async ({ page }) => {
    await page.goto('/');
    await goToSignup(page);
    await page.locator('#btnCadastro').click();

    await expect(page.locator('#erroCadastroUsuario')).toBeVisible();
    await expect(page.locator('#erroCadastroEmail')).toBeVisible();
    await expect(page.locator('#erroCadastroSenha')).toBeVisible();
    await expect(toast(page)).toHaveText('Corrija os campos destacados');
  });

  test('rejeita e-mail inválido e só marca o campo errado', async ({ page }) => {
    const user = newTestUser();
    await page.goto('/');
    await goToSignup(page);
    await signUp(page, { ...user, email: 'isto-nao-e-email' });

    await expect(page.locator('#erroCadastroEmail')).toBeVisible();
    await expect(page.locator('#erroCadastroUsuario')).toBeHidden();
    await expect(page.locator('#erroCadastroSenha')).toBeHidden();
  });

  test('rejeita confirmação de senha diferente', async ({ page }) => {
    const user = newTestUser();
    await page.goto('/');
    await goToSignup(page);
    await page.locator('#cadastroUsuario').fill(user.username);
    await page.locator('#cadastroEmail').fill(user.email);
    await page.locator('#cadastroSenha').fill(user.password);
    await page.locator('#cadastroConfirmar').fill(`${user.password}x`);
    await page.locator('#btnCadastro').click();

    await expect(page.locator('#erroConfirmar')).toBeVisible();
  });

  test('cria a conta, limpa o formulário e volta para o login', async ({ page }) => {
    const user = newTestUser();
    await page.goto('/');
    await goToSignup(page);
    await signUp(page, user);

    await expect(toast(page)).toHaveText('Conta criada com sucesso! Faça login.');
    await expect(page.locator('#cadastroUsuario')).toHaveValue('');
    await expect(page.locator('#cadastroSenha')).toHaveValue('');
    await expect(page.getByRole('heading', { name: 'Login' })).toBeInViewport({ timeout: 5000 });
  });

  test('não deixa cadastrar o mesmo usuário duas vezes', async ({ page }) => {
    const user = newTestUser();
    await page.goto('/');
    await goToSignup(page);
    await signUp(page, user);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeInViewport({ timeout: 5000 });

    await goToSignup(page);
    await signUp(page, user);
    await expect(toast(page)).toHaveText('Usuário já cadastrado!');
  });
});

test.describe('Login', () => {
  test('campos vazios mostram os erros e o aviso', async ({ page }) => {
    await page.goto('/');
    await page.locator('#btnLogin').click();

    await expect(page.locator('#erroLoginUsuario')).toBeVisible();
    await expect(page.locator('#erroLoginSenha')).toBeVisible();
    await expect(toast(page)).toHaveText('Preencha todos os campos');
  });

  test('entra com a conta criada', async ({ page }) => {
    const dialogs = acceptDialogs(page);
    const user = newTestUser();
    await page.goto('/');
    await goToSignup(page);
    await signUp(page, user);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeInViewport({ timeout: 5000 });

    await page.locator('#loginUsuario').fill(user.username);
    await page.locator('#loginSenha').fill(user.password);
    await page.locator('#btnLogin').click();

    await expect(toast(page)).toContainText('Bem-vindo de volta');
    await expect.poll(() => dialogs.length, { timeout: 5000 }).toBe(1);
    expect(dialogs[0]).toContain(user.username);
  });

  test('senha errada não entra e marca o campo da senha', async ({ page }) => {
    const dialogs = acceptDialogs(page);
    const user = newTestUser();
    await page.goto('/');
    await goToSignup(page);
    await signUp(page, user);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeInViewport({ timeout: 5000 });

    await page.locator('#loginUsuario').fill(user.username);
    await page.locator('#loginSenha').fill('senha-completamente-errada');
    await page.locator('#btnLogin').click();

    await expect(page.locator('#erroLoginSenha')).toBeVisible();
    await page.waitForTimeout(1800); // dá tempo de um login indevido (o alert viria após 1,5 s)
    expect(dialogs).toEqual([]);
  });

  test('usuário inexistente não entra', async ({ page }) => {
    const dialogs = acceptDialogs(page);
    await page.goto('/');
    await page.locator('#loginUsuario').fill('ninguem_existe_com_este_nome');
    await page.locator('#loginSenha').fill('qualquer-coisa');
    await page.locator('#btnLogin').click();

    await expect(page.locator('#erroLoginSenha')).toBeVisible();
    await page.waitForTimeout(1800);
    expect(dialogs).toEqual([]);
  });
});

test.describe('Medidor de força da senha', () => {
  const cases = [
    { senha: '', rotulo: '' },
    { senha: 'abcdef', rotulo: 'Fraca' },
    { senha: 'abcdefghij', rotulo: 'Média' },
    { senha: 'Abcdef1!', rotulo: 'Forte' },
    { senha: 'Abcdefghij1!', rotulo: 'Muito forte' },
  ];

  for (const { senha, rotulo } of cases) {
    test(`senha "${senha}" → "${rotulo || '(sem rótulo)'}"`, async ({ page }) => {
      await page.goto('/');
      await goToSignup(page);
      await page.locator('#cadastroSenha').fill(senha);
      await expect(page.locator('#forcaLabel')).toHaveText(rotulo);
    });
  }
});

test.describe('Modal "Esqueci minha senha"', () => {
  test('abre com o foco no campo de usuário', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Esqueci minha senha').click();
    await expect(page.locator('#modalSenha')).toBeVisible();
    await expect(page.locator('#recuperarUsuario')).toBeFocused();
  });

  test('fecha com o botão Cancelar e limpa o campo', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Esqueci minha senha').click();
    await page.locator('#recuperarUsuario').fill('alguem');
    await page.getByRole('button', { name: 'Cancelar' }).click();

    await expect(page.locator('#modalSenha')).toBeHidden();
    await expect(page.locator('#recuperarUsuario')).toHaveValue('');
  });

  test('fecha ao clicar fora da caixa', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Esqueci minha senha').click();
    await page.locator('#modalSenha').click({ position: { x: 5, y: 5 } });
    await expect(page.locator('#modalSenha')).toBeHidden();
  });

  test('pede o usuário quando o campo está vazio', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Esqueci minha senha').click();
    await page.getByRole('button', { name: 'Confirmar' }).click();
    await expect(toast(page)).toHaveText('Informe o nome de usuário');
  });
});

test.describe('Botão de mostrar/ocultar senha', () => {
  async function alternaCampoEEstado(page, campoId) {
    const campo = page.locator(`#${campoId}`);
    const olho = page.locator(`#${campoId} ~ .toggle-senha`);

    await expect(olho).toHaveAttribute('aria-pressed', 'false');
    await olho.click();
    await expect(campo).toHaveAttribute('type', 'text');
    await expect(olho).toHaveAttribute('aria-pressed', 'true');
    await olho.click();
    await expect(campo).toHaveAttribute('type', 'password');
    await expect(olho).toHaveAttribute('aria-pressed', 'false');
  }

  test('no login, alterna o tipo do campo e o aria-pressed', async ({ page }) => {
    await page.goto('/');
    await alternaCampoEEstado(page, 'loginSenha');
  });

  test('no cadastro, alterna o tipo do campo e o aria-pressed', async ({ page }) => {
    await page.goto('/');
    await goToSignup(page);
    await alternaCampoEEstado(page, 'cadastroSenha');
  });
});
