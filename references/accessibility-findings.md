# Accessibility Findings (WCAG 2.1 Quick Reference)

## Principle 1 - Perceivable

Information and user interface components must be presentable to users in ways they can perceive.

### Text Alternatives

- **1.1.1 Non-text Content (Level A):** Provide text alternatives for all non-text content.  
- Ensures compatibility with screen readers, braille, and alternative formats.

### Time-based Media

- **1.2.2 Captions (Prerecorded, Level A):** Captions required for prerecorded audio in synchronized media.  
- **1.2.4 Captions (Live, Level AA):** Captions required for live audio content.  
- **1.2.5 Audio Description (Level AA):** Audio description required for prerecorded video.

### Adaptable Content

- **1.3.1 Info and Relationships (Level A):** Structure and relationships must be programmatically determinable.  
- **1.3.4 Orientation (Level AA):** Content must not restrict view to a single orientation.  
- **1.3.5 Identify Input Purpose (Level AA):** Input field purposes must be programmatically determinable.

### Distinguishable

- **1.4.3 Contrast (Minimum, Level AA):** Text contrast ratio ≥ 4.5:1.  
- **1.4.10 Reflow (Level AA):** Content must reflow without loss of information at 400% zoom.  
- **1.4.11 Non-text Contrast (Level AA):** Non-text elements must have contrast ratio ≥ 3:1.  
- **1.4.12 Text Spacing (Level AA):** No loss of content when users adjust text spacing.  
- **1.4.13 Content on Hover or Focus (Level AA):** Additional content triggered by hover/focus must be dismissible, hoverable, and persistent.

---

## Principle 2 - Operable

User interface components and navigation must be operable.

### Keyboard Accessibility

- **2.1.1 Keyboard (Level A):** All functionality operable via keyboard.  
- **2.1.2 No Keyboard Trap (Level A):** Focus must be movable away using keyboard only.  
- **2.1.4 Character Key Shortcuts (Level A):** Must be remappable or disableable.

### Enough Time

- **2.2.1 Timing Adjustable (Level A):** Users must be able to adjust or disable time limits.  
- **2.2.2 Pause, Stop, Hide (Level A):** Moving/blinking content must be controllable.

### Seizures and Physical Reactions

- **2.3.1 Three Flashes or Below Threshold (Level A):** No content flashes more than 3 times per second.

### Navigable

- **2.4.2 Page Titled (Level A):** Pages must have descriptive titles.  
- **2.4.3 Focus Order (Level A):** Focus order must preserve meaning and operability.  
- **2.4.6 Headings and Labels (Level AA):** Headings and labels must describe purpose.  
- **2.4.7 Focus Visible (Level AA):** Keyboard focus indicator must be visible.

### Input Modalities

- **2.5.1 Pointer Gestures (Level A):** Multipoint gestures must have single-pointer alternatives.  
- **2.5.3 Label in Name (Level A):** Visible labels must match accessible names.  
- **2.5.8 Target Size (Minimum, Level AA):** Pointer targets must be at least 24x24 CSS pixels.

---

## Principle 3 - Understandable

Information and operation of the user interface must be understandable.

### Readable

- **3.1.1 Language of Page (Level A):** Default language must be programmatically determinable.  
- **3.1.2 Language of Parts (Level AA):** Language of passages must be determinable.

### Predictable

- **3.2.1 On Focus (Level A):** Focus must not trigger unexpected context changes.  
- **3.2.3 Consistent Navigation (Level AA):** Navigation mechanisms must be consistent across pages.  
- **3.2.4 Consistent Identification (Level AA):** Components with same functionality must be identified consistently.

---

## Principle 4 - Robust

Content must be robust enough to work with current and future user agents, including assistive technologies.

- **4.1.1 Parsing (Level A):** Content must be parsed correctly by user agents.  
- **4.1.2 Name, Role, Value (Level A):** UI components must expose name, role, and value programmatically.  
- **4.1.3 Status Messages (Level AA):** Status messages must be programmatically determinable without focus.

---

## Key Accessibility Takeaways

- **Text alternatives and captions** are critical for perceivability.  
- **Keyboard accessibility and focus management** ensure operability.  
- **Contrast, reflow, and text spacing** are essential for readability.  
- **Consistent navigation and predictable behavior** improve usability.  
- **Robust markup and ARIA roles** ensure compatibility with assistive technologies.
