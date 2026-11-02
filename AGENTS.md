<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Data access goes straight from the browser through the generated client, relying on RLS (habits visible to owner or when shared; completions writable only by habit owner). Why: simple app, policies are the security boundary.
- Habit date/progress math lives in src/lib/habits.ts with tests in src/test/habits.test.ts. Why: keeps rules testable.
