import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Habit Circle — track habits with your people" },
      { name: "description", content: "Track daily habits, keep some private, share others and talk them through with friends." },
      { property: "og:title", content: "Habit Circle — track habits with your people" },
      { property: "og:description", content: "Track daily habits, keep some private, share others and talk them through with friends." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">Habit Circle</p>
        <h1 className="mt-4 text-5xl font-bold leading-tight">Small daily habits, kept together.</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Tick off your days, keep some habits private, and share others with your group to swap advice.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild size="lg"><Link to="/signup">Sign up</Link></Button>
          <Button asChild size="lg" variant="outline"><Link to="/signin">Sign in</Link></Button>
        </div>
      </div>
    </main>
  );
}
