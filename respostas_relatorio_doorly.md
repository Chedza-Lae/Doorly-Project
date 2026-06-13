# Textos de resposta para o relatório final - Doorly

## 1. Introdução

O presente relatório descreve o desenvolvimento do projeto Doorly, uma plataforma web criada com o objetivo de facilitar a procura, divulgação e gestão de serviços. A aplicação permite aproximar clientes que precisam de um determinado serviço de prestadores que o disponibilizam, centralizando num só local a pesquisa, o contacto, a marcação e a avaliação dos serviços.

O projeto foi desenvolvido no âmbito da disciplina de Programação e Sistemas de Informação, no módulo 16, do Curso Profissional de Técnico de Gestão e Programação de Sistemas Informáticos. Ao longo do desenvolvimento foram aplicados conhecimentos de programação web, bases de dados, autenticação de utilizadores, organização de interfaces e comunicação entre frontend e backend.

A plataforma Doorly foi pensada para ser simples, intuitiva e acessível. O utilizador pode pesquisar serviços por categoria, localização ou preço, consultar detalhes, adicionar serviços aos favoritos, pedir contrapropostas, enviar mensagens, agendar serviços e deixar avaliações. Por outro lado, os prestadores podem gerir os seus serviços publicados, consultar pedidos recebidos e acompanhar o desempenho das suas publicações.

## 1.1. Enquadramento

Atualmente, muitas pessoas continuam a ter dificuldade em encontrar prestadores de serviços de forma rápida, organizada e segura. Em áreas como limpeza, canalização, eletricidade, jardinagem, pintura ou pequenas reparações, a procura é muitas vezes feita através de recomendações informais, redes sociais ou contactos dispersos, o que torna o processo pouco eficiente.

Do lado dos prestadores, também existe a necessidade de divulgar serviços de forma mais profissional, receber pedidos organizados e comunicar com potenciais clientes num ambiente centralizado. Sem uma plataforma própria, torna-se mais difícil apresentar informações como preço, localização, descrição do serviço, disponibilidade, avaliações e histórico de contacto.

O Doorly surge como resposta a este problema, funcionando como uma ponte entre clientes e prestadores. A plataforma procura tornar o processo mais transparente, permitindo que o cliente compare serviços e contacte prestadores de forma simples, enquanto o prestador consegue gerir a sua presença digital e acompanhar os pedidos recebidos.

## 1.2. Apresentação do Projeto

O Doorly é uma aplicação web de serviços, composta por frontend, backend e base de dados. O frontend apresenta a interface utilizada pelos clientes, prestadores e administradores. O backend disponibiliza a API responsável por tratar pedidos, validar dados, gerir autenticação e comunicar com a base de dados. A base de dados armazena utilizadores, serviços, mensagens, favoritos, propostas, avaliações, agendamentos, histórico e registos administrativos.

Os principais objetivos definidos para o projeto foram:

- Criar uma plataforma web onde os prestadores possam publicar e gerir serviços.
- Permitir que clientes pesquisem serviços por categoria, localização, preço e texto livre.
- Implementar autenticação com diferentes tipos de utilizador: cliente, prestador e administrador.
- Criar funcionalidades de favoritos, mensagens, contrapropostas e agendamento de serviços.
- Permitir que os clientes avaliem os serviços através de nota e comentário.
- Criar uma área administrativa para gerir utilizadores e serviços.
- Desenvolver uma interface simples, responsiva e adequada a diferentes tipos de utilizador.

A motivação para a realização deste projeto foi criar uma solução útil para uma situação comum: a dificuldade em encontrar rapidamente alguém de confiança para realizar um serviço. Além disso, o projeto permitiu aplicar conhecimentos técnicos em contexto prático, aproximando o desenvolvimento escolar de uma aplicação real.

## 1.2.1. Planeamento do projeto

O desenvolvimento do projeto foi dividido em várias fases, começando pela análise da ideia e terminando com os testes finais e a preparação do relatório. Esta divisão permitiu organizar melhor o trabalho e acompanhar a evolução do projeto ao longo do tempo.

