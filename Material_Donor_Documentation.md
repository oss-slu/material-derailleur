**Material Donor Mutual Assist**

(Material-Derailleur)

Comprehensive Project Documentation

Open-Source Software — Saint Louis University

Course: DOSS-5930 — Developing Open Source Software

Client: BWorks Nonprofit Organization

Client Contact: Patrick Van Der Tuin (patrick.van.der.tuin@bworks.org)

**Team Members**

Mathew Shereni — Tech Lead

Cole Patrick — Developer

Tori Willis — Developer

Spring Semester 2026

GitHub: https://github.com/oss-slu/material-donor-mutual-assist

# Table of Contents

# 1. Project Overview and Product Strategy

## 1.1 Executive Summary

Material Donor Mutual Assist (MDMA) is a web application developed for
BWorks, a nonprofit organization that collects and distributes donated
bikes and computers to community members in need. The platform replaces
BWorks’ current reliance on spreadsheets and paper-based records with a
centralized digital system that manages the full donation lifecycle from
intake through distribution while providing donors with transparency
into the impact of their contributions.

The application is in a mature iteration phase with core features
already operational: staff can add donations, track each item through a
defined status lifecycle (Received → Storage → Refurbished → Donated),
upload images with an admin approval workflow, scan barcodes for fast
item lookup, and manage everything through a centralized dashboard.
Donors can log in to view their contribution history and receive email
notifications as items progress through the pipeline. The current
development priority, requested directly by BWorks, is an inventory
management system to track the stock, condition, and allocation of
donated bikes and computers.

## 1.2 Vision Statement

To become the trusted platform through which BWorks manages every
donated bike and computer, creating a seamless, transparent experience
that deepens donor relationships, streamlines inventory operations, and
reduces administrative burden for staff.

## 1.3 Mission

Replace manual, paper-and-spreadsheet donation tracking with an
intuitive digital platform that gives BWorks staff real-time visibility
into donation status and inventory levels, while giving donors
meaningful insight into how their contributions of bikes and computers
are making a difference in the community.

## 1.4 Success Criteria

BWorks staff fully transition from spreadsheets and paper records to
MDMA as their primary donation and inventory tracking tool. Staff can
view real-time inventory counts of bikes and computers by status
(received, in storage, being refurbished, donated/distributed). Donors
can independently log in and view the status and impact of their
contributions without contacting staff. The image approval workflow
ensures only appropriate, high-quality photos are shared publicly.
Administrative time spent on donation tracking, inventory counts, and
donor communication is reduced by at least 40%. Donor retention and
repeat giving rates improve as a result of increased transparency. The
platform is stable, well-documented, and ready for handoff to future
development teams.

## 1.5 Target Users

**BWorks Staff / Admin (Primary Users)**

Staff manage intake, repair, storage, and distribution of donated bikes
and computers, and approve or deny donation images. They have moderate
technical comfort and are used to web apps but currently rely on
spreadsheets and paper. Key needs include fast data entry, status
updates, image moderation, inventory counts, barcode scanning, and
reporting.

**Donors (Secondary Users)**

Donors contribute bikes, computers, and other material goods and view
donation status and impact through the donor portal. Technical comfort
varies widely. Key needs include easy login, clear donation history,
status updates, approved photos showing the item journey, and impact
visibility.

## 1.6 Key Pain Points Addressed

No single source of truth: Donation and inventory data was fragmented
across spreadsheets, paper logs, and email. Staff wasted time
cross-referencing records. Inventory blind spots: BWorks could not
quickly answer questions about item counts at each stage. Donor
communication gap: Donors rarely received updates after drop-off. No
image quality control: Without approval, any uploaded photo could be
shared. Reporting difficulty: Generating impact reports required
significant manual effort. Data loss risk: Paper-based records were
vulnerable to loss and inconsistency.

## 1.7 Market and Competitive Analysis

| **Solution** | **Strengths** | **Gaps for BWorks** |
|----|----|----|
| DonorPerfect | Robust financial donor CRM; widely adopted | Designed for monetary donations; no material item lifecycle tracking |
| Bloomerang | Strong donor retention analytics; clean interface | No material donation tracking; cost-prohibitive for small orgs |
| Salesforce Nonprofit | Highly customizable; large ecosystem | Complex setup; expensive; overkill for bikes and computers |
| Spreadsheets & Paper | Familiar, zero cost, no learning curve | Error-prone; no donor portal; no real-time inventory; data loss risk |
| **MDMA** | Purpose-built for material donations; status lifecycle; barcode scanning; image approval; donor transparency; open-source | Smaller feature set; dependent on student dev team; single-org focus |

