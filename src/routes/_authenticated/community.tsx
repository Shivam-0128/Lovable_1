import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/community")({
  head: () => ({
    meta: [
      { title: "Community — Habit Circle" },
      { name: "description", content: "Habits your group has chosen to share." },
      { property: "og:title", content: "Community — Habit Circle" },
      { property: "og:description", content: "Habits your group has chosen to share." },
    ],
  }),
  component: Community,
});

function Community() {
  const habits = useQuery({
    queryKey: ["community"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habits")
        .select("id, name, when_text, profiles(display_name), completions(day)")
        .eq("is_shared", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Community</h1>
      {habits.data?.length === 0 && <p className="text-muted-foreground">No shared habits yet.</p>}
      <ul className="space-y-4">
        {habits.data?.map((h) => (
          <li key={h.id} className="rounded-xl border bg-card p-5 shadow-soft">
            <div className="flex items-baseline justify-between gap-4">
              <Link to="/habit/$id" params={{ id: h.id }} className="font-display text-xl font-bold hover:text-primary hover:underline">{h.name}</Link>
              <span className="text-sm text-muted-foreground">{h.profiles?.display_name}</span>
            </div>
            {h.when_text && <p className="mt-2 text-muted-foreground">{h.when_text}</p>}
            <p className="mt-3 text-sm font-medium">Days done: {h.completions.length}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
