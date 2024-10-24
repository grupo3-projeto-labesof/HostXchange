-- CreateTable
CREATE TABLE `USUARIO` (
    `idusuario` INTEGER NOT NULL AUTO_INCREMENT,
    `dtcadast` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `nome` VARCHAR(200) NULL,
    `email` VARCHAR(200) NULL,
    `senha` VARCHAR(200) NULL,
    `stusuario` VARCHAR(10) NULL,
    `tpusuario` VARCHAR(10) NULL,
    `cpf` VARCHAR(20) NULL,
    `rg` VARCHAR(20) NULL,
    `nrpassa` VARCHAR(20) NULL,

    PRIMARY KEY (`idusuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CONTATO_HOST` (
    `idctt` INTEGER NOT NULL AUTO_INCREMENT,
    `nmprop` VARCHAR(100) NULL,
    `endereco` VARCHAR(100) NULL,
    `cdestado` VARCHAR(100) NULL,
    `nrcep` VARCHAR(100) NULL,
    `nrtel` VARCHAR(100) NULL,
    `email` VARCHAR(100) NULL,
    `stcadast` VARCHAR(10) NULL,
    `dtcadast` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`idctt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `intercambios` (
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

-- AddForeignKey
ALTER TABLE `intercambios` ADD CONSTRAINT `intercambios_idhost_fkey` FOREIGN KEY (`idhost`) REFERENCES `CONTATO_HOST`(`idctt`) ON DELETE RESTRICT ON UPDATE CASCADE;
