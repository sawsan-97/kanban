-- CreateTable
CREATE TABLE `boards` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `columns` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `order` INTEGER NOT NULL,
    `boardId` VARCHAR(191) NOT NULL,

    INDEX `columns_boardId_idx`(`boardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tasks` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(500) NOT NULL,
    `description` TEXT NULL,
    `order` INTEGER NOT NULL,
    `columnId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `tasks_columnId_idx`(`columnId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subtasks` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(500) NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `taskId` VARCHAR(191) NOT NULL,

    INDEX `subtasks_taskId_idx`(`taskId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `columns` ADD CONSTRAINT `columns_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `boards`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_columnId_fkey` FOREIGN KEY (`columnId`) REFERENCES `columns`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subtasks` ADD CONSTRAINT `subtasks_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `tasks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
