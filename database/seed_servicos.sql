USE `doorly`;

SET @hash = '$2b$10$Oe5BNIPo1ctcLEz23PpC.eu6T.TGdwWCg.o0K5CfRs4LUokX7FSuK';

INSERT INTO utilizadores (nome, email, password_hash, tipo, ativo)
SELECT 'Maria Prestadora', _utf8mb4'prestador@doorly.pt' COLLATE utf8mb4_general_ci, @hash, 'prestador', 1
WHERE NOT EXISTS (SELECT 1 FROM utilizadores WHERE email = _utf8mb4'prestador@doorly.pt' COLLATE utf8mb4_general_ci);

INSERT INTO utilizadores (nome, email, password_hash, tipo, ativo)
SELECT 'Aurora Limpa', _utf8mb4'aurora.limpa@doorly.pt' COLLATE utf8mb4_general_ci, @hash, 'prestador', 1
WHERE NOT EXISTS (SELECT 1 FROM utilizadores WHERE email = _utf8mb4'aurora.limpa@doorly.pt' COLLATE utf8mb4_general_ci);

INSERT INTO utilizadores (nome, email, password_hash, tipo, ativo)
SELECT 'Volt & Casa', _utf8mb4'volt.casa@doorly.pt' COLLATE utf8mb4_general_ci, @hash, 'prestador', 1
WHERE NOT EXISTS (SELECT 1 FROM utilizadores WHERE email = _utf8mb4'volt.casa@doorly.pt' COLLATE utf8mb4_general_ci);

INSERT INTO utilizadores (nome, email, password_hash, tipo, ativo)
SELECT 'Atelier Verde Vivo', _utf8mb4'atelier.verde@doorly.pt' COLLATE utf8mb4_general_ci, @hash, 'prestador', 1
WHERE NOT EXISTS (SELECT 1 FROM utilizadores WHERE email = _utf8mb4'atelier.verde@doorly.pt' COLLATE utf8mb4_general_ci);

INSERT INTO utilizadores (nome, email, password_hash, tipo, ativo)
SELECT 'MobiFix Studio', _utf8mb4'mobifix@doorly.pt' COLLATE utf8mb4_general_ci, @hash, 'prestador', 1
WHERE NOT EXISTS (SELECT 1 FROM utilizadores WHERE email = _utf8mb4'mobifix@doorly.pt' COLLATE utf8mb4_general_ci);

INSERT INTO utilizadores (nome, email, password_hash, tipo, ativo)
SELECT 'Noa Bento Fotos', _utf8mb4'noa.fotos@doorly.pt' COLLATE utf8mb4_general_ci, @hash, 'prestador', 1
WHERE NOT EXISTS (SELECT 1 FROM utilizadores WHERE email = _utf8mb4'noa.fotos@doorly.pt' COLLATE utf8mb4_general_ci);

INSERT INTO utilizadores (nome, email, password_hash, tipo, ativo)
SELECT 'FitLab Bairro', _utf8mb4'fitlab@doorly.pt' COLLATE utf8mb4_general_ci, @hash, 'prestador', 1
WHERE NOT EXISTS (SELECT 1 FROM utilizadores WHERE email = _utf8mb4'fitlab@doorly.pt' COLLATE utf8mb4_general_ci);

INSERT INTO utilizadores (nome, email, password_hash, tipo, ativo)
SELECT 'Chef Lia Marmitas', _utf8mb4'chef.lia@doorly.pt' COLLATE utf8mb4_general_ci, @hash, 'prestador', 1
WHERE NOT EXISTS (SELECT 1 FROM utilizadores WHERE email = _utf8mb4'chef.lia@doorly.pt' COLLATE utf8mb4_general_ci);

INSERT INTO utilizadores (nome, email, password_hash, tipo, ativo)
SELECT 'BiciLab Lisboa', _utf8mb4'bicilab@doorly.pt' COLLATE utf8mb4_general_ci, @hash, 'prestador', 1
WHERE NOT EXISTS (SELECT 1 FROM utilizadores WHERE email = _utf8mb4'bicilab@doorly.pt' COLLATE utf8mb4_general_ci);

INSERT INTO utilizadores (nome, email, password_hash, tipo, ativo)
SELECT 'Oficina Circular', _utf8mb4'circular@doorly.pt' COLLATE utf8mb4_general_ci, @hash, 'prestador', 1
WHERE NOT EXISTS (SELECT 1 FROM utilizadores WHERE email = _utf8mb4'circular@doorly.pt' COLLATE utf8mb4_general_ci);

INSERT INTO utilizadores (nome, email, password_hash, tipo, ativo)
SELECT 'Sono & Rotina Kids', _utf8mb4'sono.kids@doorly.pt' COLLATE utf8mb4_general_ci, @hash, 'prestador', 1
WHERE NOT EXISTS (SELECT 1 FROM utilizadores WHERE email = _utf8mb4'sono.kids@doorly.pt' COLLATE utf8mb4_general_ci);

INSERT INTO utilizadores (nome, email, password_hash, tipo, ativo)
SELECT 'Pet Radar', _utf8mb4'pet.radar@doorly.pt' COLLATE utf8mb4_general_ci, @hash, 'prestador', 1
WHERE NOT EXISTS (SELECT 1 FROM utilizadores WHERE email = _utf8mb4'pet.radar@doorly.pt' COLLATE utf8mb4_general_ci);

INSERT INTO utilizadores (nome, email, password_hash, tipo, ativo)
SELECT 'Cliente Demo Sofia', _utf8mb4'cliente.sofia@doorly.pt' COLLATE utf8mb4_general_ci, @hash, 'cliente', 1
WHERE NOT EXISTS (SELECT 1 FROM utilizadores WHERE email = _utf8mb4'cliente.sofia@doorly.pt' COLLATE utf8mb4_general_ci);

INSERT INTO utilizadores (nome, email, password_hash, tipo, ativo)
SELECT 'Cliente Demo Tiago', _utf8mb4'cliente.tiago@doorly.pt' COLLATE utf8mb4_general_ci, @hash, 'cliente', 1
WHERE NOT EXISTS (SELECT 1 FROM utilizadores WHERE email = _utf8mb4'cliente.tiago@doorly.pt' COLLATE utf8mb4_general_ci);

INSERT INTO utilizadores (nome, email, password_hash, tipo, ativo)
SELECT 'Cliente Demo Ines', _utf8mb4'cliente.ines@doorly.pt' COLLATE utf8mb4_general_ci, @hash, 'cliente', 1
WHERE NOT EXISTS (SELECT 1 FROM utilizadores WHERE email = _utf8mb4'cliente.ines@doorly.pt' COLLATE utf8mb4_general_ci);

SET @maria = (SELECT id_utilizador FROM utilizadores WHERE email = _utf8mb4'prestador@doorly.pt' COLLATE utf8mb4_general_ci LIMIT 1);
SET @aurora = (SELECT id_utilizador FROM utilizadores WHERE email = _utf8mb4'aurora.limpa@doorly.pt' COLLATE utf8mb4_general_ci LIMIT 1);
SET @volt = (SELECT id_utilizador FROM utilizadores WHERE email = _utf8mb4'volt.casa@doorly.pt' COLLATE utf8mb4_general_ci LIMIT 1);
SET @verde = (SELECT id_utilizador FROM utilizadores WHERE email = _utf8mb4'atelier.verde@doorly.pt' COLLATE utf8mb4_general_ci LIMIT 1);
SET @mobifix = (SELECT id_utilizador FROM utilizadores WHERE email = _utf8mb4'mobifix@doorly.pt' COLLATE utf8mb4_general_ci LIMIT 1);
SET @noa = (SELECT id_utilizador FROM utilizadores WHERE email = _utf8mb4'noa.fotos@doorly.pt' COLLATE utf8mb4_general_ci LIMIT 1);
SET @fitlab = (SELECT id_utilizador FROM utilizadores WHERE email = _utf8mb4'fitlab@doorly.pt' COLLATE utf8mb4_general_ci LIMIT 1);
SET @chef = (SELECT id_utilizador FROM utilizadores WHERE email = _utf8mb4'chef.lia@doorly.pt' COLLATE utf8mb4_general_ci LIMIT 1);
SET @bici = (SELECT id_utilizador FROM utilizadores WHERE email = _utf8mb4'bicilab@doorly.pt' COLLATE utf8mb4_general_ci LIMIT 1);
SET @circular = (SELECT id_utilizador FROM utilizadores WHERE email = _utf8mb4'circular@doorly.pt' COLLATE utf8mb4_general_ci LIMIT 1);
SET @sono = (SELECT id_utilizador FROM utilizadores WHERE email = _utf8mb4'sono.kids@doorly.pt' COLLATE utf8mb4_general_ci LIMIT 1);
SET @pet = (SELECT id_utilizador FROM utilizadores WHERE email = _utf8mb4'pet.radar@doorly.pt' COLLATE utf8mb4_general_ci LIMIT 1);
SET @sofia = (SELECT id_utilizador FROM utilizadores WHERE email = _utf8mb4'cliente.sofia@doorly.pt' COLLATE utf8mb4_general_ci LIMIT 1);
SET @tiago = (SELECT id_utilizador FROM utilizadores WHERE email = _utf8mb4'cliente.tiago@doorly.pt' COLLATE utf8mb4_general_ci LIMIT 1);
SET @ines = (SELECT id_utilizador FROM utilizadores WHERE email = _utf8mb4'cliente.ines@doorly.pt' COLLATE utf8mb4_general_ci LIMIT 1);

