/**
 * Branded HTML email template for magic link sign-in.
 * Uses RentRayda Blue (#2D79BF) for the CTA button.
 */
export function magicLinkTemplate(url: string): string {
  return `
    <div style="font-family: Inter, -apple-system, 'Segoe UI', Roboto, sans-serif; max-width: 420px; margin: 0 auto; background: #FAFAFA; padding: 0;">
      <div style="background: #1A1A2E; padding: 24px; text-align: center;">
        <span style="color: white; font-size: 20px; font-weight: 700; letter-spacing: 2px;">RENTRAYDA</span>
      </div>
      <div style="padding: 32px 24px; text-align: center; background: #FFFFFF;">
        <p style="color: #1A1A2E; font-size: 16px; margin-bottom: 8px; font-weight: 500;">
          Sign in to RentRayda
        </p>
        <p style="color: #6B7280; font-size: 14px; margin-bottom: 28px;">
          Tap the button below to sign in. This link expires in 10 minutes.
        </p>
        <a href="${url}" style="display: inline-block; background: #2D79BF; color: white; font-size: 14px; font-weight: 600; padding: 12px 32px; border-radius: 8px; text-decoration: none;">
          Sign In
        </a>
        <p style="color: #9CA3AF; font-size: 12px; margin-top: 28px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
      <div style="border-top: 1px solid #E5E7EB; padding: 16px 24px; text-align: center;">
        <span style="color: #9CA3AF; font-size: 11px;">RentRayda &mdash; Trusted Rental Connections</span>
      </div>
    </div>
  `;
}
