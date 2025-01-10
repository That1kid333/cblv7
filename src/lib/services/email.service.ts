export async function sendEmail({ to, subject, body }: { to: string; subject: string; body: string }) {
  // Simulate sending email
  console.log(`Sending email to: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  // In a real application, integrate with an email service provider here
}