INSERT INTO servicos (id_prestador, titulo, descricao, categoria, preco, localizacao, ativo, imagem_url)
SELECT @aurora, 'Limpeza profunda de apartamentos', 'Limpeza completa para apartamentos T0 a T3, incluindo cozinha, casas de banho, vidros interiores e zonas comuns. Ideal para mudancas, pos-obra ligeira ou manutencao mensal.', 'Limpeza', 55.00, 'Lisboa', 1, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE titulo = 'Limpeza profunda de apartamentos');

INSERT INTO servicos (id_prestador, titulo, descricao, categoria, preco, localizacao, ativo, imagem_url)
SELECT @maria, 'Canalizacao e reparacao de fugas', 'Diagnostico e reparacao de fugas, torneiras, autoclismos, sifoes e pequenas instalacoes. Atendimento rapido para problemas domesticos urgentes.', 'Canalizacao', 35.00, 'Oeiras', 1, 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=1200&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE titulo = 'Canalizacao e reparacao de fugas');

INSERT INTO servicos (id_prestador, titulo, descricao, categoria, preco, localizacao, ativo, imagem_url)
SELECT @volt, 'Eletricista para pequenas reparacoes', 'Substituicao de tomadas, interruptores, candeeiros, disjuntores e resolucao de avarias simples em habitacoes e pequenos negocios.', 'Eletricidade', 40.00, 'Amadora', 1, 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1200&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE titulo = 'Eletricista para pequenas reparacoes');

INSERT INTO servicos (id_prestador, titulo, descricao, categoria, preco, localizacao, ativo, imagem_url)
SELECT @verde, 'Pintura interior por divisao', 'Pintura de quartos, salas e corredores com preparacao basica de paredes, protecao de moveis e acabamento limpo. Tintas sob orcamento.', 'Pintura', 85.00, 'Sintra', 1, 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=1200&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE titulo = 'Pintura interior por divisao');

INSERT INTO servicos (id_prestador, titulo, descricao, categoria, preco, localizacao, ativo, imagem_url)
SELECT @verde, 'Jardinagem e manutencao de exteriores', 'Corte de relva, poda ligeira, limpeza de canteiros, manutencao de vasos e organizacao de pequenos jardins ou terracos.', 'Jardinagem', 45.00, 'Cascais', 1, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1200&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE titulo = 'Jardinagem e manutencao de exteriores');

INSERT INTO servicos (id_prestador, titulo, descricao, categoria, preco, localizacao, ativo, imagem_url)
SELECT @maria, 'Explicacoes de matematica', 'Apoio individual a alunos do 2 ciclo, 3 ciclo e secundario, com preparacao para testes, exames e recuperacao de bases.', 'Explicacoes', 22.50, 'Lisboa', 1, 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE titulo = 'Explicacoes de matematica');

INSERT INTO servicos (id_prestador, titulo, descricao, categoria, preco, localizacao, ativo, imagem_url)
SELECT @mobifix, 'Montagem de moveis e prateleiras', 'Montagem de moveis, camas, mesas, estantes e instalacao de prateleiras. Inclui ferramentas e verificacao final de estabilidade.', 'Reparacoes', 30.00, 'Almada', 1, 'https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?q=80&w=1200&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE titulo = 'Montagem de moveis e prateleiras');

INSERT INTO servicos (id_prestador, titulo, descricao, categoria, preco, localizacao, ativo, imagem_url)
SELECT @mobifix, 'Mudancas locais com carrinha', 'Transporte de caixas, pequenos moveis e eletrodomesticos em mudancas dentro da mesma zona. Possibilidade de ajuda nas cargas.', 'Mudancas', 65.00, 'Setubal', 1, 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?q=80&w=1200&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE titulo = 'Mudancas locais com carrinha');

