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
    if (process.env.NODE_ENV === "development") {
      console.warn("Auth email delivery skipped because RESEND_API_KEY is not configured.", {
        subject,
      });
      return;
    }

    throw new Error("RESEND_API_KEY is not configured");
  }

  await resend.emails.send({
    from: emailFrom,
    to,
    subject,
    text,
    html,
  });
};
