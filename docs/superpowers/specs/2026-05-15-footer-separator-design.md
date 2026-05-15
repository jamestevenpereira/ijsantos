# Footer / CTABand Separator — Design Spec

**Date:** 2026-05-15  
**Status:** Approved

## Problem

`Footer.tsx` carries `mt-24` (96 px) to space itself from page content. On every page that ends with `<CTABand>` — most pages — this produces a 96 px strip of white page background wedged between two `bg-primary` (dark charcoal) sections. The gap reads as a layout error, not a design decision.

## Decision

**Approach A — Hairline divider.**

Remove `mt-24` from the `<footer>` element. Replace with `border-t border-primary-foreground/10` on the same element. A 1 px semi-transparent line between two dark surfaces provides a clear section boundary without any white gap.

```
┌──────────────────────────────────────┐
│  bg-primary  ·  CTABand             │
├──────────────────────────────────────┤  ← border-t border-primary-foreground/10
│  bg-primary  ·  Footer               │
└──────────────────────────────────────┘
```

## Scope

- **File:** `src/components/layout/Footer.tsx` — one class change on the `<footer>` element
- **Before:** `className="bg-primary text-primary-foreground mt-24"`
- **After:** `className="bg-primary text-primary-foreground border-t border-primary-foreground/10"`

Pages without a CTABand (e.g. `/contacto`) benefit too — the last section's own `py-20` provides adequate visual breathing room, and the footer flows in cleanly.

## Non-Goals

- No changes to CTABand, layout, or any other component
- No dark-mode special-casing (token `primary-foreground/10` resolves correctly in both modes)
