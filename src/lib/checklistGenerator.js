/**
 * Personalized Checklist Generator
 * Analyzes member data and generates personalized action items
 */

export class ChecklistGenerator {
  /**
   * Detect missing professional assets based on member data
   * @param {Object} memberData - Member profile data from form
   * @returns {Object} Analysis with missing assets and checklist
   */
  static analyzeMemberProfile(memberData) {
    const missing = [];
    const assets = {
      linkedin: { hasValue: !!memberData.linkedinUrl, priority: 'critical' },
      github: { hasValue: !!memberData.githubUrl, priority: 'critical' },
      portfolio: { hasValue: !!memberData.portfolioUrl, priority: 'recommended' },
      calendly: { hasValue: !!memberData.calendlyUrl, priority: 'recommended' },
    };

    // Identify missing assets
    if (!assets.linkedin.hasValue) {
      missing.push({
        asset: 'LinkedIn Profile',
        priority: 'critical',
        guide: '/resources#linkedin-guide',
        estimatedTime: '20-30 minutes',
        description: 'Professional network profile with your career path and skills',
      });
    }

    if (!assets.github.hasValue) {
      missing.push({
        asset: 'GitHub Profile/Portfolio',
        priority: 'critical',
        guide: '/resources#github-guide',
        estimatedTime: '30-45 minutes',
        description: 'Showcase your coding projects and contributions',
      });
    }

    if (!assets.portfolio.hasValue) {
      missing.push({
        asset: 'Personal Portfolio Website',
        priority: 'recommended',
        guide: '/resources#portfolio-templates',
        estimatedTime: '2-4 hours',
        description: 'Display your best work and tell your professional story',
      });
    }

    if (!assets.calendly.hasValue) {
      missing.push({
        asset: 'Calendly or Scheduling Link',
        priority: 'recommended',
        guide: '/resources#calendly-setup',
        estimatedTime: '10-15 minutes',
        description: 'Make it easy for mentors and employers to book time with you',
      });
    }

    return {
      memberId: memberData._id,
      name: memberData.name,
      email: memberData.email,
      careerGoal: memberData.careerGoal,
      missingAssets: missing,
      completionEstimate: this.calculateCompletionTime(missing),
      checklist: this.generateChecklist(memberData, missing),
    };
  }

  /**
   * Calculate estimated time to complete all missing assets
   * @param {Array} missingAssets - Array of missing asset objects
   * @returns {string} Human-readable estimate
   */
  static calculateCompletionTime(missingAssets) {
    const critical = missingAssets.filter((a) => a.priority === 'critical');
    const recommended = missingAssets.filter((a) => a.priority === 'recommended');

    if (critical.length === 0 && recommended.length === 0) {
      return 'None - you\'re all set!';
    }

    // Critical items: 30-45 mins each
    // Recommended items: 10-15 mins each
    const criticalTime = critical.length * 37.5; // midpoint
    const recommendedTime = recommended.length * 12.5; // midpoint
    const totalMinutes = criticalTime + recommendedTime;

    if (totalMinutes < 60) {
      return `About ${Math.round(totalMinutes)} minutes`;
    } else {
      const hours = Math.ceil(totalMinutes / 60);
      return `${hours}-${hours + 1} hours`;
    }
  }

  /**
   * Generate personalized action checklist
   * @param {Object} memberData - Member profile data
   * @param {Array} missingAssets - Missing assets array
   * @returns {Object} Structured checklist
   */
  static generateChecklist(memberData, missingAssets) {
    const checklist = {
      urgent: [],
      thisWeek: [],
      thisMonth: [],
      longTerm: [],
    };

    // Critical assets (do ASAP)
    const criticalAssets = missingAssets.filter((a) => a.priority === 'critical');
    if (criticalAssets.length > 0) {
      checklist.urgent.push({
        title: 'Complete Critical Professional Assets',
        items: criticalAssets.map((asset) => ({
          task: asset.asset,
          description: asset.description,
          guide: asset.guide,
          time: asset.estimatedTime,
        })),
        reason: 'Required for most job applications and networking opportunities',
      });
    }

    // Recommended assets
    const recommendedAssets = missingAssets.filter((a) => a.priority === 'recommended');
    if (recommendedAssets.length > 0) {
      checklist.thisWeek.push({
        title: 'Build Optional but Impressive Assets',
        items: recommendedAssets.map((asset) => ({
          task: asset.asset,
          description: asset.description,
          guide: asset.guide,
          time: asset.estimatedTime,
        })),
        reason: 'These significantly boost your profile and stand out to employers',
      });
    }

    // Community engagement
    checklist.thisWeek.push({
      title: 'Get Involved in Job Club',
      items: [
        {
          task: 'Join Discord Community',
          description: 'Connect with peers and mentors',
          link: 'DISCORD_SERVER_LINK',
        },
        {
          task: 'Introduce Yourself',
          description: 'Post in #introductions channel',
          link: 'DISCORD_SERVER_LINK',
        },
        {
          task: 'Attend Your First Event',
          description: 'Check events page for upcoming workshops and networking',
          link: '/jobclub/events',
        },
      ],
    });

    // Career-specific guidance
    const careerTasks = this.getCareerSpecificTasks(memberData.careerGoal);
    if (careerTasks) {
      checklist.thisMonth.push(careerTasks);
    }

    // Long-term goals
    checklist.longTerm.push({
      title: 'Professional Growth Path',
      items: [
        {
          task: 'Schedule Mentor Session',
          description: 'Get personalized guidance on your career path',
        },
        {
          task: 'Build Projects',
          description: 'Create portfolio pieces demonstrating your skills',
        },
        {
          task: 'Network Actively',
          description: 'Attend industry events and connect on LinkedIn',
        },
        {
          task: 'Apply to Opportunities',
          description: 'Start applying for internships or jobs',
        },
      ],
    });

    return checklist;
  }

