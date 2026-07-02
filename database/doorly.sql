-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.utilizadores (
  id_utilizador integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  nome character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  password_hash character varying NOT NULL,
  tipo USER-DEFINED NOT NULL DEFAULT 'cliente'::tipo_utilizador,
  data_registo timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  ativo boolean DEFAULT true,
  reset_token character varying,
  reset_expires timestamp without time zone,
  status USER-DEFINED DEFAULT 'ativo'::status_utilizador,
  ban_reason text,
  ban_until timestamp without time zone,
  foto_perfil text,
  descricao text,
  telefone character varying,
  localizacao character varying,
  profissao character varying,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT utilizadores_pkey PRIMARY KEY (id_utilizador)
);
CREATE TABLE public.admin_logs (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  admin_id integer,
  action character varying,
  target_user_id integer,
  details text,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT admin_logs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.servicos (
  id_servico integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_prestador integer NOT NULL,
  titulo character varying NOT NULL,
  descricao text NOT NULL,
  categoria character varying NOT NULL,
  preco numeric NOT NULL,
  localizacao character varying,
  data_publicacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  ativo boolean DEFAULT true,
  imagem_url text,
  CONSTRAINT servicos_pkey PRIMARY KEY (id_servico),
  CONSTRAINT fk_servicos_prestador FOREIGN KEY (id_prestador) REFERENCES public.utilizadores(id_utilizador)
);
CREATE TABLE public.mensagens (
  id_mensagem integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_servico integer NOT NULL,
  id_remetente integer NOT NULL,
  id_destinatario integer NOT NULL,
  conteudo text NOT NULL,
  data_envio timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT mensagens_pkey PRIMARY KEY (id_mensagem),
  CONSTRAINT mensagens_id_servico_fkey FOREIGN KEY (id_servico) REFERENCES public.servicos(id_servico),
  CONSTRAINT mensagens_id_remetente_fkey FOREIGN KEY (id_remetente) REFERENCES public.utilizadores(id_utilizador),
  CONSTRAINT mensagens_id_destinatario_fkey FOREIGN KEY (id_destinatario) REFERENCES public.utilizadores(id_utilizador)
);
CREATE TABLE public.favoritos (
  id_favorito integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_cliente integer NOT NULL,
  id_servico integer NOT NULL,
  data_adicionado timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT favoritos_pkey PRIMARY KEY (id_favorito),
  CONSTRAINT favoritos_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.utilizadores(id_utilizador),
  CONSTRAINT favoritos_id_servico_fkey FOREIGN KEY (id_servico) REFERENCES public.servicos(id_servico)
);
CREATE TABLE public.avaliacoes (
  id_avaliacao integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_servico integer NOT NULL,
  id_cliente integer NOT NULL,
  nota smallint NOT NULL,
  comentario text,
  data timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT avaliacoes_pkey PRIMARY KEY (id_avaliacao),
  CONSTRAINT avaliacoes_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.utilizadores(id_utilizador),
  CONSTRAINT avaliacoes_id_servico_fkey FOREIGN KEY (id_servico) REFERENCES public.servicos(id_servico)
);
CREATE TABLE public.estatisticas (
  id_estatistica integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_servico integer NOT NULL,
  visualizacoes integer DEFAULT 0,
  pedidos integer DEFAULT 0,
  ultima_atualizacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT estatisticas_pkey PRIMARY KEY (id_estatistica),
  CONSTRAINT estatisticas_id_servico_fkey FOREIGN KEY (id_servico) REFERENCES public.servicos(id_servico)
);
CREATE TABLE public.propostas (
  id_orcamento integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_servico integer NOT NULL,
  id_cliente integer NOT NULL,
  id_prestador integer NOT NULL,
  detalhes text NOT NULL,
  localizacao character varying,
  data_preferida date,
  periodo character varying,
  urgencia character varying,
  orcamento_estimado numeric,
  contacto character varying,
  estado character varying DEFAULT 'novo'::character varying,
  id_mensagem integer,
  data_pedido timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT propostas_pkey PRIMARY KEY (id_orcamento),
  CONSTRAINT propostas_id_servico_fkey FOREIGN KEY (id_servico) REFERENCES public.servicos(id_servico),
  CONSTRAINT propostas_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.utilizadores(id_utilizador),
  CONSTRAINT propostas_id_prestador_fkey FOREIGN KEY (id_prestador) REFERENCES public.utilizadores(id_utilizador)
);
CREATE TABLE public.historico_servicos (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  cliente_id integer NOT NULL,
  prestador_id integer NOT NULL,
  servico_id integer NOT NULL,
  estado character varying DEFAULT 'concluido'::character varying,
  data_conclusao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT historico_servicos_pkey PRIMARY KEY (id),
  CONSTRAINT historico_servicos_servico_id_fkey FOREIGN KEY (servico_id) REFERENCES public.servicos(id_servico),
  CONSTRAINT historico_servicos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.utilizadores(id_utilizador),
  CONSTRAINT historico_servicos_prestador_id_fkey FOREIGN KEY (prestador_id) REFERENCES public.utilizadores(id_utilizador)
);
CREATE TABLE public.agendamentos (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  cliente_id integer NOT NULL,
  prestador_id integer NOT NULL,
  servico_id integer NOT NULL,
  data_agendada date NOT NULL,
  hora_inicio time without time zone NOT NULL,
  hora_fim time without time zone,
  estado character varying DEFAULT 'pendente'::character varying CHECK (estado::text = ANY (ARRAY['pendente'::character varying, 'aceite'::character varying, 'rejeitado'::character varying, 'concluido'::character varying, 'cancelado'::character varying]::text[])),
  estado_pagamento character varying DEFAULT 'aguarda_pagamento'::character varying CHECK (estado_pagamento::text = ANY (ARRAY['aguarda_pagamento'::character varying, 'pago'::character varying, 'pagamento_falhado'::character varying]::text[])),
  pagamento_referencia text,
  pago_em timestamp without time zone,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  descricao text,
  observacoes_prestador text,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT agendamentos_pkey PRIMARY KEY (id),
  CONSTRAINT agendamentos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.utilizadores(id_utilizador),
  CONSTRAINT agendamentos_prestador_id_fkey FOREIGN KEY (prestador_id) REFERENCES public.utilizadores(id_utilizador),
  CONSTRAINT agendamentos_servico_id_fkey FOREIGN KEY (servico_id) REFERENCES public.servicos(id_servico)
);
