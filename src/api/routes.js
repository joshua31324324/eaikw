/**
 * API Routes for Job Club
 * Handles form submissions, event registration, etc.
 *
 * These can be deployed as:
 * - Netlify Functions (functions/ directory)
 * - Vercel Functions
 * - Express routes on a Node.js server
 * - Lambda functions
 */

<<<<<<< HEAD
import SanityClient from "@sanity/client";
import NotionDBIntegration from "../lib/notionIntegration.js";
import DiscordIntegration from "../lib/discordIntegration.js";
import ChecklistGenerator from "../lib/checklistGenerator.js";
=======
import SanityClient from '@sanity/client';
import NotionDBIntegration from '../lib/notionIntegration.js';
import DiscordIntegration from '../lib/discordIntegration.js';
import DiscordIntegrationHelper from '../lib/discordHelper.js';
import ChecklistGenerator from '../lib/checklistGenerator.js';
import ZapierIntegration from '../lib/zapierIntegration.js';
>>>>>>> 6910fe0364c7f57b863cde999ab63e4e8bb8ff37

const sanity = new SanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const notion = new NotionDBIntegration();
const discord = new DiscordIntegration();
const discordHelper = new DiscordIntegrationHelper();
const zapier = new ZapierIntegration();

/**
 * POST /api/onboarding
 * Receives onboarding form submission and creates member profile
 * Triggers personalized checklist and automation workflows
 */
