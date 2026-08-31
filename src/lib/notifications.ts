// Simple notification tracking system
// In production, consider using a real-time solution like Pusher or WebSocket

let newEnquiryCount = 0
let newOrderCount = 0
let enquiryListeners: ((count: number) => void)[] = []
let orderListeners: ((count: number) => void)[] = []

// Enquiry Notifications
export function getNewEnquiryCount(): number {
  return newEnquiryCount
}

export function setNewEnquiryCount(count: number): void {
  newEnquiryCount = count
  notifyEnquiryListeners()
}

export function incrementNewEnquiryCount(): void {
  newEnquiryCount++
  notifyEnquiryListeners()
}

export function decrementNewEnquiryCount(): void {
  if (newEnquiryCount > 0) {
    newEnquiryCount--
    notifyEnquiryListeners()
  }
}

export function resetNewEnquiryCount(): void {
  newEnquiryCount = 0
  notifyEnquiryListeners()
}

export function subscribeToEnquiryNotifications(callback: (count: number) => void): () => void {
  enquiryListeners.push(callback)
  callback(newEnquiryCount) // Initial call with current count
  
  // Return unsubscribe function
  return () => {
    enquiryListeners = enquiryListeners.filter(listener => listener !== callback)
  }
}

function notifyEnquiryListeners(): void {
  enquiryListeners.forEach(listener => listener(newEnquiryCount))
}

// Order Notifications
export function getNewOrderCount(): number {
  return newOrderCount
}

export function setNewOrderCount(count: number): void {
  newOrderCount = count
  notifyOrderListeners()
}

export function incrementNewOrderCount(): void {
  newOrderCount++
  notifyOrderListeners()
}

export function decrementNewOrderCount(): void {
  if (newOrderCount > 0) {
    newOrderCount--
    notifyOrderListeners()
  }
}

export function resetNewOrderCount(): void {
  newOrderCount = 0
  notifyOrderListeners()
}

export function subscribeToOrderNotifications(callback: (count: number) => void): () => void {
  orderListeners.push(callback)
  callback(newOrderCount) // Initial call with current count
  
  // Return unsubscribe function
  return () => {
    orderListeners = orderListeners.filter(listener => listener !== callback)
  }
}

function notifyOrderListeners(): void {
  orderListeners.forEach(listener => listener(newOrderCount))
}

// Legacy function for backward compatibility
export function subscribeToNotifications(callback: (count: number) => void): () => void {
  return subscribeToEnquiryNotifications(callback)
}

// Initialize counts from server on first load
export async function initializeNotificationCount(): Promise<void> {
  try {
    const response = await fetch('/api/enquiries/count/new')
    if (response.ok) {
      const data = await response.json()
      setNewEnquiryCount(data.count)
    }
  } catch (error) {
    console.error('Failed to initialize notification count:', error)
  }
}

export async function initializeOrderNotificationCount(): Promise<void> {
  try {
    const response = await fetch('/api/orders/count/new')
    if (response.ok) {
      const data = await response.json()
      setNewOrderCount(data.count)
    }
  } catch (error) {
    console.error('Failed to initialize order notification count:', error)
  }
}