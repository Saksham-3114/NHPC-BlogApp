import { PrismaClient, Role, Publish } from './generated/prisma';
import { hash } from 'bcrypt'

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');
  // Delete existing data
    await prisma.user.deleteMany();
    await prisma.post.deleteMany();
    await prisma.like.deleteMany();
    await prisma.categories.deleteMany();

    const pass = "123123123"
    const hashpass = await hash(pass,10);
  // Create Users
  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      password: hashpass,
      name: 'Alice',
      role: Role.user,
      bio: 'Climate enthusiast',
      designation: 'Hydrologist'
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      password: hashpass,
      name: 'Bob',
      role: Role.admin,
      bio: 'Tech Lead',
      designation: 'Engineer'
    },
  });

  // Create Categories
  const category1 = await prisma.categories.create({
    data: {
      name: 'Sustainability',
    },
  });

  const category2 = await prisma.categories.create({
    data: {
      name: 'Technology',
    },
  });

  // Create Posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Green Energy for the Future',
      summary: 'A deep dive into hydro power and sustainability.',
      content: 'This is a detailed content about hydro power.',
      tags: ['hydropower', 'green', 'energy'],
      authorId: user1.id,
      categoryId: category1.id,
      published: Publish.true,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'AI in Hydrology',
      content: 'Exploring AI use in river flow prediction.',
      tags: ['AI', 'hydrology'],
      authorId: user2.id,
      categoryId: category2.id,
      published: Publish.false,
    },
  });

  // Add Likes
  await prisma.like.create({
    data: {
      authorId: user1.id,
      postId: post2.id,
      liked: true,
    },
  });

  await prisma.like.create({
    data: {
      authorId: user2.id,
      postId: post1.id,
      liked: true,
    },
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error while seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
