# Doorly — Portal Web de Serviços (PAP)

Plataforma web desenvolvida no âmbito da Prova de Aptidão Profissional (PAP), com o objetivo de permitir a divulgação e gestão de serviços por parte de empresas/prestadores, bem como a consulta desses serviços por utilizadores.

---

## Tecnologias Utilizadas

### Frontend
- React + Vite
- TypeScript
- Tailwind CSS
- lucide-react

### Backend
- Node.js
- Express
- JWT (autenticação)
- Base de Dados MySQL (phpMyAdmin / XAMPP)

---

## Funcionalidades (estado atual)
- Interface web moderna e responsiva
- Listagem de serviços
- Página de detalhe de serviço
- Estrutura preparada para autenticação (login/registro)
- Comunicação frontend ↔ backend em desenvolvimento

> Nota: O projeto encontra-se em fase de protótipo funcional, podendo existir funcionalidades em fase de correção ou melhoria.

---

## Estrutura do Projeto
/frontend → Aplicação React (Vite)
/backend → API Node.js + Express

yaml
Copiar código

---

## Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js (versão LTS recomendada)
- Git
- XAMPP (Apache + MySQL) com a base de dados criada
- Base de dados criada

Confirmar versão do Node:
``bash
node -v

---

### Clonar o Repositório
``bash
git clone https://github.com/Chedza-Lae/Doorly-Project.git
cd Doorly-Project

### Executar o Backend
- bash
  
Copiar código
- cd backend
- npm install
- npm run dev

O backend corre por defeito em:

http://localhost:3001

### Executar o Frontend
Abrir um novo terminal:

- bash
Copiar código
- cd frontend
- npm install
- npm run dev

O frontend corre por defeito em:

http://localhost:5173

Se o Frontend abrir página branca

- Abrir o navegador
- Premir F12
- Ir à aba "Console"

Se existir erro, verificar:

- Node instalado corretamente
- npm install executado dentro da pasta frontend
- Porta do backend correta (3001)
- Proxy configurado no vite.config.ts

### Exemplo de proxy correto:

export default {
  server: {
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
};
Variáveis de Ambiente

### Criar ficheiro:

backend/.env

Conteúdo:
PORT=3001
JWT_SECRET=chave_exemplo
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=doorly

### Endpoint de Teste
Se necessário, testar comunicação:

http://localhost:3001/api/health

Deverá retornar JSON.

Problemas Comuns
"Failed to fetch"

- Backend desligado
- Porta incorreta
- CORS não configurado
- Proxy não configurado

Página branca

- Dependências não instaladas
- Erro no console
- Variáveis de ambiente ausentes
- Backend não acessível

Estado do Projeto

Protótipo funcional com integração frontend/backend em desenvolvimento.
Projeto em fase de otimização e testes finais.
