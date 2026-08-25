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
              <p className="text-sm mt-2">Reservations module not yet implemented</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="p-4 rounded-lg border" style={{ backgroundColor: '#F7F4EF', borderColor: '#E7DED4' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold" style={{ color: '#292522' }}>{reservation.customerName}</h3>
                      <p className="text-sm flex items-center gap-1" style={{ color: '#756E68' }}>
                        <Users className="h-3 w-3" />
                        {reservation.partySize} guests
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium flex items-center gap-1" style={{ color: '#7A4E2D' }}>
                        <Calendar className="h-4 w-4" />
                        {reservation.date}
                      </p>
                      <p className="text-xs flex items-center gap-1" style={{ color: '#756E68' }}>
                        <Clock className="h-3 w-3" />
                        {reservation.time}
                      </p>
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