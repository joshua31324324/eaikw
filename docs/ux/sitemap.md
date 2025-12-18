# Job Club Information Architecture

## Site Hierarchy

```
/jobclub/
├── index (Home)
│   ├── Hero section with CTA
│   ├── Four pillars overview
│   ├── 6-month timeline
│   └── Career-ready CTA
│
├── onboarding/ (Form + Flow)
│   ├── Form introduction
│   ├── Multi-step form
│   │   ├── Basic info (name, email, year)
│   │   ├── Skills assessment (Python, ML, AI knowledge)
│   │   ├── Goals (target role, timeline)
│   │   ├── Availability (hours per week)
│   │   ├── Interests (areas of focus)
│   │   └── Learning style preference
│   ├── Success confirmation
│   └── Next steps email
│
├── events/ (Event Directory)
│   ├── Event listing (filtered by type, date)
│   │   ├── Workshops (technical skills)
│   │   ├── Office hours (mentorship)
│   │   └── Networking (industry connections)
│   ├── Event detail page
│   │   ├── Event info (date, time, location)
│   │   ├── Speaker bio
│   │   ├── Registration link
│   │   ├── Prerequisites
│   │   └── Similar events
│   ├── Event calendar view
│   └── Registration confirmation
│
├── resources/ (Learning Hub)
│   ├── Resource listing
│   │   ├── Career guides (6 core guides)
│   │   ├── Learning paths (by goal)
│   │   ├── Templates (resume, GitHub, LinkedIn)
│   │   └── Reading list (papers, articles)
│   ├── Resource detail page
│   │   ├── Content
│   │   ├── Related resources
│   │   ├── Download options
│   │   └── Difficulty level
│   ├── Search/filter
│   └── Bookmarking system
│
├── about/ (Program Info)
│   ├── Mission & values
│   ├── Team (mentors, organizers)
│   ├── FAQ
│   │   ├── Program structure
│   │   ├── Commitment required
│   │   ├── Cost & prerequisites
│   │   ├── Timeline questions
│   │   └── Success stories
│   ├── Success stories (testimonials)
│   └── Alumni network
│
├── portfolio/ (Career Guidance)
│   ├── 4 career assets overview
│   │   ├── LinkedIn profile
│   │   │   ├── What to include
│   │   │   ├── Best practices
│   │   │   └── Template example
│   │   ├── GitHub portfolio
│   │   │   ├── Repository showcase
│   │   │   ├── README templates
│   │   │   └── Project examples
│   │   ├── Personal portfolio site
│   │   │   ├── Design inspiration
│   │   │   ├── Tools & templates
│   │   │   └── Example sites
│   │   └── Calendly availability
│   │       ├── Setup guide
│   │       ├── Types of meetings
│   │       └── Integration guide
│   ├── Portfolio checklist
│   └── Career-ready guide
│
├── privacy/ (Legal)
│   ├── Data collection policy
│   ├── GDPR rights
│   ├── Cookie information
│   ├── Third-party integrations
│   └── Contact for data requests
│
└── [Future Expansion]
    ├── /community (Discord integration)
    ├── /opportunities (Job board)
    ├── /mentors (Mentor directory)
    ├── /showcase (Student portfolios)
    └── /alumni (Graduate stories)
```

---

## Page Overview

### 1. Home (/jobclub/)
**Purpose:** Convert visitors into students through clarity and inspiration

**Key Elements:**
- Hero with 6-month promise
- Four pillars explainer (visual cards)
- Timeline visualization
- Social proof (number of students)
- Clear CTA to onboarding
- Footer with quick links

**Content Type:** Inspirational + Informational
**Load Time Target:** < 2s
**Mobile:** Fully responsive, touch-friendly buttons

---

### 2. Onboarding (/jobclub/onboarding/)
**Purpose:** Capture student info, assess skills, provide personalized path

**Key Elements:**
- Welcome message
- Multi-step form (6 sections)
- Progress indicator
- Input validation (real-time feedback)
- Success confirmation
- Email confirmation with next steps

**Content Type:** Interactive form
**Expected Completion:** 15-30 minutes
**Validation:** 
- Required fields clearly marked
- Email validation
- At least one skill selected
- One goal stated

---

### 3. Events (/jobclub/events/)
**Purpose:** Show available events and drive attendance

