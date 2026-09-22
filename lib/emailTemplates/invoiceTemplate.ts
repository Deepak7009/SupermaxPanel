import { EMAIL } from './emailTheme';
import { InvoiceTrigger, InvoiceContext } from '@/redux/types/mailer';

const formatDate = (d: Date | string) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const rupee = (n: number) => `&#8377; ${n.toFixed(2)}`;

const subjectBannerMap: Record<InvoiceTrigger, { title: string; color: string }> = {
  order_placed:  { title: 'Order Confirmation',   color: EMAIL.green  },
  status_update: { title: 'Order Status Updated', color: EMAIL.blue   },
  payment_added: { title: 'Payment Received',      color: EMAIL.purple },
};

const buildInvoiceSubject = (trigger: InvoiceTrigger, orderId: string): string => {
  const shortId = String(orderId).slice(-8).toUpperCase();
  const map: Record<InvoiceTrigger, string> = {
    order_placed:  `Order Confirmed #${shortId} — Invoice`,
    status_update: `Order #${shortId} Status Updated`,
    payment_added: `Payment Received — Order #${shortId}`,
  };
  return map[trigger];
};

const buildInvoiceHtml = (ctx: InvoiceContext): string => {
  const { order, trigger, changeNote } = ctx;

  const paidAmount    = order.paidAmount    ?? 0;
  const advanceAmount = order.advanceAmount ?? 0;
  const dueAmount     = Math.max(0, order.totalAmount - paidAmount);
  const banner        = subjectBannerMap[trigger];

  const itemRows = order.items.map((item) => `
    <tr style="border-bottom:1px solid ${EMAIL.border};">
      <td style="padding:8px 4px;">${item.name}</td>
      <td style="padding:8px 4px;text-align:center;">${item.quantity}</td>
      <td style="padding:8px 4px;text-align:right;">${rupee(item.price)}</td>
      <td style="padding:8px 4px;text-align:right;font-weight:600;">${rupee(item.price * item.quantity)}</td>
    </tr>`).join('');

  const paymentRows = order.payments?.length
    ? order.payments.map((p) => `
        <tr style="border-bottom:1px solid ${EMAIL.surfaceBg};">
          <td style="padding:6px 4px;text-transform:capitalize;">${p.type} — ${p.method}</td>
          <td style="padding:6px 4px;">${formatDate(p.date)}</td>
          <td style="padding:6px 4px;text-align:right;color:${EMAIL.green};font-weight:600;">${rupee(p.amount)}</td>
        </tr>`).join('')
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Invoice #${order._id}</title>
</head>
<body style="margin:0;padding:0;background:${EMAIL.pageBg};font-family:'Segoe UI',Arial,sans-serif;font-size:14px;color:${EMAIL.bodyText};">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${EMAIL.pageBg};padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:${EMAIL.cardBg};border-radius:${EMAIL.cardRadius};overflow:hidden;box-shadow:${EMAIL.cardShadow};">

      <!-- Header Banner -->
      <tr><td style="background:${banner.color};padding:24px 32px;">
        <h1 style="margin:0;color:${EMAIL.brandText};font-size:22px;font-weight:700;">${banner.title}</h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">
          Order #${String(order._id).slice(-8).toUpperCase()} &nbsp;|&nbsp; ${formatDate(order.createdAt)}
        </p>
      </td></tr>

      <!-- Body -->
      <tr><td style="padding:28px 32px;">

        ${changeNote ? `<div style="background:#f0f9ff;border-left:4px solid ${banner.color};padding:12px 16px;border-radius:6px;margin-bottom:20px;font-size:13px;color:${EMAIL.bodyText};">${changeNote}</div>` : ''}

        <!-- Customer Info -->
        <h3 style="margin:0 0 10px;font-size:15px;color:${EMAIL.bodyText};">Customer Details</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:${EMAIL.mutedText};margin-bottom:24px;">
          <tr>
            <td style="padding:3px 0;width:50%;"><strong>Name:</strong> ${order.customerName}</td>
            <td style="padding:3px 0;"><strong>Email:</strong> ${order.customerEmail}</td>
          </tr>
          ${order.customerMobile  ? `<tr><td style="padding:3px 0;"><strong>Mobile:</strong> ${order.customerMobile}</td><td></td></tr>` : ''}
          ${order.customerAddress ? `<tr><td colspan="2" style="padding:3px 0;"><strong>Address:</strong> ${order.customerAddress}</td></tr>` : ''}
          ${order.note            ? `<tr><td colspan="2" style="padding:3px 0;"><strong>Note:</strong> ${order.note}</td></tr>` : ''}
        </table>

        <!-- Order Status -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr>
            <td><strong>Order Status:</strong></td>
            <td align="right">
              <span style="text-transform:capitalize;padding:4px 12px;border-radius:6px;font-size:12px;font-weight:600;background:#fef9c3;color:#854d0e;border:1px solid #fde68a;">
                ${order.status}
              </span>
            </td>
            <td width="20"></td>
            <td><strong>Payment:</strong></td>
            <td align="right">
              <span style="text-transform:capitalize;padding:4px 12px;border-radius:6px;font-size:12px;font-weight:600;background:#dcfce7;color:${EMAIL.green};border:1px solid #bbf7d0;">
                ${order.paymentStatus}
              </span>
            </td>
          </tr>
        </table>

        <!-- Items Table -->
        <h3 style="margin:0 0 10px;font-size:15px;color:${EMAIL.bodyText};">Order Items</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:13px;margin-bottom:24px;">
          <thead>
            <tr style="background:${EMAIL.surfaceBg};border-bottom:2px solid ${EMAIL.border};">
              <th style="padding:8px 4px;text-align:left;">Product</th>
              <th style="padding:8px 4px;text-align:center;">Qty</th>
              <th style="padding:8px 4px;text-align:right;">Unit Price</th>
              <th style="padding:8px 4px;text-align:right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <!-- Payment Summary -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:${EMAIL.surfaceBg};border-radius:8px;padding:16px;font-size:13px;margin-bottom:${paymentRows ? '24px' : '0'};">
          <tr><td colspan="2" style="padding-bottom:8px;font-size:14px;font-weight:700;color:${EMAIL.bodyText};">Payment Summary</td></tr>
          <tr>
            <td style="padding:4px 0;color:${EMAIL.mutedText};">Order Total</td>
            <td style="text-align:right;font-weight:600;">${rupee(order.totalAmount)}</td>
          </tr>
          ${advanceAmount > 0 ? `<tr><td style="padding:4px 0;color:${EMAIL.mutedText};">Advance Paid</td><td style="text-align:right;color:${EMAIL.purple};font-weight:600;">${rupee(advanceAmount)}</td></tr>` : ''}
          <tr>
            <td style="padding:4px 0;color:${EMAIL.mutedText};">Total Paid</td>
            <td style="text-align:right;color:${EMAIL.green};font-weight:600;">${rupee(paidAmount)}</td>
          </tr>
          <tr style="border-top:1px solid ${EMAIL.border};">
            <td style="padding:8px 0 0;font-weight:700;">Amount Due</td>
            <td style="text-align:right;padding-top:8px;font-weight:700;font-size:15px;color:${dueAmount > 0 ? EMAIL.red : EMAIL.green};">${rupee(dueAmount)}</td>
          </tr>
        </table>

        <!-- Payment History -->
        ${paymentRows ? `
          <h3 style="margin:0 0 10px;font-size:15px;color:${EMAIL.bodyText};">Payment History</h3>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:13px;">
            <thead><tr style="background:${EMAIL.surfaceBg};border-bottom:2px solid ${EMAIL.border};">
              <th style="padding:6px 4px;text-align:left;">Type</th>
              <th style="padding:6px 4px;text-align:left;">Date</th>
              <th style="padding:6px 4px;text-align:right;">Amount</th>
            </tr></thead>
            <tbody>${paymentRows}</tbody>
          </table>` : ''}

      </td></tr>

      <!-- Footer -->
      <tr><td style="background:${EMAIL.footerBg};padding:16px 32px;text-align:center;color:${EMAIL.footerText};font-size:12px;border-top:1px solid ${EMAIL.border};">
        This is a system-generated invoice from <strong>${EMAIL.appName}</strong>. Please keep it for your records.
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
};

export { buildInvoiceHtml, buildInvoiceSubject };
