"use server";

import { createClient } from "@/lib/supabase/server";
import nodemailer from "nodemailer";

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
    await sendContactEmail(data);

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
    return;
  }

  // Check if AWS credentials are available
  if (!awsAccessKey || !awsSecretKey) {
    console.warn(
      "AWS credentials not configured. Email will not be sent. Configure AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY."
    );
    return;
  }

  try {
    // Create Nodemailer transporter with AWS SES
    const transporter = nodemailer.createTransport({
      host: `email.${awsRegion}.amazonaws.com`,
      port: 587,
      secure: false,
      auth: {
        user: awsAccessKey,
        pass: awsSecretKey,
      },
    });

    // Send email
    await transporter.sendMail({
      from: fromEmail,
      to: recipientEmail,
      subject: `New Contact Form Submission: ${data.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
        <hr>
        <p><small>Submitted at: ${new Date().toISOString()}</small></p>
      `,
      replyTo: data.email,
    });

    console.log(`Contact form email sent to ${recipientEmail} from ${fromEmail}`);
  } catch (error) {
    console.error("Error sending contact email via AWS SES:", error);
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
