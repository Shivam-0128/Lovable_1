import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { currentStreak, daysDone, lastSevenDays } from "@/lib/habits";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/habit/$id")({
  head: () => ({
    meta: [
      { title: "Habit — Habit Circle" },
      { name: "description", content: "Track progress and discuss this habit." },
      { property: "og:title", content: "Habit — Habit Circle" },
      { property: "og:description", content: "Track progress and discuss this habit." },
    ],
  }),
  component: HabitPage,
});

function HabitPage() {
  const { id } = Route.useParams();
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const [comment, setComment] = useState("");

  const habit = useQuery({
    queryKey: ["habit", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habits")
        .select("id, name, when_text, user_id, is_shared, profiles(display_name), completions(day)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const comments = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("id, body, created_at, profiles(display_name)")
        .eq("habit_id", id)
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const toggle = useMutation({
    mutationFn: async ({ day, done }: { day: string; done: boolean }) => {
      const { error } = done
        ? await supabase.from("completions").insert({ habit_id: id, day })
        : await supabase.from("completions").delete().eq("habit_id", id).eq("day", day);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habit", id] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const post = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("comments").insert({ habit_id: id, body: comment.trim(), user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      setComment("");
      qc.invalidateQueries({ queryKey: ["comments", id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (habit.isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (!habit.data) return <p className="text-muted-foreground">This habit isn't available.</p>;

  const h = habit.data;
  const isOwner = h.user_id === user.id;
  const doneDays = h.completions.map((c) => c.day);
  const doneSet = new Set(doneDays);

  function onPost(e: FormEvent) {
    e.preventDefault();
    const body = comment.trim();
    if (!body) return toast.error("Write a comment first");
    if (body.length > 2000) return toast.error("Comment is too long");
    post.mutate();
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold">{h.name}</h1>
        {!isOwner && <p className="mt-1 text-sm text-muted-foreground">by {h.profiles?.display_name}</p>}
        <p className="mt-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">When I do it</p>
        <p className="mt-1 whitespace-pre-wrap">{h.when_text || "—"}</p>
      </div>

      <div className="flex gap-8 rounded-xl border bg-card p-5 shadow-soft">
        <p className="text-lg">Days done: <strong>{daysDone(doneDays)}</strong></p>
        <p className="text-lg">Current streak: <strong>{currentStreak(doneDays)}</strong></p>
      </div>

      <section>
        <h2 className="text-2xl font-bold">Last 7 days</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {lastSevenDays().map((day) => (
            <li key={day} className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3">
              <Checkbox
                id={`d-${day}`}
                checked={doneSet.has(day)}
                disabled={!isOwner || toggle.isPending}
                onCheckedChange={(v) => toggle.mutate({ day, done: v === true })}
              />
              <Label htmlFor={`d-${day}`} className="font-mono">{day}</Label>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Comments</h2>
        <ul className="mt-4 space-y-3">
          {comments.data?.length === 0 && <li className="text-muted-foreground">No comments yet.</li>}
          {comments.data?.map((c) => (
            <li key={c.id} className="rounded-lg border bg-card p-4">
              <p className="text-sm font-semibold text-primary">{c.profiles?.display_name}</p>
              <p className="mt-1 whitespace-pre-wrap">{c.body}</p>
            </li>
          ))}
        </ul>
        <form onSubmit={onPost} className="mt-6 space-y-3">
          <Label htmlFor="comment">Comment</Label>
          <Textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} maxLength={2000} />
          <Button type="submit" disabled={post.isPending}>Post comment</Button>
        </form>
      </section>
    </div>
  );
}
