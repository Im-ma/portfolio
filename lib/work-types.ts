export type ScreenRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type Media = {
  src: string;
  width: number;
  height: number;
  objectFit?: string;
  objectPosition?: string;
  radius?: number;
  figmaSize?: readonly number[];
  standin?: boolean;
  alt?: string;
  caption?: string;
  /** Inner display, in source pixels, when the file includes a device bezel. */
  screen?: ScreenRect;
};

export type ListItem = {
  marker: string;
  title?: string;
  text: string;
  check?: boolean;
  checkNote?: string;
};

export type VideoBlock = {
  type: "video";
  label: string;
  poster: string;
  mp4: string;
  webm: string;
  playLabel: string;
  caption: string;
  devOnly?: boolean;
  standin?: boolean;
};

export type TextPart = {
  text: string;
  href?: string;
};

export type ThreeUpItem = {
  title?: string;
  text?: string;
  frame?: Media;
  /** Draft slot. Renders a labeled placeholder instead of the image file. */
  placeholder?: boolean;
  check?: boolean;
  checkNote?: string;
};

export type Block =
  | { type: "annotation"; devOnly?: boolean; text: string }
  | {
      type: "paragraph";
      variant?: string;
      text: string;
      parts?: TextPart[];
      askHighlight?: boolean;
      tooltip?: string;
      check?: boolean;
      checkNote?: string;
    }
  | ({
      type: "figure";
      caption?: string;
      images?: Media[];
      layout?: "contained" | "fullBleed" | "single" | "flow" | "pair";
    } & Partial<Media>)
  | { type: "figureRow"; figures: Media[] }
  | { type: "features"; label?: string; items: { title: string; text: string }[] }
  | VideoBlock
  | { type: "videos"; items: VideoBlock[] }
  | { type: "decision"; number: number; eyebrow: string; title: string; blocks: Block[] }
  | { type: "label"; text: string }
  | {
      type: "heading";
      text?: string;
      id?: string;
      level?: 2 | 3 | 4;
      badge?: string;
      check?: boolean;
      checkNote?: string;
    }
  | {
      type: "options";
      items: {
        chosen?: boolean;
        label: string;
        text: string;
        badge?: string;
        image?: Media;
      }[];
    }
  | { type: "list"; variant?: string; items: ListItem[] }
  | { type: "fullBleed"; frame: Media }
  | { type: "contained"; frame: Media }
  | { type: "single"; frame: Media }
  | {
      type: "split";
      title?: string;
      text: string;
      frame: Media;
      side?: "start" | "end";
      compact?: boolean;
      check?: boolean;
      checkNote?: string;
    }
  | { type: "pair"; frames: Media[] }
  | { type: "trio"; frames: Media[] }
  | { type: "bento"; frames: Media[]; standin?: boolean }
  | { type: "quote"; label?: string; text: string; detail?: string }
  | {
      type: "research";
      text: string;
      check?: boolean;
      checkNote?: string;
    }
  | { type: "flow"; frame?: Media; steps?: { title: string; text?: string }[] }
  | { type: "compare"; before: Media; after: Media }
  | {
      type: "panel";
      tone: "problem" | "solution" | "neutral";
      label?: string;
      caption?: string;
      blocks: Block[];
    }
  | { type: "full"; frame: Media }
  | { type: "film"; mp4: string; webm: string; poster: string; label: string }
  | { type: "threeUp"; columns?: 2 | 3 | 4; items: ThreeUpItem[] }
  | {
      type: "videoLoop";
      mp4: string;
      webm?: string;
      poster: string;
      width: number;
      height: number;
      title?: string;
      text?: string;
      caption?: string;
      label?: string;
      layout?: "split" | "full";
      flip?: boolean;
      check?: boolean;
      checkNote?: string;
    }
  | {
      type: "coreFlows";
      rows: {
        title: string;
        text: string;
        label: string;
        mp4: string;
        webm: string;
        poster: string;
        width: number;
        height: number;
      }[];
      onboarding: {
        title: string;
        text: string;
        label: string;
        mp4: string;
        webm: string;
        poster: string;
        width: number;
        height: number;
      };
    }
  | {
      type: "prototypeFlows";
      items: {
        label: string;
        caption: string;
        mp4: string;
        poster: string;
        width: number;
        height: number;
      }[];
    }
  | { type: "beforeAfter"; items: { label: string; text?: string; frame: Media }[] }
  | {
      type: "callout";
      tone?: "accent" | "neutral" | "signal";
      kicker?: string;
      title?: string;
      text?: string;
      frame?: Media;
      check?: boolean;
      checkNote?: string;
    }
  | { type: "stats"; items: { value: string; text: string }[]; check?: boolean; checkNote?: string }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string };

export type WorkSection = {
  id: string;
  number: string;
  title: string;
  blocks: Block[];
};

export type TocItem = {
  number: string;
  title: string;
  anchor: string;
  subs?: { number: string; title: string; anchor: string }[];
};

export type WorkLink = {
  label: string;
  href?: string | null;
  check?: boolean;
  checkNote?: string;
  comingSoon?: boolean;
};

export type Work = {
  slug: string;
  backLink: { label: string; href: string };
  eyebrow: string;
  number: number;
  status: string;
  title: string;
  titleCheck?: { check?: boolean; checkNote?: string };
  summary: string;
  cover?: {
    kind: "image" | "video";
    src?: string;
    mp4?: string;
    webm?: string;
    poster?: string;
    cardPoster?: string;
    field?: string;
    width?: number;
    height?: number;
    objectPosition?: string;
    standin?: boolean;
  };
  keyTakeaway?: { label: string; heading: string; body: string };
  scope?: { label: string; text: string };
  hero?: { src: string; width: number; height: number; alt?: string };
  meta: { label: string; value: string; tag?: string; check?: boolean; checkNote?: string }[];
  links: { items: WorkLink[]; flows?: WorkLink[]; flowsLabel?: string };
  sections: WorkSection[];
  tocLabel: string;
  toc: TocItem[];
  tocNote?: { text: string; devOnly?: boolean };
  nextProject: {
    label: string;
    status: string;
    title: string;
    summary: string;
    cta: string;
    slug: string;
  };
  contact: {
    heading: string;
    body: string;
    buttons: {
      label: string;
      action?: string;
      href?: string;
      variant?: "primary" | "secondary";
      arrow?: boolean;
      check?: boolean;
      checkNote?: string;
    }[];
  };
  talkButtonLabel?: string;
};
