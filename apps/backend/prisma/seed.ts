import { prisma } from '../src/lib/prisma.js';
import { faker } from '@faker-js/faker';
import process from 'process';

async function main() {
  console.log('Clearing database...');
  // The order is important here because of constraints
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.variantOptionValue.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productOptionValue.deleteMany();
  await prisma.productOption.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log('Database cleared.');

  console.log('Seeding Users...');
  const users = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.user.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          passwordHash: faker.internet.password(), // mocked for now
          addresses: {
             create: {
                street: faker.location.streetAddress(),
                city: faker.location.city(),
                state: faker.location.state(),
                zip: faker.location.zipCode(),
                country: faker.location.country(),
                isDefault: true
             }
          }
        },
      })
    )
  );

  console.log('Seeding Categories...');
  const categoriesToCreate = ['Electronics', 'Clothing', 'Home', 'Toys', 'Sports'];
  const categories = await Promise.all(
    categoriesToCreate.map((name) =>
      prisma.category.create({
        data: {
          name,
          slug: faker.helpers.slugify(name).toLowerCase(),
          description: faker.commerce.productDescription()
        },
      })
    )
  );

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