| Fase | Tarefas realizadas | Período previsto |
| --- | --- | --- |
| 1. Análise e definição da ideia | Identificação do problema, definição dos objetivos, tipos de utilizador e funcionalidades principais. | Janeiro de 2026 |
| 2. Planeamento técnico | Escolha das tecnologias, definição da estrutura do projeto, organização das pastas frontend/backend e desenho inicial da base de dados. | Janeiro de 2026 |
| 3. Base de dados | Criação das tabelas principais, relações entre entidades, chaves primárias e estrangeiras. | Fevereiro de 2026 |
| 4. Backend/API | Implementação das rotas de autenticação, utilizadores, serviços, mensagens, favoritos, propostas, avaliações, agendamentos e administração. | Fevereiro a abril de 2026 |
| 5. Frontend | Criação das páginas principais: início, serviços, detalhe do serviço, login, registo, perfil, mensagens, favoritos, dashboard do prestador e painel administrativo. | Março a maio de 2026 |
| 6. Integração | Ligação entre frontend e backend, utilização de tokens JWT, validação de permissões e ligação à base de dados. | Abril a maio de 2026 |
| 7. Testes e correções | Testes de navegação, autenticação, criação de serviços, pedidos, favoritos, avaliações e permissões por tipo de utilizador. | Maio a junho de 2026 |
| 8. Relatório final | Escrita da documentação, organização dos anexos e preparação da apresentação final. | Junho de 2026 |

Para representar o planeamento, pode ser incluído no relatório um mapa de GANTT com estas fases. O mapa deve mostrar a duração de cada tarefa e a sobreposição entre desenvolvimento do backend, frontend, testes e documentação.

## 1.3. Tecnologias utilizadas

Para desenvolver o Doorly foram utilizadas várias tecnologias, cada uma com uma função específica no projeto.

**React** foi utilizado para criar a interface da aplicação. É uma biblioteca JavaScript que permite construir páginas web interativas através de componentes reutilizáveis. No Doorly, foi usado para criar páginas como a página inicial, lista de serviços, detalhe do serviço, login, registo, perfil, favoritos, dashboard do prestador e painel administrativo. Link: https://react.dev/

**Vite** foi utilizado como ferramenta de desenvolvimento do frontend. Permite iniciar rapidamente o projeto, atualizar a página durante o desenvolvimento e gerar a versão final da aplicação. Link: https://vite.dev/

**TypeScript** foi utilizado no frontend para tornar o código mais seguro e organizado, permitindo definir tipos de dados e reduzir erros durante o desenvolvimento. Link: https://www.typescriptlang.org/

**Tailwind CSS** foi utilizado para criar o design da interface. Esta ferramenta permite aplicar estilos diretamente nos componentes através de classes, facilitando a criação de páginas responsivas e consistentes. Link: https://tailwindcss.com/

**Node.js** foi utilizado no backend para executar JavaScript no servidor. É a base da API do Doorly. Link: https://nodejs.org/

**Express.js** foi utilizado para criar as rotas da API. Com esta framework, o backend consegue responder a pedidos como login, registo, criação de serviços, envio de mensagens, favoritos, propostas e administração. Link: https://expressjs.com/

**PostgreSQL/Supabase** foi utilizado para armazenar os dados da aplicação. A base de dados guarda utilizadores, serviços, favoritos, mensagens, propostas, avaliações, agendamentos, histórico e logs administrativos. Link: https://www.postgresql.org/ e https://supabase.com/

**JWT (JSON Web Token)** foi utilizado para autenticação. Quando o utilizador inicia sessão, recebe um token que é enviado nos pedidos seguintes para comprovar a sua identidade e permissões. Link: https://jwt.io/

**bcrypt** foi utilizado para proteger as passwords dos utilizadores, guardando-as em formato encriptado através de hash. Link: https://www.npmjs.com/package/bcrypt

**Visual Studio Code** foi utilizado como ambiente de desenvolvimento, permitindo escrever, organizar e testar o código do projeto. Link: https://code.visualstudio.com/

## 2. Desenvolvimento do Projeto

O desenvolvimento do Doorly foi organizado em três partes principais: frontend, backend e base de dados. O frontend ficou responsável pela experiência do utilizador, o backend tratou da lógica da aplicação e das regras de negócio, e a base de dados armazenou a informação necessária ao funcionamento da plataforma.

Durante o desenvolvimento foram criadas funcionalidades para três perfis de utilizador: cliente, prestador e administrador. O cliente pode pesquisar serviços, guardar favoritos, enviar mensagens, pedir contrapropostas, agendar serviços e avaliar prestadores. O prestador pode criar e gerir serviços, consultar pedidos recebidos, acompanhar avaliações e responder à atividade gerada pelos clientes. O administrador pode gerir utilizadores e serviços, incluindo ações como remover, suspender ou reativar contas.

