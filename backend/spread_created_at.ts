import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function spreadCreatedAt() {
  console.log('Starting spread_created_at script...');

  // Target both PROD and DEMO to be comprehensive
  const enterprises = await prisma.enterprise.findMany({
    where: {
      status: 'active',
    },
    select: {
      id: true,
      envScope: true,
    },
  });

  console.log(`Found ${enterprises.length} active enterprises total.`);

  if (enterprises.length === 0) {
    console.log('No enterprises found. Exiting.');
    return;
  }

  // Shuffle array to randomize which enterprise gets which date
  const shuffled = enterprises.sort(() => 0.5 - Math.random());
  
  const total = shuffled.length;
  
  // Distribution config
  const now = new Date();
  const oneYear = 365 * 24 * 60 * 60 * 1000;
  
  // Split into 3 years
  const year1Count = Math.floor(total * 0.15); // Oldest (3 years ago)
  const year2Count = Math.floor(total * 0.30); // Middle (2 years ago)
  const year3Count = total - year1Count - year2Count; // Newest (Last year)

  console.log(`Distribution Plan:`);
  console.log(`- Year 1 (Oldest): ${year1Count}`);
  console.log(`- Year 2 (Middle): ${year2Count}`);
  console.log(`- Year 3 (Newest): ${year3Count}`);

  let updatedCount = 0;

  for (let i = 0; i < total; i++) {
    const ent = shuffled[i];
    let minTime, maxTime;

    if (i < year1Count) {
      // 3 years ago to 2 years ago
      minTime = now.getTime() - (3 * oneYear);
      maxTime = now.getTime() - (2 * oneYear);
    } else if (i < year1Count + year2Count) {
      // 2 years ago to 1 year ago
      minTime = now.getTime() - (2 * oneYear);
      maxTime = now.getTime() - (1 * oneYear);
    } else {
      // 1 year ago to now
      minTime = now.getTime() - (1 * oneYear);
      maxTime = now.getTime();
    }

    const randomTime = minTime + Math.random() * (maxTime - minTime);
    const newDate = new Date(randomTime);

    await prisma.enterprise.update({
      where: { id: ent.id },
      data: { createdAt: newDate },
    });

    updatedCount++;
    if (updatedCount % 50 === 0) {
      process.stdout.write('.');
    }
  }

  console.log(`\nSuccessfully updated ${updatedCount} enterprises.`);
}

spreadCreatedAt()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
