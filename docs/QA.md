# QA — Como testamos o Auth System

> Regra do projeto: **nada é "pronto" sem teste que prove**. Este documento explica o que testamos, com quê, quando e como ler os resultados.
> Complementa o `CLAUDE.md` (regras do Code) e o `docs/SKILLS.md` (quais skills usar e quando).

## 1. As camadas de teste

| Camada                         | Ferramenta                                   | O que prova                                                                              | Quando passa a existir         |
| ------------------------------ | -------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------ |
| Formatação                     | Prettier + EditorConfig                      | Código no mesmo estilo                                                                   | Agora                          |
| Lint                           | ESLint                                       | Erros comuns de código (variável não usada, etc.)                                        | Agora                          |
| **E2E (navegador de verdade)** | Playwright                                   | Botões, formulários, fluxos, mensagens, console limpo, desktop e celular                 | Agora                          |
| **Acessibilidade**             | axe (dentro do Playwright)                   | Nomes de botões, contraste, rótulos                                                      | Agora (BUG-010)                |
| **Visual (prints comparados)** | Playwright `toHaveScreenshot`                | A tela não mudou sem querer                                                              | Agora (gere as referências)    |
| Unitário                       | Vitest                                       | Funções puras do backend (validação, tokens, hash)                                       | Fase 1 em diante               |
| Integração da API              | Vitest + Supertest + Postgres de teste       | Endpoints, regras do banco, migrations                                                   | Fase 1 em diante               |
| **Dados**                      | Vitest + Postgres de teste                   | Constraints, retenção, exportação e exclusão de conta, migrations para cima e para baixo | Fases 2, 7 e 8                 |
| **Segurança**                  | Vitest/Playwright + `npm audit` + `gitleaks` | Rate limit, enumeração, tokens expirados ou reutilizados, CSRF, cabeçalhos, segredos     | Fase 6 (e antes, em cada fase) |
| Exploratório + relatório       | Skill **auto-qa**                            | Um olhar de "usuário" sobre o sistema inteiro, com evidências                            | Fim de cada fase               |

## 2. Comandos

| Comando                                                             | O que faz                                                                                  |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `npm run qa`                                                        | Lint + formatação + E2E. **Rode antes de todo commit importante e antes de todo PR.**      |
| `npm run lint`                                                      | Só o ESLint                                                                                |
| `npm run format` / `npm run format:check`                           | Formata / só confere a formatação                                                          |
| `npm run test:e2e`                                                  | Testes no navegador (desktop e celular)                                                    |
| `npm run test:visual:update`                                        | **Gera** os prints de referência (primeira vez, ou quando a mudança visual foi proposital) |
| `npm run test:visual`                                               | Compara os prints de agora com as referências                                              |
| `npm run test:report`                                               | Abre o relatório HTML do último teste (passos, prints, trace)                              |
| `npx playwright test <arquivo> --project=chromium-desktop --headed` | Roda um arquivo vendo o navegador abrir                                                    |
| `npx playwright test --ui`                                          | Modo interativo: o melhor jeito de **aprender** o que o teste faz                          |

Resultados e prints ficam em `artifacts/auto-qa/` (pasta ignorada pelo Git: pode conter dados de teste).

## 3. Como ler o resultado dos testes

- `✓` passou. `-` foi pulado (sempre com o motivo escrito no código).
- `✘` em um teste de **`known-bugs`** é **esperado**: o bug ainda existe. A suíte continua verde.
- Se um teste de bug conhecido **passar**, o Playwright mostra "Expected to fail, but passed". É **bom sinal**: você corrigiu o bug. Apague a linha `test.fail(...)` e o teste vira uma proteção permanente.

### Ciclo de correção (TDD aplicado aos bugs)

1. Escolha um `BUG-NNN` em `tests/e2e/known-bugs*.spec.js`.
2. Entenda **por que** falha (rode com `--headed` ou `--ui`).
3. Conserte o código (seguindo o ciclo de ensino do `CLAUDE.md`).
4. Rode o teste: ele "passa sem esperar" → apague o `test.fail(...)`.
5. Rode `npm run qa`: tudo verde. Commit.

## 4. Padrões dos testes

- Nome em português dizendo o **comportamento** ("senha errada não entra"), um comportamento por teste.
- Procure elementos como o usuário: `getByRole`, `getByLabel`, `getByText`. Use `#id` só quando não houver nome melhor.
- **Nunca** `waitForTimeout` para esperar algo aparecer: use `expect(...)` (ele espera sozinho). Exceção documentada: provar que algo **não** acontece (ex.: o alert de login indevido), com comentário.
- Dados **sintéticos**: usuários como `teste_xxx` e e-mails `@example.test` (domínio reservado, nunca entrega). **Nunca** dados reais, senhas reais ou chaves nos testes.
- É **proibido** apagar, enfraquecer ou pular um teste para "ficar verde". `test.skip` só com motivo escrito e referência a um bug (ex.: `BUG-007`). `test.fail` só em arquivo `known-bugs*`.

