"use server";

import AWS from "aws-sdk";
import { createClient } from "@/lib/supabase/server";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function submitContactForm(data: ContactFormData) {
  try {
    // Try saving to Supabase — non-blocking, form still succeeds if table missing
    try {
      const supabase = await createClient();
      const { error: saveError } = await supabase.from("contact_messages").insert({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
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
    const mailResult = await sendContactEmail(data);

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
  const awsRegion = process.env.AWS_SES_REGION || "us-east-1";
  const awsAccessKey = process.env.AWS_ACCESS_KEY_ID;
  const awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!recipientEmail) {
    console.warn("CONTACT_FORM_EMAIL not configured");
    return { success: false };
  }

  try {
    // In Amplify, IAM role credentials are injected automatically.
    // For local dev, explicit keys from .env.local can be used.
    const sesConfig: AWS.SES.ClientConfiguration = { region: awsRegion };
    if (awsAccessKey && awsSecretKey) {
      sesConfig.credentials = {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey,
      };
    }

    const ses = new AWS.SES(sesConfig);

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

    await ses
      .sendEmail({
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
      })
      .promise();

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
