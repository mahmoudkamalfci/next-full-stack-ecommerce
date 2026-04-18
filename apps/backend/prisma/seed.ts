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
    Array.from({ length: 100 }).map(() =>
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
  const categoriesToCreate = [
    { name: 'Men',         isFeatured: true  },
    { name: 'Women',       isFeatured: true  },
    { name: 'Kids',        isFeatured: true  },
    { name: 'Accessories', isFeatured: true  },
    { name: 'Sale',        isFeatured: false },
    { name: 'New Arrivals',isFeatured: false },
    { name: 'Shoes',       isFeatured: false },
    { name: 'Bags',        isFeatured: false },
    { name: 'Socks',       isFeatured: false },
    { name: 'UniSex',      isFeatured: false },
  ];
  const categories = await Promise.all(
    categoriesToCreate.map(({ name, isFeatured }) =>
      prisma.category.create({
        data: {
          name,
          slug: faker.helpers.slugify(name).toLowerCase(),
          description: faker.commerce.productDescription(),
          isFeatured,
        },
      })
    )
  );

  console.log('Seeding Products and Variants...');
  
  for (let i = 0; i < 1000; i++) {
    const productName = faker.commerce.productName();
    
    // Choose random category
    const category = faker.helpers.arrayElement(categories);

    // Create the base product
    const product = await prisma.product.create({
      data: {
        name: productName,
        slug: faker.helpers.slugify(productName + '-' + faker.string.alphanumeric(4)).toLowerCase(),
        description: faker.commerce.productDescription(),
        categories: {
            create: {
                category: { connect: { id: category.id } }
            }
        }
      }
    });

    // Create Options: Size and Color
    const sizeOption = await prisma.productOption.create({
        data: {
            productId: product.id,
            name: 'Size',
            values: {
                create: [
                    { value: 'S' },
                    { value: 'M' },
                    { value: 'L' }
                ]
            }
        },
        include: { values: true }
    });

    const colorOption = await prisma.productOption.create({
        data: {
            productId: product.id,
            name: 'Color',
            values: {
                create: [
                    { value: 'Red' },
                    { value: 'Blue' }
                ]
            }
        },
        include: { values: true }
    });

    // Generate Cartesian Product of Option Values to form Variants
    for (const size of sizeOption.values) {
        for (const color of colorOption.values) {
            await prisma.productVariant.create({
               data: {
                   productId: product.id,
                   sku: `${product.id}-${size.value}-${color.value}`.toUpperCase(),
                   price: faker.commerce.price({ min: 10, max: 200 }),
                   inventoryQuantity: faker.number.int({ min: 0, max: 100 }),
                   optionValues: {
                       create: [
                           { optionValue: { connect: { id: size.id } } },
                           { optionValue: { connect: { id: color.id } } }
                       ]
                   }
               }
            });
        }
    }
  }

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
