// Suppress TensorFlow.js warnings in production
export function suppressTensorFlowWarnings() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // Store original console methods
    const originalWarn = console.warn
    const originalLog = console.log

    // Override console methods to filter TensorFlow warnings
    console.warn = (...args: any[]) => {
      const message = args.join(' ')

      // Filter out TensorFlow.js kernel registration warnings
      if (message.includes('kernel') && message.includes('already registered')) {
        return
      }

      // Filter out WASM backend warnings
      if (message.includes('wasm backend was already registered')) {
        return
      }

      // Allow other warnings through
      originalWarn.apply(console, args)
    }

    console.log = (...args: any[]) => {
      const message = args.join(' ')

      // Filter out WASM backend logs
      if (message.includes('wasm backend was already registered')) {
        return
      }

      // Allow other logs through
      originalLog.apply(console, args)
    }
  }
}

// Call this early in your app initialization
if (typeof window !== 'undefined') {
  suppressTensorFlowWarnings()
}