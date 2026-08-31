"use client"

import { useState, useEffect } from "react"
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Filter,
  Search,
  MoreVertical,
  X,
  ChevronDown,
  Mail,
  Phone,
  Eye
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"

interface Reservation {
  id: number
  name: string
  email: string
  phone: string
  numberOfGuests: number
  reservationDate: string
  reservationTime: string
  specialRequest: string | null
  status: ReservationStatus
  createdAt: string
  updatedAt: string
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<ReservationStatus | "ALL">("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [showDropdown, setShowDropdown] = useState<number | null>(null)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  useEffect(() => {
    fetchReservations()
  }, [])

  useEffect(() => {
    let filtered = reservations

    // Apply status filter
    if (filter !== "ALL") {
      filtered = filtered.filter(r => r.status === filter)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(query) ||
        r.email.toLowerCase().includes(query) ||
        r.phone.toLowerCase().includes(query)
      )
    }

    setFilteredReservations(filtered)
  }, [reservations, filter, searchQuery])

  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/admin/reservations")
      if (response.ok) {
        const data = await response.json()
        setReservations(data.reservations || [])
        setFilteredReservations(data.reservations || [])
      }
    } catch (error) {
      console.error("Failed to fetch reservations:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (reservationId: number, newStatus: ReservationStatus) => {
    try {
      const response = await fetch("/api/admin/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reservationId, status: newStatus })
      })

      if (response.ok) {
        setReservations(prev => 
          prev.map(r => r.id === reservationId ? { ...r, status: newStatus } : r)
        )
        setShowDropdown(null)
      }
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200"
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusLabel = (status: ReservationStatus) => {
    switch (status) {
      case "PENDING":
        return "Pending"
      case "CONFIRMED":
        return "Confirmed"
      case "CANCELLED":
        return "Cancelled"
      case "COMPLETED":
        return "Completed"
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const statusCounts = {
    ALL: reservations.length,
    PENDING: reservations.filter(r => r.status === "PENDING").length,
    CONFIRMED: reservations.filter(r => r.status === "CONFIRMED").length,
    CANCELLED: reservations.filter(r => r.status === "CANCELLED").length,
    COMPLETED: reservations.filter(r => r.status === "COMPLETED").length
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6" style={{ backgroundColor: '#F7F4EF' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#292522' }}>Table Reservations</h1>
        <p className="text-sm" style={{ color: '#756E68' }}>
          Manage table booking reservations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: "All", count: statusCounts.ALL, color: "#7A4E2D" },
          { label: "Pending", count: statusCounts.PENDING, color: "#f59e0b" },
          { label: "Confirmed", count: statusCounts.CONFIRMED, color: "#10b981" },
          { label: "Cancelled", count: statusCounts.CANCELLED, color: "#ef4444" },
          { label: "Completed", count: statusCounts.COMPLETED, color: "#3b82f6" }
        ].map((stat) => (
          <Card 
            key={stat.label}
            className="cursor-pointer transition-all hover:shadow-md"
            style={{ 
              backgroundColor: filter === stat.label.toUpperCase() ? '#FFF8E1' : '#FFFFFF',
              border: `1px solid ${filter === stat.label.toUpperCase() ? '#B68A52' : '#E7DED4'}`,
              opacity: filter === stat.label.toUpperCase() ? 1 : 0.8
            }}
            onClick={() => setFilter(stat.label.toUpperCase() as ReservationStatus | "ALL")}
          >
            <CardContent className="p-4">
              <div className="text-2xl font-bold" style={{ color: stat.color }}>
                {stat.count}
              </div>
              <div className="text-sm mt-1" style={{ color: '#756E68' }}>
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <Card className="mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#756E68' }} />
              <input
                type="text"
                placeholder="Search reservations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                style={{ borderColor: '#E7DED4' }}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["ALL", "PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"] as const).map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(status)}
                  style={{
                    backgroundColor: filter === status ? '#7A4E2D' : '#FFFFFF',
                    borderColor: '#E7DED4',
                    color: filter === status ? '#FFFFFF' : '#7A4E2D'
                  }}
                >
                  {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reservations List */}
      <Card style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
        <CardHeader>
          <CardTitle style={{ color: '#292522' }}>
            Reservations ({filteredReservations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredReservations.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#756E68' }}>
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No reservations found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="p-4 rounded-lg border transition-all hover:shadow-md"
                  style={{ 
                    backgroundColor: '#F7F4EF',
                    borderColor: '#E7DED4'
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold" style={{ color: '#292522' }}>
                          {reservation.name}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(reservation.status)}`}
                        >
                          {getStatusLabel(reservation.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm mb-2" style={{ color: '#756E68' }}>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {reservation.numberOfGuests} guests
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(reservation.reservationDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {reservation.reservationTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm mb-2" style={{ color: '#756E68' }}>
                        <span>{reservation.email}</span>
                        <span>{reservation.phone}</span>
                      </div>
                      {reservation.specialRequest && (
                        <p className="text-sm italic" style={{ color: '#7A4E2D' }}>
                          "{reservation.specialRequest}"
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: '#999' }}>
                        <Clock className="h-3 w-3" />
                        Booked: {formatDateTime(reservation.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedReservation(reservation)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDropdown(showDropdown === reservation.id ? null : reservation.id)}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                      {showDropdown === reservation.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10" style={{ borderColor: '#E7DED4' }}>
                          <div className="p-1">
                            {(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"] as ReservationStatus[]).map((status) => (
                              <button
                                key={status}
                                className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 flex items-center gap-2"
                                style={{ color: '#292522' }}
                                onClick={() => updateStatus(reservation.id, status)}
                              >
                                {status === "PENDING" && <AlertCircle className="h-4 w-4 text-orange-500" />}
                                {status === "CONFIRMED" && <CheckCircle className="h-4 w-4 text-green-500" />}
                                {status === "CANCELLED" && <X className="h-4 w-4 text-red-500" />}
                                {status === "COMPLETED" && <CheckCircle className="h-4 w-4 text-blue-500" />}
                                {getStatusLabel(status)}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail View Modal */}
      {selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ border: '1px solid #E7DED4' }}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: '#292522' }}>
                  Reservation Details
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedReservation(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(selectedReservation.status)}`}
                  >
                    {getStatusLabel(selectedReservation.status)}
                  </span>
                  <span className="text-sm" style={{ color: '#756E68' }}>
                    Reservation ID: RES-{selectedReservation.id}
                  </span>
                </div>

                {/* Customer Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: '#7A4E2D' }}>Customer Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F7F4EF' }}>
                        <Users className="h-5 w-5" style={{ color: '#7A4E2D' }} />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: '#292522' }}>{selectedReservation.name}</p>
                        <p className="text-sm" style={{ color: '#756E68' }}>{selectedReservation.numberOfGuests} guests</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F7F4EF' }}>
                        <Mail className="h-5 w-5" style={{ color: '#7A4E2D' }} />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: '#292522' }}>{selectedReservation.email}</p>
                        <a 
                          href={`mailto:${selectedReservation.email}`}
                          className="text-sm hover:underline"
                          style={{ color: '#7A4E2D' }}
                        >
                          Send email
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F7F4EF' }}>
                        <Phone className="h-5 w-5" style={{ color: '#7A4E2D' }} />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: '#292522' }}>{selectedReservation.phone}</p>
                        <a 
                          href={`tel:${selectedReservation.phone}`}
                          className="text-sm hover:underline"
                          style={{ color: '#7A4E2D' }}
                        >
                          Call
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reservation Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: '#7A4E2D' }}>Reservation Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F4EF' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4" style={{ color: '#7A4E2D' }} />
                        <span className="text-sm font-medium" style={{ color: '#756E68' }}>Date</span>
                      </div>
                      <p className="font-semibold" style={{ color: '#292522' }}>
                        {formatDate(selectedReservation.reservationDate)}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F4EF' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4" style={{ color: '#7A4E2D' }} />
                        <span className="text-sm font-medium" style={{ color: '#756E68' }}>Time</span>
                      </div>
                      <p className="font-semibold" style={{ color: '#292522' }}>
                        {selectedReservation.reservationTime}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Special Request */}
                {selectedReservation.specialRequest && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3" style={{ color: '#7A4E2D' }}>Special Request</h3>
                    <div className="p-4 rounded-lg border-l-4" style={{ 
                      backgroundColor: '#FFF8E1', 
                      borderColor: '#B68A52' 
                    }}>
                      <p className="italic" style={{ color: '#292522' }}>
                        "{selectedReservation.specialRequest}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="text-sm" style={{ color: '#999' }}>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Booked on: {formatDateTime(selectedReservation.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4" />
                    <span>Last updated: {formatDateTime(selectedReservation.updatedAt)}</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3 pt-4 border-t" style={{ borderColor: '#E7DED4' }}>
                  <Button
                    onClick={() => {
                      updateStatus(selectedReservation.id, 'CONFIRMED')
                      setSelectedReservation(null)
                    }}
                    style={{ backgroundColor: '#10b981', color: 'white' }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm
                  </Button>
                  <Button
                    onClick={() => {
                      updateStatus(selectedReservation.id, 'CANCELLED')
                      setSelectedReservation(null)
                    }}
                    style={{ backgroundColor: '#ef4444', color: 'white' }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      updateStatus(selectedReservation.id, 'COMPLETED')
                      setSelectedReservation(null)
                    }}
                    style={{ backgroundColor: '#3b82f6', color: 'white' }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}