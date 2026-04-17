# Validation Alignment — 10 Questions with Canonical Citations

**Date:** 2026-04-17
**Purpose:** Ensure founder and Claude have identical understanding of the 14-day gate.

---

## 1. What is the BUILD threshold?

**Answer:** 30+ paid reservations in 14 days.

**Citation:** `FINAL_DECISION.md:633`
> "**30+** | **BUILD** — Phase 1 MVP cleanup → Phase 2 features → Phase 3 soft launch"

Also `FINAL_DECISION.md:30`:
> "30+ paid reservations in 14 days → we finish the MVP cleanup (~40 hours from REPO_STATUS.md §10), deploy, and manually deliver first 10 placements."

---

## 2. What is the KILL threshold?

**Answer:** Fewer than 15 paid reservations in 14 days.

**Citation:** `FINAL_DECISION.md:635`
> "**<15** | **KILL** — Refund all, publish post-mortem, archive repo"

Also `FINAL_DECISION.md:30`:
> "If fewer than 15 pay, we refund everyone, publish an honest post-mortem, and archive the repo."

**Middle ground:** `FINAL_DECISION.md:634`
> "**15-29** | **EXTEND** — 14 more days with iterated landing"

---

## 3. What is the placement CTA and its reservation amount?

**Answer:** "Reserve verified placement — ₱149" — reservation applied to ₱499 total.

**Citation:** `FINAL_DECISION.md:586-588`
> "**Placement CTA:** 'Find me a verified place in 48 hours — ₱499'"
> "Sub-copy: '3 verified matches in 48 hours or full refund. ₱149 to reserve, ₱350 on move-in.'"
> "Button: 'Reserve verified placement — ₱149'"

Also confirmed in `artifacts/landing-page-copy-and-discovery-script.md:74-76`:
> "**CTA button:** `Reserve your spot — ₱149 →`"
> "**Subtext under button:** `₱149 applied to your ₱499 total. Refunded in full if we can't deliver in 48 hours.`"

---

## 4. What happens to reservation money if we KILL?

**Answer:** Full refund of all reservations.

**Citation:** `FINAL_DECISION.md:604`
> "Refund 100% of reservations if we decide not to build. Cost: ~₱7 per refund in Paymongo fees."

Also `FINAL_DECISION.md:30`:
> "If fewer than 15 pay, we refund everyone, publish an honest post-mortem, and archive the repo."

---

## 5. What is the threshold for 30+ reservations?

**Interpretation note:** This question appears to ask the same thing as Q1. Answering literally — the threshold IS 30+ paid Verified Placement reservations (₱149 each via Paymongo).

**Citation:** `FINAL_DECISION.md:629-633`
> "Paid Verified Placement reservations in 14 days:"
> "**30+** | **BUILD**"

`FINAL_DECISION.md:596-598`:
> "**No free signups for paid tier. Paymongo payment required to reserve a spot.**"
> "Verified Placement reservation: ₱149 (applied to eventual ₱499 total on move-in)"

---

## 6. What are the expected unit economics per Verified Placement?

**Answer:** ₱397 gross margin per placement (~80%).

**Citation:** `FINAL_DECISION.md:539-546` (§6.5)
> "**Unit economics per placement (Verified Placement):**"
> "- Revenue: ₱499"
> "- Gemini API: ~₱50"
> "- PhilSMS: ~₱5"
> "- Infra amortized: ~₱30"
> "- Paymongo fees (3.5%): ~₱17"
> "- Housing buddy (Phase 2): ~₱0 (founder-led initially)"
> "- **Gross margin: ~₱397 per placement (~80%)**"

Target at Month 3: `FINAL_DECISION.md:548-550`
> "- 100 placements × ₱397 = ₱39,700/month"
> "- **Base case 50-100 placements: ₱19,850-₱39,700/month contribution margin**"

---

## 7. Which acquisition channels are prioritized in validation, in what order?

**Answer:** Organic only. Facebook Groups primary (amended 2026-04-17), TikTok secondary awareness, then personal network.

**Citation:** `FINAL_DECISION.md:617-625` (§7.4 Traffic plan)
> | Channel | Posts | Expected reach |
> | 5 BPO Facebook Groups (10-50K members) | 1 per group | 100-300K impressions |
> | 3 university groups (DLSU, UP, PUP) | 1 per group | 30-60K |
> | Personal Facebook timeline | 1 | 2-5K |
> | 10 DMs to BPO friends/family | Personal | 10 conversations |
> | TikTok | 3 videos | 5-50K views |
> | LinkedIn founder post | 1 | 2-5K |
> | **Total** | **~13 posts over 14 days** | **~145-430K** |

Priority order from `decisions/2026-04-12-tiktok-primary-awareness-channel.md` (referenced at `FINAL_DECISION.md:346`):
> "Zero paid ads — organic only (Facebook Groups primary, TikTok secondary per `decisions/2026-04-12-tiktok-primary-awareness-channel.md` amended 2026-04-17)"

