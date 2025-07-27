'use client'

import React, { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Mail,
  Trash2,
  Send,
  Plus,
  CheckCircle,
  ExternalLink,
  AlertCircle,
} from 'lucide-react'
import { useParams } from 'next/navigation'
import { useSendEmail } from '@/lib/hooks/use-email'

const Page: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('')
  const [emails, setEmails] = useState<string[]>([])
  const params = useParams()

  const adminId: string = params.id as string

  // Use the React Query hook
  const sendEmail = useSendEmail()

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }

  const addEmails = (): void => {
    if (!inputValue.trim()) return

    const newEmails: string[] = inputValue
      .split(/[,\n\s]+/)
      .map((email: string) => email.trim())
      .filter((email: string) => email && validateEmail(email))
      .filter((email: string) => !emails.includes(email))

    if (newEmails.length > 0) {
      setEmails((prev: string[]) => [...prev, ...newEmails])
      setInputValue('')
      // Clear previous mutation state
      sendEmail.reset()
    }
  }

  const removeEmail = (emailToRemove: string): void => {
    setEmails((prev: string[]) =>
      prev.filter((email: string) => email !== emailToRemove)
    )
  }

  const createEmailMessage = (): string => {
    const registrationLink = `http://localhost:8000/register/${adminId}`

    const message = `Dear Team Member,

You have been invited to join our platform as a staff member!

To complete your registration and set up your account, please click on the link below:

${registrationLink}

This invitation link will allow you to:
• Create your staff account
• Set up your login credentials  
• Access the platform dashboard
• Start collaborating with the team

Please complete your registration within 7 days of receiving this invitation.

If you have any questions or need assistance, please don't hesitate to reach out to your administrator.

Best regards,
The Admin Team

---
Note: This is an automated invitation email. Please do not reply to this message.`

    return message
  }

  const handleSendEmails = (): void => {
    if (emails.length === 0) return

    // Create the data string with emails and adminId
    const emailData = {
      emails,
      adminId,
    }

    sendEmail.mutate(emailData, {
      onSuccess: () => {
        // Clear the emails list after successful send
        setEmails([])
      },
      onError: error => {
        console.error('Failed to send emails:', error)
      },
    })
  }

  const previewEmailContent = (): void => {
    const message = createEmailMessage()
    alert(message) // You could replace this with a proper modal
  }

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      addEmails()
    }
  }

  // Get loading state and error from the mutation
  const isLoading = sendEmail.isPending
  const error = sendEmail.error
  const isSuccess = sendEmail.isSuccess

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-lg bg-blue-600 p-2">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Email Invitation Manager
              </h1>
              <p className="text-gray-600">
                Send login invitations to multiple staff members via Mailtrap
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Admin ID:{' '}
            <span className="rounded bg-gray-100 px-2 py-1 font-mono">
              {adminId}
            </span>
          </div>
          <div className="mt-2 text-sm text-blue-600">
            Registration Link:{' '}
            <span className="rounded bg-blue-50 px-2 py-1 font-mono">
              http://localhost:8000/register/{adminId}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          {/* Input Section */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Addresses
            </label>
            <div className="space-y-3">
              <Textarea
                value={inputValue}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setInputValue(e.target.value)
                }
                onKeyDown={handleKeyPress}
                placeholder="Enter email addresses (separate multiple emails with commas, spaces, or new lines)
Example: user1@example.com, user2@example.com"
                className="min-h-[100px] resize-none border-2 border-gray-200 transition-colors focus:border-blue-500"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Press Ctrl+Enter to add emails quickly
                </span>
                <Button
                  onClick={addEmails}
                  disabled={!inputValue.trim()}
                  className="bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Emails
                </Button>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {isSuccess && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">
                  Invitation emails sent successfully!
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">
                {error instanceof Error
                  ? error.message
                  : 'Failed to send emails. Please try again.'}
              </span>
            </div>
          )}

          {/* Email List */}
          {emails.length > 0 && (
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Email Recipients ({emails.length})
                </h3>
                <div className="flex gap-2">
                  <Button
                    onClick={previewEmailContent}
                    variant="outline"
                    className="px-4 py-2"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Preview Email
                  </Button>
                  <Button
                    onClick={handleSendEmails}
                    disabled={isLoading}
                    className="bg-green-600 px-6 py-2 text-white hover:bg-green-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Invitations
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid max-h-64 gap-2 overflow-y-auto">
                {emails.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{email}</span>
                    </div>
                    <Button
                      onClick={() => removeEmail(email)}
                      variant="ghost"
                      size="sm"
                      className="p-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {emails.length === 0 && !isSuccess && !error && (
            <div className="py-12 text-center">
              <Mail className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No emails added yet
              </h3>
              <p className="text-gray-500">
                Add email addresses above to send login invitations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Page
