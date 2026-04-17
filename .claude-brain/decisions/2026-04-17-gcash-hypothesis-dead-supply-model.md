# Decision: GCash hypothesis dead + landlord-as-supply model adopted

**Date:** 2026-04-17
**Status:** Active
**Amends:** `2026-04-12-escrow-via-gcash-partnership.md` (principle valid, implementation needs revisiting)
**Triggered by:** Braindump feedback loop after L6 interview + cumulative L1-L6 data

---

## Context

After 6 landlord interviews (L1-L6), the GCash payment hypothesis is dead:
- 0/6 landlords use GCash for rent collection
- 4/6 are cash-or-bank only, 2/6 use PDCs
- L6 explicitly refuses GCash AND online banking ("natatakot ako")
- Not a single landlord in any segment (formal or informal) accepts GCash

Simultaneously, 0/6 landlords showed genuine enthusiasm for platform adoption. But all would accept having their units listed for free with zero effort required. The "sige" model emerged from field observation.

---

## Decisions

### 1. GCash as payment mechanism: DEAD for landlord-side

The PRINCIPLE from `2026-04-12-escrow-via-gcash-partnership.md` remains valid: we never custody funds. But the IMPLEMENTATION (route deposit through GCash) is invalidated by field data.

**For first 10 placements:** Manual bank transfer with founder-verified receipt screenshot.
**For scale:** Explore Paymongo-direct or alternative EMI partnership. The mechanism must match how landlords ACTUALLY receive money (cash or bank deposit), not how we wish they would.

### 2. Landlord-as-supply ("sige" model): ADOPTED

Landlords don't adopt the platform. We adopt their supply. The onboarding flow is:
1. Walk barangay, find units
2. "Ate, pwede po bang i-list? Libre po, we do everything."
3. She says "sige"
4. We photograph, verify, create listing
5. She changes nothing about her operations

This is the Mamikos Mamichecker model adapted for Philippines. Proven in Indonesia (140K listings), failed only because Mamikos was underfunded and had no verification layer.

### 3. Taga-probinsya alignment: DOCUMENTED

L6 explicitly prefers provincial tenants ("mas okay taga-probinsya"). Our target tenants (provincial migrants) are the landlord's PREFERRED tenants. Added to north-star.

### 4. Tao Elev / group fraud: ADDED TO BUSINESS RULES

Verified tenant = one person, one ID, one unit. Prevents the specific group fraud pattern L6 described. Added as business rule 3b.

---

## What changed in canonical docs

| File | Change |
|------|--------|
| `00-north-star.md` | Tier 1 "GCash-powered" → "payment partner TBD". Added SUPPLY-SIDE MODEL section. |
| `05-business-rules.md` | §8: GCash → "partner TBD". §9: "GCash primary" → "partner TBD". Added §3b: Tao Elev prevention. |
| `CLAUDE.md` | Added 'studio' to unitType with PROVISIONAL note. |

## Revive trigger

Reopen GCash if:
- A new landlord segment (younger, digital-native) emerges that accepts GCash
- GCash launches a specific landlord product that addresses their resistance
- 3+ landlords in future interviews say they'd accept GCash for rent

---

## References

- L6 interview transcript: `second-brain/COG-second-brain/04-projects/rentrayda/interviews/2026-04-17-L6-lola-maybunga-transcript.md`
- Interview tracker: `context/14-interview-tracker.md` §L6 + hypothesis table
- Strategic advantages braindump: `second-brain/COG-second-brain/04-projects/rentrayda/braindumps/2026-04-17-L6-interview-strategic-advantages.md`
- Original GCash decision: `decisions/2026-04-12-escrow-via-gcash-partnership.md`