export async function handleOnboarding(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const formData = req.body;

    // Normalize incoming form keys (snake_case -> camelCase)
    const data = normalizeOnboardingData(formData);

    // Validate required fields
    const errors = validateOnboardingForm(data);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Create member profile in Sanity
    const memberProfile = await sanity.create({
      _type: "memberProfile",
      name: data.name,
      email: data.email,
      major: data.major,
      graduationYear: parseInt(data.graduationYear),
      careerGoal: data.careerGoal,
      linkedinUrl: data.linkedinUrl || null,
      githubUrl: data.githubUrl || null,
      portfolioUrl: data.portfolioUrl || null,
      calendlyUrl: data.calendlyUrl || null,
      onboardingStatus: "new",
      joinedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    });

    // Sync to Notion
    await notion.upsertMember(memberProfile);

    // Post to Discord
    await discord.sendWelcomeMessage(memberProfile);
    await discord.postIntroduction(memberProfile);

    // Generate personalized checklist
    const analysis = ChecklistGenerator.analyzeMemberProfile(memberProfile);

<<<<<<< HEAD
    // Trigger Zapier webhook for personalized email automation
    const zapierWebhookUrl = process.env.ZAPIER_ONBOARDING_WEBHOOK;
    if (zapierWebhookUrl) {
      // Fire and forget - don't block response on webhook
      triggerZapierAutomation(zapierWebhookUrl, {
        memberId: memberProfile._id,
        name: memberProfile.name,
        email: memberProfile.email,
        careerGoal: memberProfile.careerGoal,
        missingAssets: analysis.missingAssets,
        completionEstimate: analysis.completionEstimate,
        majorSpecificTasks: analysis.checklist,
      }).catch((error) => {
        console.error("Zapier webhook error (non-blocking):", error);
        // Don't fail the response - the member was created successfully
      });
=======
    // Post to Discord intro channel with enhanced embed
    await discordHelper.postIntroduction(memberProfile);

    // Optionally assign @Member role
    if (memberData.discordUserId) {
      await discordHelper.assignMemberRole(memberData.discordUserId);
>>>>>>> 6910fe0364c7f57b863cde999ab63e4e8bb8ff37
    }

    // Trigger Zapier webhook for personalized email automation
    await zapier.triggerOnboarding(memberProfile, analysis);

    return res.status(201).json({
      success: true,
      message: "Welcome to Job Club! Check your email for next steps.",
      memberId: memberProfile._id,
      personalizationData: {
        missingAssetsCount: analysis.missingAssets.length,
        completionEstimate: analysis.completionEstimate,
      },
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return res.status(500).json({
      error: "Failed to process onboarding",
      details: error.message,
    });
  }
}

/**
 * GET /api/events
 * Fetch all upcoming Job Club events
 */
export async function handleGetEvents(req, res) {
  try {
    const events = await sanity.fetch(`
      *[_type == "event" && status == "published" && dateTime(date) >= dateTime(now())]
      | order(date asc) {
        _id,
        title,
        description,
        eventType,
        date,
        endTime,
        location,
        zoomLink,
        capacity,
        registrationLink,
        tags,
        "speakers": speakers[]->{ _id, name, title, company, bio },
      }
    `);

    return res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({
      error: "Failed to fetch events",
      details: error.message,
    });
  }
}

/**
 * GET /api/resources
 * Fetch career resources by category
 */
export async function handleGetResources(req, res) {
  try {
    const { category } = req.query;

    let query = '*[_type == "resource"]';
    if (category) {
      query += `[category == "${category}"]`;
    }
    query +=
      " | order(publishedAt desc) { _id, title, slug, description, category, difficulty, timeToRead, publishedAt }";

    const resources = await sanity.fetch(query);

    return res.status(200).json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    return res.status(500).json({
      error: "Failed to fetch resources",
      details: error.message,
    });
  }
}

/**
 * POST /api/event-registration
 * Register a member for an event
 */
export async function handleEventRegistration(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { memberEmail, eventId } = req.body;

    if (!memberEmail || !eventId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find member
    const member = await sanity.fetch(
      `*[_type == "memberProfile" && email == "${memberEmail}"][0]`
    );

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    // Update member's registered events (if storing registrations)
    // This is a simplified example; you might want a separate registration document type
    console.log(`Member ${memberEmail} registered for event ${eventId}`);

    return res.status(200).json({
      success: true,
      message: "Successfully registered for event",
    });
  } catch (error) {
    console.error("Event registration error:", error);
    return res.status(500).json({
      error: "Failed to register for event",
      details: error.message,
    });
  }
}

/**
 * Validate onboarding form data
 */
function validateOnboardingForm(data) {
  const errors = [];

  if (!data.name || data.name.trim() === "") {
    errors.push("Name is required");
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push("Valid email is required");
  }

  if (!data.major || data.major.trim() === "") {
    errors.push("Major is required");
  }

  if (!data.graduationYear || isNaN(parseInt(data.graduationYear))) {
    errors.push("Valid graduation year is required");
  }

  if (!data.careerGoal) {
    errors.push("Career goal is required");
  }

  return errors;
}

/**
 * Normalize onboarding form keys from snake_case to camelCase expected by the API
 */
function normalizeOnboardingData(formData) {
  const mapKey = (obj, snake, camel) => obj[camel] ?? obj[snake];

  return {
    name: (formData.name || "").trim(),
    email: (formData.email || "").trim(),
    major: (formData.major || "").trim(),
    graduationYear: mapKey(formData, "graduation_year", "graduationYear"),
    careerGoal: mapKey(formData, "career_goal", "careerGoal"),
    linkedinUrl: mapKey(formData, "linkedin_url", "linkedinUrl") || null,
    githubUrl: mapKey(formData, "github_url", "githubUrl") || null,
    portfolioUrl: mapKey(formData, "portfolio_url", "portfolioUrl") || null,
    calendlyUrl: mapKey(formData, "calendly_url", "calendlyUrl") || null,
  };
}

/**
 * Basic email validation
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

<<<<<<< HEAD
/**
 * Trigger Zapier webhook for personalized automation
 * This sends the member data and personalized checklist to Zapier
 * for email automation, Discord integration, and other workflows
 */
async function triggerZapierAutomation(webhookUrl, data) {
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        ...data,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Zapier webhook failed: ${response.status} ${errorText}`);
    }

    console.log("Zapier automation triggered successfully");
    return await response.json();
  } catch (error) {
    console.error("Error triggering Zapier automation:", error);
    throw error;
  }
}

=======
>>>>>>> 6910fe0364c7f57b863cde999ab63e4e8bb8ff37
export default {
  handleOnboarding,
  handleGetEvents,
  handleGetResources,
  handleEventRegistration,
};
