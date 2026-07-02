# Auditoria Técnica Doorly

Análise feita ao projeto Doorly como revisão técnica de uma PAP de TGPSI. A auditoria foi feita por leitura do código, estrutura de pastas e SQL existente. Não foram executados testes funcionais completos nem alterado código da aplicação.

## 1. Estrutura geral do projeto

O projeto está organizado em três áreas principais:

- `frontend/`: aplicação React + Vite + TypeScript + Tailwind CSS.
- `backend/`: API Node.js + Express, organizada por rotas, controllers, services, repositories, middleware e validators.
- `database/`: scripts SQL da base de dados.

A separação entre frontend, backend e base de dados existe e está clara. O backend tem uma estrutura relativamente madura, com camadas bem separadas:

- `routes`: define endpoints HTTP.
- `controllers`: recebe pedidos e chama validações/services.
- `services`: concentra regras de negócio.
- `repositories`: concentra queries SQL.
- `validators`: valida payloads.
- `middleware`: autenticação, permissões e tratamento de erros.

Pontos a corrigir na entrega:

- Existe `backend/node_modules` versionado no Git. Isto não deve ser entregue no repositório.
- Existe `frontend/node_modules` no disco, mas não aparece versionado pelo `git ls-files`.
- Existe `frontend/dist` no disco. Não foi confirmado se está versionado, mas em geral deve ser gerado por build, não entregue como fonte principal.
- Existem logs do Vite (`frontend/vite-dev.log`, `frontend/vite-dev.err.log`) que não são úteis para a PAP.
- Existe `backend/hash.js` com uma password de exemplo hardcoded. Deve sair da entrega final.
- Existem ficheiros `.env` reais no projeto: `backend/.env` e `frontend/.env`.
- `backend/.env` e `frontend/.env` estão versionados no Git, o que é um problema grave.
- O `README.md` contém uma `DATABASE_URL` real/exemplo com credenciais visíveis. Deve ser removida e substituída por placeholders.
- O `README.md` ainda fala em MySQL/XAMPP/phpMyAdmin, mas o backend atual usa PostgreSQL/Supabase. Isto pode confundir o júri.

## 2. Backend

Tecnologias principais:

- Node.js
- Express 5
- PostgreSQL via `pg`
- JWT via `jsonwebtoken`
- bcrypt para passwords
- Nodemailer para emails
- Supabase Storage via chamadas HTTP diretas

Rotas principais existentes:

- `/api/auth`
  - `POST /register`
  - `POST /login`
  - `POST /forgot-password`
  - `PUT /reset-password/:token`
  - `POST /refresh-token`
- `/api/users`
  - `GET /profile`
  - `GET /me`
  - `PUT /me`
  - `POST /me/photo`
  - `PUT /password`
- `/api/servicos`
  - `GET /`
  - `GET /me`
  - `POST /image`
  - `POST /`
  - `POST /dev`
  - `GET /:id`
  - `PUT /:id`
  - `PATCH /:id`
  - `DELETE /:id`
- `/api/messages`
  - `POST /`
  - `GET /inbox`
  - `GET /thread`
  - `POST /reply`
- `/api/favorites`
  - `GET /`
  - `POST /`
  - `DELETE /`
- `/api/propostas`
  - `POST /`
  - `GET /`
  - `GET /me`
  - `GET /provider`
  - `GET /:id`
  - `PUT /:id`
  - `PATCH /:id/status`
  - `DELETE /:id`
- `/api/avaliacoes`
  - `GET /service/:id`
  - `GET /provider`
  - `POST /`
- `/api/agendamentos`
  - `POST /`
  - `GET /me`
  - `GET /prestador`
  - `PUT /:id`
  - `PATCH /:id/status`
  - `PATCH /:id/payment`
  - `DELETE /:id`
- `/api/historico`
  - `GET /me`
  - `GET /prestador`
  - `POST /`
  - `DELETE /:id`
- `/api/admin`
  - `GET /logs`
  - `GET /users`
  - `DELETE /users/:id`
  - `PUT /users/:id/reset-password`
  - `PUT /users/:id/ban`
  - `PUT /users/:id/unban`
  - `PATCH /users/:id/role`
  - `GET /services`
  - `DELETE /services/:id`

