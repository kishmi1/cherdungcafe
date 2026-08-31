"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StaffReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/staff/reservations')
      const data = await response.json()
      setReservations(data.reservations || [])
    } catch (error) {
      console.error('Failed to fetch reservations:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#292522' }}>Reservations</h1>
        <p className="text-sm" style={{ color: '#756E68' }}>Manage table reservations</p>
      </div>

      <Card style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
        <CardHeader>
          <CardTitle style={{ color: '#292522' }}>Upcoming Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12" style={{ color: '#756E68' }}>
              Loading reservations...
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#756E68' }}>
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No reservations yet</p>
              <p className="text-sm mt-2">When customers book tables, they will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="p-4 rounded-lg border" style={{ backgroundColor: '#F7F4EF', borderColor: '#E7DED4' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold" style={{ color: '#292522' }}>{reservation.name}</h3>
                      <p className="text-sm flex items-center gap-1" style={{ color: '#756E68' }}>
                        <Users className="h-3 w-3" />
                        {reservation.numberOfGuests} guests
                      </p>
                      <p className="text-xs mt-1" style={{ color: '#756E68' }}>
                        {reservation.email} • {reservation.phone}
                      </p>
                      {reservation.specialRequest && (
                        <p className="text-xs mt-1 italic" style={{ color: '#7A4E2D' }}>
                          "{reservation.specialRequest}"
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium flex items-center gap-1" style={{ color: '#7A4E2D' }}>
                        <Calendar className="h-4 w-4" />
                        {new Date(reservation.reservationDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                      <p className="text-xs flex items-center gap-1" style={{ color: '#756E68' }}>
                        <Clock className="h-3 w-3" />
                        {reservation.reservationTime}
                      </p>
                      <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full" style={{ 
                        backgroundColor: reservation.status === 'PENDING' ? '#FEF3C7' : 
                                       reservation.status === 'CONFIRMED' ? '#D1FAE5' : 
                                       reservation.status === 'CANCELLED' ? '#FEE2E2' : '#E5E7EB',
                        color: reservation.status === 'PENDING' ? '#92400E' : 
                               reservation.status === 'CONFIRMED' ? '#065F46' : 
                               reservation.status === 'CANCELLED' ? '#991B1B' : '#374151'
                      }}>
                        {reservation.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}