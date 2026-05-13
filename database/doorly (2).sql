-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 13-Maio-2026 às 10:44
-- Versão do servidor: 10.4.32-MariaDB
-- versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `doorly`
--
CREATE DATABASE IF NOT EXISTS `doorly` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `doorly`;

-- --------------------------------------------------------

--
-- Estrutura da tabela `avaliacoes`
--

DROP TABLE IF EXISTS `avaliacoes`;
CREATE TABLE `avaliacoes` (
  `id_avaliacao` int(11) NOT NULL,
  `id_servico` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `nota` tinyint(4) NOT NULL,
  `comentario` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `data` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `estatisticas`
--

DROP TABLE IF EXISTS `estatisticas`;
CREATE TABLE `estatisticas` (
  `id_estatistica` int(11) NOT NULL,
  `id_servico` int(11) NOT NULL,
  `visualizacoes` int(11) NOT NULL DEFAULT 0,
  `pedidos` int(11) NOT NULL DEFAULT 0,
  `ultima_atualizacao` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `estatisticas`
--

INSERT INTO `estatisticas` (`id_estatistica`, `id_servico`, `visualizacoes`, `pedidos`, `ultima_atualizacao`) VALUES
(2, 1, 0, 1, '2026-05-13 08:42:16');

-- --------------------------------------------------------

--
-- Estrutura da tabela `favoritos`
--

DROP TABLE IF EXISTS `favoritos`;
CREATE TABLE `favoritos` (
  `id_favorito` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_servico` int(11) NOT NULL,
  `data_adicionado` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `favoritos`
--

INSERT INTO `favoritos` (`id_favorito`, `id_cliente`, `id_servico`, `data_adicionado`) VALUES
(2, 7, 1, '2026-05-06 09:56:19');

-- --------------------------------------------------------

--
-- Estrutura da tabela `mensagens`
--

DROP TABLE IF EXISTS `mensagens`;
CREATE TABLE `mensagens` (
  `idmensagens` int(11) NOT NULL,
  `id_servico` int(11) NOT NULL,
  `id_remetente` int(11) NOT NULL,
  `id_destinatario` int(11) NOT NULL,
  `conteudo` text NOT NULL,
  `data_envio` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `mensagens`
--

INSERT INTO `mensagens` (`idmensagens`, `id_servico`, `id_remetente`, `id_destinatario`, `conteudo`, `data_envio`) VALUES
(2, 1, 6, 2, 'Olá', '2026-05-13 07:37:08'),
(3, 1, 8, 2, 'Pedido de orcamento\n\nServico: Limpeza doméstica\nCliente: tomascarol@gmail.com\nDetalhes: Teste\nLocalizacao: Lisboa\nData preferida: 2026-05-14\nPeriodo: Manha\nUrgencia: Esta semana\nOrcamento aproximado: 29 EUR\nContacto: tomascarol@gmail.com', '2026-05-13 07:42:16'),
(4, 1, 2, 8, 'Seu pedido de orçamento foi aceite.', '2026-05-13 07:43:03');

-- --------------------------------------------------------

--
-- Estrutura da tabela `pedidos_orcamento`
--

DROP TABLE IF EXISTS `pedidos_orcamento`;
CREATE TABLE `pedidos_orcamento` (
  `id_orcamento` int(11) NOT NULL,
  `id_servico` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_prestador` int(11) NOT NULL,
  `detalhes` text NOT NULL,
  `localizacao` varchar(150) DEFAULT NULL,
  `data_preferida` date DEFAULT NULL,
  `periodo` varchar(50) DEFAULT NULL,
  `urgencia` varchar(50) DEFAULT NULL,
  `orcamento_estimado` decimal(10,2) DEFAULT NULL,
  `contacto` varchar(150) DEFAULT NULL,
  `estado` varchar(30) NOT NULL DEFAULT 'novo',
  `id_mensagem` int(11) DEFAULT NULL,
  `data_pedido` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `pedidos_orcamento`
--

INSERT INTO `pedidos_orcamento` (`id_orcamento`, `id_servico`, `id_cliente`, `id_prestador`, `detalhes`, `localizacao`, `data_preferida`, `periodo`, `urgencia`, `orcamento_estimado`, `contacto`, `estado`, `id_mensagem`, `data_pedido`) VALUES
(1, 1, 8, 2, 'Teste', 'Lisboa', '2026-05-14', 'Manha', 'Esta semana', 29.00, 'tomascarol@gmail.com', 'novo', 3, '2026-05-13 07:42:16');

-- --------------------------------------------------------

--
-- Estrutura da tabela `servicos`
--

DROP TABLE IF EXISTS `servicos`;
CREATE TABLE `servicos` (
  `id_servico` int(11) NOT NULL,
  `id_prestador` int(11) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `descricao` text NOT NULL,
  `categoria` varchar(100) NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `localizacao` varchar(150) DEFAULT NULL,
  `data_publicacao` datetime NOT NULL DEFAULT current_timestamp(),
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `imagem_url` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `servicos`
--

INSERT INTO `servicos` (`id_servico`, `id_prestador`, `titulo`, `descricao`, `categoria`, `preco`, `localizacao`, `data_publicacao`, `ativo`, `imagem_url`) VALUES
(1, 2, 'Limpeza doméstica', 'Limpeza completa de apartamentos', 'Limpeza', 40.00, 'Lisboa', '2026-01-26 17:44:56', 1, 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

-- --------------------------------------------------------

--
-- Estrutura da tabela `utilizadores`
--

DROP TABLE IF EXISTS `utilizadores`;
CREATE TABLE `utilizadores` (
  `id_utilizador` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `tipo` enum('cliente','prestador','admin') NOT NULL DEFAULT 'cliente',
  `data_registo` datetime NOT NULL DEFAULT current_timestamp(),
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_expires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `utilizadores`
--

INSERT INTO `utilizadores` (`id_utilizador`, `nome`, `email`, `password_hash`, `tipo`, `data_registo`, `ativo`, `reset_token`, `reset_expires`) VALUES
(1, 'Admin', 'admin@doorly.pt', '$2b$10$VCBZWzMnawnKb/D34KbuNuOy7k7UG.xiqFvckQhcD6PNANWvAjG2u', 'admin', '2026-01-13 17:51:55', 1, NULL, NULL),
(2, 'Maria Prestadora', 'prestador@doorly.pt', '$2b$10$Oe5BNIPo1ctcLEz23PpC.eu6T.TGdwWCg.o0K5CfRs4LUokX7FSuK', 'prestador', '2026-01-25 17:44:00', 1, NULL, NULL),
(5, 'Mateus', 'm06@gmail.com', '$2b$10$zQTDHgx5jgBtfnBo5Rla7O0jgVOAT0QWojHc/I.zri8/z3bh6ovjG', 'cliente', '2026-05-05 17:04:48', 1, NULL, NULL),
(6, 'Chedza Sambrano', 'ched.sambrano@gmail.com', '$2b$10$n6l84iCcTP0un0bgif.jPOkvuMW5dcib2MC2tRHq0vsIysnRdoynS', 'cliente', '2026-05-06 00:08:52', 1, NULL, NULL),
(7, 'David', 'david@gmail.com', '$2b$10$/X4ROh.futgEIWdUUNT2pOT.2anb4k.LRjkyqOSQA3JHHjxiEVSmm', 'cliente', '2026-05-06 09:56:08', 1, NULL, NULL),
(8, 'ana', 'tomascarol@gmail.com', '$2b$10$mxkubOI/HCcgnBSfvf.G9uJuMkEObBgmEyuxEVMB0NLtwqrIVC1zG', 'cliente', '2026-05-06 11:28:05', 1, 'a20e6928e2e51423ddac07d7493c214d237ff318b815419f2f2833637dbd0263', '2026-05-13 09:49:04');

--
-- Acionadores `utilizadores`
--
DROP TRIGGER IF EXISTS `before_insert_admin`;
DELIMITER $$
CREATE TRIGGER `before_insert_admin` BEFORE INSERT ON `utilizadores` FOR EACH ROW BEGIN
  IF NEW.tipo = 'admin' THEN
    IF (SELECT COUNT(*) FROM utilizadores WHERE tipo = 'admin') >= 1 THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Já existe um administrador no sistema';
    END IF;
  END IF;
END
$$
DELIMITER ;

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `avaliacoes`
--
ALTER TABLE `avaliacoes`
  ADD PRIMARY KEY (`id_avaliacao`),
  ADD KEY `fk_5` (`id_cliente`),
  ADD KEY `fk_6` (`id_servico`);

--
-- Índices para tabela `estatisticas`
--
ALTER TABLE `estatisticas`
  ADD PRIMARY KEY (`id_estatistica`),
  ADD KEY `fk_4` (`id_servico`);

--
-- Índices para tabela `favoritos`
--
ALTER TABLE `favoritos`
  ADD PRIMARY KEY (`id_favorito`),
  ADD UNIQUE KEY `uk_favoritos_cliente_servico` (`id_cliente`,`id_servico`),
  ADD KEY `fk_2` (`id_cliente`),
  ADD KEY `fk_3` (`id_servico`);

--
-- Índices para tabela `mensagens`
--
ALTER TABLE `mensagens`
  ADD PRIMARY KEY (`idmensagens`),
  ADD KEY `fk1` (`id_servico`),
  ADD KEY `fk2` (`id_destinatario`),
  ADD KEY `fk3` (`id_remetente`);

--
-- Índices para tabela `pedidos_orcamento`
--
ALTER TABLE `pedidos_orcamento`
  ADD PRIMARY KEY (`id_orcamento`),
  ADD KEY `idx_orcamentos_prestador` (`id_prestador`,`data_pedido`),
  ADD KEY `idx_orcamentos_cliente` (`id_cliente`,`data_pedido`),
  ADD KEY `idx_orcamentos_servico` (`id_servico`);

--
-- Índices para tabela `servicos`
--
ALTER TABLE `servicos`
  ADD PRIMARY KEY (`id_servico`),
  ADD KEY `fk_1` (`id_prestador`);

--
-- Índices para tabela `utilizadores`
--
ALTER TABLE `utilizadores`
  ADD PRIMARY KEY (`id_utilizador`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `avaliacoes`
--
ALTER TABLE `avaliacoes`
  MODIFY `id_avaliacao` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `estatisticas`
--
ALTER TABLE `estatisticas`
  MODIFY `id_estatistica` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `favoritos`
--
ALTER TABLE `favoritos`
  MODIFY `id_favorito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `mensagens`
--
ALTER TABLE `mensagens`
  MODIFY `idmensagens` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `pedidos_orcamento`
--
ALTER TABLE `pedidos_orcamento`
  MODIFY `id_orcamento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `servicos`
--
ALTER TABLE `servicos`
  MODIFY `id_servico` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `utilizadores`
--
ALTER TABLE `utilizadores`
  MODIFY `id_utilizador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `avaliacoes`
--
ALTER TABLE `avaliacoes`
  ADD CONSTRAINT `fk_5` FOREIGN KEY (`id_cliente`) REFERENCES `utilizadores` (`id_utilizador`),
  ADD CONSTRAINT `fk_6` FOREIGN KEY (`id_servico`) REFERENCES `servicos` (`id_servico`);

--
-- Limitadores para a tabela `estatisticas`
--
ALTER TABLE `estatisticas`
  ADD CONSTRAINT `fk_4` FOREIGN KEY (`id_servico`) REFERENCES `servicos` (`id_servico`);

--
-- Limitadores para a tabela `favoritos`
--
ALTER TABLE `favoritos`
  ADD CONSTRAINT `fk_2` FOREIGN KEY (`id_cliente`) REFERENCES `utilizadores` (`id_utilizador`),
  ADD CONSTRAINT `fk_3` FOREIGN KEY (`id_servico`) REFERENCES `servicos` (`id_servico`);

--
-- Limitadores para a tabela `mensagens`
--
ALTER TABLE `mensagens`
  ADD CONSTRAINT `fk1` FOREIGN KEY (`id_servico`) REFERENCES `servicos` (`id_servico`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk2` FOREIGN KEY (`id_destinatario`) REFERENCES `utilizadores` (`id_utilizador`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk3` FOREIGN KEY (`id_remetente`) REFERENCES `utilizadores` (`id_utilizador`);

--
-- Limitadores para a tabela `servicos`
--
ALTER TABLE `servicos`
  ADD CONSTRAINT `fk_1` FOREIGN KEY (`id_prestador`) REFERENCES `utilizadores` (`id_utilizador`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
