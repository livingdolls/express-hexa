-- CreateTable
CREATE TABLE `image_metadata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sku` TEXT NULL,
    `color_option` TEXT NULL,
    `product_id_magento` INTEGER NULL,
    `combine_swatch` TEXT NULL,
    `img_url` TEXT NULL,
    `img_overlay` TEXT NULL,
    `secure_url` TEXT NULL,
    `img_128` TEXT NULL,
    `img_256` TEXT NULL,
    `img_384` TEXT NULL,
    `img_512` TEXT NULL,
    `img_768` TEXT NULL,
    `img_1024` TEXT NULL,
    `img_1920` TEXT NULL,
    `created_at` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `color_option` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `color_hsl` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
