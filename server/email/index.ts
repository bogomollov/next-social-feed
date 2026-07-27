import { Resend } from "resend";
import { env } from "@/shared/lib/env";

const emailFrom = env.EMAIL_FROM ?? "onboarding@resend.dev";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

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
    if (env.NODE_ENV === "development") {
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