## 1.8 Current Feature Set

Donation intake and cataloging: Staff can add new donations with
descriptions, categories (bikes, computers, etc.), donor information,
and metadata. Status lifecycle tracking: Each donated item progresses
through four defined statuses — Received, Storage, Refurbished, and
Donated — with timestamps creating a full audit trail. Image uploads
with approval workflow: Staff upload photos stored in Azure Blob
Storage, and an admin must review and approve each image before it is
visible to donors. Barcode scanning: Physical items are tagged with
barcodes for faster intake, lookup, and status updates. Donor login
portal: Donors can create accounts and view their donation history and
approved images. Admin dashboard: Centralized management for donations,
image moderation, and administrative tasks. Email notifications:
Automated SMTP-based email notifications on status changes.
Authentication and role-based access: JWT-based security with distinct
roles (donor, staff, admin/superuser).

## 1.9 Donation Status Lifecycle

| **Status** | **Description** | **Who Acts** | **Donor Sees** |
|----|----|----|----|
| **Received** | Item dropped off by donor and logged into system | Staff logs item; uploads photos; scans barcode | Confirmation donation was received |
| **Storage** | Item held in BWorks warehouse awaiting processing | Staff updates status; may add condition notes | Item is safely stored and in the pipeline |
| **Refurbished** | Item repaired, cleaned, or restored and ready to give | Staff/volunteers complete repairs; upload “after” photos | Item has been restored and is ready to help someone |
| **Donated** | Item distributed to a community member in need | Staff records distribution; closes the loop | Their contribution made a tangible difference |

## 1.10 Product Roadmap

### Current Release (Completed Features)

Full donation CRUD operations with categorization. Four-stage status
lifecycle with timestamps. Image upload to Azure Blob Storage with admin
approval workflow. Barcode scanning for physical item tagging, lookup,
and status updates. Donor-facing login portal with donation history.
Staff admin dashboard for donation management and image moderation.
Email notification system via SMTP for status change alerts. JWT-based
authentication with role-based access. PostgreSQL database with
structured data models. Docker Compose development environment.
Prettier-enforced code formatting.

### Next Release: Inventory Management (Client Requested)

BWorks has specifically requested an inventory management feature.
Planned capabilities include: an inventory dashboard with real-time
counts by status stage, item categorization with category-specific
attributes (bike type, computer specs), condition and repair tracking,
inventory search and filtering, low-stock alerts, distribution logging,
and inventory reports showing flow over time.

### Future Direction

QR code migration from barcodes for enhanced data capacity and
smartphone scanning. Impact stories alongside approved images.
Mobile-responsive design for tablet and phone use. Advanced reporting
and analytics dashboards. Automated tax receipts for donors. Bulk image
approval for efficiency. Multi-organization support for other
nonprofits.

2\. Team Working Agreement

## 2.1 Project and Team Information

Project: Material Donor Mutual Assist for BWorks. Team size: 3 members
(1 Tech Lead, 2 Developers). Project duration: 1 semester (12 weeks, 6
sprints). Sprint length: 2 weeks each.

## 2.2 Core Values and Principles

The team committed to delivering a high-quality donation management
system that helps BWorks track donations transparently and keeps donors
engaged through visibility into their contributions’ impact. The team
values are: Transparency (open communication about progress, challenges,
and decisions), Collaboration (succeeding together and supporting each
other), Quality (delivering clean, tested, and maintainable code),
Learning (embracing challenges as growth opportunities), and Client
Focus (BWorks’ needs drive priorities).

## 2.3 Communication Standards

Daily standups: Every Monday, Wednesday, Friday at 6pm via in-person or
Google Meet (minimum 15 minutes). Sprint planning: Every other Monday at
7pm (2 hours maximum). Sprint review and retro: Every other Wednesday at
7pm (1 hour maximum). Backlog refinement: Mid-sprint Wednesday at 7pm (1
hour maximum). Communication channels: Text/call for urgent issues,
Slack for updates, GitHub issues/PR comments for code discussion, email
for client communication (tech lead handles, copies team), and shared
Google Doc for meeting notes.

