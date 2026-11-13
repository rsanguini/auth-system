// ESLint (formato "flat config"). Explicação completa: docs/QA.md, seção "Lint".
import js from '@eslint/js';
import globals from 'globals';

export default [
  // Pastas que o ESLint não deve olhar.
  {
    ignores: [
      'node_modules/**',
      'artifacts/**',
      'playwright-report/**',
      'test-results/**',
      '.claude/**',
    ],
  },

  js.configs.recommended,

  // Front-end: roda no navegador, como <script> comum (não é módulo ES ainda).
  {
    files: ['frontend/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: globals.browser,
    },
    rules: {
      // As funções do script.js são chamadas pelo HTML (onclick="..."), então
      // parecem "não usadas" para o ESLint. 'local' ignora funções globais.
      // Quando o front virar módulos ES (Fase 2), isso deixa de ser necessário.
      'no-unused-vars': ['error', { vars: 'local', args: 'after-used' }],
    },
  },

  // Backend (Fase 1 em diante): Node.js com módulos ES.
  {
    files: ['backend/**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: globals.node,
    },
  },

  // Testes e arquivos de configuração: Node.js com módulos ES.
  {
    files: ['tests/**/*.js', '*.config.js'],
    languageOptions: {
      sourceType: 'module',
      globals: { ...globals.node, ...globals.browser },
    },
  },
];
