# Doorly — Portal Web de Serviços (PAP)

Plataforma web desenvolvida no âmbito da Prova de Aptidão Profissional (PAP).
Permite a divulgação, consulta e gestão de serviços, com autenticação baseada em JWT.

## Tecnologias

#### Frontend
- React
- Vite
- TypeScript
- Tailwind CSS

#### Backend

- Node.js
- Express
- JWT

#### Base de Dados

- MySQL (XAMPP / phpMyAdmin)

## Estrutura do Projeto
/frontend   → Aplicação React (Vite)
/backend    → API Node.js + Express

MÉTODO RECOMENDADO PARA AVALIAÇÃO

(Produção — Frontend servido pelo Backend)

Este método evita erros de proxy, conflitos de porta e “tela branca”.

## Pré-requisitos

- Node.js (versão LTS recomendada)
- XAMPP (Apache + MySQL)
- Git

### Confirmar Node:

- node -v

### Configurar Base de Dados

No XAMPP:

- Iniciar Apache
- Iniciar MySQL
- Abrir phpMyAdmin

- Criar base de dados:

doorly

- Importar o ficheiro .sql do projeto (se fornecido)

### Configurar Variáveis de Ambiente (Backend)

- Criar ficheiro:

backend/.env

- Conteúdo:

PORT=3001
JWT_SECRET=chave_exemplo_segura
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=doorly

### Build do Frontend

Como a pasta dist não está no repositório, é necessário gerar o build.

Abrir terminal:

- cd frontend
- npm install
- npm run build

Após executar, deverá existir:

frontend/dist/index.html

Este passo é essencial para evitar página branca.

### Executar Backend (Serve Frontend + API)

Abrir novo terminal:

- cd backend
- npm install
- npm run dev

O sistema ficará disponível em:

http://localhost:3001

Abrir apenas este link.
NÃO executar npm run dev no frontend neste modo.

### Teste de Funcionamento

Para confirmar backend ativo:

http://localhost:3001/api/health

Deverá retornar JSON.

Se esta rota funcionar, o sistema está corretamente configurado.

### Se aparecer página branca

Verificar:
- O comando npm run build foi executado dentro da pasta frontend
- A pasta frontend/dist existe
- O backend está a correr
- Abrir F12 → Console e verificar erros
- Confirmar que a base de dados está ligada

Método Alternativo (Desenvolvimento)

Apenas se necessário.

Backend
cd backend
npm install
npm run dev

Corre em:

http://localhost:3001
Frontend
cd frontend
npm install
npm run dev

Corre em:

http://localhost:5173

Neste modo é necessário proxy configurado no vite.config.ts.

Problemas Comuns
"Failed to fetch"

- Backend desligado
- Base de dados desligada
- Porta incorreta
- CORS não configurado
- Login não funciona
- Base de dados não importada corretamente
- Variáveis de ambiente incorretas
- Password não corresponde ao hash

## Estado do Projeto

Protótipo funcional com integração frontend/backend em desenvolvimento.
Projeto em fase de otimização e testes finais.
