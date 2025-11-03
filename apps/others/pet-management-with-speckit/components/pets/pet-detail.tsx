import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Pet } from '@prisma/client'
import { getPetImageUrl } from '@/lib/utils/image'

interface PetDetailProps {
  pet: Pet
}

export function PetDetail({ pet }: PetDetailProps) {
  const imageUrl = getPetImageUrl(pet.imagePath)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const calculateAge = (birthday: Date) => {
    const today = new Date()
    const birthDate = new Date(birthday)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-slate-200 rounded-lg overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={pet.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                {pet.category === 'Dog' && '🐕'}
                {pet.category === 'Cat' && '🐈'}
                {pet.category !== 'Dog' && pet.category !== 'Cat' && '🐾'}
              </div>
            )}
          </div>
          <div>
            <CardTitle className="text-3xl">{pet.name}</CardTitle>
            <p className="text-lg text-slate-600">{pet.category}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Gender</p>
            <p className="text-lg">
              {pet.gender === 'male' && '♂️ Male'}
              {pet.gender === 'female' && '♀️ Female'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Age</p>
            <p className="text-lg">{calculateAge(pet.birthday)} years old</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-medium text-slate-500">Birthday</p>
            <p className="text-lg">{formatDate(pet.birthday)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
