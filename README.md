<h1 align="center"> Auth System</h1>
<p align="center">A full-stack authentication system — frontend complete, backend in development.</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/License-MIT-22c55e?style=flat-square" alt="MIT License"/>
  <img src="https://img.shields.io/badge/Status-In%20Development-f0a030?style=flat-square" alt="Status"/>
</p>

---

## 📖 Overview

**Auth System** is an authentication interface built from scratch with vanilla HTML, CSS, and JavaScript — no frameworks, no libraries. The frontend layer is complete with form validation, password strength meter, toast notifications, and a smooth slide animation between login and signup panels.

The project is actively evolving into a full-stack application. The next phase introduces a Node.js backend with database persistence, password hashing (bcrypt), JWT-based sessions, and real OAuth integration.

---

## ✨ Features

### ✅ Current (Frontend)

- **Login & Signup** — dual-mode interface with CSS slide animation
- **Form validation** — real-time feedback on every field (email format, min length, password match)
- **Password strength meter** — 4-level indicator (Weak → Medium → Strong → Very Strong) with color-coded bars
- **Show/hide password** — toggle with SVG eye icon
- **Toast notifications** — success, error, and info messages with auto-dismiss
- **Forgot password modal** — recovery flow (mock — backend pending)
- **Remember me** — session persistence via `sessionStorage`
- **Social login UI** — Google, Facebook, LinkedIn buttons (visual only — OAuth pending)
- **Auto-redirect** — signup flow redirects to login after success
- **Enter key support** — submit forms with keyboard

### 🚧 In Development (Backend)

- **Node.js + Express API** — REST endpoints for auth operations
- **Database persistence** — PostgreSQL or MongoDB (evaluation phase)
- **Password hashing** — bcrypt with salt rounds
- **JWT authentication** — token-based session management
- **Email verification** — account confirmation on signup
- **Real OAuth** — Google, Facebook, LinkedIn integration
- **Password recovery** — email-based reset flow

---

## 🏗️ Architecture

### Frontend (Current)
```text
src/
├── index.html    # Page structure (login + signup + modal)
├── style.css     # Styling, animations, responsive layout
└── script.js     # Auth logic, validation, state management
```

### Full-Stack Target
```text
auth-system/
├── frontend/
│   ├── src/
│   │   ├── index.html
│   │   ├── style.css
│   │   └── script.js
│   └── ...
├── backend/               → (in development)
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
│   ├── package.json
│   └── server.js
├── database/              → (in development)
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🎨 Design

| Element | Detail |
|---------|--------|
| **Color palette** | Navy blue (`#1A233D`) + cream off-white (`#F7F4EF`) + gold accents |
| **Layout** | Split-card design — functional form panel + motivational text panel |
| **Animation** | CSS-only slide transition via `<input type="checkbox">` (no JS) |
| **Typography** | Playfair Display (headings) + DM Sans (body) |
| **Icons** | SVG inline — zero external dependencies |

---

## 📸 Screenshots

### Login
<img width="1919" height="907" alt="Login - captura de tela (projeto)" src="https://github.com/user-attachments/assets/fc5dc64b-5256-4e68-83c5-8803492c428a" />


### Signup
<img width="1918" height="907" alt="Cadastro - captura de tela (projeto)" src="https://github.com/user-attachments/assets/73edf9bc-f8b2-4aa5-8370-ec75de478a34" />
