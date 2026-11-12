const img = (file: string) => `/images/work/jrun-llc/${file}`;
const vid = (file: string) => `/videos/work/jrun-llc/${file}`;

export const jrunMeta = {
  slug: "jrun-llc",
  title: "JRUN LLC",
  summary:
    "Two businesses, one website. Designing and building a home for GG Beauty and Table 231.",
  eyebrow: "Case study",
  status: "Live",
  cover: {
    kind: "video" as const,
    mp4: vid("cover-loop.mp4"),
    poster: img("cover-poster.jpg"),
    cardPoster: img("cover-poster.jpg"),
    field: "#F6F0E6",
    width: 1600,
    height: 900,
  },
} as const;

export type Frame = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
};

export type Part = { text: string; href?: string };

export type Block =
  | { type: "h2"; text: string }
  | { type: "h4"; text: string }
  | { type: "p"; text: string }
  | { type: "link"; text: string; href: string }
  | { type: "list"; items: string[] }
  | { type: "points"; items: Part[][] }
  | { type: "image"; frame: Frame; maxWidth?: number }
  | { type: "tiles"; frames: Frame[] }
  | { type: "pair"; frames: Frame[] };

export type StudySection = {
  id: string;
  label: string;
  blocks: Block[];
};

const live = "https://jrun-llc.vercel.app";

