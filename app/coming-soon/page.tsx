import ComingSoonCard from "@/app/components/ui/ComingSoonCard";

export default function ComingSoonPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAF7] px-4">
      <ComingSoonCard
        title="Coming Soon"
        message="This feature is on its way. We're building the best experience for dog parents in India 🐾"
        backHref="/"
        backLabel="Back to home"
      />
    </main>
  );
}
