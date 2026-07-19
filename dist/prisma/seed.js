"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new client_1.PrismaClient();
const SEED_PASSWORD = 'SeedUser123!';
const SEED_PROFILES = [
    {
        email: 'grace.johnson@seed.fm',
        firstName: 'Grace',
        displayName: 'Grace J.',
        gender: client_1.Gender.FEMALE,
        birthday: '1996-03-14',
        denomination: 'Non-Denominational',
        faithLevel: client_1.FaithLevel.VERY_ACTIVE,
        churchInvolvement: client_1.ChurchInvolvement.WEEKLY,
        marriageIntent: client_1.MarriageIntent.WITHIN_ONE_YEAR,
        bio: 'Worship leader, coffee lover, and firm believer that God writes the best love stories. Looking for someone who leads with faith and loves with intention. My perfect Saturday is morning devotion, a good brunch, and an adventure outdoors.',
        occupation: 'Registered Nurse',
        city: 'Atlanta', state: 'Georgia', country: 'United States', zip: '30301',
        photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop',
    },
    {
        email: 'david.wright@seed.fm',
        firstName: 'David',
        displayName: 'David W.',
        gender: client_1.Gender.MALE,
        birthday: '1993-07-22',
        denomination: 'Baptist',
        faithLevel: client_1.FaithLevel.VERY_ACTIVE,
        churchInvolvement: client_1.ChurchInvolvement.WEEKLY,
        marriageIntent: client_1.MarriageIntent.READY_NOW,
        bio: 'Youth pastor with a heart for mentoring and building Christ-centered families. I believe marriage is a ministry and I\'m ready to find my partner in that calling. I enjoy hiking, cooking for friends, and deep theological conversations.',
        occupation: 'Youth Pastor',
        city: 'Nashville', state: 'Tennessee', country: 'United States', zip: '37201',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
    },
    {
        email: 'sarah.mitchell@seed.fm',
        firstName: 'Sarah',
        displayName: 'Sarah M.',
        gender: client_1.Gender.FEMALE,
        birthday: '1998-11-08',
        denomination: 'Presbyterian',
        faithLevel: client_1.FaithLevel.ACTIVE,
        churchInvolvement: client_1.ChurchInvolvement.REGULARLY,
        marriageIntent: client_1.MarriageIntent.WITHIN_ONE_YEAR,
        bio: 'Elementary school teacher who believes in the power of kindness and prayer. I grew up going to church camp every summer and those memories shaped who I am. Looking for a man of faith who values family, laughter, and Sunday mornings together.',
        occupation: 'Teacher',
        city: 'Charlotte', state: 'North Carolina', country: 'United States', zip: '28201',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop',
    },
    {
        email: 'james.carter@seed.fm',
        firstName: 'James',
        displayName: 'James C.',
        gender: client_1.Gender.MALE,
        birthday: '1991-05-19',
        denomination: 'Methodist',
        faithLevel: client_1.FaithLevel.ACTIVE,
        churchInvolvement: client_1.ChurchInvolvement.REGULARLY,
        marriageIntent: client_1.MarriageIntent.WITHIN_ONE_YEAR,
        bio: 'Software engineer by day, worship guitarist by night. My faith journey has taught me that patience and trust lead to the best outcomes. I\'m looking for a woman who challenges me spiritually and isn\'t afraid to be her authentic self.',
        occupation: 'Software Engineer',
        city: 'Austin', state: 'Texas', country: 'United States', zip: '73301',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
    },
    {
        email: 'olivia.brown@seed.fm',
        firstName: 'Olivia',
        displayName: 'Olivia B.',
        gender: client_1.Gender.FEMALE,
        birthday: '1995-09-03',
        denomination: 'Non-Denominational',
        faithLevel: client_1.FaithLevel.GROWING,
        churchInvolvement: client_1.ChurchInvolvement.OCCASIONALLY,
        marriageIntent: client_1.MarriageIntent.WITHIN_THREE_YEARS,
        bio: 'Marketing creative with a growing faith. I recently joined a small group and it\'s changed my life. I love traveling, trying new restaurants, and having honest conversations about life and God. Looking for someone patient who wants to grow together.',
        occupation: 'Marketing Manager',
        city: 'Denver', state: 'Colorado', country: 'United States', zip: '80201',
        photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop',
    },
    {
        email: 'michael.davis@seed.fm',
        firstName: 'Michael',
        displayName: 'Michael D.',
        gender: client_1.Gender.MALE,
        birthday: '1990-01-28',
        denomination: 'Pentecostal',
        faithLevel: client_1.FaithLevel.VERY_ACTIVE,
        churchInvolvement: client_1.ChurchInvolvement.WEEKLY,
        marriageIntent: client_1.MarriageIntent.READY_NOW,
        bio: 'Firefighter and men\'s group leader at my church. I believe real strength comes from surrendering to God. Family is everything to me — I can\'t wait to build one with the right woman. I love barbecuing, playing basketball, and early morning prayer.',
        occupation: 'Firefighter',
        city: 'Dallas', state: 'Texas', country: 'United States', zip: '75201',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop',
    },
    {
        email: 'emma.wilson@seed.fm',
        firstName: 'Emma',
        displayName: 'Emma W.',
        gender: client_1.Gender.FEMALE,
        birthday: '1997-06-11',
        denomination: 'Catholic',
        faithLevel: client_1.FaithLevel.ACTIVE,
        churchInvolvement: client_1.ChurchInvolvement.WEEKLY,
        marriageIntent: client_1.MarriageIntent.WITHIN_ONE_YEAR,
        bio: 'Pediatric resident who finds strength in daily Mass and the rosary. My faith is the foundation of everything I do. Looking for a man who understands the sacredness of marriage and wants to raise children in the faith. I love reading, baking, and long walks.',
        occupation: 'Pediatric Resident',
        city: 'Chicago', state: 'Illinois', country: 'United States', zip: '60601',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop',
    },
    {
        email: 'joshua.taylor@seed.fm',
        firstName: 'Joshua',
        displayName: 'Josh T.',
        gender: client_1.Gender.MALE,
        birthday: '1994-12-05',
        denomination: 'Non-Denominational',
        faithLevel: client_1.FaithLevel.ACTIVE,
        churchInvolvement: client_1.ChurchInvolvement.REGULARLY,
        marriageIntent: client_1.MarriageIntent.WITHIN_THREE_YEARS,
        bio: 'Physical therapist and small group leader. I believe in being intentional about relationships and letting God lead the way. I\'m an avid hiker, love board game nights, and I volunteer at a local food bank on weekends. Faith, service, and fun — that\'s my vibe.',
        occupation: 'Physical Therapist',
        city: 'Portland', state: 'Oregon', country: 'United States', zip: '97201',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop',
    },
    {
        email: 'hannah.moore@seed.fm',
        firstName: 'Hannah',
        displayName: 'Hannah M.',
        gender: client_1.Gender.FEMALE,
        birthday: '1999-04-20',
        denomination: 'Assembly of God',
        faithLevel: client_1.FaithLevel.VERY_ACTIVE,
        churchInvolvement: client_1.ChurchInvolvement.WEEKLY,
        marriageIntent: client_1.MarriageIntent.WITHIN_ONE_YEAR,
        bio: 'Graphic designer with a passion for missions. I\'ve been on three mission trips and each one deepened my faith in incredible ways. I\'m looking for a man who loves Jesus more than anything and dreams of making an impact together. Let\'s build something beautiful.',
        occupation: 'Graphic Designer',
        city: 'Phoenix', state: 'Arizona', country: 'United States', zip: '85001',
        photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop',
    },
    {
        email: 'caleb.anderson@seed.fm',
        firstName: 'Caleb',
        displayName: 'Caleb A.',
        gender: client_1.Gender.MALE,
        birthday: '1992-08-16',
        denomination: 'Baptist',
        faithLevel: client_1.FaithLevel.ACTIVE,
        churchInvolvement: client_1.ChurchInvolvement.REGULARLY,
        marriageIntent: client_1.MarriageIntent.READY_NOW,
        bio: 'CPA by trade, worship team drummer by calling. I believe in living a life of integrity and putting God first in every decision. My ideal date is a sunset hike followed by deep conversation over coffee. Ready for the real thing — no games.',
        occupation: 'Certified Public Accountant',
        city: 'Raleigh', state: 'North Carolina', country: 'United States', zip: '27601',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop',
    },
    {
        email: 'abigail.thomas@seed.fm',
        firstName: 'Abigail',
        displayName: 'Abby T.',
        gender: client_1.Gender.FEMALE,
        birthday: '1996-10-30',
        denomination: 'Lutheran',
        faithLevel: client_1.FaithLevel.GROWING,
        churchInvolvement: client_1.ChurchInvolvement.OCCASIONALLY,
        marriageIntent: client_1.MarriageIntent.WITHIN_THREE_YEARS,
        bio: 'Photographer who sees God in the details — sunsets, smiles, and everyday moments. I\'m on a journey of deepening my faith and would love a partner who\'s patient with that process. I love road trips, golden hour, and conversations that go beyond the surface.',
        occupation: 'Photographer',
        city: 'San Diego', state: 'California', country: 'United States', zip: '92101',
        photoUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop',
    },
    {
        email: 'nathan.harris@seed.fm',
        firstName: 'Nathan',
        displayName: 'Nate H.',
        gender: client_1.Gender.MALE,
        birthday: '1989-02-14',
        denomination: 'Evangelical',
        faithLevel: client_1.FaithLevel.VERY_ACTIVE,
        churchInvolvement: client_1.ChurchInvolvement.WEEKLY,
        marriageIntent: client_1.MarriageIntent.READY_NOW,
        bio: 'High school football coach and Bible study leader. I coach my boys to be men of character and I try to live that out daily. I\'m looking for a woman of deep faith who wants a Christ-centered home filled with love, laughter, and lots of family dinners.',
        occupation: 'Football Coach & Teacher',
        city: 'Jacksonville', state: 'Florida', country: 'United States', zip: '32099',
        photoUrl: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400&h=500&fit=crop',
    },
];
async function main() {
    if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PROD_SEED !== 'true') {
        throw new Error('Refusing to run demo seed data against a production environment. '
            + 'Set ALLOW_PROD_SEED=true if you really intend to do this.');
    }
    const passwordHash = await bcrypt.hash(SEED_PASSWORD, 12);
    console.log(`Seeding ${SEED_PROFILES.length} demo profiles...`);
    for (const sp of SEED_PROFILES) {
        const existing = await prisma.user.findUnique({ where: { email: sp.email } });
        if (existing) {
            console.log(`  ⏭  Skipping ${sp.firstName} (${sp.email}) — already exists`);
            continue;
        }
        const dob = new Date(sp.birthday);
        const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        const user = await prisma.user.create({
            data: {
                email: sp.email,
                passwordHash,
                status: client_1.UserStatus.ACTIVE,
                emailVerifiedAt: new Date(),
            },
        });
        await prisma.profile.create({
            data: {
                userId: user.id,
                firstName: sp.firstName,
                displayName: sp.displayName,
                birthday: dob,
                gender: sp.gender,
                denomination: sp.denomination,
                faithLevel: sp.faithLevel,
                churchInvolvement: sp.churchInvolvement,
                marriageIntent: sp.marriageIntent,
                bio: sp.bio,
                occupation: sp.occupation,
                city: sp.city,
                state: sp.state,
                country: sp.country,
                zip: sp.zip,
                profileCompletionPercent: 100,
                visibilityStatus: client_1.ProfileVisibilityStatus.VISIBLE,
            },
        });
        await prisma.profilePhoto.create({
            data: {
                userId: user.id,
                url: sp.photoUrl,
                storageKey: `seed/${sp.email.split('@')[0]}.jpg`,
                storageProvider: 'seed',
                mimeType: 'image/jpeg',
                sizeBytes: 0,
                sortOrder: 0,
                isPrimary: true,
                moderationStatus: client_1.PhotoModerationStatus.APPROVED,
            },
        });
        await prisma.preference.create({
            data: {
                userId: user.id,
                genderPreference: sp.gender === client_1.Gender.MALE ? client_1.Gender.FEMALE : client_1.Gender.MALE,
                minAge: Math.max(18, age - 5),
                maxAge: age + 5,
                maxDistanceMiles: 100,
            },
        });
        console.log(`  ✅ ${sp.firstName} (${sp.email}) — ${sp.city}, ${sp.state} — age ${age}`);
    }
    console.log('\nDone! All seed users have password: ' + SEED_PASSWORD);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map