Response time expectations: Slack messages within 4 hours during
business hours, code reviews within 24 hours, urgent issues within 2
hours, email within 24 hours.

## 2.4 Development Workflow

Feature Branch Workflow: Create feature branches from main using
descriptive branch names (feature/user-story-description) with small,
focused commits and clear messages. Code Review Process: All code
reviewed by at least one team member; tech lead reviews all major
architectural changes; GitHub PR templates used for consistency; all
review comments addressed before merging. Definition of Done: Code
written and follows project style guide, unit tests written and passing,
manual testing completed, code reviewed and approved, documentation
updated, deployed to development environment, and acceptance criteria
met.

## 2.5 Technology Stack

Frontend: React.js with functional components and hooks. Backend:
Node.js with Express. Database: PostgreSQL. Deployment: Docker
containers. Version Control: Git with GitHub. Code formatting: Prettier
(npm run prettier:write before commits). Testing target: Minimum 80%
code coverage.

## 2.6 Roles and Responsibilities

**Tech Lead (Mathew Shereni):**

Sprint planning and backlog management, client communication and
relationship management, code review coordination and quality oversight,
blocker resolution and escalation, team coordination and conflict
resolution, progress reporting and milestone tracking.

**Developers (Cole Patrick, Tori Willis):**

Feature development and implementation, code review participation,
testing and quality assurance, documentation updates, technical design
input, timely communication of progress and blockers.

## 2.7 Conflict Resolution

Issue escalation process: (1) Direct communication to resolve
interpersonal issues first, (2) bring technical or process issues to
team meetings, (3) tech lead facilitates resolution if needed, (4)
involve course instructor for unresolved conflicts. Decision making:
Technical decisions by consensus with tech lead breaking ties, process
changes by team vote with majority rules, priority changes decided by
tech lead after team input, and client requests coordinated by tech lead
with team feasibility discussion.

## 2.8 Agreement Acknowledgment

Signed by: Mathew Shereni (Team Lead), Cole Patrick (Developer 1), Tori
Willis (Developer 2). The team agreed to uphold these standards and hold
each other accountable, with the agreement reviewed and updated as
needed during sprint retrospectives.

# 3. Team OKRs — Spring 2026

## 3.1 Objective 1: Deliver a Stable, High-Quality Product That Meets Client Expectations

Building reliable features aligned with client needs while maintaining
code quality and system stability throughout the semester.

**Key Results:**

1\. Maintain fewer than five critical bugs open at the end of each
sprint. 2. Ensure all merged features are reviewed and approved through
pull request before deployment. 3. Complete at least 85–90% of planned
sprint features by the end of the semester. Progress tracked using the
project backlog and sprint boards (GitHub Projects), with bug counts and
pull request activity monitored through the repository issue tracker.

## 3.2 Objective 2: Improve and Maintain Project Documentation for Long-Term Maintainability

Making sure the project is easy to understand, onboard, and maintain for
current and future contributors.

**Key Results:**

1\. Maintain detailed, up-to-date setup and onboarding documentation for
developers by the second sprint. 2. Document all new major features
added during the semester. 3. Reduce repeated setup and configuration
questions by at least 50% after initial onboarding. Documentation
updates tracked through repository commits and pull requests.

## 3.3 Objective 3: Maintain Strong Communication and Client Engagement

Build a transparent and collaborative relationship with the client
through consistent communication and feedback.

**Key Results:**

1\. Hold regular client check-ins at agreed milestones throughout the
semester. 2. Address client-reported issues and feedback within one
sprint of receiving them. 3. Achieve positive client feedback at
mid-semester and end of semester. Client meetings and calls recorded,
action items documented in shared notes, and feedback/follow-ups tracked
in the project backlog.

# 4. First Client Meeting — Requirements Elicitation

## 4.1 Meeting Details

Date: February 28, 2026. This was the team’s first formal meeting with
the BWorks client to discuss the project, understand their operational
needs, and capture high-priority requirements for the Material Donor
Mutual Assist platform. The meeting established the foundational feature
requests that would drive Sprint 1 and Sprint 2 development.

## 4.2 Client Requirements Captured

