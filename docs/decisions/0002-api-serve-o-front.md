# 0002 — A API Express serve o front (mesma origem)

**Status:** proposta

## Contexto

O front é HTML, CSS e JS puros, sem build. O cookie de sessão precisa ser `__Host-` e `SameSite=Strict`.

## Decisão

O Express serve `frontend/` como arquivos estáticos e expõe a API em `/api/*`, tudo na **mesma origem**.

## Alternativas

- Front em outro domínio/serviço: exige CORS e cookies entre sites (mais superfície de ataque e mais configuração).
- Framework de front com build (React, Next): maior custo de aprendizado agora, sem ganho para este escopo.

## Consequências

- Sem CORS; CSP mais simples e rígida.
- Um único deploy. Se um dia o front for separado, esta decisão será substituída.
