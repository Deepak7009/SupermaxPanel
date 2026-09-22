import { BrevoClient } from '@getbrevo/brevo';
import puppeteer from 'puppeteer';
import { IOrder } from '@/app/admin/models/Order';
import { InvoiceTrigger, SendEmailOptions } from '@/redux/types/mailer';
import { buildInvoiceHtml, buildInvoiceSubject } from './emailTemplates/invoiceTemplate';
import { buildSetPasswordHtml, setPasswordSubject } from './emailTemplates/setPasswordTemplate';
import { buildForgotPasswordHtml, forgotPasswordSubject } from './emailTemplates/forgotPasswordTemplate';

const senderEmail = process.env.BREVO_SENDER_EMAIL ?? 'no-reply@supermaxpanel.com';
const senderName  = process.env.BREVO_SENDER_NAME  ?? 'SuperMax Panel';

// ── Helpers ───────────────────────────────────────────────────────────────────

const getBrevoClient = (): BrevoClient | null => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey || apiKey === 'your_brevo_api_key_here') {
    console.warn('[mailer] BREVO_API_KEY not configured — skipping email');
    return null;
  }
  return new BrevoClient({ apiKey });
};

const generateInvoicePdf = async (html: string): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
};

// ── Core ──────────────────────────────────────────────────────────────────────

const sendEmail = async ({ to, subject, html, attachment }: SendEmailOptions): Promise<void> => {
  const client = getBrevoClient();
  if (!client) return;

  try {
    await client.transactionalEmails.sendTransacEmail({
      subject,
      htmlContent: html,
      sender: { name: senderName, email: senderEmail },
      to: [to],
      ...(attachment && { attachment: [attachment] }),
    });
    console.log(`[mailer] "${subject}" sent to ${to.email}`);
  } catch (err) {
    // Never throw — email failure must not break the main flow
    console.error('[mailer] Failed to send email:', err);
  }
};

// ── Public API ────────────────────────────────────────────────────────────────

const sendSetPasswordEmail = async (
  toEmail: string,
  toName: string,
  token: string,
): Promise<void> => {
  const appUrl = process.env.NEXTAUTH_URL ?? process.env.APP_URL ?? 'http://localhost:3000';
  const link   = `${appUrl}/admin/set-password?token=${token}`;

  await sendEmail({
    to:      { email: toEmail, name: toName },
    subject: setPasswordSubject(),
    html:    buildSetPasswordHtml({ toName, link }),
  });
};

const sendForgotPasswordEmail = async (
  toEmail: string,
  toName: string,
  token: string,
): Promise<void> => {
  const appUrl = process.env.NEXTAUTH_URL ?? process.env.APP_URL ?? 'http://localhost:3000';
  const link   = `${appUrl}/admin/set-password?token=${token}`;

  await sendEmail({
    to:      { email: toEmail, name: toName },
    subject: forgotPasswordSubject(),
    html:    buildForgotPasswordHtml({ toName, link }),
  });
};

const sendInvoiceEmail = async (
  trigger: InvoiceTrigger,
  order: IOrder & { _id: string },
  changeNote?: string,
): Promise<void> => {
  if (!order.customerEmail) {
    console.warn('[mailer] skipping invoice — no customer email on order', order._id);
    return;
  }

  const html    = buildInvoiceHtml({ trigger, order, changeNote });
  const subject = buildInvoiceSubject(trigger, String(order._id));
  const shortId = String(order._id).slice(-8).toUpperCase();

  let attachment: { name: string; content: string } | undefined;
  try {
    const pdfBuffer = await generateInvoicePdf(html);
    attachment = { name: `Invoice-${shortId}.pdf`, content: pdfBuffer.toString('base64') };
    console.log(`[mailer] PDF generated for order ${shortId}`);
  } catch (pdfErr) {
    // PDF generation failure is non-fatal — email still sends without attachment
    console.error('[mailer] PDF generation failed, sending without attachment:', pdfErr);
  }

  await sendEmail({
    to:      { email: order.customerEmail, name: order.customerName },
    subject,
    html,
    attachment,
  });
};

export { sendSetPasswordEmail, sendForgotPasswordEmail, sendInvoiceEmail };
