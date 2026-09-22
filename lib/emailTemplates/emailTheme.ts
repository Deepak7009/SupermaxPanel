/**
 * Email design tokens — sourced from globals.css :root values.
 * Email clients don't support CSS custom properties, so we keep
 * the actual resolved values here in one place instead of
 * scattering hardcoded hex strings across every template.
 */

const EMAIL = {
  // Page chrome
  pageBg:       '#f3f4f6',   // --background (light)

  // Card
  cardBg:       '#ffffff',
  cardRadius:   '12px',
  cardShadow:   '0 2px 8px rgba(0,0,0,0.08)',

  // Brand header
  brandBg1:     '#0a3d55',   // --auth-bg
  brandBg2:     '#0d2a3e',
  brandText:    '#ffffff',

  // Body text
  bodyText:     '#1f2328',   // --foreground (light)
  mutedText:    '#57606a',   // --muted-foreground approx

  // Border / divider
  border:       '#e5e7eb',   // --border (light)
  surfaceBg:    '#f7f8fa',   // --muted (light)

  // CTA button
  btnBg1:       '#0e7490',   // --auth-btn-bg
  btnBg2:       '#0a3d55',
  btnText:      '#ffffff',

  // Status accent colours (from globals.css order/payment vars)
  green:        '#16a34a',   // --amount-paid / --status-delivered-text
  red:          '#dc2626',   // --btn-danger-text
  purple:       '#7c3aed',   // --amount-advance
  blue:         '#2563eb',   // --btn-primary-bg
  orange:       '#ea580c',   // --amount-due

  // Footer
  footerBg:     '#f7f8fa',
  footerText:   '#57606a',

  // App name
  appName:      'SuperMax Panel',
} as const;

export { EMAIL };
