/* ============================================================
   Work with me.

   One short page: what I am open to, and how to start a
   conversation. Change the words and links here; the layout is
   in StudioPage.js.

   ways      the three ways to work with me. `see` is the id of a
             node in content.js: the row links to that place in the
             brain, so people can look at the work behind it.
   STATUS    whether the "Open for work" status shows, and its words
   BOOKING   the Google Calendar link the call button opens
   SOCIALS   the links at the bottom of the page

   The longer sales page from the old scotteverett.design site
   (tiers, process, testimonials) was here before this one. It is
   still in the project history if you ever want it back.
   ============================================================ */

export const BOOKING = 'https://calendar.app.google/3DKJko2rGE9WFYTu6';

export const SOCIALS = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/company/se-design-studio/' },
  { label: 'Instagram', url: 'https://www.instagram.com/sedesignpro/' },
  { label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61564506484267' }
];

/* The "open for work" status. It shows at the top of the menu and at the top of the Work with me page.
   Set `open` to false to hide both. */
export const STATUS = { open: true, label: 'Open for work' };

export const STUDIO = {
  title: "Let's work on something.",
  intro: 'I design, teach, and build. Tell me what you need.',
  ways: [
    { name: 'A project', text: 'Brand, web, or product design.', see: 'cases' },
    { name: 'An ongoing partner', text: 'Monthly design support, from $299.', see: 'sedesign' },
    { name: 'Teaching', text: 'Workshops, guest talks, or a full-time role.', see: 'teach' }
  ],
  call: 'Book a free 45-minute call',
  callNote: 'Free · 45 minutes · No commitment',
  write: 'Or send me a note'
};
