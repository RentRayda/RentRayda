# Claude Managed Agents — Use Cases for RentRayda

**Last updated:** 2026-04-12
**Source:** Anthropic Managed Agents launch April 8, 2026 + deep research synthesis
**Purpose:** When Claude Code or the team considers whether to use Managed Agents for a RentRayda feature, check here first.

---

## WHAT CLAUDE MANAGED AGENTS IS (FACTUAL)

- Launched public beta April 8, 2026 by Anthropic
- Managed cloud infrastructure for deploying AI agents
- Pricing: standard token rates + **$0.08/session-hour** for active runtime
- Access: API key + beta header `managed-agents-2026-04-01`
- Features: sandboxed execution, long-running sessions, checkpointing, scoped permissions, built-in tools (Bash, file ops, web search/fetch, MCP)
- Research preview gates: multi-agent coordination, self-evaluation, persistent memory
- Claude Platform exclusive (not Bedrock or Vertex)
- Launch partners: Notion, Rakuten, Asana, Sentry, Atlassian

---

## THE RULE BEFORE USING IT

**Managed Agents is a tool, not a strategy.** RentRayda's bottlenecks at this stage are:
1. Validation (30 paid reservations) — no agent helps
2. Landlord supply (barangay walks) — no agent walks barangays
3. MVP cleanup (40 hours scoped work) — Claude Code handles this
4. Manual first 10 placements — founder work

**Default answer: don't use managed agents unless a specific use case below fits.**

**Test before adoption:**
- Does this use case run >10x/day? (justifies runtime cost)
- Does it require sandboxed tool execution? (justifies managed infra)
- Is it defensibly within our product scope? (not scope creep)
- Would Claude Code or a simple cron job solve it 80% as well? (don't over-engineer)

---

## RANKED USE CASES

### 1. LISTING VERIFICATION AGENT (HIGH VALUE — RECOMMENDED)

**What it does:**
Takes new landlord listing (photos, description, location, claimed price) and runs:
- Reverse image search against scam databases
- Cross-reference address against HazardHunter flood data
- Duplicate detection against existing listings
- Price anomaly flag (compare to neighborhood comparables)
- Red flag detection in description text

**Why it justifies managed agents:**
- Multiple tool calls per verification (web search, HazardHunter fetch, internal DB query)
- Long-running (2-5 min per listing)
- Sandboxed execution required for image processing
- Runs 5-50x/day at scale

**Cost estimate:** ~₱5-15 per verification
**When to build:** After validation passes, during Phase 2 (Week 2 of build)
**Session type:** Triggered on new listing submission

---

### 2. FACEBOOK / TIKTOK CONTENT GENERATION (MODERATE VALUE)

**What it does:**
Daily-scheduled managed agent session that:
- Reviews recent listings, placements, user stories
- Generates 3-5 Taglish Facebook Page posts
- Drafts TikTok script ideas for nano-influencer partners
- Researches trending topics via web search
- Pushes drafts to a review queue for human approval

**Why it justifies managed agents:**
- Persistent session maintains voice consistency
- Web search tool built-in (finds trending BPO topics)
- Checkpointing means if the session crashes, resume from last draft
- Cost-effective at scale (one session serves whole week)

**Cost estimate:** ~₱50-100/day
**When to build:** Post-validation, when content volume justifies (Month 2+)
**Session type:** Daily scheduled

**Important:** This is drafting, not publishing. Human-in-the-loop review is non-negotiable.

---

### 3. LANDLORD MESSENGER ONBOARDING ASSISTANT (MODERATE AT SCALE)

**What it does:**
Long-running session that manages multi-day Messenger conversations with landlords who started but didn't complete listing setup:
- Sends follow-up reminders at appropriate intervals (Day 1, Day 3, Day 7)
- Answers common questions (especially around BIR fear)
- Handles objections with pre-approved responses
- Escalates to human when stuck
- Checkpoints state across conversations over days

**Why it justifies managed agents:**
- Requires persistent memory across many days
- Messenger API integration needed
- Long-running sessions (days, not minutes)
- Scales without per-landlord human touch

**Cost estimate:** ~₱10-30 per landlord onboarded
**When to build:** When landlord volume exceeds capacity for human-assisted onboarding (~100 active landlords)
**Premature before PMF.** At launch, onboarding should be human-assisted.

---

### 4. CUSTOMER DISCOVERY SCHEDULING (LOW-MODERATE VALUE)

**What it does:**
Agent that schedules, follows up on, and synthesizes notes from user discovery interviews.

**Why NOT use managed agents:**
A simple Calendly + manual note-taking in a journal is 80% as good at pre-PMF scale. Managed agents overkill.

**Revisit:** Post-PMF when discovery volume is >50/month

---

### 5. ESCROW DISPUTE TRIAGE (PREMATURE)

**What it does:**
Agent reviews transaction history, lease terms, communication records for disputes; recommends resolution.

**Why NOT use managed agents:**
- No transaction volume yet
- Legal framework unclear (AFASA implications)
- High liability for automated decisions
- Tier 1/2 disputes should be human-reviewed entirely at launch

**Revisit:** After 500+ successful placements + clear dispute patterns

---

## IMPLEMENTATION GUARDRAILS

When building any of the above:

1. **Don't build agent features before validation passes.** No agent makes the landing page convert better.
2. **Human review queue for all agent output.** Agents draft; humans publish.
3. **Scoped permissions.** Each agent gets ONLY the tools it needs (listing verification agent doesn't need Messenger access).
4. **Cost monitoring from day 1.** $0.08/session-hour compounds. Set budget alerts at ₱500/week.
5. **Checkpoint frequency.** Managed agents crash. Checkpoint every 5-10 minutes so work isn't lost.
6. **MCP servers for RentRayda tools.** Build listing DB, HazardHunter, and scam database as MCP servers so any agent can use them.

---

## WHAT NOT TO DO WITH MANAGED AGENTS

Based on psychographic findings, these are explicitly off the table:

- **Tenant chatbot as primary UX.** Research says users want buttons and humans, not prompts. Kill list item 3.1.
- **Automated tenant screening decisions.** Humans decide. Agent can recommend.
- **Auto-posting to Facebook Groups.** ToS violation. Kill list item 3.3.
- **Agent-generated Messenger replies to landlords without review.** BIR fear language is high-stakes; one bad phrasing kills the relationship.
- **Automatically adjusting listing prices based on demand.** Rent Control Act compliance matters.
- **Agent-driven customer support without humans in loop.** Support builds trust; automation erodes it.

---

## REVIVE TRIGGERS

This use case ranking should be reviewed if:
- Anthropic releases multi-agent coordination out of research preview
- Managed agent pricing changes significantly (>25%)
- Competitor launches better agent infrastructure
- Our transaction volume exceeds 100 placements/month (triggers Tier 3 reconsideration)
- A specific bottleneck emerges that only agents can solve

Review date: 2026-07-12 (3 months)