**1. Ease of Updating Status and Photos (High Volume)**

The client emphasized the need for a streamlined workflow to update
donation statuses and upload photos quickly, especially during
high-volume intake events when many items are being processed at once.
The interface must minimize clicks and support rapid data entry.

**2. Email Notifications to Donors for Status Updates**

The client requested automated email notifications sent to donors when
the status of their donated item changes. To avoid overwhelming donors,
they suggested the option to backlog notifications and send them in
bulk. Mailchimp was mentioned as a reference for the kind of bulk email
capability they envisioned.

**3. Internal vs. Donor-Facing Status Updates**

Not all status updates should be visible to donors. The client requested
the ability to mark certain status changes as internal-only, so donors
are not bombarded with unnecessary information or shown updates that are
only relevant to staff workflows.

**4. React App Branding — BWorks Logo**

The client requested that the React application be branded with the
BWorks logo and visual identity, ensuring the platform feels like an
official BWorks tool rather than a generic system.

**5. Quick Photo Upload Between Phone and Website**

The client highlighted the need for a fast and easy photo upload
experience, particularly the ability to take a photo on a phone and have
it quickly appear in the web application. A dedicated photo button was
requested to reduce friction during intake.

**6. Account Access Tiers with Admin Confirmation**

The client outlined a tiered access control system where an admin
confirms and assigns each user’s account tier upon registration:

| **Tier**        | **Permissions**                                       |
|-----------------|-------------------------------------------------------|
| **Bottom Tier** | Upload photos only                                    |
| **Middle Tier** | Upload photos and view donor information              |
| **Top Tier**    | Full access to all system features and administration |

**7. Team Outing to BWorks**

The client suggested that the development team visit BWorks in person to
see firsthand how the application would be used in their day-to-day
operations. This was later completed as the Team Dynamics checkpoint
activity (see Section 11).

## 4.3 Impact on Development Priorities

These client requests directly shaped the team’s Sprint 1 and Sprint 2
backlog. The access tiers, status update workflow, photo upload
improvements, and branding updates became the core focus of early
development. The email notification and bulk-send capability was scoped
for later sprints, and the inventory feature (suggested during the
Client Demo on February 19, 2026) was added to Milestone 2 planning. The
BWorks site visit was scheduled and completed during Sprint 2.

# 5. Visual System Design Artifacts

## 5.1 Artifact Identification and Rationale

The Visual System Design Artifacts checkpoint was selected because it
directly supports the final product and community strategy.
Material-Derailleur is a full-stack application (React, Express,
PostgreSQL) with multiple user roles (Admin, Donor, tiered staff),
external integrations (Azure Blob Storage, Google GenAI, SMTP), and
non-trivial data and workflow. Having a single set of up-to-date visual
design artifacts helps the team and future maintainers understand system
structure, API boundaries, data model, deployment, and user flows
without reading the entire codebase.

## 5.2 Five Visual Design Artifacts Created

**1. System & API Architecture**

Component diagram of the Express backend: REST route groups, services
(donor, program, donatedItem, email, image analysis), and their
connections to PostgreSQL (Prisma), Azure Blob Storage, SMTP, and Google
GenAI. This clarifies API boundaries and where integration and business
logic live.

**2. Data Model / Entity Relationship**

ER diagram derived from server/prisma/schema.prisma covering entities:
Donor, Program, DonatedItem, DonatedItemStatus, and User. This supports
database discussions, migrations, and onboarding. Key design note: User
is separate from Donor — authentication and roles live in User while
donation profiles and history live in Donor.

**3. Deployment Architecture**

Diagram of Docker Compose services: client-app-frontend (port
3000:3000), server-backend (port 5050:5000, depends on healthy
database), and database (port 5432:5432). Optional external services
include Azure Blob Storage, SMTP Server, and Google GenAI API.
Configuration driven by .env variables (DATABASE_URL, JWT_SECRET,
AZURE\_\*, SMTP\_\*).

**4. User Flows**

Donor flow: Login/Register → Donor Profile → My Donations → Donated Item
Details → View Status History / View Barcode. Admin flow: Admin Login →
Admin Actions → View All Donors (search, import, edit/delete, add new
donation) \| View Donations (item details, status update, import,
barcode) \| Programs \| User Management \| Image Review.

