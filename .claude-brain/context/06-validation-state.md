# Validation State — Live Metrics

**Last updated:** 2026-04-17 (validation not yet launched; 10/20 research interviews complete)
**Phase:** Pre-validation setup — listening mode (per founder rule: no product decisions until 20 interviews)

This file is the single source of truth for validation metrics. Update after every significant event (post goes live, reservation comes in, refund processed).

---

## CURRENT PHASE

**Phase 0: Validation Setup (Day -2 to Day 0)**

Not yet launched. Landing page not yet built.

---

## RESEARCH INTERVIEWS (pre-gate)

Founder rule: **no product decisions until 20/20 interviews complete.**

| Metric | Target | Actual |
|--------|--------|--------|
| Landlord interviews | 10 | 6 |
| Tenant interviews | 10 | 4 |
| Combined | 20 | 10 |

Source: `context/14-interview-tracker.md`. Distilled summary: `context/01-research-findings.md`.
When the combined counter reaches 20, only then do we consider moving to paid-validation design decisions.

---

## THE GATE

**One tenant-paid product:**
- **Verified Placement:** ₱499 flat (₱149 reservation + ₱350 on move-in), 48-hour placement window

**Total reservations in 14 days:**
- **30+ paid reservations → BUILD**
- **15-29 → EXTEND 14 more days with iterated landing**
- **<15 → KILL, refund all, publish post-mortem, archive repo**

---

## VALIDATION METRICS (populate when live)

### Traffic funnel (combined)

| Metric | Target | Actual |
|--------|--------|--------|
| Total impressions | 150-450K | — |
| Landing page clicks | 1,500-9,000 | — |
| Form completions | 50-300 | — |
| Paid reservations | 30+ | — |

### By channel

| Channel | Posts | Clicks | Reservations |
|---------|-------|--------|-----------------|-----------------|
| BPO Facebook Group #1 | 0 | — | — |
| BPO Facebook Group #2 | 0 | — | — |
| BPO Facebook Group #3 | 0 | — | — |
| BPO Facebook Group #4 | 0 | — | — |
| BPO Facebook Group #5 | 0 | — | — |
| University group (DLSU) | 0 | — | — |
| University group (UP) | 0 | — | — |
| University group (PUP) | 0 | — | — |
| Personal Facebook | 0 | — | — |
| LinkedIn | 0 | — | — |
| TikTok video 1 | 0 | — | — |
| TikTok video 2 | 0 | — | — |
| TikTok video 3 | 0 | — | — |
| Personal DMs | 0 | — | — |

### Customer discovery calls

| Reserver | Date | Completed? | Key quote | Deadline |
|----------|------|-----------|-----------|----------|
| — | — | — | — | — |

---

## BUILD PHASE METRICS (populate after Day 15 if validation passes)

### Week 1 — MVP cleanup
| Day | Hours planned | Hours actual | Completion |
|-----|---------------|--------------|------------|
| 1 | 8 | — | 0% |
| 2 | 8 | — | 0% |
| 3 | 8 | — | 0% |
| 4 | 8 | — | 0% |
| 5 | 8 | — | 0% |

### Week 3 — Soft launch
| Metric | Target | Actual |
|--------|--------|--------|
| Landlords onboarded | 30-50 | — |
| Verified listings live | 50+ | — |
| First 10 placements success | 7+ | — |

---

## GROWTH PHASE METRICS (populate Month 1+)

| Metric | Month 1 | Month 2 | Month 3 | Kill if |
|--------|---------|---------|---------|---------|
| Paid placements | 20 | 60 | 150 | <50 by M3 |
| Refund rate | <20% | <15% | <10% | >30% |
| Gross margin | ₱400 | ₱500 | ₱600 | <₱300 |
| Contribution margin | ₱8K/mo | ₱30K/mo | ₱90K/mo | Negative |
| Referral rate | 5% | 15% | 25% | <5% M2 |
| Week-4 retention | N/A | 20% | 30% | <10% |

---

## DAILY LOG (append-only during validation)

**Day 0 (2026-04-12):** Brain installed. Landing page not yet built. Awaiting next work session.

**Day 5 (2026-04-17):** L6 logged (high-volume informal landlord, 120 units, Pasig, 60+). Interview tracker migrated from external PDF into canonical `context/14-interview-tracker.md`. Raw transcript archived at `second-brain/04-projects/rentrayda/interviews/2026-04-17-L6-lola-maybunga-transcript.md`. Hypothesis updates: GCash-as-norm promoted from FAILING to DEAD (0/6 landlords); 2 new hypotheses surfaced (compliance-hack systemic, group-fraud Tao Elev/POGO). Bedspace-is-dying claim flagged for L7-L10 counter-evidence before any unit-type decision. Zero product decisions made — n=10 of required 20.

---

## NOTES FOR CLAUDE CODE

When I ask you about validation status, read this file FIRST. Do not guess from context.

If reservations hit a threshold (especially crossing 15 or 30), surface it proactively. Do not wait for me to ask.

After every reserver conversation, add a row to the customer discovery table with the key quote.
