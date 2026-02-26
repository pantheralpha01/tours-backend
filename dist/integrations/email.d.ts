type SendEmailInput = {
    to: string;
    subject: string;
    text?: string;
    html?: string;
};
export declare const emailService: {
    sendEmail: ({ to, subject, text, html }: SendEmailInput) => Promise<{
        to: string;
        from: string;
        subject: string;
        text: string | undefined;
        html: string | undefined;
        status: string;
    }>;
};
export {};
//# sourceMappingURL=email.d.ts.map