# 14-Day Validation Calendar

**Created:** 2026-04-17
**Gate:** 30+ paid ₱149 reservations in 14 days → BUILD. <15 → KILL.
**Channel priority:** FB Groups primary, TikTok secondary (amended 2026-04-17).
**Start date:** TBD (Day 1 = landing page goes live)

---

## Day-by-Day Plan

| Day | Date | Action | Owner | Deliverable | Blocker | Verification |
|-----|------|--------|-------|-------------|---------|--------------|
| 1 | TBD | Launch landing page + Paymongo link + post in 2 BPO FB Groups + post TikTok Video 1 | Founder + Claude Code (landing page) | rentrayda.com live with browse + ₱149 CTA; Paymongo link working; 2 FB Group posts published; TikTok Video 1 live | Paymongo account not approved; FB Group admin blocks post | Can visit rentrayda.com, click "Reserve" → Paymongo payment page loads; FB posts visible; TikTok video live with bio link |
| 2 | TBD+1 | Post in 2 more BPO FB Groups + 1 university group (DLSU) + send 5 personal DMs | Founder | 4 cumulative FB Group posts; 1 university post; 5 DM conversations started | FB Group admins slow to approve posts | Posts visible in groups; DM threads open in Messenger |
| 3 | TBD+2 | Post in 1 more BPO FB Group + 2 university groups (UP, PUP) + TikTok Video 2 + personal FB timeline post | Founder | 5 cumulative BPO Group posts; 3 university posts; TikTok Video 2 live; personal FB posted | Video production delay | All posts live; check analytics: target 200+ unique visitors by end of Day 3 |
| 4 | TBD+3 | Send 5 more personal DMs + LinkedIn founder post + respond to all FB/TikTok comments + check metrics | Founder | 10 cumulative DMs; LinkedIn post; all comments replied; first metrics snapshot saved to 06-validation-state.md | Low engagement | Metrics logged: visitors, reservation count, channel breakdown. Target: 500 cumulative visitors by end of Day 4 |
| 5 | TBD+4 | Discovery calls with ALL reservers so far (within 24h rule) + TikTok Video 3 | Founder | Call notes in journal/ for each reserver; TikTok Video 3 live | Reservers don't answer Messenger | Each call documented per discovery script template; Video 3 posted |
| 6 | TBD+5 | Continue discovery calls for any new reservers + first pattern analysis (top 3 quotes, channel breakdown, deal-breaker clustering) | Founder | Pattern memo appended to 06-validation-state.md | Too few reservers to see patterns | Memo written with at least "channel source" and "what convinced them" for each reserver |
| 7 | TBD+6 | Rest day / buffer. Respond to inquiries only. Review all data collected so far. | Founder | Updated 06-validation-state.md with Day 7 snapshot | — | Metrics current; all reserver calls completed |
| 8 | TBD+7 | Iterate landing page copy based on discovery call patterns (A/B headline or CTA subtext — not full redesign) | Claude Code (code) + Founder (copy direction) | Updated landing page deployed with iterated copy; old copy preserved in git | No clear pattern from calls | Git diff shows specific copy change; A/B variant live |
| 9 | TBD+8 | Second wave: re-post in top 2 performing FB Groups with iterated messaging + reply to all new comments | Founder | 2 new FB Group posts with updated copy; all engagement responded to | Group admins block second post | Posts visible; engagement metrics tracked |
| 10 | TBD+9 | Discovery calls with new reservers from Day 8-10 + mid-point analysis | Founder | Call notes for new reservers; mid-point metrics snapshot: reservation count vs. 15/30 thresholds | — | 06-validation-state.md updated with Day 10 numbers; honest assessment of trajectory |
| 11 | TBD+10 | If below pace: second-wave TikTok content (Video 4 — male BPO variant or student variant) + 5 more targeted DMs | Founder | Additional TikTok video if needed; 5 new DM conversations | Content production time | Video live (if made); DMs sent |
| 12 | TBD+11 | Continue discovery calls + respond to all channels + push referral ask harder ("may batchmate ka ba?") | Founder | Referral tracking: how many offered names vs declined | Referral fatigue | Referral data logged per reserver |
| 13 | TBD+12 | Final push: re-share in personal network + one last FB Group post in highest-performing group + compile all data | Founder | Final organic push complete; all data compiled | — | All channel posts accounted for; reservation count finalized |
| 14 | TBD+13 | Go/No-Go analysis. Count reservations. Document decision. | Founder | Decision documented in decisions/ with full data. Either "BUILD" or "EXTEND" or "KILL" with evidence. | — | decisions/YYYY-MM-DD-validation-result.md committed with reservation count, channel data, call patterns, and decision |

