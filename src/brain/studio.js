/* ============================================================
   Work with me: the SE|Design services page.

   This is the copy from the old scotteverett.design site, moved
   here so it can be edited in one place. The page layout is in
   StudioPage.js; change the words, prices, and links here.

   BOOKING is the Google Calendar link every "Book a call" button
   opens. SOCIALS are the links at the bottom of the page.
   ============================================================ */

export const BOOKING = 'https://calendar.app.google/3DKJko2rGE9WFYTu6';

export const SOCIALS = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/company/se-design-studio/' },
  { label: 'Instagram', url: 'https://www.instagram.com/sedesignpro/' },
  { label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61564506484267' }
];

export const STUDIO = {
  kicker: 'SE|Design Studio',
  title: 'Your On-Demand Design Department',
  intro: "Full-time design staff is out of reach? One-off freelancers don't stick? SE|Design is the monthly design partnership that fills the gap - strategic, consistent, and built for Detroit's growing organizations.",
  facts: [
    { big: '$299/mo', small: 'to start a partnership' },
    { big: 'Month-to-month', small: 'no long-term contract' },
    { big: 'Detroit-rooted', small: 'Michigan-focused' },
    { big: 'Free', small: 'strategy call to begin' }
  ],

  why: {
    title: 'Most growing organizations are stuck between bad options.',
    options: [
      { name: 'The agency quote', quote: "\"We can't afford that.\"",
        text: "You got a proposal that started at $15,000 and went up from there. The work was probably great - but it wasn't built for where you are right now. So you kept waiting." },
      { name: 'The freelancer', quote: '"They did good work - then disappeared."',
        text: 'The logo was fine. The website was fine. But when you needed something new, they were unavailable, expensive, or starting from scratch again. Every time.' },
      { name: 'Doing it yourself', quote: "\"I'll just use Canva.\"",
        text: "You spent more time fighting templates than running your business. And if you're honest - the result still doesn't look like the organization you're actually building. You know it. Your customers know it." }
    ],
    gap: "That's the gap SE|Design was built to fill.",
    gapText: [
      'Not a $15K agency. Not a freelancer who disappears. Not a template tool that fights back.',
      'SE|Design is a Detroit-based design studio that works as your on-demand design department - with the structure of an agency, the accessibility of a partnership, and a network of designers and specialists who plug in when your project needs them.',
      "Every engagement is led by Scott Everett directly. You always know who's accountable. You always know what's happening. And your brand keeps moving every single month."
    ]
  },

  flow: {
    title: 'Five steps from "let\'s talk" to a brand that works for you.',
    note: 'Step 1 is always free. The strategy call is where every partnership begins.',
    steps: [
      { name: 'Discovery', text: 'A real conversation about your organization, your goals, your audience, and where your brand stands today. No assumptions, no templates. We listen before we build.' },
      { name: 'Strategy', text: 'Together, we build a design plan tied to your actual business goals, what to prioritize, what to defer, and how design connects to your growth this quarter and beyond. Not a mood board. A roadmap.' },
      { name: 'Design', text: 'Your brand, visuals, and digital assets come to life - built around the strategy, not just aesthetics. Every deliverable is intentional, on-brand, and ready to work across every channel you use.' },
      { name: 'Launch', text: "We guide you through setup and go-live, step by step. Whether it's a website, a brand rollout, or a campaign, you won't be handed files and left to figure out the rest alone." },
      { name: 'Support', text: 'This is where the partnership model earns its keep. Monthly planning calls, consistent design work, progress reports and a partner who learns your organization and keeps your brand moving every single month.' }
    ]
  },

  who: {
    title: 'Who We Partner With',
    groups: [
      { name: 'Small Businesses', kinds: 'Local businesses · Service providers · Retailers · Consultants',
        text: "You're building something real. You don't have time to piece together freelancers or fight with Canva every week. A monthly design partnership means your brand keeps moving — even when you're running the business." },
      { name: 'Mission-Driven Organizations', kinds: 'Nonprofits · Social enterprises · Community organizations',
        text: "Detroit's nonprofit sector competes for every donor dollar — and donors trust what they can see. A consistent, credible brand isn't overhead. It's how you show the work and earn the funding." },
      { name: 'Entrepreneurs', kinds: 'Startups · Freelancers · Creative professionals · Growing ventures',
        text: "Michigan adds 40,000+ new businesses every year. The ones that survive don't look like they built their brand in Canva. Professional design isn't vanity — it's how you get taken seriously before you've had the chance to prove yourself." }
    ]
  },

  levels: {
    title: 'Consistent design support, built around your budget.',
    note: "No surprise invoices. No scope creep. Month-to-month - start where it makes sense, scale when you're ready.",
    tiers: [
      { name: 'Design Starter', hours: '12 hours / month', price: '$299/mo', rate: '~$25/hr · month-to-month',
        text: 'For growing organizations that need a consistent design presence without the full commitment.',
        includesLabel: 'Included',
        includes: ['12 hrs dedicated design / month', 'Monthly planning call', 'Direct access to Scott', 'Monthly progress report'],
        best: 'Best for small businesses + nonprofits on a budget' },
      { name: 'Growth Partnership', hours: '25 hours / month', price: '$1,080/mo', rate: '~$43/hr · month-to-month', popular: true,
        text: 'For organizations ready to scale their brand, systems, and presence with a committed design partner.',
        includesLabel: 'Everything in Starter, plus',
        includes: ['25 hrs dedicated design / month', 'Monthly strategy + planning call', 'Priority turnaround', 'Quarterly brand review', 'Monthly progress report'],
        best: 'Best for scaling businesses + active nonprofits' },
      { name: 'Full Partnership', hours: '40 hours / month', price: '$2,500/mo', rate: '~$63/hr · month-to-month',
        text: 'Complete design department support for organizations in active growth mode - fully embedded, fully accountable.',
        includesLabel: 'Everything in Starter, plus',
        includes: ['40 hrs dedicated design / month', 'Weekly check-ins', 'Highest priority turnaround', 'Full brand management', 'Monthly + quarterly reporting'],
        best: 'Best for orgs in active growth or major launch mode' }
    ]
  },

  trial: {
    title: 'Need to see the work before committing?',
    note: "SE|Design offers a small number of trial projects for organizations who want to start smaller. These aren't our focus - but they're a real option for the right situation.",
    items: [
      { tag: 'Brand + Web', name: 'Digital Presence Blueprint', price: '$199 one-time',
        text: 'Complete branding and web package. Logo, color, type, and a web presence - built to last.' },
      { tag: 'Fast-track', name: 'Creative Essentials Pack', price: '$99 one-time',
        text: 'Brand essentials bundle. The core design assets your organization needs to show up professionally.' },
      { tag: 'Free', name: '45-Min Strategy Call', price: '$0 Always',
        text: 'A real conversation about your brand, your goals, and whether a design partnership makes sense right now.' }
    ]
  },

  said: [
    { text: 'Thanks to your guidance, they were able to explore their creativity and develop their design skills, all while working toward a tangible and exciting project. Your ability to make this process both educational and enjoyable was invaluable.',
      who: 'Program Director', kind: 'Organization' },
    { text: "We'd been piecing together design work for years — a freelancer here, a template there. Working with SE|Design was the first time our brand actually felt consistent. Customers started noticing before we even said anything.",
      who: 'Owner, Detroit-based retail business', kind: 'Entrepreneur' },
    { text: 'As a nonprofit, we always treated design as a luxury we couldn\'t afford. SE|Design completely changed that perspective. Our grant proposals look different now - more credible, more compelling. We landed two funders in the first quarter.',
      who: 'Executive Director, Detroit nonprofit', kind: 'Non-Profit' }
  ],

  contact: {
    title: 'Ready to start a conversation?',
    text: "Let's find the right level of support for where you are right now.",
    call: 'Book a Free 45-Min Strategy Call',
    callNote: 'Free · 45 minutes · No commitment'
  }
};
