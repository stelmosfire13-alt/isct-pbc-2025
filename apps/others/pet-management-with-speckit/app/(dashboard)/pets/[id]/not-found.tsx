import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PetNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold mb-2">Pet not found</h2>
        <p className="text-slate-600 mb-6">
          The pet you're looking for doesn't exist or you don't have permission to view it
        </p>
        <Button asChild>
          <Link href="/pets">Back to My Pets</Link>
        </Button>
      </div>
    </div>
  )
}
