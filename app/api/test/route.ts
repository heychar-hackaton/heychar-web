import { sendEmail } from '@/lib/mail';

export async function GET() {
  const result = await sendEmail('soman@inbox.ru', 'Test', 'Test');

  if (!result.success) {
    return new Response(result.error, { status: 500 });
  }

  return new Response('Email sent successfully');
}