**5. Frontend Component & Route Map**

High-level React components and routes from client-app/src/App.js.
Layers include: App (routing, layout, auth wrapper), Auth (Login,
Register, ForgotPassword, ResetPassword, ProtectedRoute), Donor
(DonorForm, DonorEdit, DonorList, DonorProfile, DonorDonations),
Donations (DonatedItemsList, NewItemForm, DonatedItemDetails,
AddNewStatus, BarcodeDisplay), Programs (Programs, AddProgramPage,
EditProgramPage), and Admin (AdminUserManagement, AdminImageReview).

## 5.3 API Route Reference

| **Route Prefix** | **Purpose** |
|----|----|
| GET/POST /donor | Donor CRUD, list, search |
| POST /donor/register, POST /api/login | Auth (register/login) |
| GET /donor/me, /donor/pending, /donor/users | Current user, pending users, admin user list |
| PUT /donor/users/:userId | Admin user approval/update |
| POST /donor/edit | Donor profile edit |
| POST /passwordReset, /passwordReset/reset-password | Password reset flow |
| GET/POST/PUT/DELETE /donatedItem, tags, reanalyze | Donated items CRUD, tags, AI reanalysis |
| POST /donatedItem/status | Add status to donated item |
| GET/POST /program, POST /program/edit | Programs CRUD |
| GET /api/barcode/:donatedItemId?format=svg\|png | Barcode image |

## 5.4 Data Model Entities

Donor: id (PK), firstName, lastName, contact, email (UK), addressLine1,
addressLine2, state, city, zipcode, emailOptIn. Program: id (PK), name,
description, startDate, aimAndCause. User: id (UUID PK), name, email
(UK), password, role (ADMIN/DONOR/TIER_ONE/TIER_TWO/TIER_THREE), status
(PENDING/ACTIVE/SUSPENDED), createdAt, firstLogin, resetToken,
resetTokenExpiry. DonatedItem: id (PK), itemType, category, quantity,
currentStatus, dateDonated, lastUpdated, imagePath, analysisMetadata
(JSON), donorId (FK), programId (FK). DonatedItemStatus: id (PK),
dateModified, statusType, donatedItemId (FK), imageUrls (string\[\]).

Key design notes: User is separate from Donor (auth/roles in User; donor
profile/donations in Donor). DonatedItem.analysisMetadata stores AI
(Google Gemini) results. DonatedItemStatus tracks history while
DonatedItem.currentStatus holds the current value.

## 5.5 Key Screens (Information Architecture)

| **Area** | **Routes** | **Purpose** |
|----|----|----|
| Public | /login, /register, /forgot-password, /reset-password, /contact | Landing, auth, contact |
| Donor | /donor-profile, /my-donations | Donor dashboard and donation list (role-protected) |
| Admin – Donors | /donorlist, /donorform, /donoredit | Donor CRUD, search, import |
| Admin – Donations | /donations, /adddonation, /donations/:id, /donatedItem/status/:id | Item list, add, details, status update |
| Admin – Programs | /programs, /addprogram, /editprogram | Program CRUD |
| Admin – System | /admin/user-management, /admin/image-review | User approval, image review |
| Shared | /donations/:id/barcode, /donated/:id/barcode | Barcode display |

# 6. Technical Architecture

## 6.1 Architecture Overview

MDMA follows a standard three-tier web architecture with clear
separation between the frontend, backend API, and database layers. All
services are containerized with Docker for consistent development and
deployment.

Frontend: React (JavaScript), located in the client-app directory,
served on port 3000. Provides the donor portal, admin dashboard, image
approval interface, barcode scanning, and all user-facing views.
Backend: Node.js with Express, located in the server directory, RESTful
API on port 5000 handling business logic, authentication, status
transitions, barcode lookups, and image approval workflows. Database:
PostgreSQL via Docker container, storing donation records, donor
profiles, status history with timestamps, image metadata and approval
status, and inventory data. File Storage: Azure Blob Storage for
donation images with metadata linking them to donations and tracking
approval status. Authentication: JWT-based token authentication with
role-based access control. Email: SMTP integration (Gmail) for automated
donor notifications. DevOps: Docker Compose for local service
orchestration; Prettier for code formatting.

## 6.2 Technical Considerations for Inventory Management