export const jrunStudy = {
  ...jrunMeta,
  hero: {
    mp4: vid("cover-loop.mp4"),
    poster: img("cover-poster.jpg"),
    width: 1600,
    height: 900,
    alt: "Cream cover with the words JRUN LLC and Two businesses, one website. A rose panel reads GG Beauty. An olive panel reads Table 231.",
    field: "#F6F0E6",
  },
  meta: [
    { label: "Role", value: "Solo designer and developer (client project)" },
    { label: "Timeline", value: "September 2026" },
    {
      label: "Scope",
      value: "Information architecture, visual design, front end build, booking and ordering flows",
    },
    { label: "Tools", value: "React, Vite, Framer Motion, Formspree, Vercel" },
    { label: "Live site", value: "jrun-llc.vercel.app" },
  ],
  sections: [
    {
      id: "brief",
      label: "The brief",
      blocks: [
        {
          type: "image",
          frame: {
            src: img("banner-brief.webp"),
            width: 1600,
            height: 680,
            alt: "Ink banner labeled The brief. One founder runs two businesses. She wanted both on a single website.",
          },
        },
        {
          type: "p",
          text: "One founder runs two businesses: GG Beauty, a mobile braiding and natural hair service, and Table 231, a line of pepper sauces, marinades, and stew bases. She wanted both on a single website under the JRUN LLC name, with online booking for hair and online ordering for food.",
        },
      ],
    },
    {
      id: "problem",
      label: "Problem",
      blocks: [
        {
          type: "h2",
          text: "Hair and food have different customers, different actions, and different moods.",
        },
        {
          type: "p",
          text: "A hair client wants to see styles, check prices, and book a time. A food customer wants to browse sauces and place an order. Putting both on one page risks a site that feels like neither.",
        },
        {
          type: "image",
          frame: {
            src: img("banner-problem.webp"),
            width: 1600,
            height: 680,
            alt: "Rose banner labeled The problem. Hair and food have different customers, different actions, and different moods.",
          },
        },
      ],
    },
    {
      id: "opportunity",
      label: "Opportunity",
      blocks: [
        {
          type: "h2",
          text: "How might we give each business its own identity, while keeping one brand, one place to manage, and one clear front door?",
        },
        {
          type: "p",
          text: "The client's goal guided the answer: establish the brand, and introduce ready made condiments that make everyday meals taste better and cut time in the kitchen.",
        },
        {
          type: "image",
          frame: {
            src: img("banner-opportunity.webp"),
            width: 1600,
            height: 680,
            alt: "Olive banner labeled The opportunity. Give each business its own identity, and keep one brand and one front door.",
          },
        },
      ],
    },
    {
      id: "research",
      label: "Research",
      blocks: [
        {
          type: "p",
          text: "I started with the client's questionnaire, which covered services, prices, booking needs, and the goal of the site. Then I looked at how other businesses handle more than one brand online.",
        },
        {
          type: "points",
          items: [
            [
              {
                text: "Small businesses usually do better with one well organized site than several, because content, contact details, and upkeep stay in one place. Separate brands still need their own landing pages and visual signals. ",
              },
              {
                text: "ChatBuild",
                href: "https://chatbuild.com/blog/when-small-business-needs-more-than-one-website",
              },
            ],
            [
              {
                text: "A common pattern is a hub: one parent homepage that routes visitors to a page for each brand, with a shared layout and a different accent color per brand. ",
              },
              {
                text: "Tech Solutions",
                href: "https://tech-solutions.co/blog/one-brand-six-divisions-website-seo",
              },
            ],
            [
              { text: "Restaurant groups with two concepts, like " },
              { text: "NEOS", href: "https://code-and-canvas.com/neos-case-study/" },
              {
                text: ", give each one its own journey while keeping an easy path between them.",
              },
            ],
          ],
        },
      ],
    },
    {
      id: "principles",
      label: "Principles",
      blocks: [
        {
          type: "tiles",
          frames: [
            {
              src: img("principle-1.webp"),
              width: 900,
              height: 900,
              alt: "Cream tile titled One umbrella, two voices. An ink bar labeled JRUN LLC sits above a rose block for GG Beauty and an olive block for Table 231.",
              caption:
                "One umbrella, two voices. JRUN LLC holds everything together. Each business speaks for itself.",
            },
            {
              src: img("principle-2.webp"),
              width: 900,
              height: 900,
              alt: "Cream tile titled Every page has one job. A hair card says pages lead to booking. A food card says pages lead to ordering.",
              caption: "Every page has one job. Hair pages lead to booking. Food pages lead to ordering.",
            },
            {
              src: img("principle-3.webp"),
              width: 900,
              height: 900,
              alt: "Cream tile titled Shared bones, different color. Two matching layouts, one with a rose accent and one with an olive accent.",
              caption:
                "Shared bones, different color. Same type, layout, and components everywhere, so it reads as one brand.",
            },
          ],
        },
      ],
    },
    {
      id: "explorations",
      label: "Explorations",
      blocks: [
        { type: "p", text: "I weighed three structures." },
        { type: "h4", text: "A. Two separate websites." },
        {
          type: "p",
          text: "Clear identities, but double the upkeep for one person, and the JRUN LLC brand disappears.",
        },
        { type: "h4", text: "B. One long page." },
        {
          type: "p",
          text: "Simple to build, but hair and food content compete, and neither gets a clear call to action.",
        },
        { type: "h4", text: "C. An umbrella home that branches into two pages." },
        {
          type: "p",
          text: "One brand and one site, with a dedicated space for each business.",
        },
        { type: "h4", text: "Why C" },
        {
          type: "p",
          text: "It matches what the client asked for, two sites in one, and follows the hub pattern from research.",
        },
      ],
    },
    {
      id: "solution",
      label: "Solution",
      blocks: [
        { type: "h4", text: "The front door." },
        {
          type: "p",
          text: 'The JRUN LLC home introduces both businesses with the line "Beauty at your door, flavour on your table," and sends visitors to the right branch.',
        },
        {
          type: "image",
          frame: {
            src: img("home-hero.webp"),
            width: 1600,
            height: 844,
            alt: "JRUN LLC home hero with the line Beauty at your door, flavour on your table, and links to GG Beauty and Table 231.",
            caption: "The JRUN LLC home.",
          },
        },
        { type: "h4", text: "GG Beauty (/hair)." },
        {
          type: "p",
          text: "A rose palette, style photography, a pricing slider, and a request to book form for date, service, and notes. Mobile service copy makes it clear the stylist comes to you.",
        },
        {
          type: "image",
          frame: {
            src: img("hair-pricing.webp"),
            width: 1600,
            height: 808,
            alt: "GG Beauty pricing slider titled Browse our signature styles, with style photographs and prices.",
            caption: "Pricing slider on the hair page.",
          },
        },
        {
          type: "image",
          maxWidth: 520,
          frame: {
            src: img("hair-booking.webp"),
            width: 1200,
            height: 1120,
            alt: "GG Beauty booking form with fields for name, email, phone, preferred date, service, and notes, and a Request Booking button.",
            caption: "Request to book form.",
          },
        },
        { type: "h4", text: "Table 231 (/food)." },
        {
          type: "p",
          text: 'An olive palette, the client\'s requested heading "Home of Condiments and Marinades," a filterable menu, and an order form.',
        },
        {
          type: "image",
          frame: {
            src: img("food-menu.webp"),
            width: 1400,
            height: 906,
            alt: "Table 231 menu with filters for All, Sauces, Zongo Stew, Marinades, and Stew Base, and a priced list of items.",
            caption: "Filterable menu.",
          },
        },
        {
          type: "image",
          maxWidth: 520,
          frame: {
            src: img("food-order.webp"),
            width: 1200,
            height: 1318,
            alt: "Table 231 order form with fields for name, email, phone, item, pickup or delivery date, quantity, and notes, and a Place Order button.",
            caption: "Order form.",
          },
        },
        { type: "h4", text: "Shared system." },
        {
          type: "p",
          text: "Both branches use Playfair Display and Inter on a cream and ink base. Only the accent color changes, so visitors always know where they are and still see one brand.",
        },
      ],
    },
    {
      id: "shipped",
      label: "Built and shipped",
      blocks: [
        {
          type: "p",
          text: "I built the site in React with Vite, added motion with Framer Motion, handled booking and order requests through Formspree, and deployed on Vercel. Forms keep it low maintenance for a one person business, with no admin panel to manage.",
        },
        { type: "link", text: "View the live site", href: live },
      ],
    },
    {
      id: "outcome",
      label: "Outcome",
      blocks: [
        {
          type: "h2",
          text: "The site is live with one brand home and two branded branches, each with its own booking or ordering path.",
        },
        {
          type: "pair",
          frames: [
            {
              src: img("hair-branch.webp"),
              width: 1400,
              height: 738,
              alt: "GG Beauty hair page hero. The heading reads Start your next great hair day here, with a Book now button.",
              caption: "The hair branch.",
            },
            {
              src: img("food-branch.webp"),
              width: 1400,
              height: 738,
              alt: "Table 231 food page hero. The heading reads Home Of Condiments And Marinades, with a Place an Order button.",
              caption: "The food branch.",
            },
          ],
        },
        { type: "h4", text: "What I'd do next" },
        {
          type: "list",
          items: [
            "Show the full price tiers (student, standard, length, and mobile).",
            "Let the client set weekly appointment slots.",
            "Add a line that Table 231 ships across the United States.",
            'Add an "appointment only" note on the hair page.',
          ],
        },
      ],
    },
  ] satisfies StudySection[],
};
