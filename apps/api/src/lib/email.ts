const RESEND_BASE = 'https://api.resend.com/emails';

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set, skipping email');
    return false;
  }

  try {
    const response = await fetch(RESEND_BASE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'RentRayda <noreply@rentrayda.ph>',
        to,
        subject,
        html,
      }),
    });
    return response.ok;
  } catch {
    console.error('Email send failed');
    return false;
  }
}
