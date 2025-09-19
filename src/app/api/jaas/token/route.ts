import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import { validateJaaSServerConfig } from '@/lib/video/jaas-config'

interface JaaSJWTPayload {
  aud: string // Always "jitsi"
  iss: string // Always "chat"
  iat: number // Issued at timestamp
  exp: number // Expiration timestamp
  nbf: number // Not before timestamp
  sub: string // Your JaaS App ID
  context: {
    features: {
      livestreaming: boolean
      'file-upload': boolean
      'outbound-call': boolean
      'sip-outbound-call': boolean
      transcription: boolean
      'list-visitors': boolean
      recording: boolean
      flip: boolean
    }
    user: {
      'hidden-from-recorder': boolean
      moderator: boolean
      name: string
      id: string
      avatar: string
      email: string
    }
  }
  room: string // "*" for wildcard access
}

interface JaaSTokenRequest {
  roomId: string
  userId: string
  userName: string
  userEmail?: string
  userRole: 'doctor' | 'patient'
  expirationMinutes?: number
}

export async function POST(request: NextRequest) {
  // Ensure we always return JSON responses with CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Access-Control-Allow-Origin': 'http://localhost:3003',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true'
  }

  try {
    const body: JaaSTokenRequest = await request.json()

    const {
      roomId,
      userId,
      userName,
      userEmail,
      userRole,
      expirationMinutes = 60
    } = body

    // Validate required fields
    if (!roomId || !userId || !userName || !userRole) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: roomId, userId, userName, userRole' },
        { status: 400, headers }
      )
    }

    // Validate server configuration
    const configValidation = validateJaaSServerConfig()
    if (!configValidation.isValid) {
      console.error('JaaS server configuration errors:', configValidation.errors)
      return NextResponse.json(
        { success: false, error: 'JaaS server configuration error', details: configValidation.errors },
        { status: 500, headers }
      )
    }

    // Get environment variables
    const jaasAppId = process.env.NEXT_PUBLIC_JAAS_APP_ID
    const jaasKeyId = process.env.JAAS_KEY_ID
    const privateKeyPath = process.env.JAAS_PRIVATE_KEY_PATH

    if (!jaasAppId || !jaasKeyId || !privateKeyPath) {
      return NextResponse.json(
        { success: false, error: 'JaaS configuration missing. Please check environment variables.' },
        { status: 500, headers }
      )
    }

    // Get private key from environment variable or file
    let privateKey: string
    try {
      // Try environment variable first (for Vercel deployment)
      if (process.env.JAAS_PRIVATE_KEY) {
        privateKey = process.env.JAAS_PRIVATE_KEY.replace(/\\n/g, '\n')
        console.log('🔑 Private key loaded from environment variable')
      } else {
        // Fallback to file reading (for local development)
        const keyPath = path.resolve(process.cwd(), privateKeyPath)
        privateKey = fs.readFileSync(keyPath, 'utf8')
        console.log('🔑 Private key loaded from file:', {
          keyPath,
          keyLength: privateKey.length,
          hasBeginKey: privateKey.includes('BEGIN'),
          hasEndKey: privateKey.includes('END')
        })
      }
    } catch (error) {
      console.error('Failed to read private key:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to read JaaS private key. Please check JAAS_PRIVATE_KEY environment variable or file path.' },
        { status: 500, headers }
      )
    }

    const now = Math.floor(Date.now() / 1000)
    const exp = now + (expirationMinutes * 60)

    console.log('🔧 JWT Generation Details:', {
      jaasAppId,
      jaasKeyId,
      roomId,
      userId,
      userName,
      userRole,
      moderator: userRole === 'doctor',
      now,
      exp,
      fullRoomName: `${jaasAppId}/${roomId}`
    })

    // Create JaaS JWT payload following official 8x8 example exactly
    const isModerator = userRole === 'doctor'
    const payload: JaaSJWTPayload = {
      aud: 'jitsi',
      iss: 'chat',
      iat: now,
      exp: exp,
      nbf: now - 10, // Allow 10 seconds clock skew
      sub: jaasAppId,
      context: {
        features: {
          livestreaming: false,
          'file-upload': false,
          'outbound-call': false,
          'sip-outbound-call': false,
          transcription: false,
          'list-visitors': false,
          recording: false, // Recording completely disabled
          flip: false
        },
        user: {
          'hidden-from-recorder': false,
          moderator: isModerator,
          name: userName,
          id: userId,
          avatar: '',
          email: userEmail || ''
        }
      },
      room: '*' // Wildcard room as per official example
    }

    console.log('🔍 JWT Payload being signed:', JSON.stringify(payload, null, 2))

    // Sign JWT with RS256 algorithm and include kid in header
    const token = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      keyid: jaasKeyId
    })

    console.log('🔐 JWT Token signed successfully:', {
      algorithm: 'RS256',
      keyid: jaasKeyId,
      tokenPreview: token.substring(0, 50) + '...'
    })

    const response = {
      success: true,
      token,
      expiresAt: new Date(exp * 1000).toISOString(),
      roomName: `${jaasAppId}/${roomId}`,
      userRole,
      moderator: userRole === 'doctor',
      domain: '8x8.vc'
    }

    console.log('✅ JWT Token generated successfully:', {
      tokenLength: token.length,
      roomName: response.roomName,
      userRole: response.userRole,
      moderator: response.moderator,
      expiresAt: response.expiresAt
    })

    return NextResponse.json(response, { headers })

  } catch (error) {
    console.error('JaaS JWT token generation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate JaaS JWT token',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const roomId = searchParams.get('roomId')
  const userId = searchParams.get('userId')
  const userName = searchParams.get('userName')
  const userEmail = searchParams.get('userEmail')
  const userRole = searchParams.get('userRole') as 'doctor' | 'patient'
  const expirationMinutes = parseInt(searchParams.get('expirationMinutes') || '60')

  if (!roomId || !userId || !userName || !userRole) {
    return NextResponse.json(
      { error: 'Missing required parameters: roomId, userId, userName, userRole' },
      { status: 400 }
    )
  }

  // Re-use POST logic
  const mockRequest = new Request('http://localhost', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      roomId,
      userId,
      userName,
      userEmail: userEmail || undefined,
      userRole,
      expirationMinutes
    })
  })

  return POST(mockRequest as NextRequest)
}

export async function OPTIONS(request: NextRequest) {
  // Handle CORS preflight requests
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3003',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400'
    }
  })
}