INSERT INTO servicos (id_prestador, titulo, descricao, categoria, preco, localizacao, ativo, imagem_url)
SELECT @noa, 'Fotografia para eventos pequenos', 'Cobertura fotografica de aniversarios, batizados, eventos familiares e sessoes informais. Entrega digital das melhores fotografias editadas.', 'Fotografia', 120.00, 'Lisboa', 1, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE titulo = 'Fotografia para eventos pequenos');

INSERT INTO servicos (id_prestador, titulo, descricao, categoria, preco, localizacao, ativo, imagem_url)
SELECT @fitlab, 'Personal trainer ao domicilio', 'Treinos personalizados para perda de peso, tonificacao ou mobilidade, adaptados ao nivel fisico e objetivos de cada cliente.', 'Fitness', 28.00, 'Odivelas', 1, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE titulo = 'Personal trainer ao domicilio');

INSERT INTO servicos (id_prestador, titulo, descricao, categoria, preco, localizacao, ativo, imagem_url)
SELECT @volt, 'Setup de casa inteligente', 'Instalacao e configuracao de luzes, sensores, assistentes de voz e rotinas simples para tornar a casa mais automatizada sem obras.', 'Domotica', 48.00, 'Lisboa', 1, 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1200&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE titulo = 'Setup de casa inteligente');

INSERT INTO servicos (id_prestador, titulo, descricao, categoria, preco, localizacao, ativo, imagem_url)
SELECT @chef, 'Marmitas semanais com plano flexivel', 'Planeamento e preparacao de marmitas saudaveis para a semana, com opcoes vegetarianas, alta proteina ou conforto caseiro.', 'Cozinha', 75.00, 'Lisboa', 1, 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1200&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE titulo = 'Marmitas semanais com plano flexivel');

INSERT INTO servicos (id_prestador, titulo, descricao, categoria, preco, localizacao, ativo, imagem_url)
SELECT @pet, 'Pet sitting com relatorio fotografico', 'Visitas a casa para alimentacao, passeio curto, companhia e envio de fotografias ao longo do dia para tutores que querem tranquilidade.', 'Pets', 18.00, 'Cascais', 1, 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1200&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE titulo = 'Pet sitting com relatorio fotografico');

INSERT INTO servicos (id_prestador, titulo, descricao, categoria, preco, localizacao, ativo, imagem_url)
SELECT @bici, 'Reparacao de bicicletas urbanas', 'Afinacao de travoes, mudancas, furos e revisao rapida para bicicletas de cidade, dobraveis e eletricas leves.', 'Mobilidade', 32.00, 'Lisboa', 1, 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1200&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE titulo = 'Reparacao de bicicletas urbanas');

INSERT INTO servicos (id_prestador, titulo, descricao, categoria, preco, localizacao, ativo, imagem_url)
SELECT @circular, 'Guarda-roupa circular e segunda vida', 'Sessao para reorganizar roupa, criar combinacoes, separar pecas para venda/doacao e reduzir compras por impulso.', 'Sustentabilidade', 42.00, 'Porto', 1, 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1200&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE titulo = 'Guarda-roupa circular e segunda vida');

INSERT INTO servicos (id_prestador, titulo, descricao, categoria, preco, localizacao, ativo, imagem_url)
SELECT @sono, 'Rotinas de sono para bebes e criancas', 'Apoio a familias na criacao de rotinas suaves, horarios realistas e estrategias consistentes para noites mais tranquilas.', 'Familia', 60.00, 'Online', 1, 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1200&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE titulo = 'Rotinas de sono para bebes e criancas');

INSERT INTO servicos (id_prestador, titulo, descricao, categoria, preco, localizacao, ativo, imagem_url)
SELECT @noa, 'Mini estudio para podcast em casa', 'Montagem de luz, som e enquadramento para gravar podcast, entrevistas remotas ou conteudo profissional sem alugar estudio.', 'Criatividade', 95.00, 'Lisboa', 1, 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1200&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE titulo = 'Mini estudio para podcast em casa');

UPDATE servicos SET id_prestador = @aurora WHERE titulo = 'Limpeza profunda de apartamentos';
UPDATE servicos SET id_prestador = @maria WHERE titulo = 'Limpeza domestica';
UPDATE servicos SET id_prestador = @maria WHERE titulo = 'Limpeza doméstica';
UPDATE servicos SET id_prestador = @maria WHERE titulo = 'Canalizacao e reparacao de fugas';
UPDATE servicos SET id_prestador = @volt WHERE titulo IN ('Eletricista para pequenas reparacoes', 'Setup de casa inteligente');
UPDATE servicos SET id_prestador = @verde WHERE titulo IN ('Pintura interior por divisao', 'Jardinagem e manutencao de exteriores');
UPDATE servicos SET id_prestador = @mobifix WHERE titulo IN ('Montagem de moveis e prateleiras', 'Mudancas locais com carrinha');
UPDATE servicos SET id_prestador = @noa WHERE titulo IN ('Fotografia para eventos pequenos', 'Mini estudio para podcast em casa');
UPDATE servicos SET id_prestador = @fitlab WHERE titulo = 'Personal trainer ao domicilio';