## 2.1. Descrição do Produto final

O produto final é uma plataforma web funcional chamada Doorly. A aplicação permite que qualquer visitante consulte serviços disponíveis, pesquise por termos específicos e veja detalhes de cada serviço. Para aceder a funcionalidades privadas, como favoritos, mensagens, agendamentos ou avaliações, o utilizador precisa de iniciar sessão.

A interface foi desenhada para ser simples e direta. A página inicial apresenta uma barra de pesquisa, categorias principais e serviços em destaque. A página de serviços permite filtrar resultados por categoria, localização, preço e avaliação. A página de detalhe apresenta imagem, descrição, preço, localização, prestador, avaliações e botões para agendar, pedir contraproposta, enviar mensagem ou contactar.

O sistema distingue três tipos de conta:

- Cliente: pode pesquisar serviços, adicionar favoritos, comunicar com prestadores, pedir contrapropostas, agendar serviços e deixar avaliações.
- Prestador: pode publicar serviços, editar informações, ativar ou desativar serviços, consultar contrapropostas e acompanhar avaliações recebidas.
- Administrador: pode gerir utilizadores, serviços publicados, passwords e estado das contas.

A aplicação utiliza uma API própria em Node.js/Express. Esta API valida os pedidos recebidos, verifica permissões com base no tipo de utilizador, comunica com a base de dados PostgreSQL e devolve respostas ao frontend em formato JSON.

## 2.2. Requisitos funcionais

- O sistema deve permitir o registo de novos utilizadores como cliente ou prestador.
- O sistema deve permitir o início de sessão através de email e password.
- O sistema deve guardar as passwords de forma segura, utilizando hash.
- O sistema deve gerar um token JWT após o login para autenticar os pedidos seguintes.
- O sistema deve proteger páginas e rotas consoante o tipo de utilizador.
- O cliente deve conseguir consultar a lista pública de serviços.
- O cliente deve conseguir pesquisar serviços por texto, categoria, localização e preço.
- O cliente deve conseguir consultar a página de detalhe de um serviço.
- O cliente deve conseguir adicionar e remover serviços dos favoritos.
- O cliente deve conseguir enviar mensagens ao prestador de um serviço.
- O cliente deve conseguir pedir uma contraproposta, indicando detalhes, localização, data preferida, período, urgência, orçamento estimado e contacto.
- O cliente deve conseguir criar um agendamento para um serviço.
- O cliente deve conseguir consultar os seus agendamentos.
- O cliente deve conseguir avaliar um serviço com nota e comentário.
- O prestador deve conseguir criar novos serviços.
- O prestador deve conseguir editar serviços existentes.
- O prestador deve conseguir ativar ou desativar serviços.
- O prestador deve conseguir eliminar serviços próprios.
- O prestador deve conseguir consultar contrapropostas recebidas.
- O prestador deve conseguir alterar o estado das contrapropostas.
- O prestador deve conseguir consultar avaliações recebidas.
- O prestador deve conseguir consultar estatísticas como visualizações e pedidos.
- O administrador deve conseguir consultar todos os utilizadores.
- O administrador deve conseguir consultar os serviços publicados.
- O administrador deve conseguir remover serviços ou utilizadores.
- O administrador deve conseguir suspender e reativar utilizadores.
- O administrador deve conseguir redefinir passwords de utilizadores.
- O sistema deve permitir recuperação de password através de token.
- O sistema deve permitir atualização dos dados de perfil.
- O sistema deve permitir upload de imagem de perfil e imagem do serviço, com validação de formato e tamanho.

## 2.3. Modelo de Dados

A base de dados do Doorly foi organizada em várias tabelas relacionadas entre si. A tabela central é a tabela de utilizadores, pois clientes, prestadores e administradores são registados no mesmo local, diferenciados pelo campo `tipo`.

### Tabela `utilizadores`

