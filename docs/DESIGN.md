# Auth System — Documento de Design

> Versão 1 · 13/11/2026 · Autor da decisão: Rafael Sanguini Colagrossi
> Este documento é a fonte da verdade do **o quê** e do **porquê**. O estado atual (em que fase estamos) fica em `docs/PROJECT_STATE.md`.
> Não é parecer jurídico. A parte legal é um mapa de estudo; revise com um profissional antes do lançamento público, se possível.

---

## 1. Intenção e porquê

Transformar o Auth System (hoje só uma interface de login/cadastro, sem backend) em um **sistema de autenticação completo, seguro e profissional**, que pessoas de verdade possam usar para criar conta, entrar, recuperar a senha e gerenciar seus dados.

Dois propósitos, com o mesmo peso:

1. **Portfólio impressionante**: código limpo, histórico de commits profissional, segurança bem feita, documentação e testes.
2. **Aprendizado**: Rafael precisa **entender cada parte** (como e por quê), porque vai evoluir o projeto e explicá-lo em entrevistas.

## 2. Objetivos

- Cadastro completo, com verificação de e-mail.
- Login com sessão segura, logout e "lembrar-me" de verdade.
- "Esqueci minha senha" com token enviado por e-mail.
- Banco de dados relacional com migrations.
- Área logada com **Segurança e Privacidade**: sessões ativas, histórico de acessos, trocar senha, baixar meus dados, excluir minha conta.
- Segurança em camadas (aplicação, banco, operação) conforme OWASP ASVS nível 2 como régua.
- Conformidade razoável com LGPD e com a legislação brasileira aplicável (ver seção 8).
- Visual moderno, responsivo, acessível, com a identidade atual (azul-marinho, creme, dourado).

## 3. Não-objetivos (por enquanto)

- Login social (Google, Facebook, LinkedIn): só depois do lançamento, e talvez só o Google.
- Aplicativo móvel, painel administrativo, múltiplos papéis/permissões.
- Framework de front (React etc.) e TypeScript: possíveis evoluções futuras.

## 4. Anti-objetivos (seria fracasso mesmo "funcionando")

- Código que o Rafael não consegue explicar.
- Abrir o cadastro ao público **antes do portão de lançamento** (seção 10).
- Guardar ou mostrar senha em texto puro, ou segredos no repositório.
- Botões ou telas "de mentira" (ex.: login social sem funcionar) visíveis a usuários reais.
- Coletar dado pessoal além do necessário.

## 5. Restrições

- Linguagens que o Rafael domina: HTML, CSS, JavaScript, SQL (e Oracle, C, Assembly). **Backend em JavaScript (Node.js)**.
- O Rafael **faz os commits manualmente** no GitHub. O Claude Code nunca faz commit nem push.
- Orçamento baixo: preferir camadas gratuitas; um domínio próprio é o único gasto esperado.
- O Code roda no VS Code; este chat serve de direção e dúvidas conceituais.

## 6. Abordagens consideradas e decisões

### 6.1 Como o Rafael aprende com o Code

| Opção                                  | Resultado                                    |
| -------------------------------------- | -------------------------------------------- |
| A. Rafael escreve tudo, Code só revisa | Descartada: lenta e arriscada em segurança   |
| **B. Híbrido**                         | **Escolhida** (decisão do Rafael)            |
| C. Code implementa tudo                | Descartada: contradiz o objetivo de aprender |

Regra da opção B (refinada em 13/11/2026 por proposta do Rafael): o **ciclo de cada passo** é: (1) o Code mostra o código e explica o quê, como e por quê, **sem gravar nada**; (2) o Rafael diz com as próprias palavras o que ele faz, e o Code confere com perguntas específicas; (3) o Code grava nos arquivos; (4) o Rafael roda e testa; (5) o Rafael lê o `git diff` e commita. No código de segurança central, há ainda um mini-exercício (alterar algo e prever o resultado). O que o Rafael já sabe (HTML, CSS, JS de front, SQL) ele pode digitar ele mesmo.

### 6.2 Ordem de construção

**Fatias verticais** (decisão do Rafael): cada fase entrega algo que funciona de ponta a ponta (front, API, banco, teste). Camada por camada foi descartada porque passa semanas sem nada funcionando.

### 6.3 Onde front e API ficam

**A API Express serve o front estático** (decisão do Rafael): um deploy, mesma origem, sem CORS, cookies `SameSite=Strict` e CSRF mais simples.
Descartadas: front na Vercel + API em outro host (dois "sites", cookies difíceis) e tudo serverless (hash/conexões menos naturais para aprender).

### 6.4 Sessão: JWT ou sessão no servidor _(escolha do Claude, a confirmar)_

