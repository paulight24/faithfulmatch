-- CreateTable
CREATE TABLE `user_ai_memories` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `communicationStyle` TEXT NULL,
    `preferredTone` VARCHAR(191) NULL,
    `relationshipGoal` TEXT NULL,
    `preferredMatchTraits` JSON NULL,
    `avoidPatterns` JSON NULL,
    `successfulPatterns` JSON NULL,
    `coachNotes` TEXT NULL,
    `isEnabled` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_ai_memories_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profile_analyses` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `profileScore` INTEGER NOT NULL,
    `matchReadinessScore` INTEGER NOT NULL,
    `strengths` JSON NOT NULL,
    `weaknesses` JSON NOT NULL,
    `suggestedBioNatural` TEXT NULL,
    `suggestedBioPlayful` TEXT NULL,
    `suggestedBioFaithBased` TEXT NULL,
    `suggestedBioMarriageFocused` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `profile_analyses_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `photo_analyses` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `photoId` VARCHAR(191) NOT NULL,
    `overallScore` INTEGER NOT NULL,
    `shouldUse` BOOLEAN NOT NULL DEFAULT true,
    `bestUse` VARCHAR(191) NULL,
    `strengths` JSON NOT NULL,
    `weaknesses` JSON NOT NULL,
    `improvementTips` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `photo_analyses_userId_idx`(`userId`),
    INDEX `photo_analyses_photoId_idx`(`photoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ai_copilot_usage` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `feature` VARCHAR(191) NOT NULL,
    `isPremiumFeature` BOOLEAN NOT NULL DEFAULT false,
    `tokensUsed` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ai_copilot_usage_userId_idx`(`userId`),
    INDEX `ai_copilot_usage_feature_idx`(`feature`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_ai_memories` ADD CONSTRAINT `user_ai_memories_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile_analyses` ADD CONSTRAINT `profile_analyses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `photo_analyses` ADD CONSTRAINT `photo_analyses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ai_copilot_usage` ADD CONSTRAINT `ai_copilot_usage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