## 5. Checklist de "tudo testado" para cada botão, campo e tela

Use ao criar ou mudar qualquer elemento de interface.

- [ ] **Funciona com o mouse e só com o teclado** (Tab, Enter, Espaço, Esc fecha modais).
- [ ] **Nome acessível**: tem texto ou `aria-label` (um leitor de tela entende).
- [ ] **Estados**: normal, foco (visível), hover, desabilitado, carregando, erro, sucesso.
- [ ] **Entradas ruins**: vazio, só espaços, muito longo (10 000 caracteres), emoji/acentos, `<script>`, aspas.
- [ ] **Duplo clique** não envia duas vezes.
- [ ] **Mensagens**: texto correto, claro, sem revelar dado sensível, e some/volta ao normal quando deve.
- [ ] **Console limpo**: nenhum `console.error`, nenhuma exceção, nenhuma requisição falha.
- [ ] **Desktop (1440x900) e celular (390x844)**, e zoom 200%.
- [ ] **Contraste e tamanho de toque** adequados (axe cobre o contraste).
- [ ] **Print** do estado salvo em `artifacts/auto-qa/screenshots/` e olhado **por você**.
- [ ] Teste automatizado escrito **e visto falhar** antes de a correção funcionar.

## 6. Prints (screenshots)

- **Evidência** (`evidence.spec.js`): salva um print de cada estado em `artifacts/auto-qa/screenshots/`. Não compara nada: serve para **você ver** o que o teste viu e para o relatório.
- **Visual** (`visual.spec.js`): compara com a imagem de referência. A referência depende do sistema operacional e das fontes (o nome do arquivo termina em `-win32`, `-darwin` ou `-linux`). Por isso:
  1. Gere no **seu** computador (`npm run test:visual:update`) e **confira as imagens**.
  2. Commite as imagens de referência (`test(visual): adiciona referências`).
  3. A CI (Linux) **não** roda o visual por enquanto; entra na Fase 9 com Docker.
- Se um print mostrar dado pessoal, **não** commite nem compartilhe.

## 7. Dados e banco (a partir da Fase 1)

- Testes de banco usam um **banco separado** (`auth_system_test`), recriado do zero a cada execução, nunca o de desenvolvimento e nunca o de produção.
- Testar sempre: migrations aplicam e desfazem; constraints rejeitam dados inválidos (e-mail duplicado, token reutilizado); **nenhum teste imprime senha, token ou hash**.
- Exclusão de conta: provar que os dados saem **e** que o que sobra no `audit_log` está anonimizado. Exportação: provar que traz os dados **do usuário certo** e só dele.

## 8. Portão de qualidade (fim de cada fase)

Só se declara a fase concluída quando **tudo** abaixo for verdade:

- [ ] `npm run qa` verde, sem nenhum `test.fail` esquecido de bug já corrigido.
- [ ] Testes novos da fase escritos (comportamento normal **e** de abuso).
- [ ] Prints revisados por você; visual atualizado se a mudança foi proposital.
- [ ] Console limpo, sem requisição falha, nas telas da fase.
- [ ] Acessibilidade (axe) sem violações graves nas telas da fase.
- [ ] Skill **auto-qa** executada e o relatório lido (ver seção 9).
- [ ] `npm audit` sem vulnerabilidade alta/crítica pendente; nenhum segredo no Git.
- [ ] `docs/PROJECT_STATE.md` atualizado e PR aberto.

## 9. A skill auto-qa neste projeto

A `auto-qa` (em `.claude/skills/auto-qa/`, versionada no Git para viajar entre computadores) é um engenheiro de QA que explora o sistema como um usuário, junta evidências e escreve um relatório.

**Neste projeto ela roda no modo "relatar e propor"**, para respeitar o ciclo de aprendizado:

1. Ela **encontra e documenta** (plano de testes, prints, console, rede, relatório).
2. Para cada defeito, ela **propõe** a correção **sem aplicar**. A correção segue o ciclo do `CLAUDE.md`: mostrar e explicar, você explicar de volta, aplicar, testar, `git diff`, commit.
3. Ela **nunca** faz commit, deploy, migração, nem mexe em dados reais ou segredos (as regras de segurança dela já dizem isso).

Quando usar: ao fim de cada fase, depois de qualquer mudança grande de interface, e antes do portão de lançamento.

Pedido sugerido ao Code:

> Use a skill auto-qa neste projeto no modo "relatar e propor": não corrija nada sozinho, não faça commit. Use o servidor local (`npm run serve:front`, depois a API quando existir), dados sintéticos, desktop e celular. Gere o plano, os prints e o relatório em `artifacts/auto-qa/`. Depois proponha, defeito por defeito, a correção com explicação.

O relatório final (`artifacts/auto-qa/report.md`) vale ser copiado para `docs/qa/` e commitado quando a fase terminar (sem dados pessoais).
