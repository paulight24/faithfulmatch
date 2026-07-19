"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const email = process.argv[2];
    if (!email) {
        console.error('Usage: npx ts-node scripts/grant-premium.ts <email>');
        process.exit(1);
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        console.error(`No user found with email ${email}`);
        process.exit(1);
    }
    const subscription = await prisma.subscription.upsert({
        where: { userId: user.id },
        create: {
            userId: user.id,
            plan: 'PREMIUM',
            status: 'ACTIVE',
            currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
        update: {
            plan: 'PREMIUM',
            status: 'ACTIVE',
            currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
    });
    console.log(`Granted PREMIUM to ${email}:`, subscription);
}
main()
    .catch((err) => {
    console.error(err);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=grant-premium.js.map