Pontos fortes do backend:

- Boa separação em camadas.
- Queries maioritariamente parametrizadas com `$1`, `$2`, etc.
- Middleware `verifyToken` valida JWT e volta a consultar o utilizador na BD, bloqueando contas banidas/desativadas mesmo com token antigo.
- Middleware `isAdmin` protege a área administrativa.
- Validações centralizadas em `validators`.
- Uso de `bcrypt` para guardar passwords.
- Uso de transações em operações críticas como criação de serviços, propostas e eliminações em cascata.
- Tratamento global de erros com `errorHandler`.

Problemas e riscos no backend:

- `POST /api/servicos/dev` está sem autenticação. Permite criar serviços em modo dev se souberem o endpoint. Deve ser removido ou protegido.
- `authService.forgotPassword` devolve sucesso mesmo que o envio de email falhe, porque o erro é apanhado e apenas registado no console. Para demo pode parecer que funcionou quando não funcionou.
- `forgot-password` devolve 404 quando o email não existe. Isto permite enumeração de emails.
- A rota de estado das propostas permite atualização se o utilizador for cliente, prestador ou admin. Isto significa que um cliente pode alterar estado de uma proposta pela API, mesmo que o frontend só mostre isso ao prestador.
- `replyToMessage` permite responder para um `other_id` indicado no body sem confirmar totalmente se esse utilizador pertence à conversa original. Há alguma proteção pela thread/listagem, mas a criação da mensagem aceita o destinatário vindo do cliente.
- `findMessageService` não exige `ativo = true`, por isso pode permitir mensagens para serviços inativos.
- O reset de password feito pelo admin aceita password mínima de 5 caracteres no service, enquanto o frontend exige 8. Inconsistência entre frontend/backend.
- O endpoint de pagamento é simulado e marca como pago diretamente, sem gateway real, sem webhook e sem prova externa.
- Não há rate limiting para login, forgot password ou uploads.
- Não foi encontrado middleware de validação de tamanho por rota além de `express.json({ limit: "4mb" })`.
- Não foram encontrados testes automáticos.

## 3. Frontend

Tecnologias principais:

- React
- Vite
- TypeScript
- React Router
- Tailwind CSS
- lucide-react

Páginas existentes:

- `Home`
- `Services`
- `ServiceDetail`
- `Login`
- `Register`
- `ForgotPassword`
- `ResetPassword`
- `Profile`
- `ProviderDashboard`
- `Admin`
- `Favorites`
- `Message`
- `Inbox`
- `Thread`
- `QuoteRequest`
- `BookingRequest`
- `MyBookings`
- `CustomerHistory`
- `About`
- páginas legais: `Terms`, `Privacy`, `Cookies`
- `SessionExpired`
- `NotFound`

Rotas protegidas:

- O componente `ProtectedRoute` verifica se existe utilizador guardado no `localStorage`.
- Algumas rotas exigem tipo de utilizador:
  - admin: `/admin`
  - prestador: `/prestador/dashboard`
  - cliente: `/favorites`, `/historico`, `/quote/new`, `/booking/new`

Pontos fortes do frontend:

- Estrutura de páginas clara.
- API centralizada em `src/lib/api.ts`.
- Tratamento básico de erros em quase todas as páginas.
- Redirecionamento para `/419` quando há 401 com token.
- Navbar adaptada a utilizadores autenticados e por tipo.
- Existe tema claro/escuro e mais variantes (`light`, `dark`, `midnight`, `premium`).
- Várias páginas usam classes responsivas (`sm`, `md`, `lg`, `xl`).
- Upload de imagem validado no frontend por tipo e tamanho.

Problemas e riscos no frontend:

