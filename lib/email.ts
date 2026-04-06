import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM ?? "onboarding@resend.dev";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const sendAuthEmail = async ({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) => {
  if (!resend) {
    console.info("Auth email fallback", { to, subject, text });
    return;
  }

  await resend.emails.send({
    from: emailFrom,
    to,
    subject,
    text,
    html,
  });
};
