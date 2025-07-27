import { apiClient } from "./axios-config";

export class EmailService {
    private readonly endpoint = '/api/v1/email';

    async sendEmail(data: { emails: any[], adminId: string }): Promise<void> {
        return apiClient.post(`${this.endpoint}/send`, data)
    }
}

export const emailService = new EmailService();