- JWT é guardado em `localStorage`, o que é simples para PAP, mas mais vulnerável a XSS do que cookies HttpOnly.
- `ProtectedRoute` confia no `localStorage` para permissões visuais. O backend confirma permissões nas rotas importantes, mas a proteção visual pode ser falsificada no browser.
- Depois do login, o utilizador é sempre enviado para `/services`; não há redirecionamento automático para dashboard conforme tipo.
- `CustomerHistory` usa `api.getCustomerHistory()`, mas no `api.ts` isso chama `/api/agendamentos/me`, não `/api/historico/me`. Ou seja, o histórico mostrado é na prática a lista de agendamentos.
- Algumas funcionalidades aparecem como protótipo/UX mas não estão completas, por exemplo pagamento simulado.
- O admin não tem no frontend uma ação visível para alterar o tipo de utilizador, apesar de existir endpoint backend `PATCH /api/admin/users/:id/role`.
- O frontend não mostra logs administrativos, apesar de existir endpoint `/api/admin/logs`.
- Vários textos aparecem com caracteres potencialmente corrompidos nas leituras do projeto (`ServiÃ§os`, `DescriÃ§Ã£o`, etc.). Pode ser problema de encoding/terminal, mas deve ser confirmado no browser antes da defesa.
- `frontend/src/index.css` parece ser ficheiro CSS gerado pelo Tailwind. Em projetos Vite/Tailwind, normalmente o ficheiro fonte deveria ser mais limpo e o build gerar CSS final.

## 4. Base de dados

Tabelas identificadas:

- `utilizadores`
- `servicos`
- `mensagens`
- `favoritos`
- `avaliacoes`
- `estatisticas`
- `propostas`
- `agendamentos`
- `historico_servicos`
- `admin_logs`

Relações principais:

- `servicos.id_prestador` referencia `utilizadores.id_utilizador`.
- `mensagens.id_servico` referencia `servicos.id_servico`.
- `mensagens.id_remetente` e `id_destinatario` referenciam `utilizadores`.
- `favoritos.id_cliente` referencia `utilizadores`.
- `favoritos.id_servico` referencia `servicos`.
- `avaliacoes.id_cliente` referencia `utilizadores`.
- `avaliacoes.id_servico` referencia `servicos`.
- `estatisticas.id_servico` referencia `servicos`.
- `propostas.id_servico`, `id_cliente`, `id_prestador` referenciam `servicos` e `utilizadores`.
- `agendamentos.servico_id`, `cliente_id`, `prestador_id` referenciam `servicos` e `utilizadores`.
- `admin_logs.admin_id` e `target_user_id` referenciam `utilizadores` no script de correções.

Constraints importantes:

- `utilizadores.email` é único.
- `tipo` deve ser `cliente`, `prestador` ou `admin` no script `supabase_correcoes.sql`.
- `servicos.preco >= 0` no script `supabase_correcoes.sql`.
- `favoritos` tem unique em `(id_cliente, id_servico)` no script de correções.
- `avaliacoes` tem unique em `(id_servico, id_cliente)` no script de correções.
- `avaliacoes.nota` tem check entre 1 e 5 no script de correções.
- `agendamentos.estado` tem check nos estados permitidos.
- `agendamentos.estado_pagamento` tem check nos estados permitidos.

Inconsistências entre SQL e backend:

- `database/doorly.sql` e `database/supabase_correcoes.sql` não estão totalmente alinhados.
- Em `doorly.sql`, `historico_servicos` usa colunas `id`, `cliente_id`, `prestador_id`, `servico_id`.
- No backend, `historyRepository.js` espera `id_historico`, `id_cliente`, `id_prestador`, `id_servico`.
- `supabase_correcoes.sql` está mais alinhado com o backend para `historico_servicos`.
- Se o júri recriar a BD apenas com `doorly.sql`, o histórico pode falhar.
- `doorly.sql` indica tipos `USER-DEFINED` sem criar claramente os enums, por isso não parece ser um script pronto a executar sozinho.
- O README fala em MySQL, mas o SQL atual é PostgreSQL/Supabase.
- Não foram encontrados triggers. Existem campos `updated_at`, mas não há trigger confirmado para atualizar automaticamente em todas as tabelas.

## 5. Segurança

Riscos altos:

- `backend/.env` está versionado no Git.
- `frontend/.env` está versionado no Git.
- `README.md` contém uma `DATABASE_URL` com credenciais. Mesmo que fosse só exemplo, deve ser tratada como segredo exposto.
- `backend/hash.js` contém uma password de exemplo hardcoded.
- `SUPABASE_SERVICE_ROLE_KEY` existe no `.env` do backend. Esta chave nunca deve ir para frontend nem repositório.
- Não há `.gitignore` na raiz nem no backend para bloquear `.env`, `node_modules`, logs e builds.
- `backend/node_modules` está versionado.

