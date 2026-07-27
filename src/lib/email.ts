// Email provider interface
export interface EmailProvider {
  sendEmail(to: string, subject: string, html: string): Promise<void>;
}

// Console email provider for development
class ConsoleEmailProvider implements EmailProvider {
  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    console.log('--------------------------------------------------');
    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body (HTML):`);
    console.log(html);
    console.log('--------------------------------------------------');
  }
}

// In the future, you can implement a ResendEmailProvider or similar here

const emailProvider: EmailProvider = new ConsoleEmailProvider();

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  
  const subject = 'Verify your email address - OUSL Law Student Portal';
  const html = `
    <p>Please verify your email address by clicking the link below:</p>
    <p><a href="${verificationLink}">${verificationLink}</a></p>
  `;

  await emailProvider.sendEmail(email, subject, html);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  
  const subject = 'Reset your password - OUSL Law Student Portal';
  const html = `
    <p>You requested a password reset. Please click the link below to reset your password:</p>
    <p><a href="${resetLink}">${resetLink}</a></p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  await emailProvider.sendEmail(email, subject, html);
};
