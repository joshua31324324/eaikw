# Web Analytics Platform Evaluation

## Executive Summary

This document evaluates web analytics platforms suitable for Job Club. Our priority is **privacy-first analytics** that comply with GDPR and don't require cookie consent for basic functionality.

## Evaluation Criteria

- **GDPR Compliance**: No third-party cookies, data residency options
- **Student Privacy**: Hashing user IPs, no personal data collection
- **Feature Set**: Page views, event tracking, UTM support
- **Cost**: Free tier or low-cost options
- **Implementation**: Easy integration, no build step needed
- **Vendor Risk**: Open source or established companies

## Platform Comparison

### 1. **Plausible Analytics** ⭐ RECOMMENDED

| Aspect | Details |
|--------|---------|
| **GDPR** | ✅ Full compliance, GDPR-by-design, no cookies |
| **Privacy** | ✅ Hash IPs, lightweight (1.5KB script) |
| **Features** | ✅ Page views, events, UTMs, referrers |
| **Cost** | Free for development, $9/month production (~10k views) |
| **Setup** | One-line script include |
| **Open Source** | ❌ No, but transparent |

**Strengths:**
- Fully GDPR compliant without cookie banner
- Lightweight and fast (1.5KB)
- Real-time dashboard
- Email reports
- No data sampling

**Weaknesses:**
- Paid only (no free tier for production)
- Limited advanced features
- Smaller community

**Integration:**
```html
<script defer data-domain="jobclub.njit.edu" src="https://plausible.io/js/script.js"></script>
```

---

### 2. **Fathom Analytics**

| Aspect | Details |
|--------|---------|
| **GDPR** | ✅ Full compliance, cookieless |
| **Privacy** | ✅ Hash IPs, no personal data |
| **Features** | ✅ Page views, events, UTMs, goals |
| **Cost** | Free for development, $19/month production |
| **Setup** | One-line script include |
| **Open Source** | ❌ No |

**Strengths:**
- GDPR compliant, no consent needed
- Lightweight (1.1KB)
- Beautiful dashboard
- Detailed documentation
- Zapier integration support

**Weaknesses:**
- More expensive ($19/month minimum)
- Limited free tier
- Smaller platform

**Integration:**
```html
<script src="https://cdn.usefathom.com/script.js" data-site="XXXXX" defer></script>
```

---

### 3. **Umami** (Open Source) ⭐ ALTERNATIVE

| Aspect | Details |
|--------|---------|
| **GDPR** | ✅ Full compliance, self-hosted option |
| **Privacy** | ✅ Open source, optional hashing |
| **Features** | ✅ Page views, events, UTMs, custom events |
| **Cost** | Free open source, $10/month managed |
| **Setup** | One-line script include |
| **Open Source** | ✅ Yes, MIT license |

**Strengths:**
- Open source (can self-host or use managed)
- Fully GDPR compliant
- Lightweight (2.4KB)
- No cookie consent required
- Affordable managed hosting

**Weaknesses:**
- Smaller community
- Managed hosting could be unreliable
- Less polished UI than commercial options

**Integration:**
```html
<script async src="https://umami-analytics.example.com/script.js" data-website-id="xxxxx"></script>
```

---

### 4. **Simple Analytics**

| Aspect | Details |
|--------|---------|
| **GDPR** | ✅ Full compliance, cookieless |
| **Privacy** | ✅ Hash IPs, no personal data |
| **Features** | ✅ Page views, events, referrers |
| **Cost** | Free for development, €12/month minimum |
| **Setup** | One-line script include |
| **Open Source** | ❌ No |

**Strengths:**
- GDPR compliant
- Simple, clean dashboard
- EU-based company
- No cookie needed

**Weaknesses:**
- Limited features
- European pricing
- Smaller platform
- Limited integrations

---

### 5. Google Analytics 4 (NOT RECOMMENDED)

| Aspect | Details |
|--------|---------|
| **GDPR** | ⚠️ Requires consent in EU |
| **Privacy** | ⚠️ Third-party cookies, data sharing |
| **Features** | ✅ Comprehensive feature set |
| **Cost** | ✅ Free |
| **Setup** | Requires GTM or custom code |
| **Open Source** | ❌ No |

**Weaknesses:**
- Requires explicit GDPR cookie consent
- Google data collection practices
- Over-engineered for Job Club's needs
- Complex setup
- Data residency concerns in EU

---

## Implementation Recommendation

