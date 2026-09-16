# GRFE - Handoff para outra IA

## Contexto do projeto

- Aplicacao: Angular 19 standalone components.
- Frontend: `http://localhost:4200`.
- Backend Spring Boot: `http://localhost:8080`.
- O backend possui CORS configurado; os services usam URL direta, sem depender de proxy.
- O contrato principal do backend esta documentado em `DTO.txt`.
- Nao adicionar dados mockados. Listas e registros devem vir da API.

## Rotas atuais

- `/login`: login.
- `/navbar/dashboard`: dashboard geral.
- `/navbar/users`: lista e CRUD de usuarios/funcionarios.
- `/navbar/admin`: gerenciador administrativo.
- `/navbar/chamados`: lista de chamados.
- `/navbar/chamados/novo`: criacao de chamado.
- `/navbar/chamados/:id`: edicao de chamado.
- `/navbar/relatorios`: relatorios.

Arquivo de rotas: `src/app/app.routes.ts`.

## Estrutura de pastas

A navbar propria ficou em:

- `src/app/components/layout/navbar/`

As features foram movidas para a raiz de `layout`:

- `layout/admin`
- `layout/chamado`
- `layout/chamados`
- `layout/dash-geral`
- `layout/login`
- `layout/relatorios`

## Telas administrativas

### User list

Arquivos:

- `src/app/components/layout/admin/user-list/user-list.component.ts`
- `src/app/components/layout/admin/user-list/user-list.component.html`
- `src/app/components/layout/admin/user-list/user-list.component.scss`

Responsabilidade:

- Lista funcionarios usando a API.
- Cria, edita e exclui funcionarios.
- Carrega especialidades da API.
- Nao possui registros iniciais mockados.
- Usa SweetAlert para validacao, sucesso, erro e confirmacao de exclusao.

Service usado: `src/app/services/usuario-service.service.ts`.

### Gerenciador administrativo

Arquivos:

- `src/app/components/layout/admin/gerenciador-admin/gerenciador-admin.component.ts`
- `src/app/components/layout/admin/gerenciador-admin/gerenciador-admin.component.html`
- `src/app/components/layout/admin/gerenciador-admin/gerenciador-admin.component.scss`

Objetivo:

- CRUD de setores.
- CRUD de divisões.
- CRUD de especialidades.
- CRUD de escalas.
- Carregamento de especialidades e funcionarios para preencher escalas.
- Dropdowns pesquisáveis reutilizáveis para divisões, setores, especialidades e funcionários.
- SweetAlert para campos obrigatorios, sucesso, erro e confirmacao de exclusao.

A antiga pasta/componente `admin-manager` foi substituida por `gerenciador-admin`.

## Regra de perfil e matrícula

O perfil representa somente nivel de acesso:

```ts
export type PerfilUsuario = 'Administrador' | 'Usuário';
```

`Plantonista` nao deve ser tratado como perfil. Plantonista e uma funcao/relacao operacional ligada ao funcionario, especialidade e escala.

Modelo: `src/app/models/usuario.ts`.

A matrícula não é digitada pelo usuário. Na criação de um funcionário, `UsuarioServiceService` consulta `GET /funcionarios`, encontra a maior matrícula numérica e envia a próxima (`maior + 1`) no `POST /funcionarios`. Na edição, a matrícula existente é preservada.

## EscolhaDropdown

O componente reutilizável está em:

- `src/app/components/shared/escolha-dropdown/escolha-dropdown.component.ts`
- `src/app/components/shared/escolha-dropdown/escolha-dropdown.component.html`
- `src/app/components/shared/escolha-dropdown/escolha-dropdown.component.scss`

Comportamento:

- campo de texto com pesquisa incremental;
- lista filtrada aparece abaixo do campo;
- seleção emite o ID real pelo evento `selectedIdChange`;
- clique fora fecha a lista;
- mensagem de nenhum resultado;
- usado no gerenciador admin para divisão, setor, especialidade e funcionário;
- usado no cadastro de usuários para especialidade.

O nome de conversa para esse padrão é `EscolhaDropdown`. Não substituir por IDs digitados manualmente.

## Escala

O model compartilhado esta em `src/app/models/escala.ts`:

