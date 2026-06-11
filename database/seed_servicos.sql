-- Seed PostgreSQL/Supabase para dados de teste coerentes com o backend atual.

INSERT INTO utilizadores (nome, email, password_hash, tipo, ativo, status)
VALUES
  ('Maria Prestadora', 'prestador@doorly.pt', '$2b$10$Oe5BNIPo1ctcLEz23PpC.eu6T.TGdwWCg.o0K5CfRs4LUokX7FSuK', 'prestador', true, 'ativo'),
  ('Aurora Limpa', 'aurora.limpa@doorly.pt', '$2b$10$Oe5BNIPo1ctcLEz23PpC.eu6T.TGdwWCg.o0K5CfRs4LUokX7FSuK', 'prestador', true, 'ativo'),
  ('Volt & Casa', 'volt.casa@doorly.pt', '$2b$10$Oe5BNIPo1ctcLEz23PpC.eu6T.TGdwWCg.o0K5CfRs4LUokX7FSuK', 'prestador', true, 'ativo'),
  ('Atelier Verde Vivo', 'atelier.verde@doorly.pt', '$2b$10$Oe5BNIPo1ctcLEz23PpC.eu6T.TGdwWCg.o0K5CfRs4LUokX7FSuK', 'prestador', true, 'ativo'),
  ('MobiFix Studio', 'mobifix@doorly.pt', '$2b$10$Oe5BNIPo1ctcLEz23PpC.eu6T.TGdwWCg.o0K5CfRs4LUokX7FSuK', 'prestador', true, 'ativo'),
  ('Noa Bento Fotos', 'noa.fotos@doorly.pt', '$2b$10$Oe5BNIPo1ctcLEz23PpC.eu6T.TGdwWCg.o0K5CfRs4LUokX7FSuK', 'prestador', true, 'ativo'),
  ('FitLab Bairro', 'fitlab@doorly.pt', '$2b$10$Oe5BNIPo1ctcLEz23PpC.eu6T.TGdwWCg.o0K5CfRs4LUokX7FSuK', 'prestador', true, 'ativo'),
  ('Chef Lia Marmitas', 'chef.lia@doorly.pt', '$2b$10$Oe5BNIPo1ctcLEz23PpC.eu6T.TGdwWCg.o0K5CfRs4LUokX7FSuK', 'prestador', true, 'ativo'),
  ('BiciLab Lisboa', 'bicilab@doorly.pt', '$2b$10$Oe5BNIPo1ctcLEz23PpC.eu6T.TGdwWCg.o0K5CfRs4LUokX7FSuK', 'prestador', true, 'ativo'),
  ('Oficina Circular', 'circular@doorly.pt', '$2b$10$Oe5BNIPo1ctcLEz23PpC.eu6T.TGdwWCg.o0K5CfRs4LUokX7FSuK', 'prestador', true, 'ativo'),
  ('Sono & Rotina Kids', 'sono.kids@doorly.pt', '$2b$10$Oe5BNIPo1ctcLEz23PpC.eu6T.TGdwWCg.o0K5CfRs4LUokX7FSuK', 'prestador', true, 'ativo'),
  ('Pet Radar', 'pet.radar@doorly.pt', '$2b$10$Oe5BNIPo1ctcLEz23PpC.eu6T.TGdwWCg.o0K5CfRs4LUokX7FSuK', 'prestador', true, 'ativo'),
  ('Cliente Demo Sofia', 'cliente.sofia@doorly.pt', '$2b$10$Oe5BNIPo1ctcLEz23PpC.eu6T.TGdwWCg.o0K5CfRs4LUokX7FSuK', 'cliente', true, 'ativo'),
  ('Cliente Demo Tiago', 'cliente.tiago@doorly.pt', '$2b$10$Oe5BNIPo1ctcLEz23PpC.eu6T.TGdwWCg.o0K5CfRs4LUokX7FSuK', 'cliente', true, 'ativo'),
  ('Cliente Demo Ines', 'cliente.ines@doorly.pt', '$2b$10$Oe5BNIPo1ctcLEz23PpC.eu6T.TGdwWCg.o0K5CfRs4LUokX7FSuK', 'cliente', true, 'ativo')
