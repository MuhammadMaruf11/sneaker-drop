import axios from 'axios'

export type ReserveDropPayload = {
  dropId: string
  userId: string
}

export type PurchasePayload = {
  reservationId: string
  userId: string
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
})

export function getDrops() {
  return apiClient.get('/drops')
}

export function reserveDrop(payload: ReserveDropPayload) {
  return apiClient.post('/reservations', payload)
}

export function purchase(payload: PurchasePayload) {
  return apiClient.post('/purchases', payload)
}

export default apiClient
