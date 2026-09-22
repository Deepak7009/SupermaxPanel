import { EMAIL } from './emailTheme';
import { ForgotPasswordContext } from '@/redux/types/mailer';

const forgotPasswordSubject = (): string =>
  `Reset your password — ${EMAIL.appName}`;

const buildForgotPasswordHtml = ({ toName, link }: ForgotPasswordContext): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Reset your password</title>
</head>
<body style="margin:0;padding:0;background:${EMAIL.pageBg};font-family:'Segoe UI',Arial,sans-serif;font-size:14px;color:${EMAIL.bodyText};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${EMAIL.pageBg};padding:40px 0;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:${EMAIL.cardBg};border-radius:${EMAIL.cardRadius};overflow:hidden;box-shadow:${EMAIL.cardShadow};">

        <!-- Brand header -->
        <tr>
          <td style="background:linear-gradient(135deg,${EMAIL.brandBg1},${EMAIL.brandBg2});padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:${EMAIL.brandText};font-size:22px;font-weight:700;letter-spacing:-.5px;">${EMAIL.appName}</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 12px;font-size:15px;color:${EMAIL.bodyText};">Hi <strong>${toName}</strong>,</p>
            <p style="margin:0 0 24px;font-size:14px;color:${EMAIL.mutedText};line-height:1.6;">
              We received a request to reset your password. Click the button below to choose a new one.
            </p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${link}"
                 style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,${EMAIL.btnBg1},${EMAIL.btnBg2});color:${EMAIL.btnText};font-size:14px;font-weight:600;border-radius:8px;text-decoration:none;">
                Reset My Password
              </a>
            </div>
            <p style="margin:24px 0 0;font-size:12px;color:${EMAIL.mutedText};line-height:1.6;">
              This link expires in <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this email.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:${EMAIL.footerBg};padding:20px 40px;border-top:1px solid ${EMAIL.border};text-align:center;">
            <p style="margin:0;font-size:11px;color:${EMAIL.footerText};">© ${EMAIL.appName}. All rights reserved.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

export { forgotPasswordSubject, buildForgotPasswordHtml };
