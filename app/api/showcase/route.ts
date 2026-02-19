import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { VideoStatus, Prisma } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const filter = searchParams.get('filter') || 'trending'
    const limit = parseInt(searchParams.get('limit') || '24')
    const offset = parseInt(searchParams.get('offset') || '0')

    let orderBy: Prisma.VideoOrderByWithRelationInput | Prisma.VideoOrderByWithRelationInput[] = {}

    switch (filter) {
      case 'trending':
        // Order by recent likes and views
        orderBy = [
          { views: 'desc' },
          { createdAt: 'desc' },
        ]
        break
      case 'latest':
        orderBy = { createdAt: 'desc' }
        break
      case 'featured':
        orderBy = { createdAt: 'desc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    const where: Prisma.VideoWhereInput = {
      isPublic: true,
      status: VideoStatus.COMPLETED,
      deletedAt: null,
      outputVideoKey: { not: null },
      ...(filter === 'featured' ? { featured: true } : {}),
    }

    const items = await prisma.video.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
      select: {
        id: true,
        title: true,
        prompt: true,
        outputVideoKey: true,
        thumbnailKey: true,
        views: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    const total = await prisma.video.count({ where })

    return NextResponse.json({
      items,
      total,
      hasMore: offset + items.length < total,
    })
  } catch (error) {
    console.error('Showcase error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch showcase' },
      { status: 500 }
    )
  }
}
