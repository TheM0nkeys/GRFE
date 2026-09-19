# GRFE — Gestão de Chamados e Escalas | Itaipu Binacional

Sistema de centro de operações para gestão de chamados técnicos, escalas de plantão e integração com o **ServiceNow**, desenvolvido como projeto integrador de extensão para a **Itaipu Binacional**.

> **Status atual do projeto:** em desenvolvimento — cerca de **25% concluído**.
> Já temos uma **V1 rodando localmente**, com front-end e back-end integrados. Ainda faltam: guarda de rotas por perfil (*role guard*), autenticação/autorização, e finalizar a integração com o ServiceNow (o client e os endpoints já existem, mas o fluxo ainda não está fechado ponta a ponta).

---

## 📌 Sumário

1. [Visão geral](#-visão-geral)
2. [Arquitetura](#-arquitetura)
3. [Estrutura do repositório](#-estrutura-do-repositório)
4. [Modelo de dados](#-modelo-de-dados)
5. [Integração com o ServiceNow](#-integração-com-o-servicenow)
6. [Como rodar o projeto](#-como-rodar-o-projeto)
7. [Estado atual e pendências conhecidas](#-estado-atual-e-pendências-conhecidas)
8. [Roadmap](#-roadmap)

---

## 🎯 Visão geral

O **GRFE** (Gestão de Chamados, Funcionários e Escalas) é uma plataforma para acompanhar chamados técnicos abertos por plantonistas, controlar escalas de equipes por especialidade e centralizar relatórios operacionais, com abertura/atualização automática de incidentes no **ServiceNow**.

Principais funcionalidades previstas:

- **Dashboard:** resumo geral de chamados, indicadores (KPIs) e ocorrências recentes.
- **Chamados:** abertura, listagem e acompanhamento de status (`ABERTO`, `EM_ANDAMENTO`, `FECHADO`), com histórico de interações.
- **Escalas:** vínculo entre funcionários, especialidades e horários de plantão.
- **Relatórios:** gráficos e indicadores por setor, período e colaborador.
- **Administração:** CRUD de divisões, departamentos e especialidades.
- **Usuários:** cadastro de funcionários e vínculo com especialidades.
- **Integração ServiceNow:** criação e atualização de incidentes (`/api/now/table/incident`) a partir dos chamados abertos no GRFE.

---

## 🏗 Arquitetura

| Camada | Tecnologia |
|---|---|
| Front-end | Angular 19 (Standalone Components), MDBootstrap, SweetAlert2, SCSS |
| Back-end | Java 17, Spring Boot 4.1.1, Spring Data JPA / Hibernate, Spring Cloud OpenFeign |
| Banco de dados | PostgreSQL, versionado com Flyway |
| Integração externa | ServiceNow (via Feign Client, REST Table API) |
| Documentação de API | springdoc-openapi (Swagger UI) |

O front-end (porta `4200`) consome a API REST do back-end (porta `8080`). A comunicação com o ServiceNow é feita pelo back-end através de um `FeignClient`, isolando o front-end do provedor externo.

---

## 📂 Estrutura do repositório

```text
GRFE/
├── backEnd/                          # API REST — Spring Boot
│   ├── src/main/java/br/com/itaipu/grfe/
│   │   ├── client/                   # ServiceNowClient (Feign)
│   │   ├── config/                   # CorsConfig, ServiceNowFeignConfig
│   │   ├── controller/                # Chamado, Departamento, Divisao, Escala,
│   │   │                              # Especialidades, Funcionario, ServiceNow
│   │   ├── dto/{request,response}/   # DTOs de entrada e saída
│   │   ├── entity/                   # Entidades JPA + enum StatusChamado
│   │   ├── exception/                # Tratamento global de exceções
│   │   ├── repository/               # Spring Data JPA repositories
│   │   └── service/                  # Regras de negócio + ServiceNowService
│   └── src/main/resources/
│       ├── application.properties
│       └── db/migration/             # Scripts Flyway (V1 a V8)
│
└── frontEnd/GRFE/                    # Aplicação Angular
    └── src/app/
        ├── components/
        │   ├── layout/
        │   │   ├── admin/            # Gerenciador admin, lista de usuários
        │   │   ├── chamado/          # Detalhe / visualização de um chamado
        │   │   ├── chamados/         # Listagem de chamados
        │   │   ├── dash-geral/       # Dashboard com KPIs
        │   │   ├── login/            # Autenticação
        │   │   ├── navbar/           # Layout base / menu
        │   │   └── relatorios/       # Relatórios e gráficos
        │   └── shared/                # Componentes reutilizáveis
        ├── models/                    # Interfaces TypeScript
        └── services/                  # Comunicação HTTP com o back-end
```

---

## 🗄 Modelo de dados

| Tabela | Descrição |
|---|---|
| `divisao` | Divisões organizacionais |
| `departamento` | Departamentos, vinculados a uma divisão |
| `especialidades` | Especialidades técnicas, vinculadas a divisão e departamento |
| `funcionario` | Funcionários (com N:N para especialidades) |
| `funcionario_especialidades` | Tabela associativa funcionário ↔ especialidade |
| `escala` | Escalas de plantão por funcionário e especialidade |
| `chamado` | Chamados abertos, com plantonista, responsável e status |
| `historico_acionamento` | Histórico de interações em um chamado |

O schema é versionado via **Flyway** (`db/migration/V1` a `V8`), incluindo migrações de estrutura, índices e dados iniciais de demonstração.

---

## 🔗 Integração com o ServiceNow

- Cliente REST via `ServiceNowClient` (Spring Cloud OpenFeign), apontando para a Table API do ServiceNow (`/api/now/table/incident`).
- Endpoints expostos pelo GRFE em `/integracao/servicenow`:
  - `POST /integracao/servicenow/incidentes` — cria um incidente no ServiceNow.
  - `PATCH /integracao/servicenow/incidentes/{sysId}` — atualiza um incidente existente.
- Credenciais configuradas via variáveis de ambiente `SERVICENOW_USERNAME` e `SERVICENOW_PASSWORD` (ver `application.properties`).
- **Status:** implementação inicial concluída (criação e atualização de incidente). Falta o fluxo automático que dispara essas chamadas a partir do ciclo de vida do `Chamado` no GRFE (hoje a chamada precisa ser feita manualmente/à parte).

---

## 🚀 Como rodar o projeto

### Pré-requisitos
- Java 17+ e Maven (ou use o `mvnw` incluso)
- Node.js + Angular CLI
- PostgreSQL

### Back-end

1. Crie o banco de dados:
   ```sql
   CREATE DATABASE grfe;
   ```
2. Configure `backEnd/src/main/resources/application.properties` com usuário/senha do seu PostgreSQL e, se for testar a integração, as variáveis `SERVICENOW_USERNAME` / `SERVICENOW_PASSWORD`.
3. Rode as migrações e suba a aplicação (Flyway aplica as migrações automaticamente ao iniciar):
   ```bash
   cd backEnd
   ./mvnw spring-boot:run
   ```
   API disponível em `http://localhost:8080`.

### Front-end

> ⚠️ **Atenção:** o `.gitignore` do front-end atualmente ignora `package.json`, `angular.json` e os `tsconfig*.json`. Esses arquivos **não estão neste .zip** — provavelmente por engano. Serão necessários para instalar dependências e rodar o projeto; vale ajustar o `.gitignore` e versionar esses arquivos o quanto antes.

1. Dentro de `frontEnd/GRFE`, instale as dependências:
   ```bash
   npm install
   ```
2. Suba o servidor de desenvolvimento:
   ```bash
   npm start
   ```
   Acesse em `http://localhost:4200`.

---

## ⚠️ Estado atual e pendências conhecidas

Este projeto está em fase inicial de desenvolvimento (~25% concluído). Pontos já identificados como pendentes:

- **Sem autenticação/autorização real.** Não há Spring Security no back-end; o front-end integra normalmente com o back, mas o *role guard* das rotas (`canActivate`) está comentado em `app.routes.ts` e ainda não foi implementado.
- **CORS liberado apenas para `localhost:4200`**, fixo no código (`CorsConfig`) — revisar para ambientes de homologação/produção.
- **Integração ServiceNow parcial:** client e endpoints implementados, mas ainda não acionados automaticamente pelo fluxo de chamados.
- **Arquivos de configuração do Angular ausentes no repositório** (`package.json`, `angular.json`, `tsconfig*.json`) por conta do `.gitignore` atual.
- **Roteamento do front-end incompleto** (comentário `//falta terminar o roteamento` em `app.routes.ts`).
- Sem testes automatizados relevantes além do teste de contexto padrão do Spring Boot (`GrfeApplicationTests`).

## 🗺 Roadmap

- [ ] Implementar autenticação e autorização (Spring Security + JWT, a definir)
- [ ] Ativar e implementar o *role guard* no front-end
- [ ] Fechar o fluxo automático de integração com o ServiceNow (abertura/atualização de chamado → incidente)
- [ ] Versionar corretamente os arquivos de configuração do Angular
- [ ] Completar o roteamento e telas pendentes (relatórios, administração)
- [ ] Cobertura de testes (back-end e front-end)
- [ ] Documentação da API (Swagger/OpenAPI já disponível via springdoc — validar e publicar)

---

## 🛠 Tecnologias

**Back-end:** Java 17 · Spring Boot 4.1.1 · Spring Data JPA · Spring Cloud OpenFeign · Flyway · PostgreSQL · Lombok · springdoc-openapi
**Front-end:** Angular 19 · MDBootstrap · SweetAlert2 · SCSS · TypeScript

---

*Projeto integrador de extensão desenvolvido para a Itaipu Binacional.*
