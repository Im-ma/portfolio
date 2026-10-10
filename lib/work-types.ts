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
  | ({ type: "figure"; caption?: string; images?: Media[] } & Partial<Media>)
  | { type: "figureRow"; figures: Media[] }
  | { type: "features"; label?: string; items: { title: string; text: string }[] }
  | {
      type: "video";
      label: string;
      poster: string;
      mp4: string;
      webm: string;
      playLabel: string;
      caption: string;
    }
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
  | { type: "list"; variant?: string; items: ListItem[] };

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