ON CONFLICT (email) DO NOTHING;

INSERT INTO servicos (id_prestador, titulo, descricao, categoria, preco, localizacao, ativo, imagem_url)
SELECT u.id_utilizador, s.titulo, s.descricao, s.categoria, s.preco, s.localizacao, true, s.imagem_url
FROM (
  VALUES
    ('aurora.limpa@doorly.pt', 'Limpeza profunda de apartamentos', 'Limpeza completa para apartamentos T0 a T3, incluindo cozinha, casas de banho, vidros interiores e zonas comuns. Ideal para mudanças, pós-obra ligeira ou manutenção mensal.', 'Limpeza', 55.00, 'Lisboa', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop'),
    ('prestador@doorly.pt', 'Canalização e reparação de fugas', 'Diagnóstico e reparação de fugas, torneiras, autoclismos, sifões e pequenas instalações. Atendimento rápido para problemas domésticos urgentes.', 'Canalização', 35.00, 'Oeiras', 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=1200&auto=format&fit=crop'),
    ('volt.casa@doorly.pt', 'Eletricista para pequenas reparações', 'Substituição de tomadas, interruptores, candeeiros, disjuntores e resolução de avarias simples em habitações e pequenos negócios.', 'Eletricidade', 40.00, 'Amadora', 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1200&auto=format&fit=crop'),
    ('atelier.verde@doorly.pt', 'Pintura interior por divisão', 'Pintura de quartos, salas e corredores com preparação básica de paredes, proteção de móveis e acabamento limpo. Tintas sob contraproposta.', 'Pintura', 85.00, 'Sintra', 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=1200&auto=format&fit=crop'),
    ('atelier.verde@doorly.pt', 'Jardinagem e manutenção de exteriores', 'Corte de relva, poda ligeira, limpeza de canteiros, manutenção de vasos e organização de pequenos jardins ou terraços.', 'Jardinagem', 45.00, 'Cascais', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1200&auto=format&fit=crop'),
    ('prestador@doorly.pt', 'Explicações de matemática', 'Apoio individual a alunos do 2 ciclo, 3 ciclo e secundário, com preparação para testes, exames e recuperação de bases.', 'Explicações', 22.50, 'Lisboa', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop'),
    ('mobifix@doorly.pt', 'Montagem de móveis e prateleiras', 'Montagem de móveis, camas, mesas, estantes e instalação de prateleiras. Inclui ferramentas e verificação final de estabilidade.', 'Reparações', 30.00, 'Almada', 'https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?q=80&w=1200&auto=format&fit=crop'),
    ('mobifix@doorly.pt', 'Mudanças locais com carrinha', 'Transporte de caixas, pequenos móveis e eletrodomésticos em mudanças dentro da mesma zona. Possibilidade de ajuda nas cargas.', 'Mudanças', 65.00, 'Setúbal', 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?q=80&w=1200&auto=format&fit=crop'),
    ('noa.fotos@doorly.pt', 'Fotografia para eventos pequenos', 'Cobertura fotográfica de aniversários, batizados, eventos familiares e sessões informais. Entrega digital das melhores fotografias editadas.', 'Fotografia', 120.00, 'Lisboa', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop'),
    ('fitlab@doorly.pt', 'Personal trainer ao domicílio', 'Treinos personalizados para perda de peso, tonificação ou mobilidade, adaptados ao nível físico e objetivos de cada cliente.', 'Fitness', 28.00, 'Odivelas', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop'),
    ('volt.casa@doorly.pt', 'Setup de casa inteligente', 'Instalação e configuração de luzes, sensores, assistentes de voz e rotinas simples para tornar a casa mais automatizada sem obras.', 'Domótica', 48.00, 'Lisboa', 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1200&auto=format&fit=crop'),
    ('chef.lia@doorly.pt', 'Marmitas semanais com plano flexível', 'Planeamento e preparação de marmitas saudáveis para a semana, com opções vegetarianas, alta proteína ou conforto caseiro.', 'Cozinha', 75.00, 'Lisboa', 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1200&auto=format&fit=crop'),
    ('pet.radar@doorly.pt', 'Pet sitting com relatório fotográfico', 'Visitas a casa para alimentação, passeio curto, companhia e envio de fotografias ao longo do dia para tutores que querem tranquilidade.', 'Pets', 18.00, 'Cascais', 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1200&auto=format&fit=crop'),
    ('bicilab@doorly.pt', 'Reparação de bicicletas urbanas', 'Afinação de travões, mudanças, furos e revisão rápida para bicicletas de cidade, dobráveis e elétricas leves.', 'Mobilidade', 32.00, 'Lisboa', 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1200&auto=format&fit=crop'),
    ('circular@doorly.pt', 'Guarda-roupa circular e segunda vida', 'Sessão para reorganizar roupa, criar combinações, separar peças para venda/doação e reduzir compras por impulso.', 'Sustentabilidade', 42.00, 'Porto', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1200&auto=format&fit=crop'),
    ('sono.kids@doorly.pt', 'Rotinas de sono para bebés e crianças', 'Apoio a famílias na criação de rotinas suaves, horários realistas e estratégias consistentes para noites mais tranquilas.', 'Família', 60.00, 'Online', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1200&auto=format&fit=crop'),
    ('noa.fotos@doorly.pt', 'Mini estúdio para podcast em casa', 'Montagem de luz, som e enquadramento para gravar podcast, entrevistas remotas ou conteúdo profissional sem alugar estúdio.', 'Criatividade', 95.00, 'Lisboa', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1200&auto=format&fit=crop')
) AS s(email, titulo, descricao, categoria, preco, localizacao, imagem_url)
JOIN utilizadores u ON u.email = s.email
WHERE NOT EXISTS (SELECT 1 FROM servicos existing WHERE existing.titulo = s.titulo);

INSERT INTO estatisticas (id_servico, visualizacoes, pedidos)
SELECT s.id_servico, FLOOR(25 + random() * 220)::int, FLOOR(1 + random() * 18)::int
FROM servicos s
WHERE NOT EXISTS (SELECT 1 FROM estatisticas e WHERE e.id_servico = s.id_servico);

UPDATE estatisticas e
SET visualizacoes = GREATEST(e.visualizacoes, FLOOR(25 + random() * 220)::int),
    pedidos = GREATEST(e.pedidos, FLOOR(1 + random() * 18)::int),
    ultima_atualizacao = CURRENT_TIMESTAMP
FROM servicos s
WHERE s.id_servico = e.id_servico;

INSERT INTO avaliacoes (id_servico, id_cliente, nota, comentario)
SELECT s.id_servico, u.id_utilizador, r.nota, r.comentario
FROM (
  VALUES
    ('Limpeza profunda de apartamentos', 'cliente.sofia@doorly.pt', 5, 'Serviço muito bem organizado. O prestador explicou tudo com clareza e deixou o resultado melhor do que eu esperava.'),
    ('Jardinagem e manutenção de exteriores', 'cliente.tiago@doorly.pt', 4, 'Pontual, prático e com boa comunicação. Gostei especialmente das sugestões para simplificar a manutenção.'),
    ('Marmitas semanais com plano flexível', 'cliente.ines@doorly.pt', 5, 'As marmitas vieram variadas, bem embaladas e com combinações que eu não teria pensado. Salvou-me a semana.'),
    ('Pet sitting com relatório fotográfico', 'cliente.sofia@doorly.pt', 5, 'Recebi fotografias durante a visita e senti muita confiança. O meu cão ficou tranquilo.'),
    ('Reparação de bicicletas urbanas', 'cliente.tiago@doorly.pt', 5, 'A bicicleta saiu afinada e pronta para ir trabalhar no dia seguinte. Rápido e sem complicações.'),
    ('Guarda-roupa circular e segunda vida', 'cliente.ines@doorly.pt', 4, 'A sessão ajudou-me a reaproveitar roupa esquecida e a vender algumas peças. Ideia muito útil.')
) AS r(titulo, email, nota, comentario)
JOIN servicos s ON s.titulo = r.titulo
JOIN utilizadores u ON u.email = r.email
WHERE NOT EXISTS (
  SELECT 1 FROM avaliacoes a
  WHERE a.id_servico = s.id_servico AND a.id_cliente = u.id_utilizador
);
