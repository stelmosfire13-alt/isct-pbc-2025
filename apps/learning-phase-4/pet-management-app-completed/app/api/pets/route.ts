import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/pets - Get all pets for the current user
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const pets = await prisma.pet.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ pets })
  } catch (error) {
    console.error('Get pets error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/pets - Create a new pet
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, category, breed, birthday, gender, imageUrl } = body

    if (!name || !category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      )
    }

    const pet = await prisma.pet.create({
      data: {
        ownerId: userId,
        name,
        category,
        breed,
        birthday: birthday ? new Date(birthday) : null,
        gender,
        imageUrl,
      },
    })

    return NextResponse.json({ pet }, { status: 201 })
  } catch (error) {
    console.error('Create pet error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
