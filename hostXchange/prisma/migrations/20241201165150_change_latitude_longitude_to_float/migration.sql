/*
  Warnings:

  - You are about to alter the column `latitude` on the `contato_host` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `Double`.
  - You are about to alter the column `longitude` on the `contato_host` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `Double`.

*/
-- AlterTable
ALTER TABLE `contato_host` MODIFY `latitude` DOUBLE NULL,
    MODIFY `longitude` DOUBLE NULL;
