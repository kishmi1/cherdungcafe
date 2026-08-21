// Simple notification tracking system
// In production, consider using a real-time solution like Pusher or WebSocket

let newEnquiryCount = 0
let listeners: ((count: number) => void)[] = []

export function getNewEnquiryCount(): number {
  return newEnquiryCount
}

export function setNewEnquiryCount(count: number): void {
  newEnquiryCount = count
  notifyListeners()
}

export function incrementNewEnquiryCount(): void {
  newEnquiryCount++
  notifyListeners()
}

export function decrementNewEnquiryCount(): void {
  if (newEnquiryCount > 0) {
    newEnquiryCount--
    notifyListeners()
  }
}

export function resetNewEnquiryCount(): void {
  newEnquiryCount = 0
  notifyListeners()
}

export function subscribeToNotifications(callback: (count: number) => void): () => void {
  listeners.push(callback)
  callback(newEnquiryCount) // Initial call with current count
  
  // Return unsubscribe function
  return () => {
    listeners = listeners.filter(listener => listener !== callback)
  }
}

function notifyListeners(): void {
  listeners.forEach(listener => listener(newEnquiryCount))
}

// Initialize count from server on first load
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