**Key Elements:**
- Event cards (date, time, type, speaker)
- Filter/sort (by type, date, level)
- Calendar view
- Event detail page (full info, speaker bio, register button)
- Registration confirmation

**Content Type:** Dynamic event listing + detailed pages
**Update Frequency:** Weekly
**API Integration:** Pull from Sanity CMS

---

### 4. Resources (/jobclub/resources/)
**Purpose:** Provide learning materials and career guidance

**Key Elements:**
- Resource cards (title, description, type, time estimate)
- Filter by: type, level, time commitment
- Resource detail pages (full content, downloads, related resources)
- Search functionality
- Download/bookmark options

**Content Type:** Educational + Templates
**Formats:** Articles, videos, templates, guides
**Maintained By:** Job Club coordinators

---

### 5. About (/jobclub/about/)
**Purpose:** Explain program, build trust, answer questions

**Key Elements:**
- Mission statement
- How it works (visual explanation)
- Team bios (mentors, organizers)
- FAQ section
- Success stories (quotes + photos)
- Contact information

**Content Type:** Educational + Social proof
**Frequency:** Updated quarterly with new team members
**Alumni Stories:** Refreshed monthly

---

### 6. Portfolio (/jobclub/portfolio/)
**Purpose:** Guide students to build career-ready portfolio

**Key Elements:**
- Four assets overview (visual cards)
- Detailed guides for each asset
- Templates and examples
- Step-by-step checklists
- Career-ready confirmation

**Content Type:** Instructional + Templates
**Design:** Progressive disclosure (overview → detail)
**Examples:** Real student/professional portfolios

---

### 7. Privacy (/jobclub/privacy/)
**Purpose:** Transparent data practices, GDPR compliance

**Key Elements:**
- Data collection policy
- Data usage explanation
- GDPR rights section
- Cookie information
- Third-party integration disclosures
- Contact for data requests/issues

**Content Type:** Legal + Transparent
**Compliance:** GDPR, CCPA, FERPA (student data)
**Update Frequency:** When integrations change

---

## Navigation Structure

### Primary Navigation (Header)
```
Logo                Home  Events  Resources  About  Portfolio  Privacy
(links to /jobclub/)
```

**Mobile:** Hamburger menu with same options

### Secondary Navigation (In Content)
- Events: Type filter, date range, level
- Resources: Category, time, difficulty
- About: Team/FAQ tabs or smooth scroll anchors

### Footer Navigation
- Quick Links: Home, Onboarding, Resources, Privacy
- Social: Discord, LinkedIn, Email
- Legal: Privacy, Terms (if applicable)
- Contact: Email, feedback form

---

## User Flow Diagrams

### Student Onboarding Flow
```
Home Page
    ↓
   Click "Start Onboarding"
    ↓
Onboarding Form
    ├─ Basic Info
    ├─ Skills Assessment
    ├─ Goals
    ├─ Availability
    └─ Learning Preferences
    ↓
Success Page
    ↓
Confirmation Email + Personalized Path
    ↓
Directed to Events/Resources Based on Path
```

### Event Discovery Flow
```
Home Page
    ↓
Click "View Events"
    ↓
Events Listing
    ├─ Filter by type, date, level
    └─ View calendar
    ↓
Click Event Card
    ↓
Event Detail Page
    ├─ Full info
    ├─ Speaker bio
    └─ Register button
    ↓
Registration Confirmation
```

### Resource Learning Flow
```
Personalized Path (from onboarding)
    ↓
Resources Hub
    ├─ View recommended path
    └─ Browse all resources
    ↓
Click Resource
    ↓
Resource Detail Page
    ├─ Read/watch content
    ├─ Download template
    └─ Mark complete
    ↓
Progress tracking updated
```

### Portfolio Building Flow
```
Month 4+ Progress
    ↓
Portfolio Page
    ├─ Review 4 assets
    └─ Choose starting point
    ↓
Asset Guide Page
    ├─ Step-by-step instructions
    ├─ Templates
    └─ Examples
    ↓
Student implements
    ↓
Share in Discord
    ↓
Receive feedback from community
```

---

## Information Design Principles

