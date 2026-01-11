-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema bdcritreel
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema bdcritreel
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `bdcritreel` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `bdcritreel` ;

-- -----------------------------------------------------
-- Table `bdcritreel`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcritreel`.`usuario` (
  `idUsuario` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `senha` VARCHAR(45) NOT NULL,
  `dtNasc` VARCHAR(45) NOT NULL,
  `suspensao` TINYINT(1) NOT NULL,
  `nomeCompleto` VARCHAR(45) NOT NULL,
  `bioPerfil` VARCHAR(100) NOT NULL,
  `fotoPerfil` VARCHAR(250) NULL DEFAULT NULL,
  `email` VARCHAR(45) NOT NULL,
  `admin` TINYINT(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idUsuario`),
  UNIQUE INDEX `emailTel_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `nomeUsuario_UNIQUE` (`username` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 25
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bdcritreel`.`filme`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcritreel`.`filme` (
  `idFilme` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(100) NOT NULL,
  `sinopse` VARCHAR(1000) NOT NULL,
  `linkTrailer` VARCHAR(255) NULL DEFAULT NULL,
  `fotosCenas` VARCHAR(255) NULL DEFAULT NULL,
  `anoLancamento` VARCHAR(45) NOT NULL,
  `idUsuario` INT NOT NULL,
  `linkAssistir` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`idFilme`),
  INDEX `fk_Filme_Usuario1_idx` (`idUsuario` ASC) VISIBLE,
  CONSTRAINT `fk_Filme_Usuario1`
    FOREIGN KEY (`idUsuario`)
    REFERENCES `bdcritreel`.`usuario` (`idUsuario`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 22
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `bdcritreel`.`avaliacaofilme`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcritreel`.`avaliacaofilme` (
  `nota` INT NOT NULL,
  `idFilme` INT NOT NULL,
  `idUsuario` INT NOT NULL,
  PRIMARY KEY (`idFilme`, `idUsuario`),
  INDEX `fk_AvaliacaoFilme_Usuario1` (`idUsuario` ASC) VISIBLE,
  CONSTRAINT `fk_AvaliacaoFilme_Filme1`
    FOREIGN KEY (`idFilme`)
    REFERENCES `bdcritreel`.`filme` (`idFilme`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_AvaliacaoFilme_Usuario1`
    FOREIGN KEY (`idUsuario`)
    REFERENCES `bdcritreel`.`usuario` (`idUsuario`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `bdcritreel`.`critica`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcritreel`.`critica` (
  `idCritica` INT NOT NULL AUTO_INCREMENT,
  `tituloFilme` VARCHAR(100) NULL DEFAULT NULL,
  `texto` VARCHAR(300) NOT NULL,
  `idUsuario` INT NOT NULL,
  `idFilme` INT NULL DEFAULT NULL,
  `dataCriacao` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `fotoCritica` VARCHAR(250) NULL DEFAULT NULL,
  PRIMARY KEY (`idCritica`),
  INDEX `fk_Critica_Usuario1_idx` (`idUsuario` ASC) VISIBLE,
  INDEX `fk_Critica_Filme1_idx` (`idFilme` ASC) VISIBLE,
  CONSTRAINT `fk_Critica_Filme1`
    FOREIGN KEY (`idFilme`)
    REFERENCES `bdcritreel`.`filme` (`idFilme`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Critica_Usuario1`
    FOREIGN KEY (`idUsuario`)
    REFERENCES `bdcritreel`.`usuario` (`idUsuario`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 19
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `bdcritreel`.`curtidacritica`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcritreel`.`curtidacritica` (
  `idUsuario` INT NOT NULL,
  `idCritica` INT NOT NULL,
  PRIMARY KEY (`idUsuario`, `idCritica`),
  INDEX `fk_CurtidaCritica_Usuario1_idx` (`idUsuario` ASC) VISIBLE,
  INDEX `fk_CurtidaCritica_Critica1_idx` (`idCritica` ASC) VISIBLE,
  CONSTRAINT `fk_CurtidaCritica_Critica1`
    FOREIGN KEY (`idCritica`)
    REFERENCES `bdcritreel`.`critica` (`idCritica`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_CurtidaCritica_Usuario1`
    FOREIGN KEY (`idUsuario`)
    REFERENCES `bdcritreel`.`usuario` (`idUsuario`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `bdcritreel`.`filmesfavoritos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcritreel`.`filmesfavoritos` (
  `idUsuario` INT NOT NULL,
  `idFilme` INT NOT NULL,
  PRIMARY KEY (`idUsuario`, `idFilme`),
  INDEX `fk_FilmesFavoritos_Usuario1_idx` (`idUsuario` ASC) VISIBLE,
  INDEX `fk_FilmesFavoritos_Filme1_idx` (`idFilme` ASC) VISIBLE,
  CONSTRAINT `fk_FilmesFavoritos_Filme1`
    FOREIGN KEY (`idFilme`)
    REFERENCES `bdcritreel`.`filme` (`idFilme`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_FilmesFavoritos_Usuario1`
    FOREIGN KEY (`idUsuario`)
    REFERENCES `bdcritreel`.`usuario` (`idUsuario`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `bdcritreel`.`imagemfilme`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcritreel`.`imagemfilme` (
  `idImagemFilme` INT NOT NULL AUTO_INCREMENT,
  `caminho` LONGTEXT NOT NULL,
  `idFilme` INT NOT NULL,
  `tipo` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`idImagemFilme`),
  INDEX `fk_ImagemFilme_Filme1_idx` (`idFilme` ASC) VISIBLE,
  CONSTRAINT `fk_ImagemFilme_Filme1`
    FOREIGN KEY (`idFilme`)
    REFERENCES `bdcritreel`.`filme` (`idFilme`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `bdcritreel`.`seguidores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcritreel`.`seguidores` (
  `idSeguidor` INT NOT NULL,
  `idSeguido` INT NOT NULL,
  PRIMARY KEY (`idSeguidor`, `idSeguido`),
  INDEX `fk_Usuario_has_Usuario_Usuario2_idx` (`idSeguido` ASC) VISIBLE,
  INDEX `fk_Usuario_has_Usuario_Usuario1_idx` (`idSeguidor` ASC) VISIBLE,
  CONSTRAINT `fk_Usuario_has_Usuario_Usuario1`
    FOREIGN KEY (`idSeguidor`)
    REFERENCES `bdcritreel`.`usuario` (`idUsuario`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Usuario_has_Usuario_Usuario2`
    FOREIGN KEY (`idSeguido`)
    REFERENCES `bdcritreel`.`usuario` (`idUsuario`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
