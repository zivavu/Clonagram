export function getMediaErrorMessage(error: unknown) {
   if (error instanceof DOMException) {
      switch (error.name) {
         case 'NotAllowedError':
         case 'SecurityError':
            return 'Camera and microphone access was denied. Allow permission and try again.';
         case 'NotFoundError':
         case 'OverconstrainedError':
            return 'No camera or microphone was found on this device.';
         case 'NotReadableError':
            return 'Your camera or microphone is already in use by another app.';
         default:
            return error.message || 'Could not access your camera or microphone.';
      }
   }
   return 'Could not access your camera or microphone.';
}
