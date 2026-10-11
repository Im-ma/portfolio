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

export type Block =
  | { type: "annotation"; devOnly?: boolean; text: string }
  | {
      type: "paragraph";
      variant?: string;
      text: string;
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
  | { type: "heading"; text?: string }
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
      text: string;
      frame: Media;
      side?: "start" | "end";
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
  | { type: "compare"; before: Media; after: Media };

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
    field?: string;
    width?: number;
    height?: number;
    objectPosition?: string;
    standin?: boolean;
  };
  keyTakeaway: { label: string; heading: string; body: string };
  scope: { label: string; text: string };
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
    image: Media;
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
