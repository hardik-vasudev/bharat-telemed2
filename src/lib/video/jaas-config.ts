/**
 * JaaS (Jitsi as a Service) Configuration for Bharat Telemed
 * Professional video conferencing configuration for medical consultations
 */

export const JAAS_CONFIG = {
  // JaaS Service Configuration
  domain: process.env.NEXT_PUBLIC_JAAS_DOMAIN || '8x8.vc',
  appId: process.env.NEXT_PUBLIC_JAAS_APP_ID || '',

  // JWT Configuration for server-side token generation
  jwt: {
    keyId: process.env.JAAS_KEY_ID || '',
    privateKeyPath: process.env.JAAS_PRIVATE_KEY_PATH || './keys/jaasauth.key',
    algorithm: 'RS256' as const,
    audience: 'jitsi',
    issuer: 'chat',
    expirationMinutes: 60
  },

  // Medical consultation optimized settings
  meetingConfig: {
    // Audio settings optimized for medical consultations
    audioQuality: {
      stereo: false, // Mono for voice clarity
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      sampleRate: 48000 // High quality for medical consultations
    },

    // Video settings for professional medical use
    videoQuality: {
      maxBitrates: {
        low: 200000,    // 200 kbps for poor connections
        standard: 500000, // 500 kbps standard
        high: 1000000   // 1 Mbps for high quality
      },
      resolution: {
        width: 1280,
        height: 720
      },
      frameRate: 30
    },

    // Medical consultation specific features
    features: {
      recording: false, // Controlled per user role
      transcription: false, // Privacy sensitive
      chat: true,
      screensharing: true, // For sharing medical documents
      virtualBackground: false, // Professional setting
      reactions: false, // Professional setting
      raiseHand: true,
      tileView: true,
      filmstrip: true,
      conferenceMapper: false // Disable conference mapper to fix 404 error
    },

    // Professional UI settings
    interface: {
      // Hide non-essential UI elements for medical focus
      hideMenuBar: false,
      hideInviteButton: true,
      hideRecordButton: false, // Shown based on permissions
      hideShareVideoButton: false,
      hideShareAudioButton: false,
      hideParticipantsStats: false,
      hideDisplayName: false,
      hideAvatarUrl: false,

      // Branding
      brandingRoomAlias: 'Bharat Telemed Televideocall',
      brandingBackgroundColor: '#10b981', // Emerald green
      toolbarButtons: [
        'microphone',
        'camera',
        'desktop',
        'fullscreen',
        'fodeviceselection',
        'hangup',
        'profile',
        'chat',
        'settings',
        'raisehand',
        'filmstrip',
        'tileview',
        'videobackgroundblur',
        'mute-everyone',
        'mute-video-everyone'
      ]
    },

    // Security and privacy settings
    security: {
      enableLobby: false, // Direct access for scheduled consultations
      disableThirdPartyRequests: true,
      enableNoAudioSignal: true,
      enableNoisyMicDetection: true,
      enableTalkWhileMuted: false
    }
  }
} as const

/**
 * Generate a secure room name for medical consultations
 */
export function generateJaaSRoomName(
  patientId: string,
  doctorId: string,
  appointmentId?: string
): string {
  const timestamp = Date.now()
  const baseRoom = appointmentId
    ? `consultation-${appointmentId}`
    : `bharattelemed-${patientId}-${doctorId}-${timestamp}`

  return baseRoom.toLowerCase().replace(/[^a-z0-9\-]/g, '-')
}

/**
 * Get JaaS meeting options for medical consultations
 */
export function getJaaSMeetingOptions(
  roomName: string,
  jwt: string,
  userRole: 'doctor' | 'patient',
  userName: string
) {
  const config = JAAS_CONFIG.meetingConfig

  return {
    roomName: `${JAAS_CONFIG.appId}/${roomName}`,
    jwt: jwt,

    // Container and dimensions
    width: '100%',
    height: '100%',

    // User configuration
    userInfo: {
      displayName: userName,
      email: undefined // Privacy - don't expose emails in frontend
    },

    // Meeting configuration
    configOverwrite: {
      // Audio/Video settings
      startWithAudioMuted: userRole === 'patient', // Patients start muted
      startWithVideoMuted: false,

      // Quality settings
      ...config.audioQuality,
      resolution: config.videoQuality.resolution.height,

      // Feature toggles
      enableWelcomePage: false,
      enableClosePage: false,
      enableNoisyMicDetection: config.security.enableNoisyMicDetection,
      enableNoAudioSignal: config.security.enableNoAudioSignal,
      enableTalkWhileMuted: config.security.enableTalkWhileMuted,

      // UI customization
      ...config.interface,

      // Professional branding
      defaultLocalDisplayName: userName,
      defaultRemoteDisplayName: userRole === 'doctor' ? 'Patient' : 'Doctor',

      // Disable features not suitable for medical consultations
      disableDeepLinking: true,
      disableInviteFunctions: true,

      // Recording disabled for privacy
      fileRecordingsEnabled: false,
      recordingService: {
        enabled: false,
        sharingEnabled: false
      },

      // Disable conference mapper to prevent 404 errors
      enableConferenceMapper: false,
      disableRemoteControl: true
    },

    // Interface configuration
    interfaceConfigOverwrite: {
      // Customize toolbar for medical use
      TOOLBAR_BUTTONS: config.interface.toolbarButtons,

      // Professional appearance
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false,
      SHOW_BRAND_WATERMARK: true,
      BRAND_WATERMARK_LINK: '',

      // Mobile optimization
      MOBILE_APP_PROMO: false,

      // Professional settings
      RECENT_LIST_ENABLED: false,
      SETTINGS_SECTIONS: ['devices', 'language', 'profile'],

      // Hide development features
      HIDE_INVITE_MORE_HEADER: true,

      // Medical consultation focus
      DEFAULT_BACKGROUND: '#f8fafc',
      DISABLE_VIDEO_BACKGROUND: false,
      TOOLBAR_TIMEOUT: 10000, // 10 seconds before hiding toolbar

      // Chat positioning
      CHAT_ENABLED: true
    },

    // Event handlers will be set by the React component
    onApiReady: undefined,
    onReadyToClose: undefined
  }
}

/**
 * Validate JaaS environment configuration (frontend-safe)
 */
export function validateJaaSConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!JAAS_CONFIG.appId) {
    errors.push('NEXT_PUBLIC_JAAS_APP_ID is not configured')
  }

  if (!JAAS_CONFIG.domain) {
    errors.push('NEXT_PUBLIC_JAAS_DOMAIN is not configured')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate JaaS server-side configuration (backend only)
 */
export function validateJaaSServerConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!process.env.NEXT_PUBLIC_JAAS_APP_ID) {
    errors.push('NEXT_PUBLIC_JAAS_APP_ID is not configured')
  }

  if (!process.env.JAAS_KEY_ID) {
    errors.push('JAAS_KEY_ID is not configured')
  }

  // Check for either environment variable or file path
  if (!process.env.JAAS_PRIVATE_KEY && !process.env.JAAS_PRIVATE_KEY_PATH) {
    errors.push('Either JAAS_PRIVATE_KEY (for deployment) or JAAS_PRIVATE_KEY_PATH (for local) must be configured')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}