New database tables/fields for inventory aggregation, category-specific
attributes, and condition grading. API endpoints for inventory CRUD,
filtering, aggregation, threshold alerts, and reporting. Frontend
components for the inventory dashboard, real-time status counts,
filtering controls, and report generation. Integration with the existing
four-stage status lifecycle so that inventory counts update
automatically.

## 6.3 Technical Risks and Mitigations

| **Risk** | **Impact** | **Mitigation** |
|----|----|----|
| Team turnover (student devs) | High — loss of institutional knowledge | Comprehensive documentation; Docker-based setup for fast onboarding; code standards |
| Azure dependency | Medium — storage costs and key management | Abstract storage layer; document key rotation; monitor costs |
| Security (donor PII + images) | High — donor info and sensitive photos | JWT + role-based access; image approval workflow; env variable secrets; regular security reviews |
| Data migration | Medium — transitioning from spreadsheets | Build import tools; validate data integrity; run parallel tracking during transition |
| Image moderation scalability | Medium — manual approval bottleneck | Bulk approval UI in roadmap; consider automated pre-screening |
| Inventory complexity | Medium — different item attributes | Flexible data model with category-specific fields; iterative dev with BWorks feedback |

# 7. Team Metrics Report — Sprint 2

## 7.1 Chosen Metrics

The team selected four metrics based on the GitHub-driven workflow: (1)
Issue Throughput — number of GitHub issues completed per sprint,
tracking planned work completion. (2) Pull Request Cycle Time — average
time from PR creation to merge, reflecting collaboration and review
efficiency. (3) Defect Rate — number of bug-labelled issues created
after a release, measuring stability and testing effectiveness. (4) Team
Satisfaction — average score from a brief weekly team check-in survey
(scale 1–5), ensuring workload balance and morale.

## 7.2 Baseline Values

| **Metric**        | **Current Value** | **Data Source**                   |
|-------------------|-------------------|-----------------------------------|
| Issue Throughput  | 12 issues closed  | GitHub Projects and GitHub Issues |
| PR Cycle Time     | 24 hours average  | GitHub Pull Request and Insights  |
| Defect Rate       | 2 bugs reported   | GitHub Issues (label: “bug”)      |
| Team Satisfaction | 4.5/5 on average  | Weekly team survey (Google Form)  |

## 7.3 Analysis and Observations

Throughput: Strong improvement over last sprint (+8 closed issues). PR
Cycle Time: Reasonable turnaround; most PRs merged within 24–30 hours,
but reviews stalled when key reviewers were unavailable. Defect Rate:
Acceptable, though a few regression bugs were introduced in the last
deployment. Satisfaction: Trending positively from 4.0 to 4.5 over two
sprints, suggesting workload and communication are well-balanced.

Unexpected findings: PRs created late in the sprint took longer to
review due to availability constraints, impacting deployment timing.
Small backend code issues classified as bugs made up the majority of
defect reports.

## 7.4 Action Items

| **Issue Identified** | **Planned Action** | **Expected Impact** |
|----|----|----|
| PRs taking too long to merge | Implement reviewer rotation schedule | Reduce cycle time by 20% |
| Minor regression bugs | Add GitHub Actions CI tests before merge | Lower defect rate |
| Late PR creation | Enforce mid-sprint cutoff for new PRs | More predictable sprint end |

Targets for upcoming sprints: PR Cycle Time ≤ 20 hours average, Defect
Rate ≤ 2 bugs per sprint, Satisfaction ≥ 4.5/5 maintained. The team
plans to introduce Commit Frequency as a lightweight productivity
indicator and automate weekly reports using a GitHub Action.

8\. Project Milestones

## 8.1 Milestone 2: 2025 Issue Cleanup, Dependency Update, Inventory CRUD, Client Test Deployment

By the end of Iteration 2, the team will close or resolve all open
issues created in 2025, update project dependencies to remove known
high-severity vulnerabilities, implement a basic Inventory feature with
full CRUD (create, read, update, delete) and a simple UI, and (time
permitting) deploy a test instance for the client to validate the
inventory flows and the whole system.

### Timeline and Sprint Cadence

