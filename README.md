# Doorly

Doorly é uma plataforma web desenvolvida no âmbito da Prova de Aptidão Profissional (PAP). O projeto permite procurar serviços, publicar serviços como prestador, trocar mensagens, criar agendamentos, guardar favoritos, avaliar serviços e gerir utilizadores através de um painel administrativo.

## Tecnologias

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

### Backend

- Node.js
- Express
- JWT para autenticação
- bcrypt para encriptar passwords
- Nodemailer para recuperação de password e emails do sistema

### Base de Dados

- PostgreSQL no Supabase
- Supabase Storage para imagens de perfil e imagens de serviços

## Estrutura

```text
frontend/   Aplicação React + Vite
backend/    API Node.js + Express
database/   Scripts SQL para PostgreSQL/Supabase
```

## Variáveis de Ambiente

Os ficheiros `.env` reais não devem ser enviados para o GitHub. Mantém apenas os ficheiros `.env.example` no repositório.

### Backend

Criar `backend/.env` com base em `backend/.env.example`:

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=trocar_por_um_segredo_longo_e_aleatorio
FRONTEND_URL=http://localhost:5173

DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
SUPABASE_URL=https://PROJECT-REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=trocar_pela_service_role_key_no_env_real
SUPABASE_STORAGE_BUCKET=profile-images
SUPABASE_PROFILE_IMAGES_BUCKET=profile-images
SUPABASE_SERVICE_IMAGES_BUCKET=service-images

EMAIL_USER=teu-email@example.com
EMAIL_PASS=app_password_do_email
```

Notas importantes:

- `JWT_SECRET` deve ser longo e aleatório.
- `SUPABASE_SERVICE_ROLE_KEY` deve existir apenas no backend.
- Nunca colocar `SUPABASE_SERVICE_ROLE_KEY` no frontend.
- `FRONTEND_URL` define a origem permitida pelo CORS.

### Frontend

Criar `frontend/.env` com base em `frontend/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:3001
```

O código também aceita `VITE_API_URL` como alternativa.

## Instalação

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

As pastas `node_modules` não devem ser versionadas. Para reconstruir o projeto noutro computador basta correr `npm install` em `backend` e `frontend`.

## Correr Localmente

### 1. Backend

```bash
cd backend
npm run dev
```

Por defeito a API fica disponível em:

```text
http://localhost:3001
```

Health check:

```text
http://localhost:3001/api/health
```

### 2. Frontend

Noutro terminal:

```bash
cd frontend
npm run dev
```

Por defeito o frontend fica disponível em:

```text
http://localhost:5173
```

## Build do Frontend

```bash
cd frontend
npm run build
```

O build é gerado em `frontend/dist`. Esta pasta é gerada automaticamente e não deve ser usada para guardar código-fonte.

## Funcionalidades Principais

- Registo e login
- Autenticação com JWT
- Passwords guardadas com bcrypt
- Perfil de utilizador
- Upload de imagem de perfil
- Publicação, edição e remoção de serviços por prestadores
- Pesquisa e filtros de serviços
- Favoritos para clientes
- Mensagens por conversa
- Pedidos de contraproposta
- Agendamentos com estados
- Pagamento simulado de agendamentos
- Avaliações de serviços
- Painel de administração
- Banir e reativar utilizadores
- Tema claro/escuro

## Histórico

A página de histórico do cliente apresenta os agendamentos do próprio utilizador e os respetivos estados (`pendente`, `aceite`, `rejeitado`, `concluido`, `cancelado`). A rota usada no frontend é `/api/agendamentos/me`, protegida por JWT. O backend filtra os dados pelo utilizador autenticado, evitando mostrar agendamentos de outros clientes.

Existe também uma API `/api/historico`, preparada para histórico de serviços concluídos. Esta funcionalidade deve ser validada com o schema final antes de ser apresentada como histórico separado.

## Deploy Futuro

Sugestão de deploy:

- Frontend: Vercel
- Backend: Render
- Base de dados: Supabase

### Variáveis no Render

Configurar no serviço do backend:

- `PORT`
- `NODE_ENV=production`
- `JWT_SECRET`
- `FRONTEND_URL`
- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `SUPABASE_PROFILE_IMAGES_BUCKET`
- `SUPABASE_SERVICE_IMAGES_BUCKET`
- `EMAIL_USER`
- `EMAIL_PASS`

### Variáveis na Vercel

Configurar no projeto do frontend:

- `VITE_API_BASE_URL`

Exemplo:

```env
VITE_API_BASE_URL=https://url-do-backend.onrender.com
```

Nunca configurar `SUPABASE_SERVICE_ROLE_KEY` na Vercel/frontend.

## Preparação para Entrega

Antes de enviar para GitHub ou para avaliação:

- Confirmar que `.env`, `backend/.env` e `frontend/.env` não estão versionados.
- Confirmar que `node_modules` não está versionado.
- Confirmar que `README.md` não contém credenciais reais.
- Correr `npm install` nas duas pastas quando clonar o projeto.
- Correr `npm run build` no frontend para validar TypeScript/build.
- Testar login, registo, serviços, favoritos, mensagens, agendamentos e painel admin.
