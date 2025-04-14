import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

// Initialize Redis
const redis = Redis.fromEnv()

export async function GET() {
  // Fetch data from Redis
  try {
    const result = await redis.get('status')
    if (result === null) {
      return NextResponse.json(
        { error: 'Key not found' },
        { status: 404 },
      )
    }

    // Return the result in the response
    return new NextResponse(JSON.stringify({ result }), { status: 200 })
  }
  catch (error) {
    console.error('Redis error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to Redis' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const { value } = await request.json()
    await redis.set('status', value)
    return NextResponse.json({ success: true }, { status: 200 })
  }
  catch (error) {
    console.error('Redis error:', error)
    return NextResponse.json(
      { error: 'Failed to set Redis value' },
      { status: 500 },
    )
  }
}
