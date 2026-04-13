# Facebook Policy — What We Can and Can't Do

**Verified against Meta Developer Platform Terms and Graph API documentation.**
**Last verified:** 2026-04-12

---

## THE HARD TRUTH

**Meta deprecated the Facebook Groups API on April 22, 2024.**

This killed:
- `publish_to_groups` permission (removed from all API versions)
- `groups_access_member_info` permission (removed)
- Any third-party tool's ability to post to Groups programmatically

No third-party tool can post to Facebook Groups via API anymore. Not Buffer. Not Hootsuite. Not SocialRails. Not us. Not anyone.

---

## WHAT WE CAN DO (ToS-compliant)

### 1. Auto-post to a Facebook Page we own

**Permission:** `pages_manage_posts` + `pages_read_engagement`
**Mechanism:** Generate long-lived Page Access Token, POST to `/{page-id}/feed`
**Status:** Fully supported, unchanged in 2024-2025 API updates

This is how we'll auto-promote every new verified listing to "RentRayda Philippines" Page.

### 2. Provide a share URL that opens Facebook's native share dialog

**Mechanism:** Create a URL of the form `https://www.facebook.com/sharer/sharer.php?u=https://rentrayda.com/listings/[id]`
**User flow:** User taps "Share to Facebook" → Facebook's native share dialog opens pre-filled → user manually picks which Group(s) to post to
**Status:** Fully supported, no API review needed

This is how landlords and tenants will share listings to Groups they're members of. The posting is human-driven, so it's ToS-compliant.

### 3. Read our own Page's posts + engagement

**Permission:** `pages_read_engagement`
**Use case:** Analytics on how our auto-posted listings perform

---

## WHAT WE CANNOT DO

### 1. Post to Facebook Groups automatically (even Groups we admin)

Groups API is dead. Full stop.

### 2. Scrape Facebook for listings

Violates Meta Platform Terms. Meta has successfully sued scrapers. Anti-bot detection escalates within hours.

This includes:
- Puppeteer or Playwright logged into a Facebook account
- Server-side scraping with cookies
- Mobile automation frameworks
- Anything that involves a "fake user" browsing Facebook

### 3. Ask users for Groups posting permissions

Those permissions no longer exist. Attempting to request them will fail.

### 4. Cross-post between Groups via any mechanism

Same as #1.

---

## OUR IMPLEMENTATION PLAN

### Phase A: Auto-post to our Page (Week 2, ~4 hours)

1. Create Facebook Page: "RentRayda Philippines"
2. Register Meta Developer App under our legal entity (OPC or sole prop initially)
3. Submit for `pages_manage_posts` app review with:
   - Clear use case description
   - Screenshots of the listing creation flow
   - Sample auto-post output
   - Estimated review time: 1-2 weeks
4. Once approved, generate long-lived Page Access Token
5. Store encrypted in env var `FACEBOOK_PAGE_ACCESS_TOKEN`
6. Implement `apps/api/src/lib/facebook/graph.ts`
7. Implement BullMQ job `apps/api/src/jobs/post-listing-to-fb.ts`
8. Trigger on `listing.published` event (after landlord verification + listing approval)

**Post format:**
```
🏠 New verified [bedspace/studio/apartment] in [barangay]!

₱[price]/month
✓ Verified landlord
✓ Scam protection included

View on RentRayda: https://rentrayda.com/listings/[id]

#RentPasig #BPOhousing #OrtigasRentals
```

### Phase B: One-tap share dialog (Week 2, ~2 hours)

1. Add "Share to Facebook" button on every listing detail screen
2. On tap, generate share URL: `https://www.facebook.com/sharer/sharer.php?u=[encoded-listing-url]`
3. Open in external browser (mobile) or new tab (web)
4. Facebook handles the rest — user picks destination manually

No API review needed. Works immediately.

---

## COMPLIANCE GUARDRAILS

- **Register app under legal entity** — RentRayda OPC formation required first
- **Rate limit our posts** — max 20 posts/day to our Page to avoid spam detection
- **Rotate tokens every 60 days** — long-lived tokens expire
- **Store tokens encrypted** — never in plain env vars
- **No scraping, no botnets, no headless browsers** — zero tolerance
- **User-initiated shares only for Groups** — we never touch Group API

---

## FALLBACK IF APP REVIEW REJECTS

App reviews can fail for vague reasons. If `pages_manage_posts` is rejected:

**Phase A is delayed, not killed.**

Part B (user-initiated share dialog) works WITHOUT app review because it's just a URL that opens Facebook's native UI. Product still functions.

Iterate on app review submission with clearer screenshots and use case. Typical resubmit turnaround: 1 week.

---

## WHAT TO DO WHEN CLAUDE SUGGESTS VIOLATIONS

If Claude proposes:
- Scraping Facebook Groups → STOP. Impossible.
- Scraping Facebook Marketplace → STOP. Impossible.
- Using `publish_to_groups` permission → STOP. Deprecated April 22, 2024.
- Using Puppeteer on Facebook → STOP. ToS violation, legal risk.
- Using a "Facebook bot" library → STOP. 99% of these are ToS-violating.

Paste this back at Claude:
```
Re-read .claude-brain/context/07-facebook-policy.md. The approach you just suggested is killed.
```
