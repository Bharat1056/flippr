"use client"

import React, { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Mail, Trash2, Send, Plus, CheckCircle, ExternalLink, AlertCircle } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useSendEmail } from '@/lib/hooks/use-email'

interface PageProps {}

const Page: React.FC<PageProps> = () => {
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
        setEmails((prev: string[]) => prev.filter((email: string) => email !== emailToRemove))
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
            onError: (error) => {
                console.error('Failed to send emails:', error)
            }
        })
    }

    const previewEmailContent = (): void => {
        const message = createEmailMessage()
        alert(message) // You could replace this with a proper modal
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
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
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Email Invitation Manager</h1>
                            <p className="text-gray-600">Send login invitations to multiple staff members via Mailtrap</p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">
                        Admin ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{adminId}</span>
                    </div>
                    <div className="text-sm text-blue-600 mt-2">
                        Registration Link: <span className="font-mono bg-blue-50 px-2 py-1 rounded">http://localhost:8000/register/{adminId}</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {/* Input Section */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Addresses
                        </label>
                        <div className="space-y-3">
                            <Textarea
                                value={inputValue}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Enter email addresses (separate multiple emails with commas, spaces, or new lines)
Example: user1@example.com, user2@example.com"
                                className="min-h-[100px] resize-none border-2 border-gray-200 focus:border-blue-500 transition-colors"
                            />
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">
                                    Press Ctrl+Enter to add emails quickly
                                </span>
                                <Button
                                    onClick={addEmails}
                                    disabled={!inputValue.trim()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Emails
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Success Message */}
                    {isSuccess && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="text-green-800 font-medium">
                                    Invitation emails sent successfully!
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <span className="text-red-800">
                                {error instanceof Error ? error.message : 'Failed to send emails. Please try again.'}
                            </span>
                        </div>
                    )}

                    {/* Email List */}
                    {emails.length > 0 && (
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Email Recipients ({emails.length})
                                </h3>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={previewEmailContent}
                                        variant="outline"
                                        className="px-4 py-2"
                                    >
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Preview Email
                                    </Button>
                                    <Button
                                        onClick={handleSendEmails}
                                        disabled={isLoading}
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                Send Invitations
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="grid gap-2 max-h-64 overflow-y-auto">
                                {emails.map((email, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-4 h-4 text-gray-500" />
                                            <span className="text-gray-900 font-medium">{email}</span>
                                        </div>
                                        <Button
                                            onClick={() => removeEmail(email)}
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                                            disabled={isLoading}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {emails.length === 0 && !isSuccess && !error && (
                        <div className="text-center py-12">
                            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No emails added yet</h3>
                            <p className="text-gray-500">Add email addresses above to send login invitations</p>
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-blue-900 mb-3">How it works with useSendEmail hook:</h4>
                    <ul className="space-y-2 text-blue-800">
                        <li className="flex items-start gap-2">
                            <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center mt-0.5 flex-shrink-0">1</span>
                            <span>Add email addresses to your recipient list</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center mt-0.5 flex-shrink-0">2</span>
                            <span>Click "Preview Email" to see the invitation message content</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center mt-0.5 flex-shrink-0">3</span>
                            <span>Click "Send Invitations" to send emails using the useSendEmail hook</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center mt-0.5 flex-shrink-0">4</span>
                            <span>The hook handles loading states, errors, and success automatically</span>
                        </li>
                    </ul>
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-amber-800 text-sm">
                            <strong>Note:</strong> Using the useSendEmail hook provides clean state management and error handling for email operations.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page