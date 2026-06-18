import { useEffect } from 'react'

import { socket } from '../realtime/socket'

export function useStockUpdates() {
  useEffect(() => {
    const handleStockUpdated = (event: unknown) => {
      console.log('stock-updated', event)
    }

    const handleReservationCreated = (event: unknown) => {
      console.log('reservation-created', event)
    }

    const handleReservationExpired = (event: unknown) => {
      console.log('reservation-expired', event)
    }

    socket.on('stock-updated', handleStockUpdated)
    socket.on('reservation-created', handleReservationCreated)
    socket.on('reservation-expired', handleReservationExpired)

    return () => {
      socket.off('stock-updated', handleStockUpdated)
      socket.off('reservation-created', handleReservationCreated)
      socket.off('reservation-expired', handleReservationExpired)
    }
  }, [])
}

export default useStockUpdates
