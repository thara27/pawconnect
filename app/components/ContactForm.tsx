"use client";

import { useState, FormEvent } from "react";
import { submitContactForm } from "@/lib/actions/contact";

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Client-side validation
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      setIsLoading(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      setIsLoading(false);
      return;
    }

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message ?? "Thank you for reaching out. We will get back to you soon.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setMessage({ type: "error", text: result.error || "Something went wrong" });
      }
    } catch (_error) {
      setMessage({ type: "error", text: "Failed to send message. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-fraunces font-bold text-4xl sm:text-5xl text-ink mb-4">
          Get in Touch
        </h1>
        <p className="text-lg text-muted font-sans">
          Have a question or feedback? We&apos;d love to hear from you. Fill out the
          form below and we&apos;ll get back to you as soon as possible.
        </p>
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-sans font-medium text-ink mb-2"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Smith"
              className="w-full px-4 py-3 border border-border rounded-lg font-sans text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-sans font-medium text-ink mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              className="w-full px-4 py-3 border border-border rounded-lg font-sans text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />
          </div>

          {/* Subject */}
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-sans font-medium text-ink mb-2"
            >
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="How can we help?"
              className="w-full px-4 py-3 border border-border rounded-lg font-sans text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-sans font-medium text-ink mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us more about your inquiry..."
              rows={5}
              className="w-full px-4 py-3 border border-border rounded-lg font-sans text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
            />
          </div>

          {/* Status Message */}
          {message && (
            <div
              className={`p-4 rounded-lg font-sans ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-sans font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            {isLoading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {/* Additional Info */}
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-center text-muted font-sans text-sm">
            We typically respond within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