JWT:

- JWT é assinado com `JWT_SECRET`.
- Token expira em 1 dia.
- O backend valida o token e consulta o utilizador atual.
- O frontend guarda o token no `localStorage`; aceitável para protótipo, mas não ideal em produção.

SQL Injection:

- As queries usam placeholders parametrizados na maioria dos casos.
- O `PATCH` de serviços monta dinamicamente nomes de colunas, mas vem de uma whitelist (`allowedServiceUpdateFields`), o que reduz bastante o risco.

CORS:

- O CORS aceita apenas `getFrontendUrl()`, por defeito `http://localhost:5173`.
- Isto é melhor do que `*`, mas em produção depende de `FRONTEND_URL` estar bem configurado.

Uploads:

- Imagens limitadas a 2MB.
- Tipos permitidos: JPG, PNG e WEBP.
- Validação feita no frontend e backend.
- Upload é feito para Supabase Storage usando service role no backend.
- Não foi confirmada validação real do conteúdo binário da imagem além de MIME/extensão/base64.

Dados sensíveis no frontend:

- Não foi encontrada `service_role key` no frontend.
- O frontend só usa `VITE_API_BASE_URL`.
- O token JWT e dados básicos do utilizador ficam em `localStorage`.

## 6. Funcionalidades

| Funcionalidade | Estado observado | Nota |
|---|---|---|
| Registo | Existe | `POST /api/auth/register`, página `Register`. |
| Login | Existe | JWT + `localStorage`. |
| Logout | Existe | `Navbar` limpa token e utilizador. |
| Recuperação de password | Existe | `ForgotPassword`, `ResetPassword`, token na BD, email por Nodemailer. Envio de email pode falhar silenciosamente. |
| Perfil de cliente | Existe | `Profile` serve todos os tipos de utilizador. |
| Perfil de prestador | Existe parcialmente | Mesmo `Profile`, mais dashboard de prestador. |
| Publicação de serviços | Existe | Prestador/admin no backend; página `ProviderDashboard`. |
| Edição/remoção de serviços | Existe | Prestador dono ou admin no backend. |
| Pesquisa e filtros | Existe | Pesquisa no backend por `q`; filtros principais no frontend. |
| Favoritos | Existe | Cliente pode adicionar/remover/listar. |
| Mensagens/chat | Existe | Inbox, thread e reply. Não é chat em tempo real. |
| Agendamentos | Existe | Criar, listar, atualizar estado, pagar simulado. |
| Histórico | Parcial/não confirmado | Existe backend `/api/historico`, mas frontend `CustomerHistory` usa agendamentos. |
| Painel de administração | Existe | Lista users/services, remove, reset password, ban/unban. |
| Banir/desbanir utilizadores | Existe | Backend e frontend. |
| Alterar tipo de utilizador | Existe no backend | Não confirmado no frontend. |
| Upload de imagens | Existe | Perfil e serviços via Supabase Storage. |
| Tema claro/escuro | Existe | `light`, `dark`, `midnight`, `premium`. |
| Notificações | Não confirmado | Há emails, mas não há tabela/sistema de notificações na app. |
| Subscrições/pagamentos | Parcial | Pagamento de agendamento é simulado; não há Stripe real confirmado. |
| Logs administrativos | Existe no backend | Não confirmado no frontend. |

## 7. Defesa da PAP

### Pontos fortes do projeto

- Projeto full-stack com frontend, backend e base de dados.
- Boa separação de responsabilidades no backend.
- Autenticação JWT funcional.
- Passwords com hash usando bcrypt.
- Permissões por tipo de utilizador: cliente, prestador e admin.
- CRUD de serviços com dono/prestador.
- Favoritos, mensagens, avaliações, agendamentos e painel admin tornam o projeto completo para PAP.
- Integração com PostgreSQL/Supabase.
- Upload de imagens via Supabase Storage.
- Validações no backend e frontend.
- Interface com várias páginas e responsividade.

