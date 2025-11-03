'use client'

import { useState, useTransition } from 'react'
import { deletePet } from '@/actions/pets'
import { Button } from '@/components/ui/button'

interface DeletePetDialogProps {
  petId: string
  petName: string
}

export function DeletePetDialog({ petId, petName }: DeletePetDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string>('')

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deletePet(petId)
        if (result?.error) {
          setError(result.error)
        }
        // If successful, the action will redirect, so no need to handle success here
      } catch (err) {
        console.error('Delete error:', err)
        setError('An unexpected error occurred. Please try again.')
      }
    })
  }

  return (
    <>
      <Button
        variant="outline"
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={() => setIsOpen(true)}
        disabled={isPending}
      >
        Delete Pet
      </Button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => !isPending && setIsOpen(false)}
          />

          {/* Dialog */}
          <div className="relative z-50 w-full max-w-md bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Delete Pet</h2>

            <p className="text-slate-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{petName}</span>?
              This action cannot be undone.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDelete}
                disabled={isPending}
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