### Page Layout Pattern
```
[HEADER: Logo + Nav]

[HERO/INTRO SECTION]
Large typography, clear heading, engaging visuals

[CONTENT SECTIONS]
Alternating: Text/Image blocks
Use of white space for breathing room
Progressive complexity (simple → detailed)

[CALL TO ACTION]
Clear, visible button with next steps

[FOOTER]
Links, social, contact info
```

### Content Organization
- **Hierarchy:** H1 > H2 > H3 (clear nesting)
- **Chunking:** Information in digestible sections
- **Scannability:** Bullet points, bold keywords
- **Progression:** Simple concepts first, advanced later

### Visual Hierarchy
- **Size:** Largest = most important
- **Color:** Brand colors for CTAs and emphasis
- **Whitespace:** Separates sections
- **Typography:** Bold for headings, regular for body

---

## Content Strategy

### Voice & Tone
- **Professional but approachable** - "I'm an expert, but I'm here to help"
- **Encouraging** - "You can do this"
- **Clear** - No jargon, explain terms
- **Authentic** - Real student stories, honest about challenges

### Content Pillars
1. **Career Clarity** - Help students understand AI jobs
2. **Practical Skills** - How to actually learn and build
3. **Community** - You're not alone in this
4. **Inspiration** - Success stories and possibilities

### Tone by Page
| Page | Tone | Example |
|------|------|---------|
| Home | Inspiring, energetic | "Turn your AI passion into a career in 6 months" |
| Onboarding | Supportive, clear | "Let's build your personalized path" |
| Events | Welcoming, specific | "Join 40+ students learning about RAG in production" |
| Resources | Helpful, practical | "Everything you need to build a GitHub portfolio employers love" |
| About | Warm, authentic | "Meet the people helping you succeed" |
| Portfolio | Encouraging, step-by-step | "Your portfolio is your voice—let's amplify it" |

---

## Technical Specifications

### Responsive Breakpoints
- **Mobile:** < 640px (phones, small tablets)
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px
- **Wide:** > 1440px

### Performance Targets
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **Time to Interactive:** < 3.5s

### Accessibility (WCAG 2.1 AA)
- ✅ Color contrast: 4.5:1 for text
- ✅ Keyboard navigation: Full support
- ✅ Screen reader: Proper semantic HTML
- ✅ ARIA labels: All interactive elements
- ✅ Form validation: Clear error messages

### SEO
- Meta descriptions on all pages
- Proper heading hierarchy (H1 per page)
- Image alt text (all images)
- Mobile-friendly design
- Fast load times
- Internal linking strategy

---

## Analytics Tracking Points

### Page-Level Events
- page_view: Every page
- home_viewed: Home page
- form_viewed: Onboarding form
- form_started: First field focused
- form_submitted: Successful submission
- form_error: Validation error shown

### Interaction Events
- button_clicked: All buttons tracked
- link_clicked: External links tracked
- event_registered: Event signup
- resource_downloaded: Template download
- search_performed: Resource search

### Engagement Events
- scroll_depth: 25%, 50%, 75%, 100%
- time_on_page: Page duration
- video_played: Resource video
- form_field_focused: Engagement tracking

---

## Future Expansion Architecture

These pages are designed for future additions:

### Community (/jobclub/community/)
- Discord integration or embedded discussions
- Study group matching
- Peer-to-peer questions

### Opportunities (/jobclub/opportunities/)
- Curated job/internship board
- Alumni company highlights
- Application resources

### Mentors (/jobclub/mentors/)
- Mentor directory
- Booking calendar integration
- Mentor profiles and expertise

### Showcase (/jobclub/showcase/)
- Student portfolio gallery
- Project highlights
- Success stories

### Alumni (/jobclub/alumni/)
- Grad tracking
- Alumni testimonials
- Alumni mentor program

---

## Content Maintenance Schedule

| Page | Owner | Frequency | Updates |
|------|-------|-----------|---------|
| Home | Coordinator | Quarterly | Stats, testimonial |
| Onboarding | Tech Lead | Monthly | Form validation, paths |
| Events | Event Manager | Weekly | New events, cancellations |
| Resources | Content Team | Biweekly | New guides, refreshes |
| About | Coordinator | Quarterly | Team updates, FAQ |
| Portfolio | Career Coach | Monthly | Examples, best practices |
| Privacy | Legal/Coordinator | As needed | Compliance updates |

