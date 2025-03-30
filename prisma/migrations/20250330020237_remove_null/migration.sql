/*
  Warnings:

  - Made the column `sku` on table `image_metadata` required. This step will fail if there are existing NULL values in that column.
  - Made the column `color_option` on table `image_metadata` required. This step will fail if there are existing NULL values in that column.
  - Made the column `combine_swatch` on table `image_metadata` required. This step will fail if there are existing NULL values in that column.
  - Made the column `img_url` on table `image_metadata` required. This step will fail if there are existing NULL values in that column.
  - Made the column `img_overlay` on table `image_metadata` required. This step will fail if there are existing NULL values in that column.
  - Made the column `secure_url` on table `image_metadata` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `image_metadata` MODIFY `sku` TEXT NOT NULL,
    MODIFY `color_option` TEXT NOT NULL,
    MODIFY `combine_swatch` TEXT NOT NULL,
    MODIFY `img_url` TEXT NOT NULL,
    MODIFY `img_overlay` TEXT NOT NULL,
    MODIFY `secure_url` TEXT NOT NULL;
