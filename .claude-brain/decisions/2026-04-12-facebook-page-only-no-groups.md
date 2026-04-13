# Decision: Facebook auto-post to our Page only, never to Groups

**Date:** 2026-04-12
**Status:** Active

---

## Context

User asked whether we could automatically post new listings to Facebook — either to our own account/Page or directly to Groups where landlords and tenants hang out (BPO housing groups, Pasig rentals, etc.).

Verified against Meta's current Graph API documentation and Platform Terms (web search, April 12, 2026):

**Meta officially deprecated the Facebook Groups API on April 22, 2024.**

- All permissions removed: `publish_to_groups`, `groups_access_member_info`
- All third-party tools lost Group posting ability: Buffer, Hootsuite, SocialRails, Sprinklr, every scheduler
- Meta's stated reason: spam prevention and community protection
- No workaround exists. Scraping Facebook (Puppeteer, Playwright) violates Platform Terms and is grounds for permanent ban + legal action.

Page API is still fully supported with `pages_manage_posts` permission.

---

## Decision

**Two-part Facebook integration:**

### Part A: Auto-post to our own Page
- Create Facebook Page "RentRayda Philippines"
- Register Meta Developer App under legal entity
- Submit for `pages_manage_posts` permission (1-2 week app review)
- On every new verified listing, backend auto-posts to our Page:
  - Primary photo
  - Listing details (type, barangay, price, verified status)
  - Deep link back to app/web

### Part B: One-tap share to Groups (user-initiated)
- Every listing detail screen has a "Share to Facebook" button
- Tapping opens Facebook's native share dialog pre-filled with listing content
- User manually picks which Group(s) to post to
- We never touch Group API — user drives the actual posting

---

## Alternatives considered

**Direct Group posting via API:** Impossible. API deprecated April 22, 2024. No workaround.

**Scraping Facebook to post via headless browser:** ToS violation. Legal risk. Anti-bot detection escalates within hours. Zero tolerance from Meta.

**Only Part B (no Page):** Simpler, no app review needed, but we lose organic growth of our own Facebook presence and the free marketing effect of all listings flowing to one place.

**Only Part A (no user share):** Loses the biggest distribution channel — landlords and tenants sharing to groups they're already members of. Part B is the multiplier.

---

## Consequences

**Positive:**
- ToS-compliant — zero risk of Meta account termination
- Part A grows our organic Facebook presence
- Part B gives landlords free marketing (incentive for them to use us)
- Every listing potentially reaches multiple Groups via human-driven shares
- Scales without needing paid distribution

**Negative:**
- App review for `pages_manage_posts` can take 1-2 weeks and may reject first submission
- Part B requires landlord/tenant action — some won't share
- No programmatic multi-Group distribution (but that's non-negotiable)

---

## Revive trigger

**This decision should be reopened if:**
- Meta reinstates the Groups API (monitor Meta Developer Blog quarterly)
- We discover a compliant way to integrate with Facebook Groups via new official mechanism
- App review rejects `pages_manage_posts` twice — might need to rethink Part A entirely

---

## Review date

2026-07-12 (3 months — re-check Meta API changelog)

---

## References

- Related decisions: [[2026-04-10-kill-scraping]]
- Related context: `context/07-facebook-policy.md`
- Meta announcement: January 23, 2024 (Graph API v19.0 release notes)
- Verification: web search 2026-04-12, 8 sources confirming deprecation