Inicialmente se falou em JWT + refresh token. **Mudança de recomendação:** usar **sessões opacas no servidor** (token aleatório em cookie `httpOnly`, hash guardado no banco).
Por quê: em um app de mesma origem, é mais simples, revogável na hora (sair de todos os dispositivos, trocar senha) e evita armadilhas de JWT. JWT pode virar um tópico opcional pós-lançamento (ex.: para uma API pública).

### 6.5 TypeScript _(escolha do Claude, a confirmar)_

**JavaScript (ESM) agora.** O Rafael já aprende backend, banco, segurança e e-mail ao mesmo tempo; somar TypeScript sobrecarrega. Migrar para TypeScript fica como fase opcional depois do lançamento.

## 7. Arquitetura

### 7.1 Stack (o que é decisão de quem)

| Camada          | Escolha                                                             | Origem                                                            |
| --------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Front           | HTML/CSS/JS puro, multipágina, módulos ES                           | Decisão do Rafael                                                 |
| Backend         | Node.js + Express                                                   | Escolha do Claude                                                 |
| Banco           | PostgreSQL (Docker local, Neon ou equivalente em produção)          | Escolha do Claude. Oracle é alternativa viável; Rafael pode vetar |
| Acesso ao banco | Biblioteca `pg` com SQL parametrizado, isolado em `backend/src/db/` | Escolha do Claude (Rafael sabe SQL; ORM fica como opção)          |
| Senhas          | Argon2id                                                            | Escolha do Claude                                                 |
| Validação       | Zod (servidor)                                                      | Escolha do Claude                                                 |
| E-mail          | Mailpit (dev) + Resend ou Brevo (prod)                              | Escolha do Claude                                                 |
| Testes          | Vitest + Supertest                                                  | Escolha do Claude                                                 |
| CI              | GitHub Actions                                                      | Escolha do Claude                                                 |
| Deploy          | Render, Railway ou Fly.io (decidir na Fase 9)                       | A decidir                                                         |

### 7.2 Estrutura do repositório (alvo)

```
auth-system/
├── CLAUDE.md                 # regras para o Claude Code (carregado automaticamente)
├── README.md
├── docker-compose.yml        # Postgres + Mailpit locais
├── .env.example              # variáveis necessárias, SEM valores secretos
├── .github/workflows/ci.yml
├── docs/
│   ├── DESIGN.md             # este arquivo
│   ├── PROJECT_STATE.md      # estado vivo: fase atual, próximo passo
│   ├── SETUP.md              # como montar o ambiente em um computador novo
│   ├── THREAT_MODEL.md  SECURITY.md  PRIVACY.md  INCIDENT_RESPONSE.md
│   ├── decisions/            # ADRs: uma decisão por arquivo
│   └── fases/                # cartões de cada passo (gerados após aprovação)
├── frontend/                 # páginas, css/, js/ (módulos)
└── backend/
    ├── src/{config,routes,controllers,services,db,middleware,utils}/
    ├── migrations/
    └── tests/
```

### 7.3 Modelo de dados (rascunho; detalhar na Fase 1/2)

- `users`: id (uuid), name, email (único, normalizado em minúsculas), password_hash, email_verified_at, terms_version, terms_accepted_at, created_at, updated_at.
- `sessions`: id, user_id, token_hash, created_at, last_seen_at, expires_at (absoluto), remember (bool), revoked_at, ip, user_agent.
- `auth_tokens`: id, user_id, type (`verify_email` | `reset_password`), token_hash, expires_at, used_at, created_at.
- `audit_log` (somente inserção): id, user_id (anulável), event, ip, user_agent, metadata (jsonb), created_at. **Nunca** grava senha ou token.

### 7.4 Endpoints (alvo)

`GET /api/health` · `POST /api/auth/register` · `/verify-email` · `/resend-verification` · `/login` · `/logout` · `/logout-all` · `/forgot-password` · `/reset-password` · `GET/PATCH /api/me` · `POST /api/me/change-password` · `GET /api/me/sessions` · `DELETE /api/me/sessions/:id` · `GET /api/me/activity` · `GET /api/me/export` · `DELETE /api/me`.

## 8. Segurança e privacidade (requisitos)

### 8.1 Aplicação

