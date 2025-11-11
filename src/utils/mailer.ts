import nodemailer from 'nodemailer';

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  EMAIL_FROM,
} = process.env;

const transport = SMTP_HOST
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT ? Number(SMTP_PORT) : 587,
      secure: Boolean(process.env.SMTP_SECURE === 'true'),
      auth:
        SMTP_USER && SMTP_PASS
          ? {
              user: SMTP_USER,
              pass: SMTP_PASS,
            }
          : undefined,
    })
  : null;

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  if (!transport) {
    console.warn('[mailer] SMTP configuration missing; skipping email send.', {
      to,
      subject,
    });
    return;
  }

  await transport.sendMail({
    from: EMAIL_FROM || SMTP_USER,
    to,
    subject,
    html,
    text,
  });
}
