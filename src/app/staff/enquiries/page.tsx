"use client"

import { useState, useEffect } from "react"
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Filter,
  Search,
  MoreVertical,
  Eye,
  X,
  ChevronDown,
  Send,
  Reply
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { resetNewEnquiryCount } from "@/lib/notifications"

type EnquiryStatus = "NEW" | "IN_PROGRESS" | "RESOLVED"

interface Enquiry {
  id: number
  name: string
  email: string
  phone: string | null
  type: string
  subject: string
  message: string
  status: EnquiryStatus
  createdAt: string
  updatedAt: string
  replies?: EnquiryReply[]
}

interface EnquiryReply {
  id: number
  message: string
  sentAt: string
}

export default function StaffEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [filteredEnquiries, setFilteredEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)
  const [filter, setFilter] = useState<EnquiryStatus | "ALL">("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [showDropdown, setShowDropdown] = useState<number | null>(null)
  const [replyMessage, setReplyMessage] = useState("")
  const [isSendingReply, setIsSendingReply] = useState(false)

  useEffect(() => {
    fetchEnquiries()
    resetNewEnquiryCount()
  }, [])

  useEffect(() => {
    let filtered = enquiries

    if (filter !== "ALL") {
      filtered = filtered.filter(e => e.status === filter)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(e => 
        e.name.toLowerCase().includes(query) ||
        e.email.toLowerCase().includes(query) ||
        e.subject.toLowerCase().includes(query) ||
        e.message.toLowerCase().includes(query)
      )
    }

    setFilteredEnquiries(filtered)
  }, [enquiries, filter, searchQuery])

  const fetchEnquiries = async () => {
    try {
      const response = await fetch("/api/staff/enquiries")
      if (response.ok) {
        const data = await response.json()
        setEnquiries(data)
        setFilteredEnquiries(data)
      }
    } catch (error) {
      console.error("Failed to fetch enquiries:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (enquiryId: number, newStatus: EnquiryStatus) => {
    try {
      const response = await fetch(`/api/staff/enquiries/${enquiryId}`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setEnquiries(prev => 
          prev.map(e => e.id === enquiryId ? { ...e, status: newStatus } : e)
        )
        setShowDropdown(null)
      }
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const sendReply = async () => {
    if (!selectedEnquiry || !replyMessage.trim()) return

    setIsSendingReply(true)
    try {
      const response = await fetch(`/api/staff/enquiries/${selectedEnquiry.id}/reply`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyMessage.trim() })
      })

      if (response.ok) {
        const data = await response.json()
        
        setSelectedEnquiry(prev => prev ? {
          ...prev,
          replies: [...(prev.replies || []), data.reply]
        } : null)

        setEnquiries(prev => 
          prev.map(e => e.id === selectedEnquiry.id ? {
            ...e,
            replies: [...(e.replies || []), data.reply]
          } : e)
        )

        setReplyMessage("")
        alert("Reply sent successfully!")
      } else {
        alert("Failed to send reply. Please try again.")
      }
    } catch (error) {
      console.error("Failed to send reply:", error)
      alert("Failed to send reply. Please try again.")
    } finally {
      setIsSendingReply(false)
    }
  }

  const getStatusColor = (status: EnquiryStatus) => {
    switch (status) {
      case "NEW":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "RESOLVED":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusLabel = (status: EnquiryStatus) => {
    switch (status) {
      case "NEW":
        return "New"
      case "IN_PROGRESS":
        return "In Progress"
      case "RESOLVED":
        return "Resolved"
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
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
    ALL: enquiries.length,
    NEW: enquiries.filter(e => e.status === "NEW").length,
    IN_PROGRESS: enquiries.filter(e => e.status === "IN_PROGRESS").length,
    RESOLVED: enquiries.filter(e => e.status === "RESOLVED").length
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
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#292522' }}>Enquiries Management</h1>
        <p className="text-sm" style={{ color: '#756E68' }}>
          View and respond to customer enquiries
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "All", count: statusCounts.ALL, color: "#7A4E2D" },
          { label: "New", count: statusCounts.NEW, color: "#f59e0b" },
          { label: "In Progress", count: statusCounts.IN_PROGRESS, color: "#3b82f6" },
          { label: "Resolved", count: statusCounts.RESOLVED, color: "#10b981" }
        ].map((stat) => (
          <Card 
            key={stat.label}
            className="cursor-pointer transition-all hover:shadow-md"
            style={{ 
              backgroundColor: filter === stat.label.toUpperCase() ? '#FFF8E1' : '#FFFFFF',
              border: `1px solid ${filter === stat.label.toUpperCase() ? '#B68A52' : '#E7DED4'}`,
              opacity: filter === stat.label.toUpperCase() ? 1 : 0.8
            }}
            onClick={() => setFilter(stat.label.toUpperCase() as EnquiryStatus | "ALL")}
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
                placeholder="Search enquiries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                style={{ borderColor: '#E7DED4' }}
              />
            </div>
            <div className="flex gap-2">
              {(["ALL", "NEW", "IN_PROGRESS", "RESOLVED"] as const).map((status) => (
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
                  {status === "ALL" ? "All" : status.replace("_", " ")}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enquiries List */}
      <Card style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
        <CardHeader>
          <CardTitle style={{ color: '#292522' }}>
            Enquiries ({filteredEnquiries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEnquiries.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#756E68' }}>
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No enquiries found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEnquiries.map((enquiry) => (
                <div
                  key={enquiry.id}
                  className="p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer"
                  style={{ 
                    backgroundColor: '#F7F4EF',
                    borderColor: '#E7DED4'
                  }}
                  onClick={() => setSelectedEnquiry(enquiry)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold truncate" style={{ color: '#292522' }}>
                          {enquiry.subject}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(enquiry.status)}`}
                        >
                          {getStatusLabel(enquiry.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm mb-2" style={{ color: '#756E68' }}>
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {enquiry.email}
                        </span>
                        {enquiry.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {enquiry.phone}
                          </span>
                        )}
                      </div>
                      <p className="text-sm truncate" style={{ color: '#756E68' }}>
                        {enquiry.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: '#999' }}>
                        <Clock className="h-3 w-3" />
                        {formatDate(enquiry.createdAt)}
                      </div>
                    </div>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowDropdown(showDropdown === enquiry.id ? null : enquiry.id)
                        }}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                      {showDropdown === enquiry.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10" style={{ borderColor: '#E7DED4' }}>
                          <div className="p-1">
{(["NEW", "IN_PROGRESS", "RESOLVED"] as EnquiryStatus[]).map((status) => (                              <button
                                key={status}
                                className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 flex items-center gap-2"
                                style={{ color: '#292522' }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  updateStatus(enquiry.id, status)
                                }}
                              >
                                {status === "NEW" && <AlertCircle className="h-4 w-4 text-orange-500" />}
                                {status === "IN_PROGRESS" && <Clock className="h-4 w-4 text-blue-500" />}
                                {status === "RESOLVED" && <CheckCircle className="h-4 w-4 text-green-500" />}
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

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-2" style={{ color: '#292522' }}>
                    {selectedEnquiry.subject}
                  </h2>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(selectedEnquiry.status)}`}
                  >
                    {getStatusLabel(selectedEnquiry.status)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEnquiry(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium" style={{ color: '#756E68' }}>Name</label>
                    <p className="font-medium" style={{ color: '#292522' }}>{selectedEnquiry.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium" style={{ color: '#756E68' }}>Email</label>
                    <p className="font-medium" style={{ color: '#292522' }}>{selectedEnquiry.email}</p>
                  </div>
                  {selectedEnquiry.phone && (
                    <div>
                      <label className="text-sm font-medium" style={{ color: '#756E68' }}>Phone</label>
                      <p className="font-medium" style={{ color: '#292522' }}>{selectedEnquiry.phone}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium" style={{ color: '#756E68' }}>Type</label>
                    <p className="font-medium" style={{ color: '#292522' }}>{selectedEnquiry.type}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium" style={{ color: '#756E68' }}>Message</label>
                  <div className="mt-1 p-4 rounded-lg" style={{ backgroundColor: '#F7F4EF' }}>
                    <p className="whitespace-pre-wrap" style={{ color: '#292522' }}>
                      {selectedEnquiry.message}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 text-sm" style={{ color: '#756E68' }}>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Created: {formatDate(selectedEnquiry.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Updated: {formatDate(selectedEnquiry.updatedAt)}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4" style={{ borderColor: '#E7DED4' }}>
                <label className="text-sm font-medium mb-2 block" style={{ color: '#756E68' }}>
                  Update Status
                </label>
                <div className="flex gap-2 mb-6">
{(["NEW", "IN_PROGRESS", "RESOLVED"] as EnquiryStatus[]).map((status) => (                    <Button
                      key={status}
                      variant={selectedEnquiry.status === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateStatus(selectedEnquiry.id, status)}
                      style={{
                        backgroundColor: selectedEnquiry.status === status ? '#7A4E2D' : '#FFFFFF',
                        borderColor: '#E7DED4',
                        color: selectedEnquiry.status === status ? '#FFFFFF' : '#7A4E2D'
                      }}
                    >
                      {status === "NEW" && <AlertCircle className="h-4 w-4 mr-1" />}
                      {status === "IN_PROGRESS" && <Clock className="h-4 w-4 mr-1" />}
                      {status === "RESOLVED" && <CheckCircle className="h-4 w-4 mr-1" />}
                      {getStatusLabel(status)}
                    </Button>
                  ))}
                </div>

                {/* Reply Section */}
                <div className="border-t pt-4" style={{ borderColor: '#E7DED4' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Reply className="h-5 w-5" style={{ color: '#7A4E2D' }} />
                    <h3 className="font-semibold" style={{ color: '#292522' }}>Reply to Customer</h3>
                  </div>

                  {/* Previous Replies */}
                  {selectedEnquiry.replies && selectedEnquiry.replies.length > 0 && (
                    <div className="mb-4 space-y-3">
                      <h4 className="text-sm font-medium" style={{ color: '#756E68' }}>
                        Previous Replies ({selectedEnquiry.replies.length})
                      </h4>
                      {selectedEnquiry.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: '#F7F4EF', border: '1px solid #E7DED4' }}
                        >
                          <p className="text-sm mb-2" style={{ color: '#292522' }}>{reply.message}</p>
                          <p className="text-xs" style={{ color: '#999' }}>
                            Sent: {formatDate(reply.sentAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Form */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block" style={{ color: '#756E68' }}>
                        Your Reply
                      </label>
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type your reply to the customer..."
                        rows={4}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                        style={{ borderColor: '#E7DED4' }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm" style={{ color: '#756E68' }}>
                        Reply will be sent to: <span className="font-medium" style={{ color: '#292522' }}>{selectedEnquiry.email}</span>
                      </p>
                      <Button
                        onClick={sendReply}
                        disabled={!replyMessage.trim() || isSendingReply}
                        style={{
                          backgroundColor: '#7A4E2D',
                          color: '#FFFFFF',
                          opacity: (!replyMessage.trim() || isSendingReply) ? 0.5 : 1
                        }}
                      >
                        {isSendingReply ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Reply
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
