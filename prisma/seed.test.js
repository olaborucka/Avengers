const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Czyszczenie bazy testowej...');
  await prisma.incidentCategory.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.hero.deleteMany();
  await prisma.category.deleteMany();

  // 5 bohaterów z jawnym ID
  await prisma.hero.createMany({
    data: [
      { id: 1, name: 'Test Flight', power: 'flight', status: 'available', missionsCount: 10 },
      { id: 2, name: 'Test Strength', power: 'strength', status: 'busy', missionsCount: 5 },
      { id: 3, name: 'Test Telepathy', power: 'telepathy', status: 'retired', missionsCount: 50 },
      { id: 4, name: 'Test Speed', power: 'speed', status: 'available', missionsCount: 2 },
      { id: 5, name: 'Test Invisibility', power: 'invisibility', status: 'busy', missionsCount: 8 }
    ]
  });

  // 8 incydentów z jawnym ID
  await prisma.incident.createMany({
    data: [
      { id: 1, location: 'Loc 1', level: 'critical', status: 'open', heroId: null },
      { id: 2, location: 'Loc 2', level: 'medium', status: 'open', heroId: null },
      { id: 3, location: 'Loc 3', level: 'low', status: 'open', heroId: null },
      { id: 4, location: 'Loc 4', level: 'critical', status: 'assigned', heroId: 1, assignedAt: new Date() },
      { id: 5, location: 'Loc 5', level: 'medium', status: 'assigned', heroId: 2, assignedAt: new Date() },
      { id: 6, location: 'Loc 6', level: 'low', status: 'resolved', heroId: 3, assignedAt: new Date(), resolvedAt: new Date() },
      { id: 7, location: 'Loc 7', level: 'critical', status: 'resolved', heroId: 4, assignedAt: new Date(), resolvedAt: new Date() },
      { id: 8, location: 'Loc 8', level: 'medium', status: 'resolved', heroId: 5, assignedAt: new Date(), resolvedAt: new Date() }
    ]
  });
  console.log('Seedy testowe wygenerowane!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });