-- CreateTable
CREATE TABLE `USUARIO` (
    `idusuario` INTEGER NOT NULL AUTO_INCREMENT,
    `dtcadast` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `nome` VARCHAR(200) NULL,
    `email` VARCHAR(200) NULL,
    `sexo` VARCHAR(40) NULL,
    `nacionali` VARCHAR(100) NULL,
    `senha` VARCHAR(200) NULL,
    `stusuario` VARCHAR(10) NULL,
    `tpusuario` VARCHAR(10) NULL,
    `cpf` VARCHAR(20) NULL,
    `rg` VARCHAR(20) NULL,
    `nrpassa` VARCHAR(20) NULL,
    `nacional` VARCHAR(40) NULL,
    `facebook` VARCHAR(255) NULL,
    `twitter` VARCHAR(255) NULL,
    `instagram` VARCHAR(255) NULL,
    `linkedin` VARCHAR(255) NULL,
    `fotoPerfil` LONGBLOB NULL,
    `fotoCapa` LONGBLOB NULL,
    `CDRESET` VARCHAR(6) NULL,
    `idhost` INTEGER NULL,
    `idavaliacao` INTEGER NULL,

    UNIQUE INDEX `USUARIO_email_key`(`email`),
    UNIQUE INDEX `USUARIO_idhost_key`(`idhost`),
    INDEX `IDHOST_idx`(`idhost`),
    PRIMARY KEY (`idusuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CONTATO_HOST` (
    `idctt` INTEGER NOT NULL AUTO_INCREMENT,
    `nmprop` VARCHAR(100) NULL,
    `endereco` VARCHAR(100) NULL,
    `numero` VARCHAR(10) NULL,
    `complem` VARCHAR(100) NULL,
    `cdestado` VARCHAR(100) NULL,
    `cidade` VARCHAR(100) NULL,
    `nrcep` VARCHAR(100) NULL,
    `nrtel` VARCHAR(100) NULL,
    `tipoProp` VARCHAR(40) NULL,
    `email` VARCHAR(100) NULL,
    `latitude` VARCHAR(100) NULL,
    `longitude` VARCHAR(100) NULL,
    `stcadast` VARCHAR(10) NULL,
    `dtcadast` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`idctt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `INTERCAMBIOS` (
    `idinterc` INTEGER NOT NULL AUTO_INCREMENT,
    `nmlocal` VARCHAR(150) NOT NULL,
    `titulo` VARCHAR(200) NOT NULL,
    `descricao` LONGTEXT NOT NULL,
    `servicos` VARCHAR(250) NOT NULL,
    `beneficios` VARCHAR(250) NOT NULL,
    `duracao` VARCHAR(100) NOT NULL,
    `img1` LONGBLOB NOT NULL,
    `img2` LONGBLOB NULL,
    `img3` LONGBLOB NULL,
    `img4` LONGBLOB NULL,
    `img5` LONGBLOB NULL,
    `img6` LONGBLOB NULL,
    `img7` LONGBLOB NULL,
    `img8` LONGBLOB NULL,
    `img9` LONGBLOB NULL,
    `img10` LONGBLOB NULL,
    `idhost` INTEGER NOT NULL,

    INDEX `IDHOST_idx`(`idhost`),
    PRIMARY KEY (`idinterc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AVALIACAO` (
    `idavaliacao` INTEGER NOT NULL AUTO_INCREMENT,
    `avaliadoId` INTEGER NOT NULL,
    `avaliadorId` INTEGER NOT NULL,
    `avaliacao` INTEGER NOT NULL DEFAULT 0,
    `snaval` BOOLEAN NULL,
    `descricao` TEXT NULL,
    `dtaval` TIMESTAMP(6) NULL,
    `dtcadast` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`idavaliacao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

<<<<<<<< HEAD:hostXchange/prisma/migrations/20241130003736_/migration.sql
========
-- CreateTable
CREATE TABLE `MATCH` (
    `idmatch` INTEGER NOT NULL AUTO_INCREMENT,
    `idviajante` INTEGER NOT NULL,
    `idinterc` INTEGER NOT NULL,
    `dtcria` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`idmatch`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

>>>>>>>> joao:hostXchange/prisma/migrations/20241201001513_/migration.sql
-- AddForeignKey
ALTER TABLE `USUARIO` ADD CONSTRAINT `USUARIO_idhost_fkey` FOREIGN KEY (`idhost`) REFERENCES `CONTATO_HOST`(`idctt`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `INTERCAMBIOS` ADD CONSTRAINT `INTERCAMBIOS_idhost_fkey` FOREIGN KEY (`idhost`) REFERENCES `CONTATO_HOST`(`idctt`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AVALIACAO` ADD CONSTRAINT `AVALIACAO_avaliadoId_fkey` FOREIGN KEY (`avaliadoId`) REFERENCES `USUARIO`(`idusuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AVALIACAO` ADD CONSTRAINT `AVALIACAO_avaliadorId_fkey` FOREIGN KEY (`avaliadorId`) REFERENCES `USUARIO`(`idusuario`) ON DELETE CASCADE ON UPDATE CASCADE;
<<<<<<<< HEAD:hostXchange/prisma/migrations/20241130003736_/migration.sql
========

-- AddForeignKey
ALTER TABLE `MATCH` ADD CONSTRAINT `MATCH_idviajante_fkey` FOREIGN KEY (`idviajante`) REFERENCES `USUARIO`(`idusuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MATCH` ADD CONSTRAINT `MATCH_idinterc_fkey` FOREIGN KEY (`idinterc`) REFERENCES `INTERCAMBIOS`(`idinterc`) ON DELETE CASCADE ON UPDATE CASCADE;
>>>>>>>> joao:hostXchange/prisma/migrations/20241201001513_/migration.sql
