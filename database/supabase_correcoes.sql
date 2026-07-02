-- Correções idempotentes para alinhar a base de dados Doorly com o código atual em Supabase/PostgreSQL.
-- Executar no SQL Editor do Supabase depois do schema base, especialmente se a origem veio de um dump MySQL.

CREATE TABLE IF NOT EXISTS utilizadores (
  id_utilizador BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'cliente' CHECK (tipo IN ('cliente', 'prestador', 'admin')),
  data_registo TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  reset_token TEXT,
  reset_expires TIMESTAMPTZ,
  foto_perfil TEXT,
  telefone TEXT,
  localizacao TEXT,
  profissao TEXT,
  descricao TEXT,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'banido')),
  ban_reason TEXT,
  ban_until TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE utilizadores ADD COLUMN IF NOT EXISTS foto_perfil TEXT;
ALTER TABLE utilizadores ADD COLUMN IF NOT EXISTS telefone TEXT;
ALTER TABLE utilizadores ADD COLUMN IF NOT EXISTS localizacao TEXT;
ALTER TABLE utilizadores ADD COLUMN IF NOT EXISTS profissao TEXT;
ALTER TABLE utilizadores ADD COLUMN IF NOT EXISTS descricao TEXT;
ALTER TABLE utilizadores ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'ativo';
ALTER TABLE utilizadores ADD COLUMN IF NOT EXISTS ban_reason TEXT;
ALTER TABLE utilizadores ADD COLUMN IF NOT EXISTS ban_until TIMESTAMPTZ;
ALTER TABLE utilizadores ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE utilizadores ADD COLUMN IF NOT EXISTS reset_token TEXT;
ALTER TABLE utilizadores ADD COLUMN IF NOT EXISTS reset_expires TIMESTAMPTZ;
ALTER TABLE utilizadores ADD COLUMN IF NOT EXISTS ativo BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE utilizadores
  ALTER COLUMN ativo TYPE BOOLEAN
  USING CASE WHEN ativo::TEXT IN ('1', 'true', 't', 'yes') THEN TRUE ELSE FALSE END;

CREATE TABLE IF NOT EXISTS servicos (
  id_servico BIGSERIAL PRIMARY KEY,
  id_prestador BIGINT NOT NULL REFERENCES utilizadores(id_utilizador) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  categoria TEXT NOT NULL,
  preco NUMERIC(10,2) NOT NULL CHECK (preco >= 0),
  localizacao TEXT,
  data_publicacao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  imagem_url TEXT
);

ALTER TABLE servicos ADD COLUMN IF NOT EXISTS imagem_url TEXT;
ALTER TABLE servicos ADD COLUMN IF NOT EXISTS ativo BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE servicos
  ALTER COLUMN ativo TYPE BOOLEAN
  USING CASE WHEN ativo::TEXT IN ('1', 'true', 't', 'yes') THEN TRUE ELSE FALSE END;

