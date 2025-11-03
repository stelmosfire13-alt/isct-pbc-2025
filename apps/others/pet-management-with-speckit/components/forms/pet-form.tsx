'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import Link from 'next/link'
import type { Pet } from '@prisma/client'
import { petSchema, type PetInput } from '@/lib/validations/pet'
import { createPet, updatePet, type PetActionState } from '@/actions/pets'
import { getPetImageUrl } from '@/lib/utils/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PetImageUpload } from '@/components/pets/pet-image-upload'

interface PetFormProps {
  pet?: Pet
  mode?: 'create' | 'edit'
}

function SubmitButton({ mode }: { mode: 'create' | 'edit' }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending
        ? mode === 'edit'
          ? 'Updating pet...'
          : 'Creating pet...'
        : mode === 'edit'
          ? 'Update Pet'
          : 'Create Pet'}
    </Button>
  )
}

export function PetForm({ pet, mode = 'create' }: PetFormProps) {
  const [removeImage, setRemoveImage] = useState(false)

  // Create bound action based on mode
  const action = mode === 'edit' && pet
    ? updatePet.bind(null, pet.id)
    : createPet

  const [state, formAction] = useFormState<PetActionState | null, FormData>(
    action,
    null
  )

  // Get image URL for preview
  const initialImageUrl = pet ? getPetImageUrl(pet.imagePath) : null

  // Format birthday for date input (YYYY-MM-DD)
  const formattedBirthday = pet?.birthday
    ? new Date(pet.birthday).toISOString().split('T')[0]
    : ''

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PetInput>({
    resolver: zodResolver(mode === 'edit' ? petSchema.partial() : petSchema),
    defaultValues: pet
      ? {
          name: pet.name,
          category: pet.category,
          // Don't set birthday in defaultValues, use HTML defaultValue instead
          gender: pet.gender,
        }
      : undefined,
  })

  const cancelHref = mode === 'edit' && pet ? `/pets/${pet.id}` : '/pets'

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'edit' ? 'Edit Pet' : 'Add New Pet'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          action={formAction}
          onSubmit={(evt) => {
            evt.preventDefault()
            const form = evt.currentTarget // Capture form reference
            handleSubmit(() => {
              formAction(new FormData(form))
            })(evt)
          }}
          className="space-y-6"
        >
          {/* Form-level error */}
          {state?.error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{state.error}</p>
            </div>
          )}

          {/* Name field */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Pet Name <span className="text-red-600">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              {...register('name')}
              placeholder="Max"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
            {state?.errors?.name && (
              <p className="text-sm text-red-600">{state.errors.name[0]}</p>
            )}
          </div>

          {/* Category field */}
          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-red-600">*</span>
            </Label>
            <Input
              id="category"
              type="text"
              {...register('category')}
              placeholder="Dog"
              className={errors.category ? 'border-red-500' : ''}
            />
            <p className="text-sm text-slate-500">
              e.g., Dog, Cat, Bird, Rabbit, etc.
            </p>
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category.message}</p>
            )}
            {state?.errors?.category && (
              <p className="text-sm text-red-600">{state.errors.category[0]}</p>
            )}
          </div>

          {/* Birthday field */}
          <div className="space-y-2">
            <Label htmlFor="birthday">
              Birthday <span className="text-red-600">*</span>
            </Label>
            <input
              id="birthday"
              type="date"
              {...register('birthday', {
                valueAsDate: true,
              })}
              defaultValue={formattedBirthday}
              max={new Date().toISOString().split('T')[0]} // Prevent future dates
              className={`flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 ${
                errors.birthday ? 'border-red-500' : ''
              }`}
            />
            {errors.birthday && (
              <p className="text-sm text-red-600">{errors.birthday.message}</p>
            )}
            {state?.errors?.birthday && (
              <p className="text-sm text-red-600">{state.errors.birthday[0]}</p>
            )}
          </div>

          {/* Gender field */}
          <div className="space-y-2">
            <Label htmlFor="gender">
              Gender <span className="text-red-600">*</span>
            </Label>
            <select
              id="gender"
              {...register('gender')}
              className={`flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.gender ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.gender && (
              <p className="text-sm text-red-600">{errors.gender.message}</p>
            )}
            {state?.errors?.gender && (
              <p className="text-sm text-red-600">{state.errors.gender[0]}</p>
            )}
          </div>

          {/* Image upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Pet Photo (Optional)</Label>
            <PetImageUpload
              name="image"
              error={state?.errors?.image?.[0] || errors.image?.message}
              initialImageUrl={initialImageUrl}
            />
            {/* Remove image checkbox (only in edit mode with existing image) */}
            {mode === 'edit' && pet?.imagePath && !removeImage && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="removeImage"
                  name="removeImage"
                  value="true"
                  checked={removeImage}
                  onChange={(e) => setRemoveImage(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                <label
                  htmlFor="removeImage"
                  className="text-sm text-slate-600 cursor-pointer"
                >
                  Remove current image
                </label>
              </div>
            )}
          </div>

          {/* Form actions */}
          <div className="flex gap-4">
            <SubmitButton mode={mode} />
            <Button asChild variant="outline" type="button" className="w-full">
              <Link href={cancelHref}>Cancel</Link>
            </Button>
          </div>

          <p className="text-sm text-slate-500">
            <span className="text-red-600">*</span> Required fields
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
