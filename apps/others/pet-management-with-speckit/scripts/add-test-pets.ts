import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Get the user ID from command line argument
  const userId = process.argv[2]

  if (!userId) {
    console.error('Usage: tsx scripts/add-test-pets.ts <user-id>')
    console.error('\nTo get your user ID:')
    console.error('1. Go to Supabase Dashboard → Authentication → Users')
    console.error('2. Copy the UUID from the "ID" column')
    process.exit(1)
  }

  console.log(`Adding test pets for user: ${userId}`)

  const pets = [
    {
      userId,
      name: 'Max',
      category: 'Dog',
      birthday: new Date('2020-03-15'),
      gender: 'male',
    },
    {
      userId,
      name: 'Luna',
      category: 'Cat',
      birthday: new Date('2021-07-22'),
      gender: 'female',
    },
    {
      userId,
      name: 'Charlie',
      category: 'Dog',
      birthday: new Date('2019-11-08'),
      gender: 'male',
    },
  ]

  for (const pet of pets) {
    const created = await prisma.pet.create({
      data: pet,
    })
    console.log(`✓ Created pet: ${created.name} (${created.id})`)
  }

  console.log('\n✅ Successfully added 3 test pets!')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
