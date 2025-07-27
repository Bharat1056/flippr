import { useMutation, useQueryClient } from '@tanstack/react-query'
import { emailService } from '@/lib/services/email.service'

export const EMAIL_KEYS = {
  all: ['email'] as const,
  invitations: () => [...EMAIL_KEYS.all, 'invitations'] as const,
}

// Types for email operations
export interface SendInvitationEmailData {
  emails: string[]
  adminId: string
}

export interface EmailResult {
  successful: number
  failed: number
  failedEmails: { email: string; error: string }[]
}

export interface SendEmailResponse {
  success: boolean
  message: string
  results?: EmailResult
}


export function useSendEmail() {
  return useMutation({
    mutationFn: (data: { emails: any[], adminId: string }) => emailService.sendEmail(data),
    onError: (error) => {
      console.error('Failed to send email:', error)
    },
  })
}