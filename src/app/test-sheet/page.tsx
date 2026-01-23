import Link from 'next/link';

/**
 * Test page for parallel route sheet pattern.
 * Navigate to /test-sheet to see it in action.
 * Delete this page after testing.
 */
export default function TestSheetPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 p-8">
      <div>
        <h1 className="font-bold text-2xl">Parallel Route Sheet Test</h1>
        <p className="mt-2 text-muted-foreground">
          Click the link below. It navigates to <code>/sheet/speaker/new</code>, but the
          intercepting route in <code>@sheet/(.)sheet/speaker/new</code> catches it and renders the
          sheet as an overlay on this page.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Test: Create Speaker (Parallel Route)</h2>
        <Link
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm hover:bg-primary/90"
          href="/sheet/speaker/new"
        >
          New Speaker (parallel route)
        </Link>
        <p className="text-muted-foreground text-sm">
          This uses a parallel route. The sheet opens instantly because there is no client-side data
          fetching. Browser back dismisses it.
        </p>
      </div>

      <div className="rounded-md border border-dashed p-4">
        <h3 className="font-medium text-sm">How it works:</h3>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-muted-foreground text-sm">
          <li>
            <code>@sheet/default.tsx</code> returns null (no sheet active)
          </li>
          <li>
            Click link navigates to <code>/sheet/speaker/new</code>
          </li>
          <li>
            <code>@sheet/(.)sheet/speaker/new/page.tsx</code> intercepts and renders the sheet
          </li>
          <li>Layout renders both children (this page) and sheet slot (the overlay)</li>
          <li>
            Close/back calls <code>router.back()</code> which restores the default slot (null)
          </li>
        </ol>
      </div>
    </div>
  );
}
