// Configuração do Playwright (testes que abrem o site de verdade num navegador).
// Explicação: docs/QA.md. Seguimos o padrão da skill auto-qa (.claude/skills/auto-qa).
import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const baseURL = process.env.QA_BASE_URL || `http://127.0.0.1:${PORT}`;

// Se você já tem o Chrome e não quer baixar o navegador do Playwright, aponte para ele:
//   PW_CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"
const launchOptions = process.env.PW_CHROME_PATH
  ? { executablePath: process.env.PW_CHROME_PATH }
  : {};

const desktop = {
  ...devices['Desktop Chrome'],
  viewport: { width: 1440, height: 900 },
  launchOptions,
};
const mobile = { ...devices['iPhone 13'], defaultBrowserType: 'chromium', launchOptions };

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './artifacts/auto-qa/test-results',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'artifacts/auto-qa/playwright-report', open: 'never' }],
  ],
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  expect: {
    // Comparação de imagens (testes visuais): tolera até 1% de pixels diferentes.
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' },
  },
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // Vídeo só se você pedir (QA_VIDEO=1): exige o ffmpeg do Playwright. O trace já ajuda a depurar.
    video: process.env.QA_VIDEO ? 'retain-on-failure' : 'off',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },
  // Sobe o servidor do front sozinho (a menos que você aponte QA_BASE_URL para outro).
  webServer: process.env.QA_BASE_URL
    ? undefined
    : {
        command: 'npm run serve:front',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
      },
  projects: [
    // Testes funcionais no desktop: tudo, menos os visuais e os específicos de celular.
    { name: 'chromium-desktop', use: desktop, testIgnore: /(visual|-mobile)\.spec\.js/ },
    // No celular, só o que já faz sentido hoje (o layout mobile ainda tem bugs: BUG-007).
    {
      name: 'chromium-mobile',
      use: mobile,
      testMatch: /(smoke|evidence|known-bugs-mobile)\.spec\.js/,
    },
    // Testes visuais (comparam prints): rode `npm run test:visual:update` na primeira vez.
    { name: 'visual-desktop', use: desktop, testMatch: /visual\.spec\.js/ },
    { name: 'visual-mobile', use: mobile, testMatch: /visual\.spec\.js/ },
  ],
});
