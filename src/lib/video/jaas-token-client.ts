/**
 * JaaS Token Client for Bharat Telemed
 * Handles secure JWT token retrieval for video consultations
 */

interface JaaSTokenResponse {
  success: boolean
  token: string
  expiresAt: string
  roomName: string
  userRole: 'doctor' | 'patient'
  moderator: boolean
  domain: string
}

interface JaaSTokenRequest {
  roomId: string
  userId: string
  userName: string
  userEmail?: string
  userRole: 'doctor' | 'patient'
  expirationMinutes?: number
}

/**
 * Fetch a JaaS JWT token from the backend
 */
export async function fetchJaaSToken(
  request: JaaSTokenRequest,
  retryCount = 0
): Promise<JaaSTokenResponse> {
  const maxRetries = 3
  const baseDelay = 1000 // 1 second

  try {
    const response = await fetch('/api/jaas/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include authentication cookies
      body: JSON.stringify(request)
    })

    // Check content type first
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      console.error('Expected JSON but received:', contentType, text.substring(0, 200))

      if (response.status === 307 || response.status === 302) {
        throw new Error('Authentication required: Please log in to access video consultation')
      }

      throw new Error(`Invalid response type: Expected JSON but received ${contentType || 'unknown'}`)
    }

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.error || errorMessage
      } catch (jsonError) {
        console.warn('Failed to parse error response as JSON:', jsonError)
      }
      throw new Error(errorMessage)
    }

    let data: JaaSTokenResponse
    try {
      data = await response.json()
    } catch (jsonError) {
      console.error('Failed to parse success response as JSON:', jsonError)
      throw new Error('Invalid JSON response from JaaS token API')
    }

    if (!data.success) {
      throw new Error(data.error || 'Token generation failed')
    }

    return data
  } catch (error) {
    console.error(`JaaS token fetch error (attempt ${retryCount + 1}/${maxRetries + 1}):`, error)

    // Don't retry authentication errors or final attempt
    if (retryCount >= maxRetries ||
        (error instanceof Error && error.message.includes('Authentication required'))) {
      throw new Error(
        error instanceof Error
          ? `Token fetch failed: ${error.message}`
          : 'Unknown token fetch error'
      )
    }

    // Exponential backoff delay
    const delay = baseDelay * Math.pow(2, retryCount)
    console.log(`Retrying in ${delay}ms...`)

    await new Promise(resolve => setTimeout(resolve, delay))
    return fetchJaaSToken(request, retryCount + 1)
  }
}

/**
 * Token cache to avoid unnecessary API calls
 */
class JaaSTokenCache {
  private cache = new Map<string, { token: JaaSTokenResponse; expiresAt: number }>()

  private getCacheKey(request: JaaSTokenRequest): string {
    return `${request.userId}-${request.roomId}-${request.userRole}`
  }

  get(request: JaaSTokenRequest): JaaSTokenResponse | null {
    const key = this.getCacheKey(request)
    const cached = this.cache.get(key)

    if (!cached) {
      return null
    }

    // Check if token expires in the next 5 minutes
    const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000)
    if (cached.expiresAt <= fiveMinutesFromNow) {
      this.cache.delete(key)
      return null
    }

    return cached.token
  }

  set(request: JaaSTokenRequest, token: JaaSTokenResponse): void {
    const key = this.getCacheKey(request)
    const expiresAt = new Date(token.expiresAt).getTime()

    this.cache.set(key, { token, expiresAt })
  }

  clear(): void {
    this.cache.clear()
  }
}

const tokenCache = new JaaSTokenCache()

/**
 * Get a cached or fresh JaaS token
 */
export async function getJaaSToken(
  request: JaaSTokenRequest,
  useCache: boolean = true
): Promise<JaaSTokenResponse> {
  // Try cache first if enabled
  if (useCache) {
    const cached = tokenCache.get(request)
    if (cached) {
      console.log('Using cached JaaS token')
      return cached
    }
  }

  // Fetch fresh token
  console.log('Fetching fresh JaaS token')
  const token = await fetchJaaSToken(request)

  // Cache the new token
  if (useCache) {
    tokenCache.set(request, token)
  }

  return token
}

/**
 * Clear the token cache (useful for logout or role changes)
 */
export function clearJaaSTokenCache(): void {
  tokenCache.clear()
}

/**
 * Generate consultation data for JaaS token request
 */
export function generateConsultationTokenRequest(
  patientId: string,
  patientName: string,
  patientEmail: string,
  doctorId: string,
  doctorName: string,
  doctorEmail: string,
  userRole: 'doctor' | 'patient',
  appointmentId?: string
): JaaSTokenRequest {
  // Generate room ID
  const timestamp = Date.now()
  const roomId = appointmentId
    ? `consultation-${appointmentId}`
    : `bharattelemed-${patientId}-${doctorId}-${timestamp}`

  // Determine user details based on role
  const isDoctor = userRole === 'doctor'

  return {
    roomId: roomId.toLowerCase().replace(/[^a-z0-9\-]/g, '-'),
    userId: isDoctor ? doctorId : patientId,
    userName: isDoctor ? doctorName : patientName,
    userEmail: isDoctor ? doctorEmail : patientEmail,
    userRole,
    expirationMinutes: 90 // 1.5 hours for medical consultations
  }
}