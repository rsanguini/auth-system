#  Auth System

<p align="center">Um sistema full-stack de autenticação — frontend concluído, backend em desenvolvimento.</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/License-MIT-22c55e?style=flat-square" alt="Licença MIT"/>
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-f0a030?style=flat-square" alt="Status"/>
</p>

---

##  Visão geral

O **Auth System** é uma interface de autenticação desenvolvida do zero com HTML, CSS e JavaScript puro, sem frameworks ou bibliotecas externas.

O frontend está concluído e conta com validação de formulários, indicador de força da senha, notificações toast e uma animação deslizante suave entre as telas de login e cadastro.

O projeto está evoluindo para uma aplicação full-stack. A próxima etapa prevê a implementação de um backend com Node.js, persistência de dados em banco de dados, criptografia de senhas com bcrypt, autenticação baseada em JWT e integração real com provedores OAuth.

---

##  Funcionalidades

###  Implementadas — Frontend

- **Login e cadastro** — interface com dois modos e animação de transição em CSS.
- **Validação de formulários** — feedback em tempo real para cada campo, incluindo formato de e-mail, tamanho mínimo e confirmação de senha.
- **Indicador de força da senha** — classificação em quatro níveis: fraca, média, forte e muito forte, com barras coloridas.
- **Mostrar ou ocultar senha** — alternância de visibilidade com ícone SVG de olho.
- **Notificações toast** — mensagens de sucesso, erro e informação com fechamento automático.
- **Modal de recuperação de senha** — fluxo demonstrativo de recuperação, com backend ainda pendente.
- **Lembrar de mim** — persistência de sessão utilizando `sessionStorage`.
- **Interface de login social** — botões para Google, Facebook e LinkedIn, ainda sem autenticação OAuth real.
- **Redirecionamento automático** — após o cadastro bem-sucedido, o usuário é direcionado para a tela de login.
- **Suporte à tecla Enter** — permite enviar os formulários pelo teclado.

###  Em desenvolvimento — Backend

- **API com Node.js e Express** — endpoints REST para operações de autenticação.
- **Persistência em banco de dados** — SQL ou Oracle, ainda em avaliação.
- **Hash de senhas** — utilização do bcrypt com salt rounds.
- **Autenticação JWT** — gerenciamento de sessões por meio de tokens.
- **Verificação de e-mail** — confirmação da conta após o cadastro.
- **OAuth real** — integração com Google, Facebook e LinkedIn.
- **Recuperação de senha** — fluxo de redefinição por e-mail.
- **Página 404 personalizada** — página de erro com identidade visual do projeto e redirecionamento para o login.

---

##  Arquitetura do projeto

### Frontend atual

```text
src/
├── index.html    # Estrutura da página: login, cadastro e modal
├── style.css     # Estilos, animações e layout responsivo
└── script.js     # Lógica de autenticação, validação e gerenciamento de estado
```

### Estrutura planejada para a aplicação full-stack

```text
auth-system/
├── frontend/
│   ├── src/
│   │   ├── index.html
│   │   ├── style.css
│   │   └── script.js
│   └── ...
├── backend/               # Em desenvolvimento
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
│   ├── package.json
│   └── server.js
├── database/              # Em desenvolvimento
├── .gitignore
├── LICENSE
└── README.md
```

---

##  Design e identidade visual

| Elemento | Detalhes |
|---|---|
| **Paleta de cores** | Azul-marinho (`#1A233D`), branco-creme (`#F7F4EF`) e detalhes em dourado |
| **Layout** | Cartão dividido entre o formulário funcional e um painel com mensagens motivacionais |
| **Animação** | Transição deslizante feita exclusivamente com CSS, utilizando `<input type="checkbox">`, sem JavaScript |
| **Tipografia** | Playfair Display para títulos e DM Sans para o corpo do texto |
| **Ícones** | SVG incorporado diretamente ao código, sem dependências externas |

---

##  Capturas de tela

### Tela de login

<img width="1919" height="907" alt="Captura de tela da página de login" src="https://github.com/user-attachments/assets/fc5dc64b-5256-4e68-83c5-8803492c428a" />

### Tela de cadastro

