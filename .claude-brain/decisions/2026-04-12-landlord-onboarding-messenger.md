# Decision: Landlord onboarding is Messenger-mediated human-assisted, not self-serve app

**Date:** 2026-04-12
**Status:** Active

---

## Context

Prior plan assumed landlords would self-serve listing creation in the app: download app, register, upload ID, upload property proof, create listing, upload photos.

Deep research (April 2026) revealed a critical mismatch:
- Target landlords are 45-70, primarily female
- Facebook-native but app-resistant
- "Higher difficulties, especially regarding security and education" with new digital systems (Pantao Journal 2025)
- Messenger is their primary communication tool — more than SMS or phone calls
- Any friction beyond Facebook-native patterns causes abandonment

Self-serve onboarding will fail for this demographic. Proceeding with that assumption would kill supply-side growth.

---

## Decision

**At launch, landlord listing creation is facilitated by a RentRayda team member (founder, initially) through Facebook Messenger.**

Flow:
1. Landlord sees our Facebook post, contacts our Page or a referrer
2. RentRayda team member opens Messenger conversation
3. Team member asks questions conversationally: "How many rooms available? What's the monthly rent? May pictures po ba?"
4. Landlord sends photos and info via Messenger (native behavior for her)
5. Team member creates the listing in the admin panel
6. Team member sends back listing preview: "Okay na po, ito ang listing mo. Ayos na ba?"
7. Landlord approves verbally. Listing goes live.
8. Team member handles all subsequent updates the same way

**No landlord app download required at launch.**

Landlords CAN install the app if they want (for notifications, inquiry management, verification uploads), but it's optional. Most won't.

---

## Alternatives considered

**Self-serve listing creation:** Research says it fails. Rejected.

**Voice call onboarding:** Would work but doesn't scale. Messenger text is async, allowing team member to handle 10-20 conversations in parallel. Voice is 1-to-1 real-time.

**In-person barangay walks only:** Essential for INITIAL acquisition, but Messenger handles the ongoing updates, questions, and follow-up that would otherwise require another visit.

**Fully automated Messenger chatbot:** Rejected at launch. BIR anxiety + complex questions = high risk of bad automated response. Humans handle it. Later, partial automation via Managed Agent (see `context/11-managed-agents-use-cases.md` § 3).

---

## Consequences

**Positive:**
- Matches landlord's actual digital comfort zone
- Zero-friction onboarding (she's already in Messenger)
- Human touch builds trust (high-leverage for skeptical 45+ demographic)
- Lets us screen landlord quality before listing (we can decline shady operators)
- Each onboarding is a discovery interview (we learn continuously)
- Acts as BIR-anxiety detector (her first question tells us if she's scared)

**Negative:**
- Doesn't scale linearly. One team member can handle ~50-100 active landlords.
- Operational overhead — this IS the job for first ~6 months
- Requires Messenger business account with compliance setup
- Response time expectations (users expect fast Messenger replies)

---

## Scale plan

| Landlord count | Onboarding approach |
|----------------|--------------------|
| 0-50 | Founder (Miguel) personally |
| 50-100 | Founder + trained assistant |
| 100-500 | Small team + semi-automated templates |
| 500+ | Managed agent with human escalation (see use case #3) |
| 1000+ | Self-serve option available but not required |

---

## Operational requirements

**At launch:**
- Facebook Business Manager with Messenger-enabled Page
- Messenger response time <1 hour during 10 AM - 10 PM
- Saved replies template library (Taglish, warm register)
- CRM tagging for each landlord state (reached out, interested, sent photos, listed, active)
- Weekly review of abandoned conversations for learnings

**Compliance:**
- All landlord-facing Messenger content must avoid BIR-adjacent language (see `decisions/2026-04-12-no-bir-paper-trail.md`)
- Privacy disclosure: "Your info is kept private. We don't share with BIR or anyone."
- No promises we can't keep (verification is not 100%, etc.)

---

## Revive trigger

This decision should be reopened if:
- Self-serve completion rate exceeds 60% in A/B testing (test periodically with younger landlords)
- Landlord volume exceeds capacity for human-assisted onboarding (~100 active landlords)
- Younger landlords (under 40) become a meaningful segment
- Facebook Messenger API becomes unreliable or restricted
- A specific landlord segment emerges that actively prefers app-based self-serve

---

## Review date

2026-07-12 (3 months — assess landlord volume and onboarding capacity)

---

## References

- Research: `context/10-target-psychographics-secondary.md` § DIGITAL BEHAVIOR
- Related: [[2026-04-12-no-bir-paper-trail]], [[2026-04-12-facebook-page-only-no-groups]]
- Source: Pantao Journal Vol 4 Issue 1 (2025) study on informal economy digital adoption
