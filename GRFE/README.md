# GRFE - Gestão de Incidentes e Operações

Bem-vindo ao repositório do **GRFE**, um sistema moderno desenvolvido em **Angular 19** para o frontend e **Spring Boot** para o backend, feito especialmente para gerenciar chamados, incidentes operacionais e plantonistas.

---

## 📌 Sumário

1. [[#🎯 O que é o projeto?]]
2. [[#🛠️ Tecnologias Utilizadas]]
3. [[#📂 Estrutura do Projeto]]
4. [[#🚀 Como Executar o Projeto]]
5. [[#⚙️ Rotas e Funcionalidades]]
6. [[#🎨 Estilização e Temas]]

---

## 🎯 O que é o projeto?

O GRFE é uma plataforma de centro de operações. O sistema permite o acompanhamento contínuo de incidentes, relatórios estatísticos e gestão de equipes e plantonistas.

Principais funcionalidades:
- **Dashboard:** Resumo geral de ocorrências, chamados recentes e indicadores (KPIs).
- **Chamados:** Abertura, listagem, e acompanhamento de status (Aberto, Em Andamento, Resolvido).
- **Relatórios:** Gráficos e indicadores de ocorrências por setor, período e colaborador.
- **Gerenciador Administrativo:** Controle de dados de base (Divisões, Setores, Especialidades, Escalas).
- **Usuários:** Controle de acesso e vínculo de especialidades.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Angular 19** (Standalone Components)
- **MDBootstrap Angular UI Kit** (Componentes de UI)
- **SweetAlert2** (Popups e alertas de confirmação)
- **SCSS** (Estilização com _glassmorphism_ e variáveis CSS)
- **TypeScript**

### Backend (API)
- **Java Spring Boot** (na porta `8080`)


---

## 📂 Estrutura do Projeto

A arquitetura do Angular segue uma organização baseada em **features** (`standalone components`):

```text
src/
 ┣ app/
 ┃ ┣ components/
 ┃ ┃ ┣ layout/
 ┃ ┃ ┃ ┣ admin/          # Telas de gestão (Usuários e Gerenciador Admin)
 ┃ ┃ ┃ ┣ chamado/        # Detalhe/Edição de um chamado
 ┃ ┃ ┃ ┣ chamados/       # Lista de chamados e abertura
 ┃ ┃ ┃ ┣ dash-geral/     # Dashboard com KPIs
 ┃ ┃ ┃ ┣ login/          # Tela de autenticação
 ┃ ┃ ┃ ┣ navbar/         # Menu lateral/superior base
 ┃ ┃ ┃ ┗ relatorios/     # Gráficos e estatísticas
 ┃ ┃ ┗ shared/           # Componentes reutilizáveis (ex: EscolhaDropdown)
 ┃ ┣ models/             # Interfaces TypeScript e entidades (Usuario, Chamado, Escala)
 ┃ ┗ services/           # Comunicação HTTP com o backend (Spring)
 ┣ styles.scss           # Estilos globais (cores da Itaipu, glassmorphism)
 ┗ index.html
```

---

## 🚀 Como Executar o Projeto

1. **Pré-requisitos:** Node.js instalado e Angular CLI.
2. **Backend:** Certifique-se de que a API Spring Boot está rodando na porta `8080`.
3. **Instalação:**
   ```bash
   npm install
   ```
4. **Rodando o Servidor de Desenvolvimento:**
   ```bash
   npm start
   ```
   Acesse no navegador: `http://localhost:4200/`

---

## ⚙️ Rotas e Funcionalidades

As rotas da aplicação (definidas em `app.routes.ts`) seguem a seguinte estrutura:

- `/login`: Tela inicial de acesso.
- `/navbar/dashboard`: **Centro de Operações** (Resumo geral).
- `/navbar/chamados`: Lista de todos os incidentes.
- `/navbar/chamados/novo`: Abertura de incidente.
- `/navbar/chamados/:id`: Acompanhamento/atualização de incidente específico.
- `/navbar/relatorios`: Painel de visualização de métricas e gráficos.
- `/navbar/admin`: [[Gerenciador Administrativo]] (CRUD de Divisões, Setores, etc).
- `/navbar/users`: Lista e gestão de funcionários/plantonistas.

---

## 🎨 Estilização e Temas


O arquivo central de estilização é o `styles.scss`, onde encontram-se:

- **Variáveis CSS:** Todas as cores (`--itaipu-green`, `--itaipu-blue`, `--surface`, `--ink`, etc).
- **Glassmorphism:** Efeito visual aplicado nos painéis e cartões brancos do sistema:
  ```css
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  ```
- O layout utiliza o fundo com corte diagonal `linear-gradient(135deg, green 50%, blue 50%)`, aplicado globalmente ao corpo da aplicação.
