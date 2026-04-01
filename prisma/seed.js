const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  // WYMÓG: Deterministyczne dane
  faker.seed(7);

  console.log('Czyszczenie bazy danych...');
  // WYMÓG: Czyszczenie w konkretnej kolejności
  await prisma.incidentCategory.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.hero.deleteMany();
  await prisma.category.deleteMany();

  console.log('Tworzenie 5 kategorii...');
  const categoryNames = ['flood', 'fire', 'robbery', 'terrorism', 'accident'];
  for (const name of categoryNames) {
    await prisma.category.create({ data: { name } });
  }
  const allCategories = await prisma.category.findMany();

  console.log('Tworzenie 20 bohaterów...');
  const powers = ['flight', 'strength', 'telepathy', 'speed', 'invisibility'];
  const heroStatuses = ['available', 'busy', 'retired'];
  const heroes = [];

  for (let i = 0; i < 20; i++) {
    const hero = await prisma.hero.create({
      data: {
        name: faker.person.firstName() + ' ' + faker.word.adjective(),
        power: faker.helpers.arrayElement(powers),
        status: faker.helpers.arrayElement(heroStatuses),
        missionsCount: faker.number.int({ min: 0, max: 100 })
      }
    });
    heroes.push(hero);
  }

  console.log('Tworzenie 60 incydentów...');
  const incidentLevels = ['low', 'medium', 'critical'];
  const incidentStatuses = ['open', 'assigned', 'resolved'];

  for (let i = 0; i < 60; i++) {
    const status = faker.helpers.arrayElement(incidentStatuses);
    let heroId = null;

    if (status !== 'open') {
      heroId = faker.helpers.arrayElement(heroes).id;
    }

    // Losujemy od 1 do 3 kategorii dla incydentu
    const randomCategories = faker.helpers.arrayElements(allCategories, { min: 1, max: 3 });

    await prisma.incident.create({
      data: {
        location: faker.location.streetAddress(),
        district: faker.location.city(),
        level: faker.helpers.arrayElement(incidentLevels),
        status: status,
        heroId: heroId,
        assignedAt: status !== 'open' ? new Date() : null,
        resolvedAt: status === 'resolved' ? new Date() : null,
        // WYMÓG: tworzenie rekordów IncidentCategory przez zagnieżdżone create
        categories: {
          create: randomCategories.map(cat => ({
            category: { connect: { id: cat.id } }
          }))
        }
      }
    });
  }
  console.log('Seedy zakończone sukcesem!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });