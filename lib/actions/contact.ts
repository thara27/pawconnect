"use server";

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { createClient } from "@/lib/supabase/server";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function submitContactForm(data: ContactFormData) {
  // Server-side validation — client-side checks are bypassable
  const name = (data.name ?? "").trim();
  const email = (data.email ?? "").trim();
  const subject = (data.subject ?? "").trim();
  const message = (data.message ?? "").trim();

  if (!name || !email || !subject || !message) {
    return { success: false, error: "All fields are required." };
  }
  if (name.length > 100) {
    return { success: false, error: "Name must be 100 characters or fewer." };
  }
  if (subject.length > 200) {
    return { success: false, error: "Subject must be 200 characters or fewer." };
  }
  if (message.length > 5000) {
    return { success: false, error: "Message must be 5000 characters or fewer." };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  const sanitised: ContactFormData = { name, email, subject, message };

  try {
    // Try saving to Supabase — non-blocking, form still succeeds if table missing
    try {
      const supabase = await createClient();
      const { error: saveError } = await supabase.from("contact_messages").insert({
        name: sanitised.name,
        email: sanitised.email,
        subject: sanitised.subject,
        message: sanitised.message,
        created_at: new Date().toISOString(),
      });

      if (saveError) {
        // Log the real error for debugging (check server logs / Amplify logs)
        console.error("Supabase save error:", saveError.message, saveError.code);
      }
    } catch (dbError) {
      console.error("DB connection error:", dbError);
    }

    // Send email notification (always attempt, independent of DB)
    const mailResult = await sendContactEmail(sanitised);

    if (!mailResult.success) {
      return {
        success: false,
        error:
          "We saved your message, but email delivery failed. Please check SES identity/permissions and try again.",
      };
    }

    return {
      success: true,
      message: "Thank you for reaching out. We will get back to you soon.",
    };
  } catch (error) {
    console.error("Contact form error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

async function sendContactEmail(data: ContactFormData) {
  const recipientEmail = process.env.CONTACT_FORM_EMAIL;
  const fromEmail = process.env.CONTACT_FORM_FROM_EMAIL || recipientEmail;
  // GHSA-j965-2qgj-vjmq: validate region against allowlist before passing to SDK
  const VALID_AWS_REGIONS = /^[a-z]{2}-[a-z]+-\d+$/;
  const rawRegion = process.env.AWS_SES_REGION ?? "us-east-1";
  const awsRegion = VALID_AWS_REGIONS.test(rawRegion) ? rawRegion : "us-east-1";
  const awsAccessKey = process.env.AWS_ACCESS_KEY_ID;
  const awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!recipientEmail) {
    console.warn("CONTACT_FORM_EMAIL not configured");
    return { success: false };
  }

  try {
    // In Amplify, IAM role credentials are injected automatically.
    // For local dev, explicit keys from .env.local can be used.
    const sesConfig: ConstructorParameters<typeof SESClient>[0] = { region: awsRegion };
    if (awsAccessKey && awsSecretKey) {
      sesConfig.credentials = {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey,
      };
    }

    const ses = new SESClient(sesConfig);

    const htmlBody = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
      <hr>
      <p><small>Submitted at: ${new Date().toISOString()}</small></p>
    `;

    const textBody = [
      "New Contact Form Submission",
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Subject: ${data.subject}`,
      "Message:",
      data.message,
      `Submitted at: ${new Date().toISOString()}`,
    ].join("\n");

    await ses.send(
      new SendEmailCommand({
        Source: fromEmail!,
        Destination: {
          ToAddresses: [recipientEmail],
        },
        Message: {
          Subject: {
            Data: `New Contact Form Submission: ${data.subject}`,
            Charset: "UTF-8",
          },
          Body: {
            Html: {
              Data: htmlBody,
              Charset: "UTF-8",
            },
            Text: {
              Data: textBody,
              Charset: "UTF-8",
            },
          },
        },
        ReplyToAddresses: [data.email],
      }),
    );

    console.log(`Contact form email sent to ${recipientEmail} from ${fromEmail}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending contact email via AWS SES:", error);
    return { success: false };
  }
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