### Pontos fracos que o júri pode perguntar

- Porque existem `.env` e credenciais no repositório?
- Porque o README fala em MySQL se o projeto usa Supabase/PostgreSQL?
- Porque existe `backend/node_modules` no Git?
- Porque há uma rota `/api/servicos/dev` sem autenticação?
- O pagamento é real ou simulado?
- O chat é em tempo real?
- O histórico usa a tabela `historico_servicos` ou apenas agendamentos?
- Como é impedido que um utilizador altere permissões no browser?
- Como são protegidas as chaves do Supabase?
- Existem testes automáticos?

### Respostas sugeridas em tom humilde

- Sobre `.env` no repositório: "Neste momento identifiquei isso como uma falha de entrega. A correção é remover os `.env` do Git, manter apenas `.env.example` e regenerar as chaves expostas."
- Sobre MySQL vs Supabase: "O projeto começou com uma abordagem mais simples, mas foi migrado para PostgreSQL/Supabase. O README ainda precisa de ser atualizado para refletir a versão final."
- Sobre `node_modules`: "Foi uma falha de organização do repositório. A forma correta é versionar `package.json` e `package-lock.json`, e instalar dependências com `npm install`."
- Sobre `/api/servicos/dev`: "Essa rota ficou de apoio ao desenvolvimento. Para entrega final deve ser removida ou protegida por admin."
- Sobre pagamentos: "O pagamento está simulado. A estrutura foi preparada para no futuro integrar Stripe, mas nesta PAP foquei-me no fluxo funcional de agendamento."
- Sobre chat: "É um sistema de mensagens por thread, não um chat em tempo real. Para tempo real usaria WebSockets ou Supabase Realtime."
- Sobre permissões: "O frontend esconde páginas por tipo de utilizador, mas a segurança real está no backend, que valida o token e o tipo do utilizador em cada operação sensível."
- Sobre testes: "Ainda não existem testes automáticos. A prioridade futura seria adicionar testes de autenticação, permissões e fluxos principais."

### Funcionalidades a demonstrar

- Registo como cliente e prestador.
- Login e logout.
- Pesquisa de serviços.
- Favoritos com cliente.
- Perfil e upload de fotografia, se o Supabase Storage estiver configurado.
- Dashboard de prestador: criar, editar, ativar/desativar e remover serviço.
- Pedido de contraproposta.
- Mensagens entre cliente e prestador.
- Agendamento de serviço.
- Prestador aceitar/rejeitar/concluir agendamento.
- Admin banir/desbanir utilizador e remover serviço.
- Tema claro/escuro.

### Funcionalidades a evitar mostrar se estiverem instáveis

- Pagamento como se fosse real. Deve ser apresentado como simulação.
- Histórico, se depender da tabela `historico_servicos`; confirmar antes porque o frontend parece usar agendamentos.
- Recuperação de password por email, se `EMAIL_USER`/`EMAIL_PASS` não estiverem configurados.
- Upload de imagens, se buckets/chaves Supabase não estiverem configurados.
- Recriação da BD a partir de `doorly.sql` sem aplicar `supabase_correcoes.sql`.
- Endpoint `/api/servicos/dev`, que não deve ser mostrado.

### Melhorias futuras realistas

- Remover segredos do Git e regenerar credenciais expostas.
- Criar `.gitignore` raiz.
- Atualizar README para PostgreSQL/Supabase.
- Remover `node_modules`, logs e ficheiros temporários do repositório.
- Remover/proteger rota dev.
- Implementar testes automáticos.
- Implementar rate limiting em login e recuperação de password.
- Melhorar recuperação de password para não revelar se o email existe.
- Implementar notificações reais na aplicação.
- Implementar chat em tempo real.
- Integrar Stripe ou outro gateway real para pagamentos.
- Criar dashboard admin mais completo com logs e alteração de roles.
- Uniformizar `doorly.sql` e `supabase_correcoes.sql`.

## 8. Prioridade de correção