Armazena os dados dos utilizadores da plataforma.

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id_utilizador` | BIGSERIAL | Chave primária do utilizador. |
| `nome` | TEXT | Nome do utilizador. |
| `email` | TEXT | Email único usado no login. |
| `password_hash` | TEXT | Password guardada de forma segura. |
| `tipo` | TEXT | Tipo de conta: cliente, prestador ou admin. |
| `data_registo` | TIMESTAMPTZ | Data de criação da conta. |
| `ativo` | BOOLEAN | Indica se a conta está ativa. |
| `reset_token` | TEXT | Token usado na recuperação de password. |
| `reset_expires` | TIMESTAMPTZ | Data de expiração do token. |
| `foto_perfil` | TEXT | URL da imagem de perfil. |
| `telefone` | TEXT | Contacto telefónico. |
| `localizacao` | TEXT | Localização do utilizador. |
| `profissao` | TEXT | Profissão ou área de atividade. |
| `descricao` | TEXT | Descrição do perfil. |
| `status` | TEXT | Estado administrativo: ativo ou banido. |
| `ban_reason` | TEXT | Motivo da suspensão. |
| `ban_until` | TIMESTAMPTZ | Data até à qual o utilizador fica suspenso. |
| `updated_at` | TIMESTAMPTZ | Data da última atualização. |

### Tabela `servicos`

Guarda os serviços publicados pelos prestadores.

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id_servico` | BIGSERIAL | Chave primária do serviço. |
| `id_prestador` | BIGINT | Chave estrangeira para `utilizadores`. |
| `titulo` | TEXT | Título do serviço. |
| `descricao` | TEXT | Descrição detalhada. |
| `categoria` | TEXT | Categoria do serviço. |
| `preco` | NUMERIC(10,2) | Preço do serviço. |
| `localizacao` | TEXT | Zona onde o serviço é prestado. |
| `data_publicacao` | TIMESTAMPTZ | Data de publicação. |
| `ativo` | BOOLEAN | Indica se o serviço está visível. |
| `imagem_url` | TEXT | URL da imagem do serviço. |

### Tabela `favoritos`

Regista os serviços guardados por cada cliente.

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id_favorito` | BIGSERIAL | Chave primária do favorito. |
| `id_cliente` | BIGINT | Chave estrangeira para `utilizadores`. |
| `id_servico` | BIGINT | Chave estrangeira para `servicos`. |
| `data_adicionado` | TIMESTAMPTZ | Data em que o serviço foi adicionado. |

Existe uma restrição única entre `id_cliente` e `id_servico` para impedir favoritos duplicados.

### Tabela `mensagens`

Guarda as mensagens trocadas entre clientes e prestadores.

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id_mensagem` | BIGSERIAL | Chave primária da mensagem. |
| `id_servico` | BIGINT | Serviço associado à conversa. |
| `id_remetente` | BIGINT | Utilizador que enviou a mensagem. |
| `id_destinatario` | BIGINT | Utilizador que recebeu a mensagem. |
| `conteudo` | TEXT | Texto da mensagem. |
| `data_envio` | TIMESTAMPTZ | Data e hora de envio. |

### Tabela `propostas`

Armazena pedidos de contraproposta feitos pelos clientes.

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id_orcamento` | BIGSERIAL | Chave primária da proposta. |
| `id_servico` | BIGINT | Serviço associado. |
| `id_cliente` | BIGINT | Cliente que pediu a proposta. |
| `id_prestador` | BIGINT | Prestador que recebe a proposta. |
| `detalhes` | TEXT | Descrição do pedido. |
| `localizacao` | TEXT | Local onde o serviço será realizado. |
| `data_preferida` | DATE | Data pretendida pelo cliente. |
| `periodo` | TEXT | Período preferido. |
| `urgencia` | TEXT | Grau de urgência. |
| `orcamento_estimado` | NUMERIC(10,2) | Valor estimado pelo cliente. |
| `contacto` | TEXT | Contacto indicado pelo cliente. |
| `estado` | TEXT | Estado da proposta. |
| `id_mensagem` | BIGINT | Mensagem associada à proposta. |
| `data_pedido` | TIMESTAMPTZ | Data do pedido. |

### Tabela `avaliacoes`

Guarda avaliações feitas pelos clientes aos serviços.

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id_avaliacao` | BIGSERIAL | Chave primária da avaliação. |
| `id_servico` | BIGINT | Serviço avaliado. |
| `id_cliente` | BIGINT | Cliente que avaliou. |
| `nota` | INTEGER | Nota entre 1 e 5. |
| `comentario` | TEXT | Comentário do cliente. |
| `data` | TIMESTAMPTZ | Data da avaliação. |

