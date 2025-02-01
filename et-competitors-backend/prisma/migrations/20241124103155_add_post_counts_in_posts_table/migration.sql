-- AlterTable
ALTER TABLE `posts` ADD COLUMN `postCounts` INTEGER NOT NULL DEFAULT 1 AFTER `description`;