- **Hash:** Argon2id, partindo do mínimo da OWASP (19 MiB, 2 iterações, paralelismo 1) e **ajustando medindo** no servidor de produção.
- **Política de senha (NIST SP 800-63B-4):** sem regras de composição, sem troca periódica, aceitar passphrases longas (até 128), **rejeitar senhas vazadas/comuns** (Have I Been Pwned por k-anonymity). Como a senha é o único fator até o 2FA existir, **mínimo de 15 caracteres** _(escolha do Claude; revisitar com 2FA)_.
- **Respostas genéricas** no login e no "esqueci minha senha" (não revelar se o e-mail existe); tempo de resposta equalizado.
- **Tokens** (verificação, reset, sessão): 32 bytes aleatórios, **só o hash no banco**, uso único e expiração (verificação 24 h, reset 30 min _— a confirmar_).
- **Cookie de sessão:** `httpOnly`, `Secure`, `SameSite=Strict`, prefixo `__Host-`. Proteção CSRF adicional em requisições que alteram estado.
- **Rate limiting** por IP e por conta, com atraso progressivo; **Helmet**, CSP restritiva, HSTS; validação de toda entrada com Zod; **SQL sempre parametrizado**.
- **Login exige e-mail verificado.** Trocar/redefinir senha **revoga todas as sessões**.
- Segredos só em variáveis de ambiente; `gitleaks` e Dependabot no repositório.

### 8.2 Banco

- Dois usuários: um de **migrations** (DDL) e um da **API** (mínimo de permissões, sem superusuário).
- TLS na conexão, criptografia em repouso (provedor), backups criptografados com **restauração testada**.
- Retenção: job apaga tokens expirados e sessões antigas; logs de acesso guardados por **6 meses** e depois anonimizados/apagados.
- Minimização: só nome, e-mail e senha.

### 8.3 Legal e políticas (Brasil) — mapa de estudo

| Tema                                                     | Requisito                                                                                                                                                                                                      | Onde vira funcionalidade             |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| LGPD                                                     | Política de Privacidade e Termos de Uso, base legal definida, canal do titular e contato do encarregado                                                                                                        | Fase 8                               |
| Direitos do titular                                      | Acesso, correção, exclusão, portabilidade                                                                                                                                                                      | Fase 7 (baixar dados, excluir conta) |
| Consentimento                                            | Aceite explícito, caixa **desmarcada** por padrão, registro da versão e da data                                                                                                                                | Fase 2 e 8                           |
| Incidentes                                               | Comunicar ANPD e titulares em **3 dias úteis** (Res. CD/ANPD 15/2024; dobro para agentes de pequeno porte); comunicação preliminar complementável em 20 dias úteis; guardar o registro do incidente por 5 anos | `docs/INCIDENT_RESPONSE.md` (Fase 8) |
| Marco Civil, art. 15                                     | Registros de acesso por 6 meses, sob sigilo (obrigação é de pessoa jurídica que exerce atividade econômica; adotamos como política)                                                                            | Retenção de logs                     |
| ECA Digital (Lei 15.211/2025, em vigor desde 17/03/2026) | Autodeclaração de idade deixou de ser mecanismo suficiente; verificar enquadramento. Decisão provisória: Termos declaram **18+**                                                                               | **Item em aberto** (seção 12)        |
| Cookies                                                  | Só cookie estritamente necessário (sessão); documentar na Política de Privacidade                                                                                                                              | Fase 8                               |

Fontes de estudo: OWASP Password Storage Cheat Sheet; OWASP ASVS; NIST SP 800-63B-4 (pages.nist.gov/800-63-4/sp800-63b); Resolução CD/ANPD 15/2024 (in.gov.br); Lei 13.709/2018 (LGPD); Lei 12.965/2014 (Marco Civil); Lei 15.211/2025.

## 9. Fases (fatias verticais)

Cada fase: uma branch (`feat/fase-NN-...`), vários commits pequenos, um Pull Request para a `main`, critério de pronto verificado.

