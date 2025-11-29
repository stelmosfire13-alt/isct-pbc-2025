import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/pets/[id] - Get a specific pet
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const pet = await prisma.pet.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!pet) {
      return NextResponse.json(
        { error: 'Pet not found' },
        { status: 404 }
      )
    }

    if (pet.ownerId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    return NextResponse.json({ pet })
  } catch (error) {
    console.error('Get pet error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/pets/[id] - Update a specific pet
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const pet = await prisma.pet.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!pet) {
      return NextResponse.json(
        { error: 'Pet not found' },
        { status: 404 }
      )
    }

    if (pet.ownerId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, category, breed, birthday, gender, imageUrl } = body

    const updatedPet = await prisma.pet.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        category,
        breed,
        birthday: birthday ? new Date(birthday) : null,
        gender,
        imageUrl,
      },
    })

    return NextResponse.json({ pet: updatedPet })
  } catch (error) {
    console.error('Update pet error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/pets/[id] - Delete a specific pet
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const pet = await prisma.pet.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!pet) {
      return NextResponse.json(
        { error: 'Pet not found' },
        { status: 404 }
      )
    }

    if (pet.ownerId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    await prisma.pet.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: 'Pet deleted successfully' })
  } catch (error) {
    console.error('Delete pet error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
