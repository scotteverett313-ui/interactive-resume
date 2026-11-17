/* ============================================================
   Notes: the blog.

   Each note is one entry in the list below, newest first.

   TO POST A NOTE add an entry at the top:
     slug     the last part of its address: /notes/<slug>. Lowercase,
              hyphens, no spaces. Never change it once it is shared.
     title    the headline
     date     'YYYY-MM-DD'
     summary  one or two sentences, shown in the list of notes
     body     the text, as a list of blocks in order:
                { h: 'A heading' }
                { p: 'A paragraph.' }
                { lead: 'A bold opening line.', p: 'The paragraph after it.' }
     links    optional: [{ to: '<node id from content.js>', why: 'one line' }]
              These become "Connects to" buttons, the same as on a
              node's page, so a note can point into the brain.
     studio   optional: true adds a button to the Work with me page
   ============================================================ */

export const NOTES = [
  {
    slug: 'beyond-cookie-cutter-custom-digital-ecosystems-for-detroit-nonprofits',
    title: 'Beyond Cookie-Cutter: Custom Digital Ecosystems for Detroit Nonprofits.',
    date: '2025-12-10',
    summary: "Cookie-cutter websites aren't dead, they're just really bad at their job. And if you're running a nonprofit in Detroit, that's a problem you can't afford to ignore.",
    links: [
      { to: 'cases', why: 'The web design work this comes from.' },
      { to: 'sedesign', why: 'The studio behind it.' }
    ],
    studio: true,
    body: [
      { p: "Let's cut to the chase: cookie-cutter websites aren't dead, they're just really bad at their job. And if you're running a nonprofit in Detroit, that's a problem you can't afford to ignore." },
      { p: "Think about it. You're competing for donor dollars against organizations with slick, mission-driven websites that tell compelling stories and make giving effortless. Meanwhile, your template site looks like every other nonprofit's template site, with generic stock photos of diverse hands reaching toward the sky and a donation button buried somewhere below the fold." },
      { p: "That's not going to cut it in 2025." },
      { h: "The Real Cost of Template Thinking" },
      { p: "Cookie-cutter websites are the participation trophies of web design for nonprofits. They check the box of \"we have a website,\" but they're not actually working for your mission." },
      { p: "Here's what happens when Detroit nonprofits stick with generic templates:" },
      { lead: "Your story disappears.",
        p: "Templates force every organization into the same mold. Your unique community impact, your specific approach to solving local problems, your connection to Detroit's neighborhoods, all of that gets flattened into generic messaging that could apply to any nonprofit anywhere." },
      { lead: "Donors get confused.",
        p: "Template sites prioritize looking pretty over being functional. Visitors land on your homepage and can't figure out how to donate, volunteer, or even understand what you do. When someone wants to support your cause and your website makes it difficult, you've lost them forever." },
      { lead: "You can't grow.",
        p: "Templates are rigid. When your programs expand, when you launch new initiatives, when you need to integrate with new tools, you're stuck. You end up with a website that becomes a bottleneck instead of a growth engine." },
      { h: "Why Detroit Nonprofits Need Something Different" },
      { p: "Detroit nonprofits face unique challenges that generic solutions can't address. You're working in communities that have been overlooked by mainstream tech solutions. You're building trust with people who have every reason to be skeptical of institutions. You're often doing groundbreaking work with limited resources." },
      { p: "Your website needs to reflect that reality, not hide it behind template polish." },
      { lead: "Community connection matters here.",
        p: "Detroit residents want to know that your nonprofit understands their neighborhood, their struggles, their hopes. A custom digital ecosystem can showcase local partnerships, feature community voices, and demonstrate real neighborhood impact in ways that templates never could." },
      { lead: "Trust is everything.",
        p: "When someone in Detroit decides to donate to your cause or volunteer their time, they're making a leap of faith. Your website needs to earn that trust through authentic storytelling, transparent impact reporting, and seamless user experience. Generic templates feel impersonal and institutional, the opposite of what builds community trust." },
      { lead: "Local SEO actually works.",
        p: "When Detroit residents search for \"nonprofit volunteering opportunities near me\" or \"community organizations helping families in Detroit,\" you want to show up. Custom web solutions built with detroit web design best practices and local search optimization help your organization get found by the people who need you most." },
      { h: "What a Custom Digital Ecosystem Actually Looks Like" },
      { p: "Forget everything you think you know about nonprofit websites. A custom digital ecosystem isn't just a prettier version of a template, it's a completely different approach to how your organization connects with supporters online." },
      { lead: "It starts with your story.",
        p: "Every element of your site should reinforce why your work matters and how supporters can be part of the solution. Custom design means your website architecture flows logically from awareness to action, with every page designed to move visitors closer to supporting your mission." },
      { lead: "It makes giving effortless.",
        p: "Donation workflows that actually work. Recurring giving options that don't confuse people. Mobile-optimized forms that process smoothly. Impact tracking that shows donors exactly how their contributions make a difference. This isn't rocket science, it's just good user experience design." },
      { lead: "It grows with your mission.",
        p: "Need to add a new program? Launch a capital campaign? Integrate with your CRM? A custom solution adapts to your needs instead of forcing you to work around limitations." },
      { h: "The Bold Truth About Digital Presence in 2025" },
      { p: "Here's what most nonprofits get wrong: they think having a website is enough. But your website isn't a business card, it's your most powerful fundraising tool, your volunteer recruitment system, and your community engagement platform all rolled into one." },
      { p: "Detroit nonprofits doing the most impactful work understand this. They're not settling for \"good enough\" digital presence because their missions are too important. They're investing in custom web solutions that help them reach more people, raise more funds, and create more community impact." },
      { lead: "Community-driven design works.",
        p: "When your website reflects your community's values, voices, and visual identity, people feel seen and understood. That emotional connection translates directly into stronger donor relationships and deeper volunteer engagement." },
      { lead: "Digital ecosystems compound impact.",
        p: "A well-designed nonprofit website becomes a hub that connects all your other digital efforts. Email campaigns drive traffic to targeted landing pages. Social media posts link to specific program information. Event promotion flows seamlessly into registration and payment processing. Everything works together instead of competing for attention." },
      { lead: "Investment pays for itself.",
        p: "Yes, custom web solutions require upfront investment. But they also generate measurably better results. Higher donation conversion rates. More volunteer signups. Better donor retention. Improved grant application success. When your digital presence actually supports your mission, the ROI is impossible to ignore." },
      { h: "What This Means for Your Organization" },
      { p: "If you're running a Detroit nonprofit with big ambitions and limited resources, your website should be working overtime for your mission. Cookie-cutter solutions are holding you back from the community impact you're capable of creating." },
      { p: "The organizations making the biggest difference in Detroit neighborhoods aren't the ones with the biggest budgets: they're the ones with the clearest communication and the most effective digital strategies." },
      { p: "Your community needs what you're offering. Your donors want to support meaningful work. Your volunteers are ready to get involved. Don't let a generic website be the barrier between your mission and the people who can help you accomplish it." },
      { h: "Ready to Build Something Better?" },
      { p: "Detroit's nonprofit community deserves digital tools that match their ambition and commitment. If you're tired of watching potential supporters bounce off your template site, it's time to explore what a custom digital ecosystem could do for your organization." },
      { p: "The conversation starts with understanding your unique mission, your community's needs, and your growth goals. From there, we can design a web design for nonprofits solution that actually serves your cause instead of just looking professional." },
      { p: "Your work matters too much to settle for generic. Let's build something that matches your impact." },
      { p: "Explore our Digital Presence Blueprint to see how custom digital ecosystems can transform your nonprofit's community engagement and fundraising effectiveness." },
    ]
  }
];

export const NOTE_BY_SLUG = {};
NOTES.forEach(function(n){ NOTE_BY_SLUG[n.slug] = n; });

/* '2025-12-10' -> 'December 10, 2025' */
export function noteDate(d){
  var m = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var p = d.split('-');
  return m[Number(p[1]) - 1] + ' ' + Number(p[2]) + ', ' + p[0];
}
