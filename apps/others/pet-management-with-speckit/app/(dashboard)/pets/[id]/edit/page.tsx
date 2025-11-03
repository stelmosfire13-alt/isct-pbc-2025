import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPet } from '@/actions/pets'
import { PetForm } from '@/components/forms/pet-form'

export default async function EditPetPage({ params }: { params: { id: string } }) {
  const pet = await getPet(params.id)

  if (!pet) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link
          href={`/pets/${pet.id}`}
          className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1"
        >
          ← Back to Pet Details
        </Link>
      </div>

      <PetForm pet={pet} mode="edit" />
    </div>
  )
}