### Primary Choice: **Plausible Analytics**

**Why Plausible:**
1. **Privacy-First**: No cookies, no consent needed
2. **GDPR Compliant**: Already complies with GDPR by design
3. **Lightweight**: Only 1.5KB JavaScript
4. **Easy Setup**: One-line script in base layout
5. **Job Club Scale**: $9/month covers up to 50k monthly pageviews
6. **Professional**: Used by companies worldwide

**Cost Impact:**
- Development: Free
- Production: $9/month (10k monthly sessions) or $19/month (100k sessions)
- Total annual: ~$108-$228

**Integration Steps:**
1. Sign up at https://plausible.io
2. Add domain: jobclub.njit.edu
3. Copy script URL
4. Add to `src/_layouts/base.njk` (after cookie consent logic)
5. Test with Plausible dashboard

---

## Cookie Banner Interaction

Since **Plausible doesn't require consent**, the cookie banner:
- ✅ Shows notification to comply with cookie transparency
- ✅ Allows users to reject analytics if preferred
- ❌ Doesn't block Plausible by default

For GDPR compliance, we'll respect the user's analytics preference and wrap Plausible in a consent check.

---

## Alternative: Umami (If Self-Hosting)

If we want to avoid third-party vendor lock-in:
1. Self-host Umami on existing server
2. Zero ongoing cost
3. Full control of data
4. More complex setup

This is recommended if NJIT has infrastructure preference for self-hosting.

---

## Tracking Implementation

### Events to Track:

1. **Form Interactions:**
   - onboarding_form_viewed
   - onboarding_form_started
   - onboarding_form_completed
   - onboarding_form_error

2. **Navigation:**
   - events_list_viewed
   - resources_list_viewed
   - portfolio_guide_viewed

3. **Event Registration:**
   - event_registration_clicked
   - event_registration_confirmed

4. **Resource Engagement:**
   - resource_guide_opened
   - resource_template_downloaded

### Implementation in Code:

```javascript
// Track event in Plausible
function trackEvent(eventName, properties = {}) {
  if (window.plausible) {
    window.plausible(eventName, { props: properties });
  }
}

// Examples:
trackEvent('form_submitted', { form: 'onboarding' });
trackEvent('event_registered', { eventId: '123' });
```

---

## Rollout Plan

**Week 1:**
- [ ] Evaluate Plausible vs Umami with team
- [ ] Get approval for analytics cost ($9-19/month)

**Week 2:**
- [ ] Set up Plausible account
- [ ] Update privacy policy with Plausible disclosure
- [ ] Integrate script in base layout

**Week 3:**
- [ ] Add event tracking to forms
- [ ] Test analytics dashboard
- [ ] Set up email reports

**Week 4:**
- [ ] Monitor initial data
- [ ] Adjust events if needed
- [ ] Create analytics dashboard screenshots for QA report

---

## GDPR + Privacy Compliance Checklist

With Plausible Analytics:
- ✅ No third-party cookies set
- ✅ IP addresses hashed immediately
- ✅ User consent NOT required
- ✅ Data residency in EU (GDPR-friendly)
- ✅ Complies with EULA for NJIT student data
- ✅ Clear privacy policy disclosure
- ✅ User can opt-out via analytics preference

---

## Conclusion

**Recommendation: Implement Plausible Analytics**

This provides privacy-first analytics that are fully GDPR compliant, require no cookie consent, and fit Job Club's needs perfectly. The cost is minimal ($9-19/month) for the value provided.

For enhanced privacy, Umami self-hosted is a strong alternative if NJIT wants to maintain data sovereignty.

---

### Option 4: Matomo

**Pros:**
- Self-hosted option
- GDPR compliant

**Cons:**
- More complex setup

**Status:** *To be evaluated*

---

### Option 5: Cloudflare Web Analytics

**Pros:**
- Privacy-focused
- Free tier available
- Easy setup

**Cons:**
- Requires Cloudflare

**Status:** *To be evaluated*

---

### Option 6: Umami

**Pros:**
- Open source
- GDPR compliant
- Self-hosted option

**Cons:**
- Requires hosting

**Status:** *To be evaluated*

---

## Recommendation

*To be completed*

**Selected Platform:** 

**Justification:**

---

## Implementation Details

### GDPR Consent Mode
*To be completed*

### Tracking Setup

- Page views: *To be completed*
- Onboarding form views: *To be completed*
- Event clicks: *To be completed*
