-- CreateTable
CREATE TABLE `posts_urls` (
    `id` VARCHAR(191) NOT NULL,
    `postUrl` MEDIUMTEXT NOT NULL,
    `postId` VARCHAR(191) NOT NULL,
    `socialMediaAppId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `posts_urls` ADD CONSTRAINT `posts_urls_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts_urls` ADD CONSTRAINT `posts_urls_socialMediaAppId_fkey` FOREIGN KEY (`socialMediaAppId`) REFERENCES `social_media_apps`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
