"use client"

import { useState, useEffect } from "react"
import { Mail, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Message {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  isRead: boolean
  createdAt: string
}

export default function StaffMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/staff/messages')
      const data = await response.json()

      if (response.ok) {
        setMessages(data.messages || [])
      } else {
        setError(data.error || 'Failed to fetch messages')
      }
    } catch (error) {
      setError('An error occurred while fetching messages')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`/api/staff/messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true }),
      })

      if (response.ok) {
        setMessages(messages.map(msg =>
          msg.id === id ? { ...msg, isRead: true } : msg
        ))
      }
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const markAsUnread = async (id: number) => {
    try {
      const response = await fetch(`/api/staff/messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: false }),
      })

      if (response.ok) {
        setMessages(messages.map(msg =>
          msg.id === id ? { ...msg, isRead: false } : msg
        ))
      }
    } catch (error) {
      console.error('Failed to mark as unread:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading messages...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="p-6" style={{ backgroundColor: '#F7F4EF' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#292522' }}>Contact Messages</h1>
        <p className="text-sm" style={{ color: '#756E68' }}>View and manage messages from the contact form</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-4">
          {messages.length === 0 ? (
            <Card className="p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
              <div className="text-center" style={{ color: '#756E68' }}>
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet</p>
              </div>
            </Card>
          ) : (
            messages.map((message) => (
              <Card
                key={message.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedMessage?.id === message.id
                    ? 'border-2'
                    : 'border hover:border-amber-300'
                } ${!message.isRead ? 'bg-amber-50' : ''}`}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: selectedMessage?.id === message.id ? '#B68A52' : '#E7DED4'
                }}
                onClick={() => {
                  setSelectedMessage(message)
                  if (!message.isRead) {
                    markAsRead(message.id)
                  }
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1" style={{ color: '#292522' }}>{message.name}</h3>
                    <p className="text-sm" style={{ color: '#756E68' }}>{message.subject}</p>
                  </div>
                  {!message.isRead && (
                    <div className="w-2 h-2 rounded-full ml-2 mt-2" style={{ backgroundColor: '#B68A52' }} />
                  )}
                </div>
                <p className="text-xs" style={{ color: '#999' }}>{formatDate(message.createdAt)}</p>
              </Card>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card className="p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-2" style={{ color: '#292522' }}>{selectedMessage.subject}</h2>
                  <div className="text-sm space-y-1" style={{ color: '#756E68' }}>
                    <p><strong>From:</strong> {selectedMessage.name}</p>
                    <p><strong>Email:</strong> {selectedMessage.email}</p>
                    {selectedMessage.phone && <p><strong>Phone:</strong> {selectedMessage.phone}</p>}
                    <p><strong>Date:</strong> {formatDate(selectedMessage.createdAt)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markAsUnread(selectedMessage.id)}
                    disabled={!selectedMessage.isRead}
                  >
                    <EyeOff className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="border-t pt-6" style={{ borderColor: '#E7DED4' }}>
                <h3 className="font-semibold mb-2" style={{ color: '#292522' }}>Message</h3>
                <p className="whitespace-pre-wrap" style={{ color: '#292522' }}>{selectedMessage.message}</p>
              </div>

              <div className="mt-6 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.location.href = `mailto:${selectedMessage.email}`}
                  style={{ borderColor: '#E7DED4', color: '#7A4E2D' }}
                >
                  Reply via Email
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-12" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
              <div className="text-center" style={{ color: '#756E68' }}>
                <Mail className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Select a message to view details</p>
                <p className="text-sm">Choose a message from the list to read and manage it</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
