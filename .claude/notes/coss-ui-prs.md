# Coss UI — Potential Open Source PRs

Issues observed while using Coss UI components in this project that may be worth upstreaming.

---

## Toast — Minor styling differences from reference screenshots

**File:** `components/ui/toast.tsx` (the `Toasts` inner component)

**Observations vs. the Coss UI docs/preview screenshots:**

1. **Icon sizing** — current: `[&>svg]:h-lh [&>svg]:w-4` (16px wide, line-height tall). Reference screenshots show icons at a consistent ~20px. Consider `size-5` with `shrink-0`.

2. **Icon gap** — current: `gap-2` between icon and text column. Reference looks slightly wider (~`gap-3`).

3. **Title weight** — current: `font-medium`. Reference screenshots read as slightly bolder (`font-semibold`).

These are subtle and may be intentional defaults. Worth raising with the Coss UI maintainers before changing.
