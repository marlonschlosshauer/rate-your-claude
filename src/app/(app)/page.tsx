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
          <p className="mt-3 text-sand-500 max-w-lg mx-auto">
            We all know Claude can be a bit <em>erratic</em>. Yesterday he
            one-shotted a huge migration, today he struggles to move some simple
            DOM-elements around.
          </p>
          <p className="mt-5">So, how was Claude for you today?</p>
        </header>
        <ReviewForm />
        <ReviewsChart />
      </div>
    </main>
  );
}
