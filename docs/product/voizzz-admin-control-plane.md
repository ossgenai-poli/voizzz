# Voizzz Admin Product Control Plane

**Date:** September 7, 2026  
**Status:** Approved product architecture  
**Scope:** Voizzz product administration, configuration, release control, and operational oversight

## 1. Purpose

Voizzz Admin is the product control plane used by the people who design and operate the Voizzz product. It is not part of the customer application and is not a privileged version of the customer experience.

The governing boundary is:

> Engineering determines what the platform is built on. Admin configures how the product behaves. Users configure how the product behaves for them.

## 2. Separate personas and applications

Product Admin and customer are separate personas with no shared navigation or interface.

- The customer application contains Compose, Inbox, Drafts, Contacts, Memory, and user Settings.
- The Admin application is a separate surface, such as `admin.voizzz.com`, with separate authentication.
- The customer application does not contain an Admin entry point.
- Admin does not use the customer interface to configure the product.

There is one administrative role: **Admin**. There are no Super Admin, Reviewer, or Approver variants. An authenticated Admin may draft, test, publish, and roll back product configuration.

## 3. Authority boundaries

### 3.1 Engineering-owned foundation

Engineering selects and maintains the foundational platform, including:

- Microsoft Foundry or another selected AI platform
- Hosting and deployment architecture
- Databases and storage infrastructure
- Authentication infrastructure
- Core telephony and provider integrations
- Secret and key management

Admin cannot replace the foundational platform or introduce an unapproved provider. After Engineering exposes an approved capability, Admin may configure how the product uses it.

### 3.2 Admin-controlled product behavior

Admin configures the product-wide capability envelope and runtime behavior, including:

- System prompts and agent instructions
- Planning, Orchestration, and Calling Agent behavior
- Model selection from Engineering-approved deployments
- Tool availability, assignment, permissions, limits, and fallbacks
- Orchestration rules, routing, retries, escalation, scheduling, and handoffs
- Available communication channels, languages, and voices
- Safety, privacy, Memory, and retention policies
- Pricing and cost-estimation rules
- Evaluation suites and release versions

Admin defines what the product offers. Admin does not choose a customer's personal settings.

### 3.3 User-controlled configuration

Customers control their own:

- Communication and notification preferences
- Channel choice for a Task or Message
- My Assistant or My Voice delivery choice
- Contacts and contact defaults
- Memory content and thread-level Memory authorization
- Connectors, dedicated numbers, scheduling, and task approvals

Admin must not alter these selections on a customer's behalf.

## 4. Administrative information architecture

The Admin application contains:

1. **Overview** — platform health, usage, call success rates, costs, alerts, and recent failures.
2. **Agents** — configuration for Planning, Orchestration, and Calling Agents.
3. **Tools & Channels** — configuration of approved tools, calling, text, email, connectors, permissions, and fallbacks.
4. **Calls** — platform-level call analytics and individual execution inspection.
5. **Test & Release** — evaluation of drafts, integrated journey testing, publishing, version history, and rollback.
6. **Pricing & Policies** — cost estimation, retention, Memory behavior, privacy rules, product limits, and user-facing capability choices.
7. **Audit Log** — immutable configuration and sensitive-data access history.
8. **Platform** — read-only visibility into Engineering-selected infrastructure and providers.

## 5. Agent configuration

Agents are independently configurable but must also be tested as one end-to-end system.

### 5.1 Planning Agent

Admin configures the system prompt, clarification strategy, suggestion behavior, Memory recommendations, Task Contract structure, permitted tools, and selected reasoning model.

### 5.2 Orchestration Agent

Admin configures task lifecycle behavior, routing, authorization checkpoints, context packaging, retry limits, scheduling, escalation, callbacks, state transitions, and handoffs.

### 5.3 Calling Agent

Admin configures the execution prompt, voice settings, conversational boundaries, permitted tools, disclosure behavior, voicemail handling, and deflection rules.

Each agent screen shows the published version, editable draft, selected approved model, tool permissions, test results, version history, and release controls.

## 6. Tool and channel configuration

For an Engineering-approved tool or channel, Admin may:

- Enable or disable it for the product
- Assign it to one or more agents
- Define when it may be used
- Set authorization requirements
- Set limits, timeout behavior, and fallbacks
- Test behavior before release

Introducing a new foundational provider or integration remains an Engineering change.

## 7. Calls and operational oversight

For the Voizzz SaaS deployment, Admin has access to platform-level and individual-call operations, including:

- Total call volume and success rates
- Cost, duration, latency, and failure trends
- Individual call status and failure reason
- Recording, transcript, summary, and execution timeline
- Agent, model, provider, tool use, retries, and transfers
- Relevant agent decisions and technical diagnostics

This operational access does not authorize Admin to modify the customer's configuration, contacts, Memory, Tasks, Messages, or approvals.

## 8. SaaS and private deployments

### 8.1 Voizzz SaaS

Authorized Voizzz Admins may inspect individual call content and execution data for product operation, debugging, quality, and support. This access must be disclosed in the product's privacy terms and protected by authentication and auditing.

### 8.2 Private implementation

Voizzz personnel cannot access the private customer's call data. The customer controls its own administrators, data, encryption, retention, and audit policies. Private deployment does not create a hidden access path for Voizzz.

## 9. Mandatory audit history

Every Admin access to sensitive call information and every product configuration action is recorded with:

- Administrator identity
- Timestamp
- Resource accessed or changed
- Stated reason for sensitive-data access
- Action performed
- Previous and resulting configuration version, when applicable

Audit records are immutable from the Admin interface. In a private implementation, the private customer owns and controls its audit records.

## 10. Configuration release lifecycle

All Admin-controlled changes follow:

**Draft → Test → Publish → Rollback**

- **Draft:** Admin edits configuration without changing customer-facing behavior.
- **Test:** Admin runs isolated agent tests and complete Planning-to-Orchestration-to-Calling journey evaluations using non-production test data.
- **Publish:** Admin activates a versioned configuration for the product.
- **Rollback:** Admin restores a previously published configuration.

There is no second-Admin approval requirement. Audit history provides accountability.

An already approved Task remains pinned to the configuration version under which it was approved. Publishing a new configuration must not silently change the behavior or authority of work already in progress.

## 11. Test and release requirements

A draft cannot be published unless required evaluations pass. At minimum, testing must cover:

- The changed agent or capability in isolation
- The complete three-agent journey when agent interfaces or orchestration change
- Authorization boundaries and out-of-scope deflection
- Memory and disclosure restrictions
- Cancellation, retry, timeout, and rollback behavior
- Cost and channel behavior affected by the change

Unauthorized commitments and unapproved disclosures are release-blocking failures.

## 12. Initial Admin mockup scope

The first Admin mockup should demonstrate:

1. Overview with product health and call metrics.
2. Agents with Planning, Orchestration, and Calling tabs.
3. A versioned configuration moving through Draft, Test, and Publish.
4. Calls with both aggregate metrics and individual-call inspection.
5. Immutable audit history for a sensitive transcript access and a published prompt change.

The mockup should communicate the Admin/customer boundary clearly and must not reuse the customer Inbox, Compose, Contacts, Memory, or Settings experience.

