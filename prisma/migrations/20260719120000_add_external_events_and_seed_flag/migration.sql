-- Marks demo/filler accounts so they can be bulk-hidden later without
-- guessing which accounts were real vs. seeded.
ALTER TABLE `users` ADD COLUMN `isSeedData` BOOLEAN NOT NULL DEFAULT false;

-- Curated listings for real third-party events (e.g. Eventbrite). RSVP is
-- disabled client-side for these; organizerUserId still points at a system
-- curator account since the FK is required.
ALTER TABLE `events` ADD COLUMN `isExternal` BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE `events` ADD COLUMN `externalUrl` TEXT NULL;
ALTER TABLE `events` ADD COLUMN `source` VARCHAR(191) NULL;