Iteration 2 start: Mon Mar 16, 2026. Iteration 2 end: Fri May 11, 2026.
Sprint cadence: 2-week sprints. Sprint 4: Mar 16 — Mar 30. Sprint 5: Mar
30 — Apr 13. Sprint 6: Apr 13 — Apr 28. Milestone close-ups and
presentations: Apr 27 — May 11.

### Success Criteria

1\. Issue cleanup: All GitHub issues created in 2025 are either closed
with a merged PR or converted to a documented backlog item with an owner
and timeline. 2. Dependencies: All direct dependencies updated to
supported versions; security audit reports no critical or high
vulnerabilities remaining. 3. Inventory feature: Inventory supports full
CRUD with a working UI; manual acceptance tests pass and automated tests
cover core logic. 4. Quality gates: CI pipeline runs on PRs, and all
checks pass for merged work. 5. Client test readiness: If deployed, the
client can access the test instance and complete a validation script
(add item — edit — delete — export if available).

### Acceptance Criteria per Deliverable

**Clear all 2025 Issues:**

Each 2025 issue has one of: closed + linked PR, closed + documented
reason, or moved to a new milestone with an owner. A GitHub Milestone
named “Milestone 2” lists all targeted issues and shows progress.

**Dependency Updates:**

Run dependency manager update; CI build succeeds; security audit shows
zero critical/high vulnerabilities. Update notes added to CHANGELOG.md
or README.

**Inventory CRUD:**

Backend endpoints implemented and documented (GET/inventory,
POST/inventory, PUT/inventory, DELETE/inventory). Frontend list and item
detail/edit screens implemented; manual smoke test demonstrates
add/edit/delete. Unit tests for core inventory functions.

**Deployment:**

Deployment script or instructions in repo; deployed URL accessible;
smoke test executed and recorded.

**Testing and CI:**

New PRs include tests; CI runs and passes for merged PRs; coverage for
new modules ≥ 70%.

### Risk Register

Risk 1 — Large or complex 2025 issues take more time than planned.
Mitigation: Triage day 1 of Sprint 1 to categorize issues into quick
fixes (≤1 day), medium (1–3 days), and large (\>3 days). Close quick
fixes first; move large items to a follow-up milestone if needed.

Risk 2 — Dependency updates break the app or CI. Mitigation: Update
dependencies in small batches, use feature branches, run full test suite
in CI, and pin rollback points.

Risk 3 — Deployment blocked by missing credentials or client approvals.
Mitigation: Prepare a local or test deployment configuration that uses
mock/test credentials; request client access early.

# 9. Client Demo and Feedback

## 9.1 Client Demo 1 — February 19, 2026

On February 19, 2026 at 6pm, the team held the first client demo for the
Material-Derailleur project, presenting work completed in Sprint 1 and
Sprint 2. The team walked the client through the features built so far,
explained progress, and demonstrated how everything is working together.
The client was pleased with what had been accomplished, and the team’s
efforts and steady progress were aligning well with project
expectations.

During the feedback discussion, the client suggested adding an inventory
feature to help manage and track materials more effectively within the
system. The team agreed this was a valuable idea and planned to discuss
design and implementation in the upcoming sprint. The entire demo and
feedback session was recorded on Zoom for reference and documentation.

Client Demo 2 — March 30, 2026
During our second client demo, the team showcased all of the work from Sprints 3 and 4. The team was able to show all of the features that helped improve the workflow of the project, and the client was thoroughly. We discussed the next steps of making the project more efficient for all of the users. We also discussed the SSE showcase on April 30, 2026, and what we will be doing as a team to represent BWorks.


# 10. Sprint Retrospective — Team Process Improvement

## 10.1 Session Details

Date: February 23, 2026. Time: 1:00pm. Duration: 45 minutes. Location:
SSE Building, DOSS Room 210. Attendees: Mathew (Tech Lead), Cole, and
Tori. Format: Open discussion retrospective organized on a whiteboard
with three sections — Strengths, Weaknesses, and Improvements.
Participation method: Round-robin sharing so each person contributed.

## 10.2 Key Insights

**Strengths identified by the team:**

Communication, knowledge of the domain, and team collaboration.

**Weaknesses identified by the team:**

Time management, documentation consistency, and code review timeline.

**Main theme:**

The team works well together, but workflow timing and documentation need
more structure.

## 10.3 Specific Team Actions Agreed

**Dedicated task time:**

