# Events System Wireframe – Job Club

## Header

- **Logo:** Top-left wordmark “Job Club”.
- **Navigation:** Home | Onboarding | Events | Resources | Portfolio | Privacy.
- **Accessibility:** High contrast, skip-to-content link, keyboard focus visible.

---

## Events Listing Page

- **Section Title:** Upcoming Events
- **Event Categories:**
  - Workshops
  - Office hours
  - Meetups
  - Guest speakers
  - Hack nights
- **Event Cards (repeated for each event):**
  - Title
  - Date/time
  - Short description
  - CTA Button: [View Details]
- **Actions:**
  - [See All Events] button
  - Filter by category (dropdown or tabs)

---

## Event Details Page

- **Content:**
  - Title
  - Description
  - Date/time
  - Location or Zoom link
  - CTA Button: [Add to Calendar]
- **Optional Speaker Section:**
  - Speaker name
  - Bio
  - Links (LinkedIn, portfolio, etc.)
- **Actions:**
  - [Register] button (if applicable)
  - [Back to Events] link

---

## Event Management in Sanity CMS

- **Schemas:**
  - `event`
    - Title
    - Description
    - Date/time
    - Location/Zoom link
    - Category (workshop, office hours, meetup, guest speaker, hack night)
    - Speaker reference (optional)
  - `speaker`
    - Name
    - Bio
    - Links (LinkedIn, GitHub, portfolio)

---

## Analytics Integration

- **Metrics to Track:**
  - Page views (events listing + event detail)
  - Event clicks (View Details, Add to Calendar, Register)
  - Registrations
- **Compliance:**
  - GDPR-compliant analytics
  - Cookie consent banner required before tracking
  - Opt-in/opt-out preferences stored

---

## Footer

- **Links:** Privacy policy, accessibility, contact.
- **GDPR:** Cookie banner with Accept, Reject, Preferences; analytics load only after consent.
- **Accessibility:** ARIA labels, semantic landmarks, keyboard navigation confirmed.
