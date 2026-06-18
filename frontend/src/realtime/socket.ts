import { io } from 'socket.io-client'

export const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000', {
  autoConnect: true,
  transports: ['websocket', 'polling'],  // ← এটা যোগ করো, Disconnected fix হবে
})

export default socket