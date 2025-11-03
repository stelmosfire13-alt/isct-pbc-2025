import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPet } from '@/actions/pets'
import { PetDetail } from '@/components/pets/pet-detail'
import { DeletePetDialog } from '@/components/pets/delete-pet-dialog'
import { Button } from '@/components/ui/button'

export default async function PetDetailPage({ params }: { params: { id: string } }) {
  const pet = await getPet(params.id)

  if (!pet) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link
          href="/pets"
          className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1"
        >
          ← Back to My Pets
        </Link>
      </div>

      <PetDetail pet={pet} />

      <div className="mt-6 flex gap-4">
        <Button asChild variant="outline">
          <Link href={`/pets/${pet.id}/edit`}>Edit Pet</Link>
        </Button>
        <DeletePetDialog petId={pet.id} petName={pet.name} />
      </div>
    </div>
  )
}
