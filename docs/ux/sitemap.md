# Job Club - Sitemap & Information Architecture

## Sitemap

- **Home**
  - Mission statement + CTA (Join Job Club)
  - Upcoming events preview
  - Featured resources
  - Discord/CRM integration links
  - Footer (Privacy, Accessibility, Contact)

- **Onboarding Workflow**
  - Onboarding Form
    - Name, Email, Major/Grad Year
    - LinkedIn, GitHub, Portfolio, Calendly
    - Career Goal
  - Personalized Checklist (missing assets + guides)
  - Confirmation screen + Discord intro automation

- **Events**
  - Events Listing Page
    - Workshops
    - Office Hours
    - Meetups
    - Guest Speakers
    - Hack Nights
  - Event Detail Page
    - Title, Description, Date/Time
    - Location/Zoom link
    - “Add to Calendar” button

- **Resources**
  - Resource Library
    - Guides (LinkedIn optimization, GitHub profile building, Calendly setup, etc.)
    - Templates
  - Resource Detail Page
    - Title, Content body, Author attribution

- **Portfolio Guidance**
  - Model student portfolio showcase
  - Portfolio checklist
  - Templates/examples

- **Privacy & Compliance**
  - GDPR Cookie Banner
  - Privacy Policy Page
    - Data collection
    - Use of Zapier/CRM integrations
    - Storage + deletion policy
    - Cookies + analytics

---

## Information Architecture

### Content Models (Sanity CMS Schemas)

- **memberProfile**
  - Personal info (name, email, major, grad year)
  - Career goal
  - URLs (LinkedIn, GitHub, portfolio, Calendly)
  - Onboarding status (new, in-progress, completed)
  - Timestamp
  - Flags for missing prerequisites

- **event**
  - Title
  - Description
  - Date/time
  - Location/Zoom link
  - Speaker (optional)

- **resource**
  - Title
  - Description
  - Content body
  - Author reference

- **author**
  - Name
  - Bio
  - Links (LinkedIn, GitHub, portfolio)

### Navigation Map

- **Top Navigation:** Home | Onboarding | Events | Resources | Portfolio | Privacy  
- **Footer Navigation:** Contact | Discord | CRM | Accessibility Policy | GDPR Consent

---