Each team member will set aside at least 1–2 focused days (or dedicated
time blocks) for assigned sprint tasks to support better time management
and reduce last-minute rushing.

**PR deadline expectation:**

PRs should be opened on or before every Friday, giving the team more
time to review before the sprint ends.

**Documentation improvement:**

Create and maintain a shared Google Doc updated with completed work and
key progress notes. Each developer updates the document for the work
they completed.

**Retro follow-through:**

Hold a retrospective at the end of every sprint at the same time and
place to check progress on improvements.

## 10.4 Ownership and Individual Commitments

Tech Lead (Mathew): Monitor GitHub Projects progress and remind team
about Friday PR expectations, check that the shared Google Doc is being
updated, and facilitate end-of-sprint retrospectives. Cole and Tori: Set
dedicated task time for assigned work, open PRs by or before Friday, and
update the shared Google Doc with completed work.

## 10.5 Follow-Through Plan

Tracking tools: GitHub Projects, pull request activity, and the shared
Google Doc. Check-in schedule: End of every sprint during the recurring
retrospective (same time, same place). What will be reviewed: PR timing,
documentation updates, task progress, and remaining blockers. If
progress is not improving: Adjust expectations, simplify the
documentation process, or break tasks into smaller parts during the next
retro.

11\. Team Outing — BWorks Site Visit

## 11.1 Activity Summary

As part of Sprint 2 in the Developing Open Source Software course at
SLU, the team completed the Team Dynamics checkpoint by participating in
an off-sprint engagement activity. As the Tech Lead for the open-source
project Material Derailleur, owned by BWorks, Mathew organized a visit
to the BWorks nonprofit organization with the two developers on the
team. The purpose of this visit was to better understand how the
organization operates and how the software supports their mission.

During the visit, the team observed BWorks’ daily processes, asked
questions about their workflows, and gained insight into the real-world
environment in which the system will be used.

## 11.2 Impact and Reflection

This experience strengthened both the team’s technical perspective and
team cohesion. By stepping outside the regular development setting, the
team built stronger communication, trust, and shared understanding.
Seeing the organization firsthand helped connect development tasks to a
meaningful community impact. Overall, the activity reinforced the
importance of collaboration, empathy, and alignment in open-source
software development.

The visit was documented with a LinkedIn post shared by Mathew Shereni,
accompanied by photographs taken at the BWorks facility. This was tagged
under Open Source with SLU and Saint Louis University School of Science
and Engineering.

# 12. Appendix

## 12.1 Repository and Resources

GitHub Repository:
https://github.com/oss-slu/material-donor-mutual-assist

Client Contact: Patrick Van Der Tuin (patrick.van.der.tuin@bworks.org)

Client Demo 1 Zoom Recording:
https://slu.zoom.us/rec/share/bMn3mdyXcr6Ak6hm8CkKX3_VP553J9yAOIyHCdgJf5NX2fyQZgjVtBeTgazhrwvE
(Passcode: ?^279bH^)

## 12.2 Source Documents Compiled

This document was compiled from the following source artifacts:

1\. Team Working Agreement (Spring Semester). 2. Team OKRs (Mathew
Shereni, 001460357). 3. First Client Meeting Notes (February 28, 2026).
4. Team Metrics Report (Sprint 2). 5. Checkpoint Artifact — Visual
System Design Artifacts (GitHub). 6. Product Strategy Draft 1.0
(Checkpoint). 7. Milestone 2 — DOSSP. 8. Client Demo Feedback 1. 9.
Sprint 2/3 Team Process Improvement Retrospective. 10. Team Outing Post
and Documentation.

## 12.3 Technology Stack Summary

| **Layer**         | **Technology**                           |
|-------------------|------------------------------------------|
| Frontend          | React.js (functional components, hooks)  |
| Backend           | Node.js with Express (RESTful API)       |
| Database          | PostgreSQL (managed via Prisma ORM)      |
| File Storage      | Azure Blob Storage                       |
| Authentication    | JWT-based with role-based access control |
| Email             | SMTP (Gmail)                             |
| AI Integration    | Google GenAI (Gemini) for image analysis |
| Containerization  | Docker Compose                           |
| Version Control   | Git / GitHub                             |
| Code Formatting   | Prettier                                 |
| IDE (Recommended) | VS Code                                  |
