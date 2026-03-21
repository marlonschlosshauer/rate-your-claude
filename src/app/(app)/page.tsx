import { ReviewForm } from "@/components/review-form";
import { ReviewsChart } from "@/components/reviews-chart";

export default function AppPage() {
  return (
    <main className="flex-1 flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Rate your Claude
          </h1>
          <p className="mt-3 text-neutral-400 max-w-lg mx-auto">
            We all know Claude can be a bit temperamental. Yesterday he
            one-shotted a huge migration, today he struggles to move some simple
            DOM-elements around. Share your signal.
          </p>
        </header>

        <ReviewForm />
        <ReviewsChart />

        <footer className="text-center text-xs text-neutral-500 dark:text-neutral-600 pt-4 border-t border-neutral-800">
          This site is not affiliated with, endorsed by, or associated with
          Anthropic, PBC. &ldquo;Claude&rdquo; is a trademark of Anthropic.
        </footer>
      </div>
    </main>
  );
}