<img width="1918" height="907" alt="Captura de tela da página de cadastro" src="https://github.com/user-attachments/assets/73edf9bc-f8b2-4aa5-8370-ec75de478a34" />

---

##  Tecnologias utilizadas

| Camada | Tecnologia | Status |
|---|---|---|
| **Frontend** | HTML5, CSS3 e JavaScript puro | ✅ Concluído |
| **Backend** | Node.js e Express | 🚧 Planejado |
| **Banco de dados** | PostgreSQL ou MongoDB | 🚧 Em avaliação |
| **Autenticação** | JWT e bcrypt | 🚧 Planejado |
| **OAuth** | Google, Facebook e LinkedIn | 🚧 Planejado |

---

##  Como executar o projeto

### Acesse a versão online

O projeto está hospedado na Vercel. Acesse o link abaixo para testar a interface:

🔗 **[auth-system.vercel.app](https://auth-system.vercel.app)**

> Na tela de cadastro, crie uma conta e depois utilize as mesmas credenciais na tela de login. O fluxo atual é demonstrativo e ainda não utiliza um backend com persistência de dados.

### Execute localmente

**1. Clone o repositório:**

```bash
git clone https://github.com/rsanguini/auth-system.git
```

**2. Acesse a pasta do frontend:**

```bash
cd auth-system/src
```

**3. Abra o arquivo `index.html` em qualquer navegador moderno.**

Não é necessário instalar dependências ou executar um processo de build.

> ⚠️ **Limitação atual:** os usuários cadastrados são armazenados em memória durante a execução da aplicação. Ao atualizar a página, os dados podem ser perdidos. A persistência em banco de dados será implementada na etapa de desenvolvimento do backend.

---

##  Roadmap

| Etapa | Descrição | Status |
|---|---|---|
| **1. Frontend** | Login, cadastro, validações e interface | ✅ Concluído |
| **2. API Backend** | Servidor Express, endpoints REST e middlewares | 🚧 Próxima etapa |
| **3. Banco de dados** | Modelagem, estrutura dos usuários e migrações | 📋 Planejado |
| **4. Segurança** | Hash com bcrypt, tokens JWT e limitação de requisições | 📋 Planejado |
| **5. OAuth** | Autenticação com Google, Facebook e LinkedIn | 📋 Planejado |
| **6. E-mails** | Verificação de conta e recuperação de senha | 📋 Planejado |
| **7. Refinamento** | Animações, responsividade mobile, modo escuro e página 404 personalizada | 📋 Planejado |

---

##  Conceitos aplicados

- **Manipulação do DOM** — seleção de elementos, alternância de classes e atualização dinâmica de conteúdo.
- **Programação orientada a eventos** — utilização de `addEventListener` e eventos de teclado e clique.
- **Validação de formulários** — expressões regulares, verificações de tamanho, comparação de campos e feedback em tempo real.
- **Gerenciamento de estado** — utilização de objetos em memória para simular um banco de dados.
- **Armazenamento de sessão** — uso de `sessionStorage` para implementar a funcionalidade "Lembrar de mim".
- **Animações CSS** — transições realizadas com `transform` e `transition`.
- **Funções modulares** — separação de responsabilidades entre validação, interface e lógica de autenticação.

---

##  Autor

**Rafael Sanguini Colagrossi** <br>
--  Desenvolvedor de software apaixonado por Código, Inteligência Artificial, Tecnologia Financeira e Desenvolvimento Full-Stack.

Criando softwares modernos com foco em desempenho, arquitetura limpa e excelente experiência do usuário. --
<p>
  <a href="https://linkedin.com/in/rafaelsanguini">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn"/>
  </a>
  <a href="https://github.com/rsanguini">
    <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub"/>
  </a>
  <a href="https://rafaelsanguini.vercel.app">
    <img src="https://img.shields.io/badge/Portfólio-000000?style=flat-square&logo=vercel&logoColor=white" alt="Portfólio"/>
  </a>
  <a href="mailto:rafaelcolagrossi@gmail.com">
    <img src="https://img.shields.io/badge/E--mail-D14836?style=flat-square&logo=gmail&logoColor=white" alt="E-mail"/>
  </a>
</p>

---

<div align="center">⭐ Se este projeto foi útil para você, considere deixar uma estrela no repositório!</div>
