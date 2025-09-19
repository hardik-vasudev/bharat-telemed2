'use client'

import { useEffect, useRef, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle, Video, VideoOff } from 'lucide-react'
import { getJaaSToken, generateConsultationTokenRequest } from '@/lib/video/jaas-token-client'
import { getJaaSMeetingOptions, validateJaaSConfig } from '@/lib/video/jaas-config'

// Extend window interface for JitsiMeetExternalAPI
declare global {
  interface Window {
    JitsiMeetExternalAPI?: any
  }
}

interface JaaSMeetComponentProps {
  meetingConfig: {
    roomName: string
    doctorId: string
    doctorName: string
    doctorEmail: string
    patientId: string
    patientName: string
    patientEmail: string
    userRole: 'doctor' | 'patient'
    appointmentId?: string
  }
  onMeetingStart?: () => void
  onMeetingEnd?: () => void
  onError?: (error: string) => void
  showControls?: boolean
  className?: string
}

export default function JaaSMeetComponent({
  meetingConfig,
  onMeetingStart,
  onMeetingEnd,
  onError,
  showControls = true,
  className = ''
}: JaaSMeetComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [participantCount, setParticipantCount] = useState(0)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Validate configuration on mount
  useEffect(() => {
    const validation = validateJaaSConfig()
    if (!validation.isValid) {
      const errorMsg = `JaaS Configuration Error: ${validation.errors.join(', ')}`
      setError(errorMsg)
      onError?.(errorMsg)
      return
    }
  }, [onError])

  // Load JaaS external API script
  useEffect(() => {
    const loadJaaSScript = async () => {
      try {
        console.log('🚀 Starting JaaS script loading...')
        const jaasAppId = process.env.NEXT_PUBLIC_JAAS_APP_ID
        console.log('📝 JaaS App ID:', jaasAppId)

        if (!jaasAppId) {
          throw new Error('JaaS App ID not configured')
        }

        // Check if script already exists
        const existingScript = document.querySelector(`#jaas-script-${jaasAppId}`)
        if (existingScript) {
          console.log('✅ JaaS script already exists, setting loaded state')
          setScriptLoaded(true)
          return
        }

        // Create and load script
        const script = document.createElement('script')
        script.src = `https://8x8.vc/${jaasAppId}/external_api.js`
        script.id = `jaas-script-${jaasAppId}`
        script.async = true

        console.log('📥 Loading script from:', script.src)

        script.onload = () => {
          console.log('✅ JaaS External API script loaded successfully')
          console.log('🔍 Checking if JitsiMeetExternalAPI is available:', !!window.JitsiMeetExternalAPI)
          // Add small delay to ensure API is fully available
          setTimeout(() => {
            console.log('🎬 Setting script loaded to true')
            console.log('🔍 JitsiMeetExternalAPI available after timeout:', !!window.JitsiMeetExternalAPI)
            setScriptLoaded(true)
          }, 200)
        }

        script.onerror = (err) => {
          // Simplified error handling - minimal logging
          const errorMsg = 'Failed to load video calling service'
          setError(errorMsg)
          onError?.(errorMsg)
        }

        document.head.appendChild(script)
      } catch (err) {
        // Simplified error handling - minimal logging
        const errorMsg = 'Failed to initialize video calling service'
        setError(errorMsg)
        onError?.(errorMsg)
      }
    }

    loadJaaSScript()
  }, [onError])

  // Initialize JaaS meeting
  useEffect(() => {
    console.log('🔍 Meeting initialization useEffect triggered')
    console.log('📊 State check:', {
      scriptLoaded,
      containerReady: !!containerRef.current,
      apiExists: !!apiRef.current,
      isLoading,
      error
    })

    if (!scriptLoaded) {
      console.log('⏳ Script not loaded yet, waiting...')
      return
    }

    if (!containerRef.current) {
      console.log('⏳ Container not ready yet, waiting...')
      return
    }

    if (apiRef.current || isInitialized) {
      console.log('⚠️ API already exists or initialized, skipping initialization')
      return
    }

    console.log('✅ All conditions met, proceeding with initialization')

    const initializeMeeting = async () => {
      try {
        console.log('🎯 Initializing JaaS meeting...')
        setIsLoading(true)
        setError(null)

        // Generate token request
        console.log('📋 Generating token request...')
        const tokenRequest = generateConsultationTokenRequest(
          meetingConfig.patientId,
          meetingConfig.patientName,
          meetingConfig.patientEmail,
          meetingConfig.doctorId,
          meetingConfig.doctorName,
          meetingConfig.doctorEmail,
          meetingConfig.userRole,
          meetingConfig.appointmentId
        )
        console.log('📋 Token request:', tokenRequest)

        // Fetch JWT token
        console.log('🔑 Fetching JWT token...')
        console.log('📋 Token request details:', {
          roomId: tokenRequest.roomId,
          userId: tokenRequest.userId,
          userName: tokenRequest.userName,
          userRole: tokenRequest.userRole
        })
        const tokenResponse = await getJaaSToken(tokenRequest)
        console.log('✅ JaaS token received:', {
          roomName: tokenResponse.roomName,
          userRole: tokenResponse.userRole,
          moderator: tokenResponse.moderator,
          tokenLength: tokenResponse.token.length,
          domain: tokenResponse.domain
        })

        // Decode and log the JWT payload for debugging
        try {
          const tokenParts = tokenResponse.token.split('.')
          const payload = JSON.parse(atob(tokenParts[1]))
          console.log('🔍 JWT payload:', payload)
        } catch (e) {
          console.warn('Could not decode JWT for debugging:', e)
        }

        // Get meeting options
        console.log('⚙️ Getting meeting options...')
        const meetingOptions = getJaaSMeetingOptions(
          meetingConfig.roomName,
          tokenResponse.token,
          meetingConfig.userRole,
          meetingConfig.userRole === 'doctor' ? meetingConfig.doctorName : meetingConfig.patientName
        )
        console.log('⚙️ Meeting options:', meetingOptions)

        // Initialize JitsiMeetExternalAPI
        if (!window.JitsiMeetExternalAPI) {
          // Simplified error handling - minimal logging
          throw new Error('JitsiMeetExternalAPI not available')
        }

        console.log('🚀 Creating JitsiMeetExternalAPI instance...')
        const api = new window.JitsiMeetExternalAPI('8x8.vc', {
          ...meetingOptions,
          parentNode: containerRef.current
        })

        console.log('✅ JaaS API instance created')
        apiRef.current = api
        setIsInitialized(true)

        // Clear loading immediately after API creation for faster UI response
        console.log('🚀 Clearing loading state immediately after API creation')
        setTimeout(() => {
          setIsLoading(false)
          // Add custom CSS for chat styling if needed
          try {
            const iframe = containerRef.current?.querySelector('iframe')
            if (iframe && iframe.contentDocument) {
              const style = iframe.contentDocument.createElement('style')
              style.textContent = `
                /* Custom chat panel styling */
                .chat-panel-container {
                  position: fixed !important;
                  right: 0 !important;
                  top: 0 !important;
                  height: 100% !important;
                  width: 320px !important;
                  z-index: 1000 !important;
                }
              `
              iframe.contentDocument.head.appendChild(style)
            }
          } catch (e) {
            console.log('Could not inject custom CSS:', e)
          }
        }, 1000) // 1 second delay to let Jitsi render

        // Event listeners
        api.addListener('readyToClose', () => {
          console.log('JaaS meeting ready to close')
          setIsConnected(false)
          onMeetingEnd?.()
        })

        api.addListener('participantJoined', (participant: any) => {
          console.log('Participant joined:', participant)
          setParticipantCount(prev => prev + 1)
        })

        api.addListener('participantLeft', (participant: any) => {
          console.log('Participant left:', participant)
          setParticipantCount(prev => Math.max(0, prev - 1))
        })

        api.addListener('videoConferenceJoined', (participant: any) => {
          console.log('✅ Video conference joined:', participant)
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
          }
          setIsConnected(true)
          setIsLoading(false)
          onMeetingStart?.()
        })

        api.addListener('videoConferenceLeft', () => {
          console.log('Video conference left')
          setIsConnected(false)
          onMeetingEnd?.()
        })

        // Handle hangup button click
        api.addListener('hangup', () => {
          console.log('Hangup button clicked')
          setIsConnected(false)
          onMeetingEnd?.()
        })

        api.addListener('errorOccurred', (error: any) => {
          // Simplified error handling - minimal logging
          const errorMsg = `Meeting connection failed. Please try again.`
          setError(errorMsg)
          onError?.(errorMsg)
        })

        // Additional event listeners to handle UI display properly
        api.addListener('videoConferenceReady', () => {
          console.log('✅ Video conference ready - clearing loading state')
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
          }
          setIsLoading(false)
        })

        api.addListener('participantRoleChanged', (data: any) => {
          console.log('Participant role changed:', data)
        })

        api.addListener('deviceListChanged', (devices: any) => {
          console.log('Device list changed:', devices)
          // Clear loading once devices are available
          setIsLoading(false)
        })

        // Set a fallback timeout to clear loading if events don't fire properly
        timeoutRef.current = setTimeout(() => {
          console.log('⏰ Loading timeout reached - forcing loading state clear')
          setIsLoading(false)
        }, 8000) // 8 seconds timeout

      } catch (err) {
        // Simplified error handling - minimal logging
        const errorMsg = 'Failed to initialize video meeting. Please try again.'
        setError(errorMsg)
        setIsLoading(false)
        onError?.(errorMsg)
      }
    }

    initializeMeeting()

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      if (apiRef.current) {
        console.log('🧹 Disposing JaaS meeting')
        apiRef.current.dispose?.()
        apiRef.current = null
        setIsInitialized(false)
        setIsLoading(true)
      }
    }
  }, [scriptLoaded])

  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    setIsInitialized(false)
    if (apiRef.current) {
      apiRef.current.dispose?.()
      apiRef.current = null
    }
    window.location.reload() // Simple retry by reloading
  }

  const handleEndCall = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand('hangup')
    }
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-full bg-gray-50 ${className}`}>
        <div className="text-center p-8 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Video Call Error
          </h3>
          <Alert className="mb-4">
            <AlertDescription className="text-left">
              {error}
            </AlertDescription>
          </Alert>
          <Button onClick={handleRetry} className="w-full">
            Retry Connection
          </Button>
        </div>
      </div>
    )
  }

  // Always render the container, but show loading overlay when needed

  return (
    <div className={`relative h-full ${className}`}>
      {/* Video container - always render so containerRef exists */}
      <div
        ref={containerRef}
        className="h-full w-full min-h-[400px] bg-gray-900"
        style={{ minHeight: '400px' }}
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Connecting to Video Call
            </h3>
            <p className="text-gray-600">
              Please wait while we set up your secure consultation...
            </p>
          </div>
        </div>
      )}


      {/* Custom controls removed - using JaaS built-in controls only */}
    </div>
  )
}