INSERT INTO estatisticas (id_servico, visualizacoes, pedidos)
SELECT s.id_servico, FLOOR(25 + RAND() * 220), FLOOR(1 + RAND() * 18)
FROM servicos s
WHERE NOT EXISTS (SELECT 1 FROM estatisticas e WHERE e.id_servico = s.id_servico);

UPDATE estatisticas e
JOIN servicos s ON s.id_servico = e.id_servico
SET e.visualizacoes = GREATEST(e.visualizacoes, FLOOR(25 + RAND() * 220)),
    e.pedidos = GREATEST(e.pedidos, FLOOR(1 + RAND() * 18))
WHERE s.titulo IN (
  'Setup de casa inteligente',
  'Marmitas semanais com plano flexivel',
  'Pet sitting com relatorio fotografico',
  'Reparacao de bicicletas urbanas',
  'Guarda-roupa circular e segunda vida',
  'Rotinas de sono para bebes e criancas',
  'Mini estudio para podcast em casa'
);

INSERT INTO avaliacoes (id_servico, id_cliente, nota, comentario)
SELECT s.id_servico, @sofia, 5, 'Servico muito bem organizado. O prestador explicou tudo com clareza e deixou o resultado melhor do que eu esperava.'
FROM servicos s
WHERE s.titulo = 'Setup de casa inteligente'
  AND NOT EXISTS (SELECT 1 FROM avaliacoes a WHERE a.id_servico = s.id_servico AND a.id_cliente = @sofia);

INSERT INTO avaliacoes (id_servico, id_cliente, nota, comentario)
SELECT s.id_servico, @tiago, 4, 'Pontual, pratico e com boa comunicacao. Gostei especialmente das sugestoes para simplificar a manutencao.'
FROM servicos s
WHERE s.titulo = 'Jardinagem e manutencao de exteriores'
  AND NOT EXISTS (SELECT 1 FROM avaliacoes a WHERE a.id_servico = s.id_servico AND a.id_cliente = @tiago);

INSERT INTO avaliacoes (id_servico, id_cliente, nota, comentario)
SELECT s.id_servico, @ines, 5, 'As marmitas vieram variadas, bem embaladas e com combinacoes que eu nao teria pensado. Salvou-me a semana.'
FROM servicos s
WHERE s.titulo = 'Marmitas semanais com plano flexivel'
  AND NOT EXISTS (SELECT 1 FROM avaliacoes a WHERE a.id_servico = s.id_servico AND a.id_cliente = @ines);

INSERT INTO avaliacoes (id_servico, id_cliente, nota, comentario)
SELECT s.id_servico, @sofia, 5, 'Recebi fotografias durante a visita e senti muita confianca. O meu cao ficou tranquilo.'
FROM servicos s
WHERE s.titulo = 'Pet sitting com relatorio fotografico'
  AND NOT EXISTS (SELECT 1 FROM avaliacoes a WHERE a.id_servico = s.id_servico AND a.id_cliente = @sofia);

INSERT INTO avaliacoes (id_servico, id_cliente, nota, comentario)
SELECT s.id_servico, @tiago, 5, 'A bicicleta saiu afinada e pronta para ir trabalhar no dia seguinte. Rapido e sem complicacoes.'
FROM servicos s
WHERE s.titulo = 'Reparacao de bicicletas urbanas'
  AND NOT EXISTS (SELECT 1 FROM avaliacoes a WHERE a.id_servico = s.id_servico AND a.id_cliente = @tiago);

INSERT INTO avaliacoes (id_servico, id_cliente, nota, comentario)
SELECT s.id_servico, @ines, 4, 'A sessao ajudou-me a reaproveitar roupa esquecida e a vender algumas pecas. Ideia muito util.'
FROM servicos s
WHERE s.titulo = 'Guarda-roupa circular e segunda vida'
  AND NOT EXISTS (SELECT 1 FROM avaliacoes a WHERE a.id_servico = s.id_servico AND a.id_cliente = @ines);
