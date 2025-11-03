import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Note: In a real scenario, you would need actual user IDs from Supabase Auth
  // This seed script is for testing purposes only
  // Replace the userId with an actual UUID from your Supabase Auth users table

  const testUserId = '00000000-0000-0000-0000-000000000000' // Replace with real user ID

  // Create sample pets
  const pets = [
    {
      userId: testUserId,
      name: 'Max',
      category: 'Dog',
      birthday: new Date('2020-03-15'),
      gender: 'male',
      imagePath: null,
    },
    {
      userId: testUserId,
      name: 'Luna',
      category: 'Cat',
      birthday: new Date('2021-07-22'),
      gender: 'female',
      imagePath: null,
    },
    {
      userId: testUserId,
      name: 'Charlie',
      category: 'Dog',
      birthday: new Date('2019-11-08'),
      gender: 'male',
      imagePath: null,
    },
  ]

  for (const pet of pets) {
    await prisma.pet.upsert({
      where: { id: `${pet.name.toLowerCase()}-seed-id` },
      update: {},
      create: pet,
    })
    console.log(`Created pet: ${pet.name}`)
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
