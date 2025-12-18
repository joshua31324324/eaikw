# Onboarding Workflow Wireframe – Job Club

## Header

- **Logo:** Top-left wordmark “Job Club”.
- **Navigation:** Home | Onboarding | Events | Resources | Portfolio | Privacy.
- **Accessibility:** High contrast, skip-to-content link, keyboard focus visible.

---

## Step 1: Onboarding Form (Front-End)

- **Form Fields:**
  - Name
  - Email
  - Major / Graduation year
  - LinkedIn URL
  - GitHub URL
  - Personal portfolio site (optional, with reference example)
  - Calendly link
  - Career goal (consultant, startup founder, SWE, product manager, data scientist, etc.)
- **CTA Button:** [Submit Onboarding Form]

---

## Step 2: Sanity CMS Storage (Back-End)

- **Data Saved as `memberProfile`:**
  - Personal info
  - Career goal
  - URLs provided
  - Onboarding status (new, in-progress, completed)
  - Timestamp
  - Flags for missing prerequisites (LinkedIn, GitHub, portfolio, Calendly)

---

## Step 3: Automated Personalized Checklist

- **System Actions:**
  - Identify missing professional assets.
  - Generate personalized checklist.
  - Send onboarding email via automation (Zapier/Make).
- **Checklist Example:**
  - Create LinkedIn profile → link to “Optimize LinkedIn for AI Jobs”.
  - Build GitHub repo → link to “GitHub Profile Starter Guide”.
  - Set up Calendly → link to “Calendly Setup Guide”.
  - Create personal site → link to “Portfolio Starter Template”.
- **CTA Button:** [Mark Task Complete]

---

## Step 4: Confirmation Screen

- **Message:** “Welcome to Job Club! You’re now in the pipeline.”
- **Checklist Display:** Shows completed vs. missing assets.
- **CTA Buttons:**
  - [Join Discord Community]
  - [Explore Events]
  - [View Resources]

---

## Step 5: Discord Integration

- **Automated Actions:**
  - Add student to CRM.
  - Post intro message in `#jobclub-intros`.
  - *(Optional)* Assign Discord `@Member` role.

---

## Footer

- **Links:** Privacy policy, accessibility, contact.
- **GDPR:** Cookie banner with Accept, Reject, Preferences; analytics load only after consent.
- **Accessibility:** ARIA labels, semantic landmarks, keyboard navigation confirmed.
