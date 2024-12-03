/*
  Warnings:

  - You are about to alter the column `img1` on the `intercambios` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.
  - You are about to alter the column `img2` on the `intercambios` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.
  - You are about to alter the column `img3` on the `intercambios` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.
  - You are about to alter the column `img4` on the `intercambios` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.
  - You are about to alter the column `img5` on the `intercambios` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.
  - You are about to alter the column `img6` on the `intercambios` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.
  - You are about to alter the column `img7` on the `intercambios` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.
  - You are about to alter the column `img8` on the `intercambios` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.
  - You are about to alter the column `img9` on the `intercambios` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.
  - You are about to alter the column `img10` on the `intercambios` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `intercambios` MODIFY `img1` VARCHAR(191) NOT NULL,
    MODIFY `img2` VARCHAR(191) NULL,
    MODIFY `img3` VARCHAR(191) NULL,
    MODIFY `img4` VARCHAR(191) NULL,
    MODIFY `img5` VARCHAR(191) NULL,
    MODIFY `img6` VARCHAR(191) NULL,
    MODIFY `img7` VARCHAR(191) NULL,
    MODIFY `img8` VARCHAR(191) NULL,
    MODIFY `img9` VARCHAR(191) NULL,
    MODIFY `img10` VARCHAR(191) NULL;