### Tabela `agendamentos`

Guarda marcações de serviços entre clientes e prestadores.

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | BIGSERIAL | Chave primária do agendamento. |
| `servico_id` | BIGINT | Serviço agendado. |
| `cliente_id` | BIGINT | Cliente que criou o agendamento. |
| `prestador_id` | BIGINT | Prestador responsável. |
| `data_agendada` | DATE | Data do serviço. |
| `hora_inicio` | TIME | Hora de início. |
| `hora_fim` | TIME | Hora de fim. |
| `estado` | TEXT | Estado: pendente, aceite, rejeitado, concluído ou cancelado. |
| `descricao` | TEXT | Informação adicional do cliente. |
| `observacoes_prestador` | TEXT | Observações do prestador. |
| `created_at` | TIMESTAMPTZ | Data de criação. |
| `updated_at` | TIMESTAMPTZ | Data de atualização. |

### Tabela `historico_servicos`

Regista serviços concluídos para consulta posterior.

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id_historico` | BIGSERIAL | Chave primária do histórico. |
| `id_servico` | BIGINT | Serviço concluído. |
| `id_cliente` | BIGINT | Cliente associado. |
| `id_prestador` | BIGINT | Prestador associado. |
| `data_conclusao` | TIMESTAMPTZ | Data de conclusão. |
| `detalhes` | TEXT | Detalhes do serviço concluído. |

### Tabela `estatisticas`

Guarda dados estatísticos dos serviços.

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id_estatistica` | BIGSERIAL | Chave primária da estatística. |
| `id_servico` | BIGINT | Serviço associado. |
| `visualizacoes` | INTEGER | Número de visualizações do serviço. |
| `pedidos` | INTEGER | Número de pedidos recebidos. |
| `ultima_atualizacao` | TIMESTAMPTZ | Data da última atualização. |

### Tabela `admin_logs`

Regista ações administrativas importantes.

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | BIGSERIAL | Chave primária do log. |
| `admin_id` | BIGINT | Administrador que realizou a ação. |
| `action` | TEXT | Ação executada. |
| `target_user_id` | BIGINT | Utilizador afetado pela ação. |
| `details` | TEXT | Detalhes adicionais. |
| `created_at` | TIMESTAMPTZ | Data da ação. |

## 2.4. Interface de utilização

A interface do Doorly foi criada com o objetivo de ser clara, moderna e fácil de utilizar. A navegação principal permite aceder rapidamente à página inicial, serviços, login, registo e áreas privadas, dependendo do tipo de utilizador autenticado.

Na página inicial, o utilizador encontra uma apresentação da plataforma, uma barra de pesquisa e uma lista de categorias de serviços. Esta página permite perceber rapidamente a finalidade do Doorly e iniciar a procura por um serviço.

Na página de serviços, os resultados são apresentados em cartões com imagem, título, preço, localização, categoria, prestador e avaliação. O utilizador pode aplicar filtros por categoria, localização, preço e avaliação mínima. Esta organização facilita a comparação entre diferentes serviços.

Na página de detalhe do serviço, são mostradas informações mais completas: imagem principal, descrição, preço, localização, categoria, prestador, avaliações e botões de ação. A partir desta página, o cliente pode agendar o serviço, pedir uma contraproposta, enviar mensagem, contactar o prestador ou adicionar o serviço aos favoritos.

A página de login permite ao utilizador entrar com email e password. Após autenticação, o sistema guarda o token JWT e utiliza-o para aceder às funcionalidades protegidas.

A página de registo permite criar uma nova conta como cliente ou prestador. Esta distinção é importante porque cada tipo de utilizador tem permissões diferentes dentro da aplicação.

A página de perfil permite ao utilizador atualizar dados pessoais, como nome, telefone, localização, profissão, descrição e imagem de perfil. Também é possível alterar a password.

A área de favoritos permite ao cliente consultar os serviços que guardou para acesso rápido.

A área de mensagens permite a comunicação entre cliente e prestador no contexto de um serviço específico. Existe uma caixa de entrada e uma página de conversa.

A página de agendamentos permite ao cliente consultar marcações e ao prestador acompanhar pedidos relacionados com os seus serviços.

O dashboard do prestador permite gerir serviços publicados. O prestador pode criar, editar, ativar, desativar e eliminar serviços, além de consultar contrapropostas, avaliações, visualizações e pedidos.

