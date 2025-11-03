import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import type { Pet } from '@prisma/client'
import { getPetImageUrl } from '@/lib/utils/image'

interface PetCardProps {
  pet: Pet
}

export function PetCard({ pet }: PetCardProps) {
  const imageUrl = getPetImageUrl(pet.imagePath)

  return (
    <Link href={`/pets/${pet.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-16 h-16 bg-slate-200 rounded-lg overflow-hidden">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={pet.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  {pet.category === 'Dog' && '🐕'}
                  {pet.category === 'Cat' && '🐈'}
                  {pet.category !== 'Dog' && pet.category !== 'Cat' && '🐾'}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{pet.name}</h3>
              <p className="text-sm text-slate-600">{pet.category}</p>
              <p className="text-xs text-slate-500 mt-1">
                {pet.gender === 'male' && '♂️ Male'}
                {pet.gender === 'female' && '♀️ Female'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
