/*
  Warnings:

  - You are about to drop the column `img_1024` on the `image_metadata` table. All the data in the column will be lost.
  - You are about to drop the column `img_128` on the `image_metadata` table. All the data in the column will be lost.
  - You are about to drop the column `img_1920` on the `image_metadata` table. All the data in the column will be lost.
  - You are about to drop the column `img_256` on the `image_metadata` table. All the data in the column will be lost.
  - You are about to drop the column `img_384` on the `image_metadata` table. All the data in the column will be lost.
  - You are about to drop the column `img_512` on the `image_metadata` table. All the data in the column will be lost.
  - You are about to drop the column `img_768` on the `image_metadata` table. All the data in the column will be lost.
  - Made the column `created_at` on table `image_metadata` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `image_metadata` DROP COLUMN `img_1024`,
    DROP COLUMN `img_128`,
    DROP COLUMN `img_1920`,
    DROP COLUMN `img_256`,
    DROP COLUMN `img_384`,
    DROP COLUMN `img_512`,
    DROP COLUMN `img_768`,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `ImageVariant` (
    `id` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `imageId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ImageVariant` ADD CONSTRAINT `ImageVariant_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `image_metadata`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
