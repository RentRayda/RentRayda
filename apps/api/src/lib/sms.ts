const PHILSMS_BASE = 'https://app.philsms.com/api/v3/sms/send';

export async function sendOTP(phone: string, code: string): Promise<boolean> {
  const response = await fetch(PHILSMS_BASE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PHILSMS_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      recipient: phone.startsWith('0') ? `63${phone.substring(1)}` : phone,
      sender_id: process.env.PHILSMS_SENDER_ID || 'PhilSMS',
      message: `Your OTP code is: ${code}. Valid for 10 minutes. Do not share this code.`,
    }),
  });
  if (!response.ok) {
    console.error('PhilSMS error:', await response.text());
    return false;
  }
  return true;
}

export async function sendSMS(phone: string, message: string): Promise<boolean> {
  const response = await fetch(PHILSMS_BASE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PHILSMS_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      recipient: phone.startsWith('0') ? `63${phone.substring(1)}` : phone,
      sender_id: process.env.PHILSMS_SENDER_ID || 'PhilSMS',
      message,
    }),
  });
  return response.ok;
}

export function normalizePhPhone(raw: string): string {
  const digits = raw.replace(/[\s\-\(\)\.]/g, '');
  if (digits.startsWith('+63')) return digits;
  if (digits.startsWith('63')) return `+${digits}`;
  if (digits.startsWith('09')) return `+63${digits.substring(1)}`;
  if (digits.startsWith('9')) return `+63${digits}`;
  throw new Error(`Invalid PH phone: ${raw}`);
}