CREATE TABLE IF NOT EXISTS estatisticas (
  id_estatistica BIGSERIAL PRIMARY KEY,
  id_servico BIGINT NOT NULL UNIQUE REFERENCES servicos(id_servico) ON DELETE CASCADE,
  visualizacoes INTEGER NOT NULL DEFAULT 0,
  pedidos INTEGER NOT NULL DEFAULT 0,
  ultima_atualizacao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS favoritos (
  id_favorito BIGSERIAL PRIMARY KEY,
  id_cliente BIGINT NOT NULL REFERENCES utilizadores(id_utilizador) ON DELETE CASCADE,
  id_servico BIGINT NOT NULL REFERENCES servicos(id_servico) ON DELETE CASCADE,
  data_adicionado TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uk_favoritos_cliente_servico UNIQUE (id_cliente, id_servico)
);

CREATE TABLE IF NOT EXISTS mensagens (
  id_mensagem BIGSERIAL PRIMARY KEY,
  id_servico BIGINT NOT NULL REFERENCES servicos(id_servico) ON DELETE CASCADE,
  id_remetente BIGINT NOT NULL REFERENCES utilizadores(id_utilizador) ON DELETE CASCADE,
  id_destinatario BIGINT NOT NULL REFERENCES utilizadores(id_utilizador) ON DELETE CASCADE,
  conteudo TEXT NOT NULL,
  data_envio TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'mensagens' AND column_name = 'idmensagens'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'mensagens' AND column_name = 'id_mensagem'
  ) THEN
    ALTER TABLE mensagens RENAME COLUMN idmensagens TO id_mensagem;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS propostas (
  id_orcamento BIGSERIAL PRIMARY KEY,
  id_servico BIGINT NOT NULL REFERENCES servicos(id_servico) ON DELETE CASCADE,
  id_cliente BIGINT NOT NULL REFERENCES utilizadores(id_utilizador) ON DELETE CASCADE,
  id_prestador BIGINT NOT NULL REFERENCES utilizadores(id_utilizador) ON DELETE CASCADE,
  detalhes TEXT NOT NULL,
  localizacao TEXT,
  data_preferida DATE,
  periodo TEXT,
  urgencia TEXT,
  orcamento_estimado NUMERIC(10,2),
  contacto TEXT,
  estado TEXT NOT NULL DEFAULT 'novo',
  id_mensagem BIGINT REFERENCES mensagens(id_mensagem) ON DELETE SET NULL,
  data_pedido TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS avaliacoes (
  id_avaliacao BIGSERIAL PRIMARY KEY,
  id_servico BIGINT NOT NULL REFERENCES servicos(id_servico) ON DELETE CASCADE,
  id_cliente BIGINT NOT NULL REFERENCES utilizadores(id_utilizador) ON DELETE CASCADE,
  nota INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario TEXT NOT NULL,
  data TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uk_avaliacoes_servico_cliente UNIQUE (id_servico, id_cliente)
);

CREATE TABLE IF NOT EXISTS agendamentos (
  id BIGSERIAL PRIMARY KEY,
  servico_id BIGINT NOT NULL REFERENCES servicos(id_servico) ON DELETE CASCADE,
  cliente_id BIGINT NOT NULL REFERENCES utilizadores(id_utilizador) ON DELETE CASCADE,
  prestador_id BIGINT NOT NULL REFERENCES utilizadores(id_utilizador) ON DELETE CASCADE,
  data_agendada DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendente' CHECK (estado IN ('pendente', 'aceite', 'rejeitado', 'concluido', 'cancelado')),
  estado_pagamento TEXT NOT NULL DEFAULT 'aguarda_pagamento' CHECK (estado_pagamento IN ('aguarda_pagamento', 'pago', 'pagamento_falhado')),
  pagamento_referencia TEXT,
  pago_em TIMESTAMPTZ,
  descricao TEXT,
  observacoes_prestador TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE agendamentos ADD COLUMN IF NOT EXISTS estado_pagamento TEXT NOT NULL DEFAULT 'aguarda_pagamento';
ALTER TABLE agendamentos ADD COLUMN IF NOT EXISTS pagamento_referencia TEXT;
ALTER TABLE agendamentos ADD COLUMN IF NOT EXISTS pago_em TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'agendamentos_estado_pagamento_check'
  ) THEN
    ALTER TABLE agendamentos
      ADD CONSTRAINT agendamentos_estado_pagamento_check
      CHECK (estado_pagamento IN ('aguarda_pagamento', 'pago', 'pagamento_falhado'));
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS historico_servicos (
  id_historico BIGSERIAL PRIMARY KEY,
  id_servico BIGINT NOT NULL REFERENCES servicos(id_servico) ON DELETE CASCADE,
  id_cliente BIGINT NOT NULL REFERENCES utilizadores(id_utilizador) ON DELETE CASCADE,
  id_prestador BIGINT NOT NULL REFERENCES utilizadores(id_utilizador) ON DELETE CASCADE,
  data_conclusao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  detalhes TEXT
);

CREATE TABLE IF NOT EXISTS admin_logs (
  id BIGSERIAL PRIMARY KEY,
  admin_id BIGINT REFERENCES utilizadores(id_utilizador) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_user_id BIGINT REFERENCES utilizadores(id_utilizador) ON DELETE SET NULL,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_servicos_prestador ON servicos(id_prestador);
CREATE INDEX IF NOT EXISTS idx_mensagens_thread ON mensagens(id_servico, id_remetente, id_destinatario, data_envio);
CREATE INDEX IF NOT EXISTS idx_propostas_cliente ON propostas(id_cliente, data_pedido);
CREATE INDEX IF NOT EXISTS idx_propostas_prestador ON propostas(id_prestador, data_pedido);
CREATE INDEX IF NOT EXISTS idx_agendamentos_cliente ON agendamentos(cliente_id, data_agendada);
CREATE INDEX IF NOT EXISTS idx_agendamentos_prestador ON agendamentos(prestador_id, data_agendada);

-- O código atual não usa uma tabela de notificações. Se essa funcionalidade for adicionada, criar a tabela antes de chamar queries novas.
