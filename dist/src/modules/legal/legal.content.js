"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TERMS_HTML = exports.PRIVACY_HTML = void 0;
function page(title, sections) {
    const sectionsHtml = sections
        .map((s) => `
      <div class="section">
        <h2>${s.heading}</h2>
        ${s.body.map((p) => `<p>${p}</p>`).join('\n')}
      </div>`)
        .join('\n');
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — FaithfulMatch</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 720px; margin: 0 auto; padding: 32px 20px 64px; color: #241b33; background: #fbf9ff; }
  h1 { font-size: 26px; margin: 0 0 4px; }
  .updated { font-size: 12px; color: #7a7188; margin: 0 0 28px; }
  .section { background: #fff; border-radius: 14px; padding: 18px 20px; margin-bottom: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
  .section h2 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #6d4aff; margin: 0 0 10px; }
  .section p { font-size: 14.5px; line-height: 1.6; margin: 0 0 10px; }
  .section p:last-child { margin-bottom: 0; }
  .footer { text-align: center; font-size: 12px; color: #a49bb5; padding: 24px 0 0; }
</style>
</head>
<body>
  <h1>${title}</h1>
  <p class="updated">Last updated: July 8, 2026</p>
  ${sectionsHtml}
  <p class="footer">FaithfulMatch.love — Real people. Real commitment.</p>
</body>
</html>`;
}
exports.PRIVACY_HTML = page('Privacy Policy', [
    {
        heading: 'What We Collect',
        body: [
            'Account information: your email address, encrypted password, and verification status.',
            'Profile information you choose to share: name, birthday, gender, denomination, faith background, bio, occupation, city/state, and photos.',
            'Approximate location (city-level) to power distance-based discovery. We never share your exact coordinates with other members.',
            'Activity within the app: likes, matches, messages, event RSVPs, and reports you file.',
        ],
    },
    {
        heading: 'How We Use It',
        body: [
            'To show your profile to potential matches based on mutual preferences.',
            'To power optional AI features (profile coaching, reply suggestions, photo feedback). AI suggestions are only generated when you request them, and are never sent on your behalf without your approval.',
            'To keep the community safe: photo moderation, report review, and enforcement against harassment or fake profiles.',
            'To send you notifications you have enabled (new matches, messages).',
        ],
    },
    {
        heading: 'What We Never Do',
        body: [
            'We never sell your personal data.',
            'We never show your exact location to other members.',
            'We never post to any social account on your behalf.',
            'We never share your private messages with other members or advertisers.',
        ],
    },
    {
        heading: 'Your Controls',
        body: [
            'Pause your profile at any time to hide from discovery (Settings → Pause Profile).',
            'Block or report any member — reports are reviewed by our moderation team.',
            'Delete your account at any time (Settings → Delete Account). This permanently removes your profile, photos, and matches.',
        ],
    },
    {
        heading: 'Data Security',
        body: [
            'Passwords are stored using strong one-way hashing (never in plain text).',
            'All communication with our servers is encrypted in transit.',
            'Access to member data is restricted to authorized moderation staff and is audit-logged.',
        ],
    },
    {
        heading: 'Contact',
        body: ['Questions about your data? Contact us at faithfulmatch@empoweredforwealth.com.'],
    },
]);
exports.TERMS_HTML = page('Terms of Service', [
    {
        heading: 'Who Can Use FaithfulMatch',
        body: [
            'You must be at least 18 years old.',
            'You must create only one account, for yourself, with accurate information.',
            "FaithfulMatch is a Christ-centered community. You are welcome regardless of where you are in your faith journey, but you agree to respect the community's values.",
        ],
    },
    {
        heading: 'Community Standards',
        body: [
            'Be honest: no fake profiles, impersonation, or misleading photos.',
            'Be respectful: no harassment, hate speech, sexual content, or pressuring other members.',
            'No commercial use: no advertising, solicitation, or scamming of any kind.',
            'Violations may result in warnings, suspension, or permanent removal, at our discretion.',
        ],
    },
    {
        heading: 'Safety',
        body: [
            'We moderate photos and review reports, but we do not conduct criminal background checks on members.',
            'Always exercise judgment when connecting with people you meet online. Meet in public places and tell someone you trust.',
            'Use the in-app report and block tools whenever something feels wrong — every report is reviewed.',
        ],
    },
    {
        heading: 'Your Content',
        body: [
            'You own the content you post. By posting it, you give FaithfulMatch permission to display it to other members as part of the service.',
            'You agree not to post content you do not have the right to share.',
        ],
    },
    {
        heading: 'AI Features',
        body: [
            'AI coaching features provide suggestions only. You choose what to send — nothing is ever sent automatically.',
            'AI output can be imperfect; use your own judgment.',
        ],
    },
    {
        heading: 'Service Changes & Termination',
        body: [
            'We may update features, or these terms, as the service evolves. Material changes will be communicated in the app.',
            'You may delete your account at any time. We may suspend or terminate accounts that violate these terms.',
        ],
    },
    {
        heading: 'Contact',
        body: ['Questions about these terms? Contact us at faithfulmatch@empoweredforwealth.com.'],
    },
]);
//# sourceMappingURL=legal.content.js.map