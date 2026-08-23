"use client"

import { useState, useEffect } from "react"
import { Mail, Trash2, Eye, EyeOff } from "lucide-react"
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

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/messages')
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
      const response = await fetch(`/api/admin/messages/${id}`, {
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

  const deleteMessage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMessages(messages.filter(msg => msg.id !== id))
        if (selectedMessage?.id === id) {
          setSelectedMessage(null)
        }
      }
    } catch (error) {
      console.error('Failed to delete message:', error)
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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">Manage messages from the contact form</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-4">
          {messages.length === 0 ? (
            <Card className="p-6">
              <div className="text-center text-gray-500">
                <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No messages yet</p>
              </div>
            </Card>
          ) : (
            messages.map((message) => (
              <Card
                key={message.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedMessage?.id === message.id
                    ? 'border-amber-500 border-2'
                    : 'border border-gray-200 hover:border-amber-300'
                } ${!message.isRead ? 'bg-amber-50' : ''}`}
                onClick={() => {
                  setSelectedMessage(message)
                  if (!message.isRead) {
                    markAsRead(message.id)
                  }
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{message.name}</h3>
                    <p className="text-sm text-gray-600">{message.subject}</p>
                  </div>
                  {!message.isRead && (
                    <div className="w-2 h-2 bg-amber-500 rounded-full ml-2 mt-2" />
                  )}
                </div>
                <p className="text-xs text-gray-500">{formatDate(message.createdAt)}</p>
              </Card>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedMessage.subject}</h2>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>From:</strong> {selectedMessage.name}</p>
                    <p><strong>Email:</strong> {selectedMessage.email}</p>
                    {selectedMessage.phone && <p><strong>Phone:</strong> {selectedMessage.phone}</p>}
                    <p><strong>Date:</strong> {formatDate(selectedMessage.createdAt)}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteMessage(selectedMessage.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Message</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="mt-6 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.location.href = `mailto:${selectedMessage.email}`}
                >
                  Reply via Email
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-12">
              <div className="text-center text-gray-500">
                <Mail className="h-16 w-16 mx-auto mb-4 text-gray-400" />
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
