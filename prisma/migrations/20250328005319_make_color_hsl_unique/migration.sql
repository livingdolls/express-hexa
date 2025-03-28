/*
  Warnings:

  - A unique constraint covering the columns `[color_hsl]` on the table `color_option` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `color_option` MODIFY `color_hsl` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `color_option_color_hsl_key` ON `color_option`(`color_hsl`);
