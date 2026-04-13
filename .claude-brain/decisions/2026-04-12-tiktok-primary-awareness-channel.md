# Decision: TikTok is the primary awareness channel; Facebook Groups remain primary conversion channel

**Date:** 2026-04-12
**Status:** Active
**Amends:** Validation traffic plan in [[2026-04-12-validate-before-build]]

---

## Context

Original validation traffic plan prioritized: BPO Facebook groups, universities, Reddit, TikTok, personal DMs.

Deep research (April 2026) revealed usage patterns that invert this priority:

| Platform | Time/month (target demo) | Primary use |
|----------|-------------------------|-------------|
| **TikTok** | **40 hrs** | Entertainment, trust-building |
| YouTube | 25.4 hrs | Background consumption |
| Facebook | 23.5 hrs | Housing search, groups |
| Messenger | 16.4 hrs | Daily peer + family communication |
| Reddit | <1 hr | Minimal for female BPO workers 20-26 |

TikTok owns attention. Facebook owns transaction intent. Reddit is nearly irrelevant for this demographic.

---

## Decision

**Revised channel priority for validation phase and beyond:**

1. **TikTok** — Primary awareness channel. Nano-influencer BPO workers creating authentic content (housing tours, move-in day videos, "how I found my bedspace" stories)
2. **Facebook Groups** — Primary conversion channel. Remains #1 for bottom-of-funnel transaction intent. Thousands-strong BPO housing groups (Pasig Bedspace, Ortigas condoshare)
3. **Messenger** — Primary peer referral channel. BPO batchmate group chats are the native sharing mechanism. Design shareable listing cards for Messenger
4. **BPO HR partnerships** — High-conversion institutional channel. Concentrix, TaskUs, Teleperformance HR departments maintain accredited housing lists
5. **Reddit** — DEPRIORITIZED heavily. Allocate minimal effort. Not the demographic.

**Funnel design:**
```
TikTok (discover RentRayda) →
Facebook (evaluate listings) →
Messenger (get referral from batchmate) →
App (book)
```

---

## Alternatives considered

**Maintain Reddit as top-3 channel:** Rejected. Data shows female BPO workers 20-26 barely use Reddit in PH (male-skewed, tech-skewed platform). Keeping it wastes effort for marginal reach.

**TikTok as co-equal with Facebook, no hierarchy:** Considered. Rejected because clarity of priority helps team allocate effort. TikTok first for awareness, Facebook first for conversion is a specific, testable hypothesis.

**Paid ads on TikTok:** Premature. Validation phase is organic-only (locked in [[2026-04-12-validate-before-build]]). Nano-influencer partnerships can be organic (no budget needed initially — offer early-bird access in exchange for content).

**Instagram/Twitter:** Low priority. Instagram has some relevance for urban Gen Z but not for housing transactions. Twitter/X usage in PH is low.

---

## Consequences

**Positive:**
- Matches actual user attention (40 hrs/month vs 23.5)
- Nano-influencer content doubles as trust signal (authentic "people like me" voice)
- Cost-effective (organic, referral-based)
- TikTok content is highly shareable, compounds over time
- Content calendar can be generated with Managed Agents (see `context/11-managed-agents-use-cases.md`)

**Negative:**
- Video production requires more effort than text posts
- Founders may lack TikTok fluency (need to recruit BPO worker creators)
- TikTok algorithm is unpredictable — viral hit is luck-dependent
- Facebook Group conversion relies on group admin approval (some ban self-promotion)

---

## Implementation path

**Week 1 (validation prep):**
- Draft 3 TikTok scripts featuring: (1) scam prevention story, (2) verified landlord walkthrough, (3) "day in the life" of new BPO worker finding housing. See `prompts/tiktok-scripts.md`.
- Identify 5-10 nano-influencer BPO workers (5K-50K followers) as potential partners
- Create RentRayda TikTok account, post first 3 videos yourself before reaching out to creators

**Week 2-4:**
- Partner with 2-3 nano-influencers for "authentic search journey" content
- Develop shareable Messenger-optimized listing cards (see `context/04-brand.md` for card design)
- Begin BPO HR conversations (Concentrix, TaskUs first)

---

## Revive trigger

This decision should be reopened if:
- TikTok gets banned or restricted in Philippines
- Facebook Groups algorithm changes significantly boost organic reach for Pages
- Reddit adoption surges in our target demographic (monitor quarterly)
- Our TikTok conversion rate is <10% of Facebook's after 90 days (might mean we're wrong about channel hierarchy)
- A new platform emerges and captures >15 hrs/month of target demo attention

---

## Review date

2026-07-12 (3 months — check conversion metrics by channel)

---

## References

- Research: `context/09-target-psychographics-primary.md` § MEDIA CONSUMPTION
- Related: [[2026-04-12-validate-before-build]] (original traffic plan)
- Source: Meltwater / DataReportal Philippines 2025 report, Statista social media data
