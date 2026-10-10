import { Resend } from "resend";

type QuestionMail = {
  name: string;
  email: string;
  question: string;
  quote?: string;
  source?: string;
};

export async function sendQuestion(input: QuestionMail) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL || "tutuimmanuel10@gmail.com";
  const from = process.env.RESEND_FROM || "Portfolio <onboarding@resend.dev>";

  if (!apiKey) {
    console.info("Question form (mail is not configured)", input);
    return { delivered: false as const };
  }

  const resend = new Resend(apiKey);
  const subject = input.source
    ? `Portfolio question from ${input.name} about ${input.source}`
    : `Portfolio question from ${input.name}`;
  const text = [
    `From: ${input.name} <${input.email}>`,
    input.source ? `Source: ${input.source}` : "",
    input.quote ? `Quote: ${input.quote}` : "",
    "",
    input.question,
  ]
    .filter((line) => line !== "")
    .join("\n");

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: input.email,
    subject,
    text,
  });

  if (error) {
    console.error("Resend error", error);
    throw new Error(error.message);
  }
  return { delivered: true as const };
}