- `id`
- `dataHoraInicio`
- `dataHoraFim`
- `especialidadeId`
- `especialidadeNome`
- `funcionarioId`
- `funcionarioNome`

O request usa os campos:

- `dataHoraInicio`
- `dataHoraFim`
- `especialidadeId`
- `funcionarioId`

Isso segue `EscalaRequest` e `EscalaResponse` em `DTO.txt`.

## Remocao de equipes

A solicitacao atual e remover equipes completamente. Ja foram removidos:

- Service de equipes no `AdminService`.
- Aba/lista/logica de equipes do gerenciador administrativo.
- Campo `equipe` do modelo de usuario.
- Campo `equipe` dos relatorios.
- Coluna de equipe da tela de relatorios.
- Campo de equipe da exportacao CSV.
- Arquivo legado `src/app/models/equipe.ts`.

Nao reintroduzir `equipe`, `equipes` ou `Equipes`.

## Services principais

### `src/app/services/chamado-service.service.ts`

- API direta: `http://localhost:8080/chamados`.
- Converte response do backend para modelo visual.
- POST/PUT enviam IDs numericos:
  - `especialidadeId`
  - `plantonistaId`
  - `usuarioResponsavelId`
- Chamados possuem alerts SweetAlert na tela de detalhe.

### `src/app/services/usuario-service.service.ts`

Endpoints usados:

- `GET /funcionarios`
- `GET /funcionarios/:id`
- `POST /funcionarios`
- `PUT /funcionarios/:id`
- `DELETE /funcionarios/:id`
- `GET /especialidades`

DTOs usados conforme `DTO.txt`:

- `FuncionarioRequest`
- `FuncionarioResponse`
- `EspecialidadeResponse`

### `src/app/services/admin-service.service.ts`

Deve conter endpoints para:

- divisões
- departamentos/setores
- especialidades
- escalas
- funcionarios

Não existem endpoints ou CRUD de perfis no gerenciador. `perfil` no modelo de usuário é apenas o nível de acesso `Administrador | Usuário`.

## Backend DTO importante

Em `DTO.txt` existem contratos para:

- `DepartamentoRequest` / `DepartamentoResponse`
- `DivisaoRequest` / `DivisaoResponse`
- `EscalaRequest` / `EscalaResponse`
- `EspecialidadesRequest` / `EspecialidadeResponse`
- `FuncionarioRequest` / `FuncionarioResponse`
- `ChamadoRequest` / `ChamadoResponse`
- `HistoricoAcionamentoRequest` / `HistoricoAcionamentoResponse`

O DTO fornecido nao mostra claramente um DTO de perfil. Nao inventar campos/payloads sem confirmar os controllers do backend.

## SweetAlert

As telas CRUD devem usar SweetAlert para:

- sucesso de criacao
- sucesso de atualizacao
- sucesso de exclusao
- erro de requisicao/backend
- campos obrigatorios vazios
- IDs nulos ou invalidos
- confirmacao antes de excluir

Chamado detail e user list ja possuem essa estrutura. O gerenciador administrativo recebeu a mesma regra.

## Estado atual

- A última build validada antes desta alteração passou.
- Depois da implementação do `EscolhaDropdown`, executar novamente a build para validar os templates e imports.
- Os endpoints de divisões e especialidades assumem as rotas `/divisoes` e `/especialidades`, conforme o DTO; confirmar os controllers do backend se houver erro HTTP 404.

## Validacao recomendada

Executar no Windows via `cmd.exe`, pois o PowerShell apresentou bloqueio de execucao anteriormente:

```bat
cmd.exe /d /c npm run build -- --configuration development
```

Warnings esperados:

- Deprecacao de `@import` Sass em `src/styles.scss`.

Esses warnings nao impedem a build. O criterio de sucesso e:

```text
Application bundle generation complete.
```

## Cuidados para a proxima IA

- Ler os arquivos atuais antes de editar: houve alteracoes manuais/formatadores entre etapas.
- Nao reintroduzir mocks.
- Nao reintroduzir equipes.
- Nao assumir que perfil e plantonista: perfil e apenas administrador/usuario.
- Conferir `DTO.txt` antes de criar novos payloads.
- Rodar build depois de corrigir qualquer erro de import, template ou TypeScript.