| Problema encontrado | Ficheiro/local provável | Gravidade | Impacto na defesa | Solução recomendada |
|---|---|---|---|---|
| `.env` real versionado | `backend/.env`, `frontend/.env` | Alta | Muito alto: expõe segredos e má prática de segurança | Remover do Git, adicionar `.gitignore`, manter só `.env.example`, regenerar credenciais |
| Credenciais no README | `README.md` | Alta | Muito alto: júri pode questionar segurança | Substituir por placeholders e regenerar password/token expostos |
| `node_modules` versionado | `backend/node_modules` | Alta | Alto: mostra má organização de repositório | Remover do Git e ignorar `node_modules` |
| Rota dev sem autenticação | `backend/src/routes/servicos.js`, `serviceController.js` | Alta | Alto: permite criar serviços sem login | Remover rota ou proteger com `verifyToken` + `isAdmin` |
| SQL do histórico inconsistente | `database/doorly.sql`, `database/supabase_correcoes.sql`, `historyRepository.js` | Alta | Alto: funcionalidade pode falhar ao recriar BD | Unificar schema e garantir nomes usados pelo backend |
| README desatualizado sobre MySQL | `README.md` | Média | Alto: confunde explicação técnica | Atualizar para PostgreSQL/Supabase e passos reais |
| Pagamento simulado apresentado na UI | `scheduleService.js`, `MyBookings.tsx` | Média | Médio/alto se for apresentado como pagamento real | Explicar como simulação e planear Stripe/webhook como melhoria |
| Recuperação de password revela email inexistente | `authService.js` | Média | Médio: questão de segurança | Responder sempre mensagem genérica |
| Email de recuperação pode falhar silenciosamente | `authService.js`, `sendEmail.js` | Média | Médio: demo pode parecer funcional sem enviar email | Mostrar erro controlado ou validar configuração antes |
| Token em `localStorage` | `frontend/src/lib/api.ts` | Média | Médio: boa pergunta de segurança | Explicar limitação e propor cookies HttpOnly em produção |
| Cliente pode alterar estado da proposta via API | `quoteRepository.js`, `quoteService.js` | Média | Médio: falha de regra de negócio | Limitar alteração de estado ao prestador/admin |
| `reply` aceita destinatário vindo do body | `messageService.js` | Média | Médio: risco de mensagens indevidas | Validar que `other_id` pertence à thread/serviço |
| Admin reset password aceita mínimo 5 no backend | `adminService.js` | Média | Médio | Usar a mesma política forte do registo/reset |
| Histórico frontend usa agendamentos | `frontend/src/lib/api.ts`, `CustomerHistory.tsx` | Média | Médio | Ligar a `/api/historico/me` ou renomear como "agendamentos" |
| Sem testes automáticos | Projeto geral | Média | Médio | Adicionar testes para auth, permissões e CRUD principal |
| Sem rate limiting | Backend global | Média | Médio | Adicionar `express-rate-limit` em login/forgot/upload |
| Logs e dist no disco | `frontend/vite-dev.log`, `frontend/dist` | Baixa | Baixo/médio | Ignorar/remover da entrega se não forem necessários |
| `backend/hash.js` com password exemplo | `backend/hash.js` | Baixa/média | Médio se for visto pelo júri | Remover ou mover para documentação segura de desenvolvimento |
| Possível encoding estranho em textos | Vários ficheiros `.tsx`, `README.md` | Baixa/média | Médio se aparecer no browser | Confirmar no browser e guardar ficheiros como UTF-8 |
| Admin logs sem UI confirmada | `adminLogRepository.js`, `Admin.tsx` | Baixa | Baixo | Criar secção no painel admin ou não mencionar como funcionalidade visível |

## Conclusão

O Doorly é um projeto forte para PAP porque demonstra uma aplicação full-stack com autenticação, permissões, serviços, favoritos, mensagens, agendamentos, avaliações, upload de imagens e administração. A arquitetura do backend é um dos pontos mais positivos.

Antes da defesa, a prioridade deve ser limpar a entrega: remover segredos, corrigir README, tirar `node_modules` do Git, remover a rota dev e confirmar o schema correto da base de dados. Estes pontos não diminuem o valor funcional do projeto, mas são exatamente o tipo de detalhe técnico que um júri atento pode questionar.
