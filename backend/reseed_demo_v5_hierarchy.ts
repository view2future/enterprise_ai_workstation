import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Configuration
const ENTERPRISE_COUNT = 550;
const REGION_FOCUS = 'SW'; // Southwest
const ENV_SCOPE = 'DEMO';

// Cities and Coordinates (Lat, Lng)
const CITIES = [
  { name: '成都', lat: 30.5728, lng: 104.0668, weight: 0.60 },
  { name: '重庆', lat: 29.5630, lng: 106.5516, weight: 0.15 },
  { name: '西安', lat: 34.3416, lng: 108.9398, weight: 0.15 }, // Per user request: 2nd/3rd tier presence
  { name: '昆明', lat: 25.0443, lng: 102.7214, weight: 0.05 },
  { name: '贵阳', lat: 26.6470, lng: 106.6302, weight: 0.05 },
];

const INDUSTRIES = ['制造', '能源', '金融', '互联网', '教育', '医疗', '政务', '零售'];
const STAGES = ['LEAD', 'EMPOWERING', 'ADOPTED', 'ECO_PRODUCT', 'POWERED_BY', 'CASE_STUDY'];
const TECH_USAGE = ['飞桨', '文心', '飞桨+文心', 'None'];

function getRandomItem(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getWeightedCity() {
  const rand = Math.random();
  let cumulative = 0;
  for (const city of CITIES) {
    cumulative += city.weight;
    if (rand < cumulative) return city;
  }
  return CITIES[0];
}

// Coordinate Jitter (approx 5-10km radius)
function getJitteredCoord(base: number) {
  return base + (Math.random() - 0.5) * 0.15; 
}

// Date Generator (Rising Trend)
function getRandomDateInPast3Years() {
  const now = new Date();
  const threeYearsAgo = new Date();
  threeYearsAgo.setFullYear(now.getFullYear() - 3);
  
  // Bias towards recent dates (y = x^2 distribution)
  const rand = Math.pow(Math.random(), 0.5); // 0.5 power makes small numbers bigger? No, wait. 
  // Let's keep it simple: linear random, but filtered.
  // Actually, to show "prosperity", more recent dates should be more frequent.
  // Random time from 0 to total_ms. higher values = closer to now.
  const totalDuration = now.getTime() - threeYearsAgo.getTime();
  // Using power > 1 biases towards larger numbers (closer to now)
  const randomDuration = Math.pow(Math.random(), 0.3) * totalDuration; 
  
  return new Date(now.getTime() - randomDuration);
}

async function main() {
  console.log('🚀 Starting V5 Neural Hub Demo Seeding...');
  const passwordHash = await bcrypt.hash('Demo1234!', 10);

  // 1. Clean Demo Data
  console.log('🧹 Cleaning old demo data...');
  await prisma.enterprise.deleteMany({ where: { envScope: ENV_SCOPE } });
  await prisma.user.deleteMany({ where: { envScope: ENV_SCOPE } });

  // 2. Create Hierarchy
  console.log('🏗️ Building Organizational Hierarchy...');

  // Level 1: Cortex (Global Viewer for Demo)
  const cortex = await prisma.user.create({
    data: {
      username: 'demo_cortex',
      email: 'cortex@demo.nexus',
      role: 'CORTEX',
      department: 'HEADQUARTERS',
      envScope: ENV_SCOPE,
      password: passwordHash,
      firstName: 'Demo',
      lastName: 'Commander',
    }
  });

  // Level 2: Ganglion (Regional Manager - Southwest)
  const ganglion = await prisma.user.create({
    data: {
      username: 'demo_manager_sw',
      email: 'manager.sw@demo.nexus',
      role: 'GANGLION',
      department: 'SOUTHWEST_REGION', // Specific Node
      region: 'SW',
      envScope: ENV_SCOPE,
      password: passwordHash,
      firstName: 'SW',
      lastName: 'Director',
      managerId: cortex.id
    }
  });

  // Level 3: Neurons (Staff - 8 people)
  const neurons = [];
  for (let i = 1; i <= 8; i++) {
    const neuron = await prisma.user.create({
      data: {
        username: `demo_staff_sw_${i}`,
        email: `staff.sw.${i}@demo.nexus`,
        role: 'NEURON',
        department: 'SOUTHWEST_REGION',
        region: 'SW',
        envScope: ENV_SCOPE,
        password: passwordHash,
        firstName: 'Staff',
        lastName: `${i}`,
        managerId: ganglion.id
      }
    });
    neurons.push(neuron);
  }

  console.log(`✅ Hierarchy created: 1 Cortex, 1 Ganglion, ${neurons.length} Neurons.`);

  // 3. Create Enterprises
  console.log(`🏭 Manufacturing ${ENTERPRISE_COUNT} Enterprises...`);
  
  const enterprises = [];
  for (let i = 0; i < ENTERPRISE_COUNT; i++) {
    const city = getWeightedCity();
    const owner = getRandomItem(neurons); // Assign to a random staff in the region
    const createdAt = getRandomDateInPast3Years();
    
    // Business Logic
    const tech = getRandomItem(TECH_USAGE);
    const stage = getRandomItem(STAGES);
    const isPoweredBy = Math.random() > 0.8; // 20% chance
    const isHighTech = Math.random() > 0.7;
    const isSpecialized = Math.random() > 0.8;
    
    enterprises.push({
      enterpriseName: `SW_Demo_Ent_${i}_${Math.floor(Math.random()*1000)}`,
      envScope: ENV_SCOPE,
      base: city.name,
      region: REGION_FOCUS, // 确保 region 字段被正确填充为 SW
      latitude: getJitteredCoord(city.lat),
      longitude: getJitteredCoord(city.lng),
      ownerId: owner.id,
      
      // Core Biz Fields
      industry: getRandomItem(INDUSTRIES),
      clueStage: stage,
      feijiangWenxin: tech,
      
      // Flags
      isPoweredBy: isPoweredBy,
      isHighTech: isHighTech,
      isSpecialized: isSpecialized,
      
      // Metadata
      status: 'active',
      createdAt: createdAt,
      updatedAt: createdAt,
      
      // Random extras
      registeredCapital: BigInt(Math.floor(Math.random() * 100000000)),
      employeeCount: Math.floor(Math.random() * 500),
      partnerLevel: Math.random() > 0.9 ? 'GOLD' : (Math.random() > 0.7 ? 'SILVER' : 'NONE'),
      certExpiryDate: new Date(new Date().getTime() + Math.random() * 1000 * 60 * 60 * 24 * 365 * 2) // Future date
    });
  }

  // Batch insert
  // Prisma createMany doesn't support relation connection easily with SQLite sometimes in older versions, 
  // but standard createMany works for basic fields.
  // However, we need to be careful. SQLite createMany is supported in recent Prisma.
  // Let's try createMany.
  
  await prisma.enterprise.createMany({
    data: enterprises
  });

  console.log(`✅ ${ENTERPRISE_COUNT} Enterprises seeded into DEMO environment.`);
  console.log('🎉 V5 Demo Data Ready. Login with: demo_manager_sw / Demo1234!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