**Resolved (2026-04-17):** The original contradiction (TikTok declared "primary" but FB Groups had 10-60x reach) was resolved by amending the decision file. FB Groups are now primary overall (conversion-first), TikTok is secondary awareness. This aligns with the traffic plan table and Dormy PH research showing TikTok's weak conversion despite high engagement.

---

## 8. What is the customer discovery call process?

**Answer:** Founder calls every reserver within 24 hours of reservation, 20-minute Messenger video call.

**Citation:** `FINAL_DECISION.md:641`
> "Within 24h of their reservation, call or Messenger-video-call. 20 min:"

`artifacts/landing-page-copy-and-discovery-script.md:168-172`:
> "**When:** Within 24 hours of each paid reservation (Verified Placement)"
> "**Who:** Founder only during validation phase"
> "**Where:** Messenger video call (target's native platform)"
> "**Goal:** Learn why they paid, what they expect, what they'd refund over, how they heard about us"

8 questions listed at `FINAL_DECISION.md:643-652`, expanded to 15 questions + 4 infrastructure signal questions in `artifacts/landing-page-copy-and-discovery-script.md:196-261`.

---

## 9. Name the 3 psychographic pain points driving conversion per context/09.

**Answer:** The fear hierarchy from `context/09-target-psychographics-primary.md:69-76`:

> 1. **"SCAMS.** Losing ₱5-10K to a fake listing. Catastrophic at her income level. Every housing transaction carries this anxiety."
> 2. **"PHYSICAL SAFETY.** 88% of women aged 18-24 experience harassment in Metro Manila (UN Women). Night-shift commute (2-5 AM departure) amplifies risk. Gendered safety is foundational, not a filter."
> 3. **"DISAPPOINTING FAMILY.** Losing the BPO job = losing the remittance = family impact. The job is the family economic strategy, not personal advancement."

(There are 5 total in the hierarchy; #4 is AI replacement anxiety, #5 is isolation/homesickness. The top 3 are the conversion drivers.)

---

## 10. What does context/06-validation-state.md currently track?

**Answer:** Pre-validation setup state. No live metrics yet.

**Citation:** `context/06-validation-state.md:4-5`:
> "**Phase:** Pre-validation setup — listening mode (per founder rule: no product decisions until 20 interviews)"

Currently tracks:
- **Research interview counts** (line 22-28): 6/10 landlord, 4/10 tenant = 10/20 combined
- **The gate thresholds** (line 36-41): 30+ BUILD, 15-29 EXTEND, <15 KILL
- **Empty traffic funnel tables** (line 47-69): impressions, clicks, completions, reservations — all blank
- **Empty customer discovery call table** (line 77)
- **Empty build phase metrics** (line 85-99)
- **Empty growth phase metrics** (line 103-112)
- **Daily log** (line 116-120): Last entry Day 5 (2026-04-17) — L6 logged, interview tracker migrated

All validation metric fields are dashes (—). Landing page not yet built. Zero reservations.

---

## CONTRADICTIONS OR AMBIGUITIES FLAGGED

### FLAG 1: RESOLVED — FB Groups now primary overall

Founder confirmed (2026-04-17): Facebook Groups should be PRIMARY, TikTok secondary. Deep research on Dormy PH (85K followers, 1.2M likes, no conversion evidence) + platform data (FB drives >70% of PH social web referrals, TikTok <5%) validated this. Decision file amended. FINAL_DECISION.md and north-star updated. Full research saved to Second Brain.

### FLAG 2: Unit economics cite "Gemini API ~₱50" but north-star says "AI + human"

`FINAL_DECISION.md:541` lists "Gemini API: ~₱50" in unit economics. But `context/00-north-star.md:230` lists "ANTHROPIC_API_KEY" as a potential Phase 2 env var alternative. The actual AI provider for matching is TBD. The ₱50 cost estimate may shift depending on provider choice. Not blocking — just noting the assumption is Gemini-based cost, which may be off.

### FLAG 3: "Price A/B clear winner" metric in §11.1 — but only one price exists

`FINAL_DECISION.md:958` lists a validation metric:
> "Price A/B clear winner | Yes | Kill if: No signal by Day 10"

But the current product has ONE price (₱499 flat). The old two-tier model (escrow + concierge) was killed on 2026-04-17. There's no A/B price test to run with a single tier. This metric row appears to be a stale artifact from the two-tier era.

### FLAG 4: RESOLVED — Override documented in 06-validation-state.md

Founder confirmed. Override documented in `context/06-validation-state.md` lines 4-5: landing page work (Prompts 6-10) authorized to proceed in parallel with remaining interviews (L7-L10, T5-T10). The 20-interview rule applies to product decisions only, not demand validation.

---

**All 10 questions answered with file:line citations. Flags 1, 2, 4 resolved. Flag 3 stored for future cleanup.**
