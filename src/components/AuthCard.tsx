import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function AuthCard({ title, children, footer }: { title: string; children: ReactNode; footer: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-soft">
        <Link to="/" className="text-sm font-medium uppercase tracking-widest text-primary">Habit Circle</Link>
        <h1 className="mt-3 text-3xl font-bold">{title}</h1>
        <div className="mt-6">{children}</div>
        <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
      </div>
    </main>
  );
}
