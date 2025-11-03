import Link from 'next/link'
import { getPets } from '@/actions/pets'
import { PetCard } from '@/components/pets/pet-card'
import { Button } from '@/components/ui/button'

export default async function PetsPage() {
  const pets = await getPets()

  if (pets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">🐾</div>
          <h2 className="text-2xl font-bold mb-2">No pets yet</h2>
          <p className="text-slate-600 mb-6">
            Start by adding your first pet to keep track of their information
          </p>
          <Button asChild>
            <Link href="/pets/new">Add your first pet</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Pets</h1>
          <p className="text-slate-600">Manage your pet information</p>
        </div>
        <Button asChild>
          <Link href="/pets/new">Add Pet</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  )
}