| Fase                                  | Entrega (funciona de ponta a ponta)                                                                                                                                                                                                                                                   | Critério de pronto                                                        |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **0. Fundação**                       | Reorganizar em `frontend/` e `backend/`; fontes carregadas; CSS limpo; remover o que é inseguro/falso (senha exibida, login social de mentira); README honesto; ESLint/Prettier; `SETUP.md`; **modelo de ameaças**; `.gitignore` corrigido (versionar o lockfile); proteção da `main` | Repo organizado, lint passa, documentos base existem                      |
| **1. Servidor e banco**               | Express com `/api/health`, Postgres no Docker, migrations, validação de variáveis de ambiente, logs                                                                                                                                                                                   | `GET /api/health` responde e consulta o banco                             |
| **2. Cadastro**                       | `<form>` real, Zod, Argon2id, checagem de senha vazada, tabela `users`, aceite dos termos                                                                                                                                                                                             | Conta criada; senha nunca em texto puro; testes do fluxo                  |
| **3. E-mail e verificação**           | Mailpit, envio, token de verificação, reenvio                                                                                                                                                                                                                                         | Conta só fica verificada pelo link; token de uso único                    |
| **4. Login e sessão**                 | Login, cookie de sessão, `/me`, logout, "lembrar-me" real, página logada básica                                                                                                                                                                                                       | Rota protegida bloqueia sem sessão; logout invalida no servidor           |
| **5. Recuperação de senha**           | Esqueci/redefinir com token por e-mail                                                                                                                                                                                                                                                | Resposta genérica; reset revoga sessões; token usado não funciona de novo |
| **6. Endurecimento**                  | Rate limiting, bloqueio progressivo, CSP/Helmet, CSRF, `audit_log`, varredura de dependências                                                                                                                                                                                         | Testes de abuso passam; cabeçalhos verificados                            |
| **7. Área logada completa**           | Painel Segurança e Privacidade: sessões, atividade, trocar senha, baixar dados, excluir conta, perfil                                                                                                                                                                                 | Todos os itens funcionam e geram auditoria                                |
| **8. Conformidade**                   | Termos e Política de Privacidade, registro de consentimento, plano de incidente, retenção automática, contato do encarregado                                                                                                                                                          | Páginas publicadas, jobs de retenção testados                             |
| **9. Qualidade e lançamento**         | Cobertura de testes, GitHub Actions, imagem Docker, deploy, domínio, SPF/DKIM, backups, monitoramento                                                                                                                                                                                 | **Portão de lançamento** (seção 10) cumprido                              |
| **10. Diferenciais (pós-lançamento)** | 2FA TOTP, login com Google, modo escuro, i18n, passkeys, migração opcional para TypeScript                                                                                                                                                                                            | Um item por vez                                                           |

Tempo: cada fase equivale a uma ou duas sessões de trabalho. O Rafael define o ritmo.

## 10. Portão de lançamento

O cadastro **só abre ao público** quando **todos** estes itens estiverem verdadeiros: Argon2id e política de senha; verificação de e-mail; reset de senha; rate limiting; cookies e cabeçalhos seguros; auditoria; páginas legais publicadas; exclusão de conta e exportação de dados; plano de incidente escrito; backups com restauração testada; e-mail enviado por domínio próprio com SPF e DKIM; segredos fora do Git; testes de segurança passando.
Antes disso: ambiente local ou preview **com cadastro fechado**.

## 11. Método de ensino (resumo; detalhes no `CLAUDE.md`)

Cada passo é um **cartão** em `docs/fases/`: objetivo, por que existe, o código a ser mostrado e explicado, perguntas de conferência, como testar, armadilhas, mensagem de commit sugerida e critério de pronto. Commits no padrão Conventional Commits, feitos pelo Rafael. O Code encerra cada sessão atualizando `docs/PROJECT_STATE.md`.

## 12. Itens em aberto

1. **Domínio próprio:** qual nome e onde registrar (necessário para e-mail de verdade).
2. **Banco:** PostgreSQL assumido (o Rafael só usou SQL Developer/Oracle; o Code ensina Docker, Postgres e cliente gráfico desde o básico, local primeiro, nuvem só no deploy). Pode vetar.
3. **Sessão no servidor e JavaScript (em vez de JWT e TypeScript):** confirmar.
4. **Hospedagem:** escolher na Fase 9 (Render, Railway ou Fly.io).
5. **ECA Digital:** verificar se o serviço entra no escopo e qual a consequência para cadastro de menores.
6. **Prazos de token:** 24 h (verificação) e 30 min (reset) são propostas.
7. **Exclusão de conta:** apagar na hora (com confirmação por senha) e anonimizar o que restar no `audit_log`. Detalhar na Fase 7.

## 13. O que fica para quem constrói

Detalhes de nomes de variáveis, bibliotecas exatas e versões, textos das mensagens e estilo visual das novas telas são escolhas de cada fase, sempre explicadas ao Rafael antes de implementar.

## 14. Qualidade e testes (resumo; detalhes em `docs/QA.md`)

- Pirâmide: lint/format → unitários (Vitest) → integração da API e do banco (Supertest + Postgres de teste) → **E2E no navegador (Playwright, desktop e celular)** → acessibilidade (axe) → visual (prints comparados) → segurança e dados.
- Bugs conhecidos viram testes `test.fail` (TDD): o teste documenta o defeito e protege depois da correção.
- A skill **auto-qa** roda ao fim de cada fase em modo "relatar e propor" (não corrige sozinha, não comita). Outras skills: `docs/SKILLS.md`.
- Portão de qualidade por fase: `docs/QA.md`, seção 8. O portão de lançamento (seção 10) inclui o relatório da auto-qa limpo.