O painel administrativo permite gerir a plataforma de forma centralizada. O administrador consegue consultar utilizadores, separar clientes e prestadores, remover serviços, remover utilizadores, suspender contas, reativar contas e redefinir passwords.

## 2.5. Desenvolvimento do projeto

O desenvolvimento começou pela definição da estrutura geral do projeto, separando o frontend do backend. Esta opção facilitou a organização do código, porque a interface ficou numa aplicação React e a lógica do servidor ficou numa API Node.js/Express.

No backend, a implementação foi organizada por camadas: rotas, controladores, serviços, repositórios, validadores, middleware e configuração. Esta separação tornou o código mais fácil de manter. As rotas recebem os pedidos HTTP, os controladores encaminham a ação, os serviços aplicam regras de negócio e os repositórios comunicam com a base de dados.

Uma das primeiras funcionalidades implementadas foi a autenticação. O sistema permite registo e login, utilizando bcrypt para guardar passwords de forma segura e JWT para autenticar pedidos. Esta escolha foi importante porque permite proteger rotas privadas, como perfil, favoritos, mensagens, agendamentos, dashboard do prestador e painel administrativo.

De seguida foi implementada a gestão de serviços. Os prestadores podem criar serviços com título, descrição, categoria, preço, localização e imagem. Também podem editar, ativar, desativar ou eliminar os seus próprios serviços. Para garantir segurança, o backend verifica se o utilizador autenticado tem permissão para alterar o serviço.

A pesquisa e listagem de serviços foram desenvolvidas para permitir consulta pública da plataforma. No frontend, os serviços são apresentados em cartões e podem ser filtrados por texto, categoria, localização, preço e avaliação. Esta opção melhora a experiência do utilizador e torna a navegação mais rápida.

Depois foram implementadas funcionalidades de interação entre cliente e prestador. O cliente pode adicionar favoritos, enviar mensagens, pedir contrapropostas e criar agendamentos. No caso das contrapropostas, o sistema cria o pedido e também gera uma mensagem associada, permitindo que o prestador receba o contacto com contexto.

A funcionalidade de avaliações foi criada para permitir feedback dos clientes. Cada avaliação guarda uma nota e comentário, ficando associada ao serviço e ao cliente. O sistema também apresenta média de avaliação e número total de avaliações.

Posteriormente foi desenvolvida a área administrativa. Esta área foi protegida para utilizadores do tipo administrador e permite consultar utilizadores, gerir serviços, suspender contas, reativar contas, eliminar registos e redefinir passwords.

Durante o desenvolvimento foram tomadas algumas decisões importantes:

- Usar React no frontend, por facilitar a criação de componentes reutilizáveis e páginas dinâmicas.
- Usar Node.js e Express no backend, por serem adequados para construir APIs REST de forma simples.
- Usar PostgreSQL/Supabase como base de dados, por permitir guardar dados relacionais e criar ligações entre utilizadores, serviços, mensagens e pedidos.
- Separar o código do backend em serviços e repositórios, para evitar concentrar toda a lógica nas rotas.
- Usar JWT para autenticação, por ser uma solução simples e compatível com aplicações web.
- Utilizar validações no backend, para evitar dados inválidos e melhorar a segurança da aplicação.

Uma alternativa seria desenvolver a aplicação com backend e frontend no mesmo projeto, mas a separação escolhida tornou o código mais organizado e aproximou o projeto de uma arquitetura usada em aplicações reais. A principal desvantagem desta abordagem é exigir mais configuração, especialmente na ligação entre frontend, backend, CORS e variáveis de ambiente.

## 3. Conclusões e trabalho futuro

O projeto Doorly permitiu desenvolver uma plataforma web funcional para procura e oferta de serviços. Os principais objetivos definidos inicialmente foram alcançados, nomeadamente a criação de contas com diferentes permissões, a publicação e pesquisa de serviços, a comunicação entre cliente e prestador, os favoritos, as contrapropostas, os agendamentos, as avaliações e a existência de uma área administrativa.

Ao longo do projeto foram aplicados conhecimentos importantes de desenvolvimento web, como criação de interfaces em React, comunicação com APIs, autenticação por JWT, proteção de rotas, ligação a base de dados PostgreSQL, organização de código em camadas e validação de dados. O projeto também permitiu perceber melhor a importância de planear a estrutura antes de começar a programar.