---

## Critical Path (slip any of these → test at risk)

1. **Paymongo account approved and ₱149 payment link working before Day 1.** If Paymongo approval delays, the entire test is blocked. No workaround — we need real money.

2. **Landing page live on Day 1.** Every day of delay is a day of the 14-day window wasted. The page doesn't need to be perfect — it needs to exist with a working CTA.

3. **First 2 BPO FB Group posts on Day 1.** FB Groups are the primary channel. If admins block posts or approval takes 48h+, we lose our highest-reach window.

4. **Discovery calls within 24h of each reservation.** Every call produces qualitative data that informs the Day 8 iteration. Skip calls → iterate blind → waste the second week.

5. **Day 8 copy iteration actually deployed.** If we learn from calls but don't act on it, the second wave (Days 9-13) runs identical copy. The iteration IS the value of the first week.

6. **500 unique visitors by Day 4.** If we can't get 500 visitors in 4 days with organic reach to 120K+ group members, the traffic plan is broken and we need to diagnose before continuing.

7. **Honest Day 10 midpoint assessment.** If we're at 3 reservations on Day 10, pretending "we still have 4 days" is denial. The midpoint assessment must trigger an honest conversation about extending, pivoting messaging, or accepting early kill signal.

---

## Kill Switches (trigger immediate assessment)

These are not automatic kills — they trigger a stop-and-assess conversation. The founder makes the final call.

### 1. Paymongo down or payment link broken >24 hours

**Why it's a kill switch:** Every hour the payment link is broken, we're collecting interest signals we can't convert. Interest decays fast — someone who would have paid today won't come back tomorrow. 24h of downtime during a 14-day test is ~7% of the window gone.

**Response:** If Paymongo is down, immediately create a Google Form backup that collects name + email + phone + "I'd pay ₱149." Not as strong a signal as real money, but preserves some data. Fix Paymongo and email all form submitters with payment link.

### 2. <50 unique visitors in first 72 hours (Days 1-3)

**Why it's a kill switch:** At 3% conversion (aggressive but possible), 50 visitors → 1.5 reservations. We need 30 in 14 days = ~2.1/day. If we can't even get eyeballs, the channel plan is broken — no amount of copy iteration fixes zero traffic.

**Response:** Diagnose immediately. Are FB Group posts being approved? Are they getting any engagement? Is the landing page URL working? If traffic is zero despite posts being live, the channel hypothesis is wrong and we need to pivot to heavier DM outreach or consider paid ads (which breaks the organic-only rule — requires founder override).

### 3. >50% refund rate after discovery calls

**Why it's a kill switch:** If more than half of reservers refund after talking to us, the product promise doesn't survive first contact with reality. Either the landing page overpromises, or the actual need is weaker than research suggested.

**Response:** Stop all marketing. Analyze the 3-5 most common refund reasons. If it's "I found a place already" → urgency window is even shorter than 72h, need faster response. If it's "I didn't understand what I was paying for" → copy is misleading, fix immediately. If it's "I don't actually need this" → the wedge is wrong. Document and assess kill.

---

## Notes

- The PLAYBOOK Day 1 requirement says "3 FB Page posts" but we don't have a Facebook Page set up yet (that's Phase 2 §4.3). Replaced with "2 BPO FB Group posts" which is the primary channel per the amended decision.
- TikTok Video 1 on Day 1 is ambitious — if the founder can't film + edit + post by Day 1, push to Day 2. FB Groups are what matter for conversion.
- The "500 visitors by Day 4" target assumes ~0.4% of 120K combined group members click through. Conservative for housing-intent groups.
- All metrics go into `context/06-validation-state.md` — this is the single source of truth during the 14 days.
