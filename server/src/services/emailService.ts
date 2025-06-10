// server/src/services/emailService.ts

export const sendWelcomeEmail = async (to: string, name: string) => {
  console.log(`📨 [MOCK] Welcome email would be sent to ${name} at ${to}`);
};

export const sendPasswordReset = async (to: string, token: string) => {
  console.log(`📨 [MOCK] Password reset email would be sent to ${to} with token: ${token}`);
};
export const sendDonationEmail = async (...args: any[]) => {
  console.log(`📨 [MOCK] sendDonationEmail called with args:`, args);
};
export const sendCertificateEmailWithBuffer = async (
  to: string,
  name: string,
  buffer: Buffer
) => {
  console.log(`📨 [MOCK] Would send certificate to ${name} at ${to}`);
  console.log(`Certificate buffer size: ${buffer.length} bytes`);
};