Uma das principais dificuldades sentidas foi a integração entre frontend, backend e base de dados. Foi necessário garantir que os dados enviados pela interface correspondiam ao que o backend esperava e que as respostas da API eram tratadas corretamente no frontend. Também foi necessário gerir permissões diferentes para clientes, prestadores e administradores.

Outra dificuldade foi manter a interface simples enquanto se adicionavam várias funcionalidades. Como o Doorly tem páginas para serviços, mensagens, favoritos, agendamentos, perfil, dashboard e administração, foi importante organizar a navegação para que o utilizador encontrasse facilmente o que precisava.

Apesar das dificuldades, o resultado final é um protótipo funcional e com potencial de evolução. A plataforma pode ser útil tanto para clientes que procuram serviços de forma rápida como para prestadores que pretendem divulgar o seu trabalho.

Como trabalho futuro, poderiam ser desenvolvidas as seguintes melhorias:

- Implementar notificações em tempo real para mensagens, agendamentos e propostas.
- Melhorar o sistema de verificação de prestadores.
- Criar um sistema de pagamento integrado.
- Adicionar localização por mapa.
- Criar filtros mais avançados por disponibilidade e distância.
- Melhorar a área de histórico de serviços concluídos.
- Criar testes automatizados para backend e frontend.
- Melhorar a versão mobile da interface.
- Implementar confirmação por email no registo de utilizadores.
- Adicionar relatórios estatísticos mais completos para prestadores e administradores.

Conclui-se que o Doorly cumpriu os objetivos principais definidos para o projeto e demonstra uma aplicação prática dos conhecimentos adquiridos ao longo do curso.

## 4. Anexos - Manual do utilizador

### Aceder à plataforma

O utilizador deve abrir a aplicação Doorly no navegador. A página inicial apresenta uma barra de pesquisa, categorias de serviços e serviços em destaque.

### Criar conta

Para criar conta, o utilizador deve clicar em registar, preencher nome, email, password e escolher o tipo de conta: cliente ou prestador. Depois de concluir o registo, poderá iniciar sessão.

### Iniciar sessão

O utilizador deve aceder à página de login, inserir email e password e confirmar. Se os dados estiverem corretos, será redirecionado para a aplicação com acesso às funcionalidades correspondentes ao seu tipo de conta.

### Pesquisar serviços

Na página inicial ou na página de serviços, o utilizador pode escrever uma palavra-chave, como "limpeza" ou "canalização". Também pode aplicar filtros por categoria, localização, preço e avaliação.

### Consultar um serviço

Ao clicar num serviço, o utilizador acede à página de detalhe. Nesta página pode consultar descrição, preço, categoria, localização, prestador, avaliações e ações disponíveis.

### Adicionar favorito

Um cliente autenticado pode clicar no ícone de favorito para guardar um serviço. O serviço ficará disponível na página de favoritos.

### Pedir contraproposta

Na página de detalhe do serviço, o cliente pode clicar em "Pedir contraproposta" e preencher os dados do pedido, como detalhes, localização, data preferida, urgência, orçamento estimado e contacto.

### Enviar mensagem

O cliente pode enviar uma mensagem ao prestador através da página de detalhe do serviço. As conversas ficam disponíveis na caixa de mensagens.

### Agendar serviço

O cliente pode clicar em "Agendar serviço", escolher a data, hora de início, hora de fim e adicionar uma descrição. O agendamento fica registado com estado inicial pendente.

### Avaliar serviço

Na página de detalhe do serviço, um cliente autenticado pode atribuir uma nota de 1 a 5 e escrever um comentário. A avaliação fica associada ao serviço.

### Gerir perfil

Na página de perfil, o utilizador pode atualizar nome, telefone, localização, profissão, descrição, fotografia e password.

### Área do prestador

O prestador deve aceder ao dashboard para criar e gerir serviços. Pode adicionar título, descrição, categoria, preço, localização e imagem. Também pode editar, ativar, desativar ou eliminar serviços.

### Consultar contrapropostas e avaliações

No dashboard, o prestador pode consultar contrapropostas recebidas e avaliações deixadas pelos clientes. Também pode alterar o estado das contrapropostas.

### Área administrativa

O administrador pode aceder ao painel administrativo para consultar utilizadores e serviços. A partir desta área pode remover utilizadores, remover serviços, suspender contas, reativar contas e redefinir passwords.
