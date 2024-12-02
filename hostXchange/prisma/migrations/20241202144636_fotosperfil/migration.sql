/*
  Warnings:

  - You are about to alter the column `fotoPerfil` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.
  - You are about to alter the column `fotoCapa` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `usuario` MODIFY `fotoPerfil` VARCHAR(191) NULL,
    MODIFY `fotoCapa` VARCHAR(191) NULL;