  /**
   * Get career-goal-specific tasks and resources
   * @param {string} careerGoal - Career goal from form
   * @returns {Object|null} Career-specific tasks or null
   */
  static getCareerSpecificTasks(careerGoal) {
    const careerTasks = {
      'ai-engineer': {
        title: 'AI Software Engineer Path',
        items: [
          {
            task: 'Learn Core ML Libraries',
            description: 'PyTorch, TensorFlow, or JAX',
            guide: '/resources#ml-frameworks',
          },
          {
            task: 'Complete ML Projects',
            description: 'Build and deploy at least 2 projects',
            guide: '/resources#project-ideas',
          },
          {
            task: 'Study System Design',
            description: 'For scaling ML models in production',
            guide: '/resources#system-design',
          },
        ],
      },
      'data-scientist': {
        title: 'Data Scientist Path',
        items: [
          {
            task: 'Master Data Analysis Tools',
            description: 'SQL, Python Pandas, Tableau or Power BI',
            guide: '/resources#data-tools',
          },
          {
            task: 'Work with Real Datasets',
            description: 'Kaggle competitions or own data projects',
            guide: '/resources#datasets',
          },
          {
            task: 'Learn Statistics',
            description: 'Statistical testing, A/B testing, causal inference',
            guide: '/resources#statistics',
          },
        ],
      },
      'product-manager': {
        title: 'Product Manager Path',
        items: [
          {
            task: 'Study Product Strategy',
            description: 'Read books like Inspired or Empowered',
            guide: '/resources#product-books',
          },
          {
            task: 'Analyze AI Products',
            description: 'Evaluate ChatGPT, Claude, Copilot - what works and why',
            guide: '/resources#ai-products',
          },
          {
            task: 'Practice Product Thinking',
            description: 'Write PRDs and do product analysis',
            guide: '/resources#prd-templates',
          },
        ],
      },
      'ai-consultant': {
        title: 'AI Consultant Path',
        items: [
          {
            task: 'Understand AI Landscape',
            description: 'Different models, use cases, limitations',
            guide: '/resources#ai-fundamentals',
          },
          {
            task: 'Learn Business Case Analysis',
            description: 'ROI, implementation challenges, organizational change',
            guide: '/resources#business-consulting',
          },
          {
            task: 'Build Soft Skills',
            description: 'Communication, presentation, stakeholder management',
            guide: '/resources#soft-skills',
          },
        ],
      },
      'ai-startup': {
        title: 'AI Startup Founder Path',
        items: [
          {
            task: 'Validate Your Idea',
            description: 'Talk to potential customers, find product-market fit',
            guide: '/resources#startup-validation',
          },
          {
            task: 'Learn Startup Fundamentals',
            description: 'Fundraising, unit economics, growth',
            guide: '/resources#startup-guide',
          },
          {
            task: 'Build an MVP',
            description: 'Minimum Viable Product to test assumptions',
            guide: '/resources#mvp-guide',
          },
        ],
      },
    };

    return careerTasks[careerGoal] || null;
  }

  /**
   * Format checklist for email template
   * @param {Object} analysis - Analysis object from analyzeMemberProfile
   * @returns {string} HTML-formatted checklist
   */
  static formatChecklistForEmail(analysis) {
    let html = '';

    // Missing assets summary
    if (analysis.missingAssets.length > 0) {
      html += `
<section style="margin: 20px 0; padding: 15px; background: #f0f4ff; border-radius: 8px;">
  <h3 style="color: #6366f1; margin-top: 0;">📋 Your Personalized Action Items</h3>
  <p>Estimated completion time: <strong>${analysis.completionEstimate}</strong></p>
  
  <div style="margin-top: 15px;">
`;

      // Critical items
      const critical = analysis.missingAssets.filter((a) => a.priority === 'critical');
      if (critical.length > 0) {
        html += '<h4 style="color: #dc2626; margin: 10px 0;">🔴 Critical (Do ASAP)</h4>';
        critical.forEach((item) => {
          html += `
<div style="margin: 10px 0; padding: 10px; background: white; border-radius: 4px;">
  <strong>${item.asset}</strong> - ${item.estimatedTime}<br>
  <small>${item.description}</small><br>
  <a href="${item.guide}" style="color: #6366f1; text-decoration: none;">→ View Guide</a>
</div>
`;
        });
      }

      // Recommended items
      const recommended = analysis.missingAssets.filter((a) => a.priority === 'recommended');
      if (recommended.length > 0) {
        html += '<h4 style="color: #f59e0b; margin: 15px 0 10px 0;">🟡 Recommended (This Week)</h4>';
        recommended.forEach((item) => {
          html += `
<div style="margin: 10px 0; padding: 10px; background: white; border-radius: 4px;">
  <strong>${item.asset}</strong> - ${item.estimatedTime}<br>
  <small>${item.description}</small><br>
  <a href="${item.guide}" style="color: #6366f1; text-decoration: none;">→ View Guide</a>
</div>
`;
        });
      }

      html += '</div></section>';
    } else {
      html += `
<section style="margin: 20px 0; padding: 15px; background: #f0fdf4; border-radius: 8px;">
  <h3 style="color: #16a34a; margin-top: 0;">✅ You're All Set!</h3>
  <p>Great job having all the essential professional assets in place. Focus on quality and helping other members now!</p>
</section>
`;
    }

    return html;
  }
}

export default ChecklistGenerator;
