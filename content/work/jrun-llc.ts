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
    field: "#f5f7fb",
    width: 1920,
    height: 1080,
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

export type Clip = {
  mp4: string;
  poster: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
};

const clip = (file: string, alt: string, caption: string): Clip => ({
  mp4: vid(`${file}.mp4`),
  poster: img(`${file}.jpg`),
  width: 1920,
  height: 1072,
  alt,
  caption,
});

const live = "https://jrun-llc.vercel.app";

export const jrunStudy = {
  ...jrunMeta,
  hero: {
    mp4: vid("cover-loop.mp4"),
    poster: img("cover-poster.jpg"),
    still: img("cover-poster.jpg"),
    width: 1920,
    height: 1080,
    alt: "A MacBook and an iPhone on a pale background. The laptop screen shows the JRUN LLC home. The phone shows the GG Beauty page.",
    field: "#f5f7fb",
  },
  meta: [
    { label: "Timeline", value: "September 2026" },
    { label: "Live site", value: "jrun-llc.vercel.app", href: live },
  ],
  about:
    "One founder runs two businesses, GG Beauty and Table 231, and wanted both on one site under the JRUN LLC name, with booking for hair and ordering for food. Hair and food need different journeys, without the site feeling like two brands.",
  facts: [
    { label: "Industry", value: "Beauty and food, small business" },
    { label: "Scope", value: "Website, booking and ordering flows" },
    { label: "Role", value: "Solo designer and developer" },
    { label: "Tools", value: "React, Vite, Framer Motion, Formspree, Vercel" },
  ],
  approach: {
    headline:
      "How might we give each business its own identity, while keeping one brand, one place to manage, and one clear front door?",
    why: [
      {
        text: "An umbrella home with two branches won over separate sites or one long page: one brand, one site, and a page for each business. It follows the hub pattern in ",
      },
      {
        text: "ChatBuild",
        href: "https://chatbuild.com/blog/when-small-business-needs-more-than-one-website",
      },
      { text: ", " },
      {
        text: "Tech Solutions",
        href: "https://tech-solutions.co/blog/one-brand-six-divisions-website-seo",
      },
      { text: ", and " },
      { text: "NEOS", href: "https://code-and-canvas.com/neos-case-study/" },
      { text: "." },
    ] satisfies Part[],
  },
  principles: [
    {
      src: img("principle-1.webp"),
      width: 1600,
      height: 844,
      alt: "The JRUN LLC home, with the shared navigation and links into GG Beauty and Table 231.",
      caption:
        "One umbrella, two voices. JRUN LLC holds everything together. Each business speaks for itself.",
    },
    {
      src: img("principle-2.webp"),
      width: 1820,
      height: 504,
      alt: "The hair page Book now button beside the food page Place an Order button.",
      caption: "Every page has one job. Hair pages lead to booking. Food pages lead to ordering.",
    },
    {
      src: img("principle-3.webp"),
      width: 1820,
      height: 651,
      alt: "The rose GG Beauty page beside the olive Table 231 page. Both keep the same navigation and layout.",
      caption:
        "Shared bones, different color. Same type, layout, and components everywhere, so it reads as one brand.",
    },
  ] satisfies Frame[],
  scenes: [
    {
      id: "front-door",
      nav: "The front door",
      eyebrow: "The front door",
      headline: "Beauty at your door, flavour on your table.",
      text: "The home introduces both businesses and sends visitors to the right branch.",
      clips: [
        clip(
          "01-home-hero",
          "Home hero on the live site. The pointer hovers the GG Beauty and Table 231 calls to action.",
          "The home hero, and the two calls to action.",
        ),
        clip(
          "02-home-services",
          "The What we do list on the home page. Hovering a service swaps the preview image.",
          "What we do, with the preview swapping on hover.",
        ),
      ],
    },
    {
      id: "beauty",
      nav: "GG Beauty",
      eyebrow: "GG Beauty",
      headline: "Book a style and check the price.",
      text: "A rose palette, style photography, and a pricing slider. The page leads to a request to book, and the copy makes it clear the stylist comes to you.",
      clips: [
        clip(
          "03-hair-styles-slider",
          "The GG Beauty signature styles carousel, dragged through styles and prices.",
          "Signature styles and prices.",
        ),
      ],
    },
    {
      id: "table",
      nav: "Table 231",
      eyebrow: "Table 231",
      headline: "Home of condiments and marinades.",
      text: "An olive palette and a filterable menu, under the heading the client asked for. The page leads to an order.",
      clips: [
        clip(
          "06-food-menu-filter",
          "The Table 231 menu. Category tabs filter the list.",
          "Menu filters update the list.",
        ),
      ],
    },
  ],
  requests: {
    headline: "One form for each job.",
    text: "Hair ends in a booking form for date, service, and notes. Food ends in an order form.",
    clips: [
      clip(
        "04-hair-booking-form",
        "The GG Beauty booking form. The service menu opens over the date, service, and notes fields.",
        "Booking form and service menu.",
      ),
      clip(
        "05-food-order-scroll",
        "The Table 231 page. Place an order smooth scrolls to the order form.",
        "Place an order scrolls to the form.",
      ),
    ],
  },
  phones: [
    {
      mp4: vid("07-hair-phone.mp4"),
      poster: img("07-hair-phone.jpg"),
      width: 780,
      height: 1688,
      alt: "GG Beauty at phone width. The clip starts on the hero, scrolls to the styles carousel, moves through a few styles, and returns to the hero.",
      caption: "Hair",
    },
    {
      mp4: vid("08-food-phone.mp4"),
      poster: img("08-food-phone.jpg"),
      width: 780,
      height: 1688,
      alt: "Table 231 at phone width. The clip starts on the hero, scrolls to the menu, taps filter tabs, and returns to the hero.",
      caption: "Food",
    },
  ] satisfies Clip[],
  outcome: "The site is live.",
  nextSteps: [
    "Show the full price tiers (student, standard, length, and mobile).",
    "Let the client set weekly appointment slots.",
    "Add a line that Table 231 ships across the United States.",
    'Add an "appointment only" note on the hair page.',
  ],
};
