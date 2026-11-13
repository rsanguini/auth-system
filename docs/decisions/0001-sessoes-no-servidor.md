# 0001 — Sessões no servidor em vez de JWT

**Status:** proposta (a confirmar com o Rafael na Fase 4)

## Contexto

O sistema precisa de login com "lembrar-me", logout que realmente encerra a sessão, lista de dispositivos e revogação de todas as sessões ao trocar ou redefinir a senha.

## Decisão

Sessão **opaca** no servidor: um token aleatório de 32 bytes vai num cookie `__Host-` com `HttpOnly`, `Secure` e `SameSite=Strict`. No banco guardamos só o **hash** do token, com validade e metadados (dispositivo, último uso).

## Alternativas

- **JWT** em cookie ou `localStorage`: sem estado, mas difícil de revogar, e no `localStorage` fica exposto a XSS. Faz sentido com várias APIs independentes, o que não é nosso caso.
- Sessão em memória do servidor: some a cada reinício e não escala para mais de uma instância.

## Consequências

- Revogar é apagar linhas (logout, "sair de todos os dispositivos", troca de senha).
- Cada requisição autenticada consulta o banco (aceitável nesta escala; cache depois, se medir necessidade).
- Exige proteção contra CSRF (SameSite=Strict + token em ações que alteram estado).
