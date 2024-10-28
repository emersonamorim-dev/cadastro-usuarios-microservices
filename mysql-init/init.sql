-- Cria o banco de dados se ainda não existir
CREATE DATABASE IF NOT EXISTS `usuariodb` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `usuariodb`;

-- Cria a tabela `usuarios`
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cpf` VARCHAR(14) NOT NULL UNIQUE,
  `senha_hash` VARCHAR(255) NOT NULL,
  `nome` VARCHAR(100) NOT NULL,
  `data_nascimento` DATE NOT NULL,
  `endereco_rua` VARCHAR(100) NOT NULL,
  `endereco_numero` VARCHAR(10) NOT NULL,
  `endereco_complemento` VARCHAR(50),
  `endereco_bairro` VARCHAR(50) NOT NULL,
  `endereco_cidade` VARCHAR(50) NOT NULL,
  `endereco_estado` VARCHAR(2) NOT NULL,
  `endereco_cep` VARCHAR(10) NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'Ativo',
  `created_at` DATETIME NOT NULL,
  `created_by` VARCHAR(50) NOT NULL,
  `updated_at` DATETIME NULL,
  `updated_by` VARCHAR(50) NULL,
  `deleted_at` DATETIME NULL,
  `deleted_by` VARCHAR(50) NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
