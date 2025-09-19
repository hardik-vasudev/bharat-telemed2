# JaaS (Jitsi as a Service) Video Integration

## Overview

The Bharat Telemed platform now includes professional JaaS (Jitsi as a Service) video calling integration with RS256 JWT authentication for secure medical consultations using 8x8's enterprise video platform.

## Features

### ✅ Implemented
- **Enterprise JaaS Integration** - Professional 8x8 video conferencing platform
- **RS256 JWT Authentication** - Secure server-side token generation with private key signing
- **Medical-Optimized UI** - Clean interface designed for healthcare consultations
- **Role-Based Controls** - Different permissions for doctors vs patients
- **RSA 4096 Key Pair** - Cryptographically secure authentication
- **Professional Quality** - Enterprise-grade video and audio quality
- **Screen Sharing** - Doctor-only screen sharing capability
- **HIPAA-Ready Architecture** - Enterprise security standards
- **Professional Branding** - Bharat Telemed branded interface

## File Structure

```
src/
├── app/api/jitsi/token/route.ts      # Server-side JWT token API
├── lib/video/
│   ├── jitsi-config.ts               # Jitsi configuration & medical settings
│   └── token-client.ts               # Client-side token management
├── components/teleconsultation/
│   ├── JitsiMeetProvider.tsx         # React context provider
│   ├── JitsiMeetComponent.tsx        # Main video interface
│   ├── CallManagement.tsx            # Advanced controls panel
│   ├── IndependentDoctorNotepad.tsx  # Medical notes component
│   ├── IndependentPrescriptionBuilder.tsx # Prescription component
│   └── MedKit.tsx                    # Medical tools interface
└── app/teleconsultation/page.tsx     # Main consultation page
```

## Configuration

Environment variables in `.env.local`:

```bash
# Jitsi Meet Configuration
NEXT_PUBLIC_JITSI_DOMAIN=meet.jit.si
NEXT_PUBLIC_JITSI_APP_ID=bharattelemed
JITSI_JWT_SECRET=your-secret-key-change-this-in-production
JITSI_JWT_ISSUER=bharattelemed
JITSI_JWT_AUDIENCE=bharattelemed
```

## Usage

### Starting a Video Consultation

1. Navigate to `/teleconsultation`
2. The system automatically generates:
   - Secure room names (`bharattelemed-{patientId}-{doctorId}-{timestamp}`)
   - JWT tokens with appropriate permissions
   - Medical consultation optimized settings

### Doctor Features
- Full meeting controls (mute participants, manage settings)
- Screen sharing capability
- Advanced call statistics
- Medical notes and prescription tools
- Recording capabilities (if configured)

### Patient Features
- Basic controls (mute/unmute, camera on/off)
- Chat functionality
- Raise hand feature
- Connection quality indicators

## API Endpoints

### POST /api/jitsi/token
Generate JWT token for video call access.

**Request Body:**
```json
{
  "roomId": "bharattelemed-consultation-123",
  "userId": "doctor_001",
  "userName": "Dr. Sarah Wilson",
  "userEmail": "sarah@bharattelemed.com",
  "userRole": "doctor",
  "expirationMinutes": 90
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2024-01-20T10:30:00.000Z",
  "roomId": "bharattelemed-consultation-123",
  "userRole": "doctor",
  "moderator": true
}
```

## Security Features

- **JWT Authentication** - All video calls secured with signed tokens
- **Role-Based Access** - Doctors get moderator permissions, patients get participant access
- **Token Expiration** - Tokens expire after 90 minutes (configurable)
- **Room Validation** - Room names follow secure pattern validation
- **API Rate Limiting** - Server-side token generation prevents client-side manipulation

## Medical Consultation Optimizations

- **Audio Quality** - Optimized for voice clarity (48kHz sample rate, noise suppression)
- **Video Quality** - Medical-appropriate resolution and bitrate settings
- **Network Adaptive** - Automatic quality adjustment based on connection
- **Professional UI** - Clean, distraction-free interface for medical use
- **Recording Ready** - Configured for medical consultation recording

## Production Deployment

### Required Changes for Production:

1. **Secure JWT Secret**
   ```bash
   JITSI_JWT_SECRET=your-very-secure-random-256-bit-secret
   ```

2. **Custom Jitsi Instance** (Recommended)
   ```bash
   NEXT_PUBLIC_JITSI_DOMAIN=meet.your-domain.com
   ```

3. **HTTPS Configuration**
   - Ensure all video calls happen over HTTPS
   - Configure proper SSL certificates

4. **Database Integration**
   - Store consultation metadata
   - Track call statistics
   - Audit trails for compliance

## Compliance Considerations

- **HIPAA Alignment** - Secure video transmission, no data storage on public servers
- **Patient Privacy** - Encrypted connections, secure token-based access
- **Audit Trails** - Call logs and participant tracking
- **Data Retention** - Configurable recording and data retention policies

## Development Server

Currently running on: `http://localhost:3005`

### Available Routes:
- `/teleconsultation` - Main video consultation interface
- `/api/jitsi/token` - JWT token generation endpoint

## Next Steps

1. **Backend Integration** - Connect with patient/doctor database
2. **Appointment Scheduling** - Link with existing appointment system
3. **Medical Records** - Integration with EMR systems
4. **Notifications** - Call invitations and reminders
5. **Analytics** - Call quality metrics and usage statistics