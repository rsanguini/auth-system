// ===== BANCO DE DADOS EM MEMÓRIA =====
  const db = {};

  const CREDENCIAIS_INVALIDAS = 'Usuário ou senha incorretos';
  const RECUPERACAO_INDISPONIVEL =
    'A recuperação de senha por e-mail ainda não está disponível. Quando estiver, você receberá as instruções no e-mail cadastrado.';

  // ===== TOAST =====
  let toastTimer;
  function toast(msg, tipo = 'info') {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.className = 'show ' + tipo;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.className = '', 3000);
  }

  // ===== TOGGLE SENHA =====
  // Ícones decorativos: o nome do botão vem do aria-label, então o SVG fica fora da árvore de acessibilidade.
  const ICONE_OLHO = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  const ICONE_OLHO_RISCADO = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

  function toggleSenha(id, btn) {
    const input = document.getElementById(id);
    const estavaVisivel = input.type === 'text';
    input.type = estavaVisivel ? 'password' : 'text';
    // O rótulo fica fixo ("Mostrar senha"); quem comunica o estado é o aria-pressed.
    btn.setAttribute('aria-pressed', String(!estavaVisivel));
    btn.innerHTML = estavaVisivel ? ICONE_OLHO : ICONE_OLHO_RISCADO;
  }

  // ===== VALIDAÇÕES =====
  function setErro(id, erroId, show, texto) {
    const input = document.getElementById(id);
    const msg = document.getElementById(erroId);
    // Guarda o texto do HTML uma única vez, antes de qualquer troca, para poder restaurá-lo.
    msg.dataset.padrao ??= msg.textContent;
    msg.textContent = texto ?? msg.dataset.padrao;
    if (show) {
      input.classList.add('erro'); input.classList.remove('ok');
      msg.classList.add('visivel');
    } else {
      input.classList.remove('erro'); input.classList.add('ok');
      msg.classList.remove('visivel');
    }
    return !show;
  }

  function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ===== FORÇA DA SENHA =====
  function verificarForca(senha) {
    let pts = 0;
    if (senha.length >= 6) pts++;
    if (senha.length >= 10) pts++;
    if (/[A-Z]/.test(senha) && /[a-z]/.test(senha)) pts++;
    if (/[0-9]/.test(senha) && /[^A-Za-z0-9]/.test(senha)) pts++;

    const bars = ['fb1','fb2','fb3','fb4'];
    const cores = ['#e05252','#f0a030','#52c07a','#2ecc71'];
    const labels = ['','Fraca','Média','Forte','Muito forte'];

    bars.forEach((b, i) => {
      document.getElementById(b).style.background = i < pts ? cores[pts-1] : 'var(--border)';
    });
    document.getElementById('forcaLabel').textContent = labels[pts] || '';
    document.getElementById('forcaLabel').style.color = pts > 0 ? cores[pts-1] : '#aaa';
  }

  // ===== CADASTRO =====
  function fazerCadastro() {
    const usuario = document.getElementById('cadastroUsuario').value.trim();
    const email = document.getElementById('cadastroEmail').value.trim();
    const senha = document.getElementById('cadastroSenha').value;
    const confirmar = document.getElementById('cadastroConfirmar').value;

    let ok = true;
    ok = setErro('cadastroUsuario', 'erroCadastroUsuario', usuario.length < 3) && ok;
    ok = setErro('cadastroEmail', 'erroCadastroEmail', !validarEmail(email)) && ok;
    ok = setErro('cadastroSenha', 'erroCadastroSenha', senha.length < 6) && ok;
    ok = setErro('cadastroConfirmar', 'erroConfirmar', senha !== confirmar) && ok;

    if (!ok) { toast('Corrija os campos destacados', 'erro'); return; }

    if (db[usuario]) { toast('Usuário já cadastrado!', 'erro'); return; }

    db[usuario] = { email, senha };
    toast('Conta criada com sucesso! Faça login.', 'sucesso');

    // Limpar campos
    ['cadastroUsuario','cadastroEmail','cadastroSenha','cadastroConfirmar'].forEach(id => {
      const el = document.getElementById(id);
      el.value = ''; el.className = '';
    });
    verificarForca('');

    // Ir para login após 1s
    setTimeout(() => { document.getElementById('toggle').checked = false; }, 1200);
  }

  // ===== LOGIN =====
  function fazerLogin() {
    const usuario = document.getElementById('loginUsuario').value.trim();
    const senha = document.getElementById('loginSenha').value;
    const lembrar = document.getElementById('remember').checked;

    let ok = true;
    ok = setErro('loginUsuario', 'erroLoginUsuario', !usuario) && ok;
    ok = setErro('loginSenha', 'erroLoginSenha', !senha) && ok;

    if (!ok) { toast('Preencha todos os campos', 'erro'); return; }

    // Mesma resposta, no mesmo campo, para "usuário não existe" e "senha errada":
    // diferenças permitiriam descobrir quais contas existem (enumeração).
    const conta = db[usuario];
    if (!conta || conta.senha !== senha) {
      setErro('loginSenha', 'erroLoginSenha', true, CREDENCIAIS_INVALIDAS);
      toast(CREDENCIAIS_INVALIDAS, 'erro'); return;
    }

    if (lembrar) sessionStorage.setItem('usuario', usuario);
    toast(`Bem-vindo de volta, ${usuario}! 🎉`, 'sucesso');

    setTimeout(() => {
      // window.location.href = 'home.html';
      alert(`Login realizado como "${usuario}"!\n(Redirecione para home.html aqui)`);
    }, 1500);
  }

  // ===== MODAL ESQUECI SENHA =====
  function abrirModalSenha(e) {
    e.preventDefault();
    document.getElementById('modalSenha').classList.add('aberto');
    document.getElementById('recuperarUsuario').focus();
  }

  function fecharModalSenha() {
    document.getElementById('modalSenha').classList.remove('aberto');
    document.getElementById('recuperarUsuario').value = '';
  }

  function recuperarSenha() {
    const usuario = document.getElementById('recuperarUsuario').value.trim();
    if (!usuario) { toast('Informe o nome de usuário', 'erro'); return; }
    // Não consulta o db: a resposta é igual para qualquer nome, sem vazar quem tem conta.
    fecharModalSenha();
    toast(RECUPERACAO_INDISPONIVEL, 'info');
  }

  // Fechar modal ao clicar fora
  document.getElementById('modalSenha').addEventListener('click', function(e) {
    if (e.target === this) fecharModalSenha();
  });

  // O navegador dispara "submit" tanto no clique no botão quanto no Enter.
  // preventDefault() impede o envio padrão (GET para a própria URL, recarregando a página).
  function ligarSubmit(id, handler) {
    document.getElementById(id).addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }

  ligarSubmit('formLogin', fazerLogin);
  ligarSubmit('formCadastro', fazerCadastro);
  ligarSubmit('formRecuperar', recuperarSenha);
