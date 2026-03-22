import { ContactForm } from "@/app/components/ContactForm";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFF8E7] to-white">
      <ContactForm />

      {/* Footer */}
      <footer className="mt-16 bg-gradient-to-r from-ink to-purple-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-sm">
            © 2024 PawConnect. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
