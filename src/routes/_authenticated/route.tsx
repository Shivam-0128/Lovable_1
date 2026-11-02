import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/signin" });
    return { user: data.user };
  },
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/signin", replace: true });
  }

  const linkCls = "text-sm font-medium text-muted-foreground hover:text-foreground [&.active]:text-primary";

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 shrink-0 flex-col gap-2 bg-sidebar p-5 text-sidebar-foreground md:flex">
        <p className="mb-4 font-display text-xl font-bold">Habit Circle</p>
        <Button asChild variant="sidebar"><Link to="/habits">My habits</Link></Button>
        <Button asChild variant="sidebar"><Link to="/community">Community</Link></Button>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-card px-6 py-3">
          <nav className="flex gap-5">
            <Link to="/habits" className={linkCls}>My habits</Link>
            <Link to="/community" className={linkCls}>Community</Link>
          </nav>
          <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
