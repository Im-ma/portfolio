const img = (file: string) => `/images/work/linked-text-frames/${file}`;
const vid = (file: string) => `/videos/work/linked-text-frames/${file}`;

export const linkedFramesMeta = {
  slug: "linked-text-frames",
  title: "Linked Text Frames for Figma",
  summary:
    "A native concept for InDesign style text threading in Figma, with a working plugin as proof.",
  eyebrow: "Case study",
  status: "Concept",
  cover: {
    kind: "video" as const,
    mp4: vid("cover-loop.mp4"),
    poster: img("cover-poster.jpg"),
    cardPoster: img("cover-poster.jpg"),
    field: "#D6EEE2",
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

export type Clip = {
  mp4: string;
  poster: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
};

export type Block =
  | { type: "h2"; text: string }
  | { type: "h4"; text: string }
  | { type: "p"; text: string }
  | { type: "link"; text: string; href: string }
  | { type: "note"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; cite: string }
  | { type: "image"; frame: Frame; maxWidth?: number; enlarge?: boolean }
  | { type: "video"; clip: Clip }
  | { type: "tiles"; frames: Frame[] }
  | { type: "beside"; clip: Clip; frame: Frame }
  | { type: "stills"; frames: Frame[] }
  | { type: "pair"; frames: Frame[] }
  | { type: "lessons"; items: { title: string; text: string }[] };

export type StudySection = {
  id: string;
  label: string;
  blocks: Block[];
};

const concept = { width: 1440, height: 900 };
const plugin = { width: 1600, height: 900 };

function conceptClip(file: string, alt: string, caption: string): Clip {
  return {
    mp4: vid(`${file}-loop.mp4`),
    poster: img(`${file}-poster.jpg`),
    ...concept,
    alt,
    caption,
  };
}

function pluginClip(file: string, alt: string, caption: string): Clip {
  return {
    mp4: vid(`${file}-loop.mp4`),
    poster: img(`${file}-poster.jpg`),
    ...plugin,
    alt,
    caption,
  };
}

export const linkedFrames = {
  ...linkedFramesMeta,
  disclaimer:
    "Independent student concept. Not affiliated with, endorsed by, or sponsored by Figma.",
  hero: {
    mp4: vid("cover-loop.mp4"),
    poster: img("cover-poster.jpg"),
    width: 1920,
    height: 1080,
    alt: "A looping mint motion graphic. The Figma logo, built from its five colored shapes, splits apart and turns into three linked text columns. Lines of text fill the columns one after another, blue thread lines join them, and a red plus appears on the last column before the scene fades back to the mint background.",
  } satisfies Clip,
  meta: [
    {
      label: "Role",
      value: "Solo (research, design, prototype, plugin build)",
    },
    { label: "Timeline", value: "October to November 2026" },
    {
      label: "Scope",
      value:
        "Product design, interaction design, desk research, prototyping, plugin development",
    },
    { label: "Tools", value: "Figma, Figma Plugin API, TypeScript" },
  ],
  sections: [
    {
      id: "overview",
      label: "Overview",
      blocks: [
        {
          type: "h2",
          text: "Figma has no way to flow one story across text boxes.",
        },
        {
          type: "p",
          text: "InDesign already does. Text that does not fit in one frame flows into the next, and the story reflows when the copy changes. In Figma, every text box stands alone.",
        },
        {
          type: "image",
          frame: {
            src: img("brief.png"),
            width: 2686,
            height: 1080,
            alt: "Blue banner labeled The brief with the question: How might we let long text flow across boxes in Figma, so editorial layouts can stay in one collaborative tool?",
          },
        },
        {
          type: "video",
          clip: {
            mp4: vid("reel-concept-clips-0-to-8-loop.mp4"),
            poster: img("reel-concept-clips-0-to-8-poster.jpg"),
            ...concept,
            alt: "A Figma style editor where text is linked across three magazine columns, reflows on edit, and survives a deleted column.",
            caption: "The concept in about a minute.",
          },
        },
        { type: "h4", text: "My role" },
        {
          type: "p",
          text: "I did this solo, from October to November 2026: desk research, principles, three directions, an 8 screen UI3 concept with a Smart Animate prototype, and a working Figma plugin that proves the behavior on a real magazine spread.",
        },
      ],
    },
    {
      id: "problem",
      label: "Problem",
      blocks: [
        { type: "h2", text: "Every text box in Figma is an island" },
        {
          type: "p",
          text: "In InDesign, text that does not fit in one frame flows into the next linked frame. Edit a paragraph, resize a column, or delete a frame, and the story reflows. In Figma, every text box stands alone. Multi column layouts, magazine spreads, reports, and text heavy slides all mean splitting copy by hand and redoing it every time the copy changes.",
        },
        {
          type: "image",
          frame: {
            src: img("problem.png"),
            width: 2686,
            height: 1080,
            alt: "Light gray banner labeled The problem with the line Every text box in Figma is an island, framed by scattered, unlinked text box shapes in blue, mint, red, white, and black, one of them showing a red overflow plus.",
          },
        },
        { type: "h4", text: "People have been asking for five years" },
        {
          type: "p",
          text: 'The main Figma forum request, "Link textboxes in Figma", was opened in April 2021. On November 10, 2026 it showed 55 replies and 12,508 views. Newer requests keep appearing, including one from a Figma Slides user in December 2025.',
        },
        {
          type: "image",
          maxWidth: 500,
          frame: {
            src: img("forum-thread-screenshot.png"),
            width: 1000,
            height: 1786,
            alt: "Screenshot of the Figma forum thread titled Link textboxes in Figma, showing 55 replies and 12508 views and the first replies.",
            caption:
              'The public "Link textboxes in Figma" thread on the Figma forum, captured November 10, 2026.',
          },
        },
        {
          type: "quote",
          text: "I found this thread while trying to figure out if I should convince a collaborator to move from InDesign to Figma. If text wrapping between text boxes is not possible, we'll be sticking with InDesign.",
          cite: "Nick_DeMaison, Figma forum",
        },
        {
          type: "quote",
          text: "Just keeping this alive. I'd rather have simple and extremely useful things like this than AI, which is blocked in my company anyway...",
          cite: "Bas_Poppink1, Figma forum",
        },
        { type: "h4", text: "The opportunity" },
        {
          type: "h2",
          text: "What if text in Figma could flow from one box to the next, the way it has in publishing tools for years?",
        },
        {
          type: "image",
          frame: {
            src: img("opportunity.png"),
            width: 2686,
            height: 1080,
            alt: "Mint banner labeled The opportunity with the question What if text in Figma could flow from one box to the next, the way it has in publishing tools for years? Three numbered text boxes climb toward the corner, joined by blue thread lines.",
          },
        },
      ],
    },
    {
      id: "research",
      label: "Research",
      blocks: [
        { type: "h2", text: "Desk research" },
        {
          type: "p",
          text: "I read every forum request end to end, studied how InDesign, Affinity Publisher, and QuarkXPress thread text, and checked whether any browser based design tool does it today.",
        },
        {
          type: "list",
          items: [
            "InDesign gives every frame an in port and an out port. A red plus in the out port means overset text.",
            "Affinity Publisher uses flow triangles on the frame corners and can show the text flow as lines.",
            "QuarkXPress uses a separate linking tool and shows the chain as arrows.",
            'Canva\'s help center lists "Text won\'t automatically flow across multiple text boxes" as a limitation. Penpot\'s team confirmed in May 2026 that it cannot run text from one element to another.',
          ],
        },
        {
          type: "image",
          frame: {
            src: img("diagram-research-insight.png"),
            width: 1790,
            height: 720,
            alt: "Diagram titled What people do today with three linked squares. Copy split by hand, redone on every edit. Overflow is easy to miss, fixed boxes do not pass it on. Work stays in InDesign, for ebooks, reports, and layouts.",
            caption:
              "What people do today: split copy by hand, miss overflow, or keep the work in InDesign.",
          },
        },
        { type: "h2", text: "Competitive analysis" },
        {
          type: "image",
          frame: {
            src: img("competitive-comparison.png"),
            width: 2880,
            height: 1800,
            alt: "Comparison table of InDesign, Affinity Publisher, QuarkXPress, Canva, Penpot, Framer, Figma today, and this concept across linked text boxes, overflow indicator, visible thread, and reflow on edit.",
            caption:
              "Publishing tools thread text. Browser design tools do not. Checked November 2026 from each product's docs or community answers.",
          },
        },
        {
          type: "p",
          text: "Plugins exist, including the community plugin Text Threading (September 2026) and my own prototype. That shows demand, but a plugin cannot draw ports in Figma's own interface or reflow live while you type. That gap is the case for a native feature.",
        },
        { type: "h2", text: "Persona hypotheses" },
        {
          type: "image",
          frame: {
            src: img("persona-hypotheses.png"),
            width: 2880,
            height: 1440,
            alt: "Three persona cards, each tagged Hypothesis, not validated: the editorial designer, the slide builder, and the product designer with long copy.",
            caption: "Three hypotheses drawn from public forum posts. Not validated.",
          },
        },
        {
          type: "p",
          text: "These are assumptions, not findings. I have not run interviews yet.",
        },
        { type: "h2", text: "Interviews planned" },
        {
          type: "p",
          text: "Next, I plan to interview 5 to 6 designers who do editorial or long text work, and run a short unmoderated test on the prototype. The screener, discussion guide, and test plan are ready.",
        },
      ],
    },
    {
      id: "principles",
      label: "Principles",
      blocks: [
        { type: "h2", text: "What makes threading feel like it belongs in Figma?" },
        {
          type: "tiles",
          frames: [
            {
              src: img("principle-1.png"),
              width: 848,
              height: 848,
              alt: "Tile labeled Feel native. A selected mint text box with a blue out port sits beside a panel whose Text flow control reads Linked, 1 of 3.",
              caption: "Feel native. Threading should look like it shipped with UI3.",
            },
            {
              src: img("principle-2.png"),
              width: 848,
              height: 848,
              alt: "Tile labeled Never lose a word. A text box with a red overflow plus, and a dark toast reading Box deleted. Text kept. Undo.",
              caption: "Never lose a word. Overflow is always visible, and deleting a box keeps its text.",
            },
            {
              src: img("principle-3.png"),
              width: 848,
              height: 848,
              alt: "Tile labeled Show the thread when it matters. Three numbered text boxes step down the tile, joined by blue thread lines between their ports.",
              caption: "Show the thread when it matters. Ports and lines appear on selection.",
            },
          ],
        },
      ],
    },
    {
      id: "explorations",
      label: "Explorations",
      blocks: [
        { type: "h2", text: "How should you create and see a thread?" },
        {
          type: "p",
          text: "I compared three directions side by side on one decision board.",
        },
        {
          type: "image",
          frame: {
            src: img("directions-a-b-c-comparison.png"),
            width: 1328,
            height: 332,
            alt: "Decision board with three cards. Direction A, Port and link, marked Recommended for v1. Direction B, Flow Auto Layout property. Direction C, Story object.",
            caption:
              "Direction A leads v1. B is a complementary Auto Layout shortcut. C is a later power-user story object.",
          },
        },
        { type: "h4", text: "Direction A: Port and link (recommended for v1)" },
        {
          type: "p",
          text: "Canvas-first connectors. Every text frame gets in and out ports, it works across freeform pages, and it is the best match to what people ask for when they mention InDesign.",
        },
        { type: "h4", text: "Direction B: Flow Auto Layout property" },
        {
          type: "p",
          text: "A parent Flow property that runs text across its children. Great inside structured layouts, and complementary to ports rather than a replacement.",
        },
        { type: "h4", text: "Direction C: Story object" },
        {
          type: "p",
          text: "A named story in the Layers panel. A power-user story object that is strong for long documents, planned as a later milestone after ports.",
        },
        { type: "h2", text: "Why ports and link?" },
        {
          type: "p",
          text: "Ports work anywhere on the canvas, not only inside an Auto Layout parent, and they match the model people already know from InDesign and Affinity. B and C stay on the roadmap: B as a shortcut for structured layouts, C for long documents once ports exist.",
        },
        {
          type: "image",
          frame: {
            src: img("diagram-why-ports.png"),
            width: 1790,
            height: 720,
            alt: "Two labels joined by a plus: Works anywhere on the canvas, plus A model people already know. Around them are scattered text boxes, ports, a blue thread line, a red overflow plus, and a cursor.",
          },
        },
        { type: "h2", text: "Direction A in wireframes" },
        {
          type: "p",
          text: "Before going high fidelity, I wireframed Direction A through 13 states, including edge cases like multiplayer, page breaks, keyboard only linking, and cycles.",
        },
        {
          type: "image",
          enlarge: true,
          frame: {
            src: img("wireframes-direction-a-overview.png"),
            width: 6928,
            height: 4200,
            alt: "A grid of 14 low fidelity wireframes covering ports, overflow, linking, threaded state, properties, layers, delete, multiplayer, resize, page breaks, Auto Layout, keyboard linking, cyclic links, and the directions board.",
            caption: "All Direction A wireframes on one board.",
          },
        },
        {
          type: "image",
          frame: {
            src: img("wireframe-01-hover-ports.png"),
            width: 1328,
            height: 800,
            alt: "Wireframe of a single text frame with small in and out ports on its edges.",
            caption: "Ports appear on hover and selection.",
          },
        },
        {
          type: "image",
          frame: {
            src: img("wireframe-03-linking-flow.png"),
            width: 1328,
            height: 800,
            alt: "Wireframe of a loaded cursor linking one text frame to an empty frame beside it.",
            caption: "Click the out port, then the next frame.",
          },
        },
        {
          type: "image",
          frame: {
            src: img("wireframe-11-auto-layout-hybrid.png"),
            width: 1328,
            height: 800,
            alt: "Wireframe of linked text frames placed inside an Auto Layout container.",
            caption: "Where A meets B: linked frames inside an Auto Layout parent.",
          },
        },
      ],
    },
    {
      id: "solution",
      label: "Solution",
      blocks: [
        { type: "h2", text: "Text flow: thread text the way Figma would" },
        {
          type: "p",
          text: 'Eight screens at 1440 x 900, drawn to look like Figma UI3 on a real "Wander" magazine Lisbon spread, linked with Smart Animate.',
        },
        {
          type: "beside",
          clip: conceptClip(
            "clip0-finding-text-flow",
            "The right panel Typography section with a Text flow control below Alignment, and the selected column's out port highlighting.",
            "Find it where text lives. Select a fixed size text box and a new Text flow control appears in Typography. Its Link button highlights the out port.",
          ),
          frame: {
            src: img("closeup-text-flow-control.png"),
            width: 340,
            height: 450,
            alt: "Close up of the Typography section with a Text flow row showing link status, plus Previous frame and Next frame fields.",
            caption:
              "The Text flow control sits under Alignment, with the previous and next frame listed below.",
          },
        },
        {
          type: "video",
          clip: conceptClip(
            "clip1-select-text-flow",
            "Selecting the first column of the Lisbon spread brings up the Text flow control.",
            "Select a column and Text flow shows what that box can do.",
          ),
        },
        {
          type: "video",
          clip: conceptClip(
            "clip2-overflow-red-plus",
            "A text column with a red plus on its out port, showing overset text.",
            "Overflow is never hidden. A red plus marks text that does not fit.",
          ),
        },
        {
          type: "video",
          clip: conceptClip(
            "clip3-link-with-ports",
            "Clicking the out port on column one, then column two, and the text continuing across columns with a thread line.",
            "Click the out port, click the next box, and the story flows across.",
          ),
        },
        {
          type: "video",
          clip: conceptClip(
            "clip4-thread-layers-panel",
            "The Layers panel listing the linked columns as one thread, with each column highlighting on the canvas.",
            "The thread is readable in the Layers panel too.",
          ),
        },
        {
          type: "video",
          clip: conceptClip(
            "clip5-reflow-on-edit",
            "A collaborator cursor edits a column and the text in the following columns shifts to fit.",
            "Edit anywhere, even with a collaborator, and the rest of the story reflows live.",
          ),
        },
        {
          type: "video",
          clip: conceptClip(
            "clip6-delete-toast-undo",
            "Deleting the middle column, a toast confirming the text was kept, and Undo restoring the column.",
            "Delete a linked box and its text stays in the story. Undo is one click away.",
          ),
        },
        {
          type: "note",
          text: "Some spacing values are estimates because the official UI3 kit would not open. Any keyboard shortcuts shown are my proposals, not real Figma shortcuts.",
        },
      ],
    },
    {
      id: "smaller-decisions",
      label: "Smaller decisions",
      blocks: [
        { type: "h2", text: "What happens when the thread changes?" },
        {
          type: "image",
          frame: {
            src: img("diagram-thread-changes.png"),
            width: 1790,
            height: 720,
            alt: "Diagram titled When the thread changes with four squares. Delete a linked box: text kept, Undo. Resize a box: reflows as you drag. Mixed styles: every run keeps its style. Link back into the story: cycles blocked.",
          },
        },
        { type: "h4", text: "Deleting a linked box" },
        {
          type: "p",
          text: "First pass: a confirm dialog on every delete, asking whether to stitch the neighbors together or park the text as unlinked overflow.",
        },
        {
          type: "p",
          text: "Final: delete right away, keep the text in the story, and show a toast with Undo.",
        },
        {
          type: "p",
          text: "Why: a dialog interrupts every delete and asks a question most people cannot answer yet. Undo protects against the rare mistake at no cost.",
        },
        {
          type: "image",
          frame: {
            src: img("wireframe-07-unlink-delete-edge-case.png"),
            width: 1328,
            height: 800,
            alt: "Wireframe of three linked frames with the middle one selected and a dialog titled Delete middle frame with Stitch neighbors, Park text, and Cancel.",
            caption: "First pass. A dialog asking whether to stitch neighbors or park text.",
          },
        },
        {
          type: "video",
          clip: conceptClip(
            "clip6-delete-toast-undo",
            "Deleting the middle column, a toast confirming the text was kept, and Undo restoring the column.",
            "Final. The text stays in the story, a toast confirms it, and Undo brings the box back.",
          ),
        },
        { type: "h4", text: "Resizing a box" },
        {
          type: "p",
          text: "Alternative: reflow only when you press a Reflow button, which is how my plugin works today.",
        },
        {
          type: "p",
          text: "Final: the thread reflows as you drag. Shorten column 1 and its lines carry into columns 2 and 3. When there is no room left, column 3 shows the red plus.",
        },
        {
          type: "video",
          clip: conceptClip(
            "clip7-resize",
            "Dragging the bottom handle of the first column up, the text shifting into the second and third columns, and a red plus appearing on the third column.",
            "Drag column 1 shorter and its lines carry into columns 2 and 3 until column 3 overflows with a red plus.",
          ),
        },
        {
          type: "stills",
          frames: [
            {
              src: img("clip7-a-resize-handle-grabbed.png"),
              width: 1440,
              height: 900,
              alt: "The first column selected with its bottom resize handle grabbed.",
              caption: "Grab column 1's bottom handle.",
            },
            {
              src: img("clip7-b-lines-carry-over.png"),
              width: 1440,
              height: 900,
              alt: "The first column shorter, with its last lines now at the top of the second column.",
              caption: "Lines carry into columns 2 and 3.",
            },
            {
              src: img("clip7-c-overset-red-plus.png"),
              width: 1440,
              height: 900,
              alt: "The third column full, with a red plus on its out port.",
              caption: "Column 3 overflows with a red plus.",
            },
          ],
        },
        { type: "h4", text: "Mixed styles" },
        {
          type: "p",
          text: "Alternative: apply one style to the whole story. My first plugin build did this, and the drop cap's color and leading spread onto all the body text.",
        },
        {
          type: "p",
          text: "Final: every run keeps its own style. After an edit, an italic run, an Anton drop cap, and a bold run move from column 1 to column 2 intact, and column 3 overflows.",
        },
        {
          type: "video",
          clip: conceptClip(
            "clip8-mixed-styles",
            "Editing the first column while styled text, including an italic phrase, a large drop cap, and a bold phrase, reflows into the second column unchanged, and the third column shows a red plus.",
            "After an edit, the italic run, drop cap, and bold run move from column 1 to column 2 with their styles intact.",
          ),
        },
        {
          type: "stills",
          frames: [
            {
              src: img("clip8-a-styled-runs-column-1.png"),
              width: 1440,
              height: 900,
              alt: "The first column with an italic phrase, a drop cap, and a bold phrase.",
              caption: "Styled runs in column 1.",
            },
            {
              src: img("clip8-b-styled-runs-column-2.png"),
              width: 1440,
              height: 900,
              alt: "The same italic, drop cap, and bold runs now at the top of the second column.",
              caption: "After the edit, the same runs sit in column 2, styles intact.",
            },
          ],
        },
        { type: "h4", text: "Linking back into the same story" },
        {
          type: "p",
          text: "Decision: block it. Trying to link frame 3 back into frame 1 shows an inline message and a red invalid target, so a story can never loop.",
        },
        {
          type: "image",
          frame: {
            src: img("wireframe-13-cyclic-link-error.png"),
            width: 1328,
            height: 800,
            alt: "Wireframe of three linked frames with frame 1 outlined in red and the message Cannot create a cycle. Frame 1 is already earlier in this story.",
            caption: "Cycles are blocked with a clear reason.",
          },
        },
      ],
    },
    {
      id: "plugin",
      label: "Plugin as proof",
      blocks: [
        { type: "h2", text: "A concept can fake anything, so I built it" },
        {
          type: "p",
          text: "I wrote a working development plugin, Linked Text Frames (Prototype), in TypeScript on the Figma Plugin API and tested it on the real Wander spread. On November 10, 2026, link, reflow, auto reflow, and delete all worked in Figma.",
        },
        {
          type: "link",
          text: "View the plugin on GitHub",
          href: "https://github.com/Im-ma/linked-text-frames-plugin",
        },
        {
          type: "video",
          clip: pluginClip(
            "plugin1-open-plugin",
            "The Linked Text Frames plugin panel with order options, a Link button, and Auto-reflow and Show overlay checkboxes.",
            "Open the plugin from Plugins, Development. Choose the order, link, and turn on auto reflow or the overlay.",
          ),
        },
        {
          type: "video",
          clip: pluginClip(
            "plugin2-link-frames",
            "Three magazine columns selected, the Link button clicked, a toast reading Linked 3 frames and reflowed, and thread lines between columns.",
            "Select three columns and link them. The story reflows and thread lines appear.",
          ),
        },
        {
          type: "video",
          clip: pluginClip(
            "plugin3-reflow-on-edit",
            "Typing in the first column, then the plugin reporting Auto-reflow complete as text shifts across columns.",
            "Edit column one. About a second after typing stops, the story reflows.",
          ),
        },
        {
          type: "video",
          clip: pluginClip(
            "plugin4-delete-frame-overset",
            "The middle column deleted, the thread line rerouting, and a red overset marker on the last column.",
            "Delete the middle frame. The thread reroutes and a red marker flags overset text.",
          ),
        },
        {
          type: "video",
          clip: pluginClip(
            "plugin5-draw-new-frame",
            "A new text frame drawn on the spread, filling with the remaining text as the overset marker clears.",
            "Draw a new frame and the overset text flows into it.",
          ),
        },
        { type: "h4", text: "How it works" },
        {
          type: "list",
          items: [
            "The story and its order are stored in shared plugin data, so a thread survives closing the file.",
            "A binary search with one off canvas probe finds how much text fits each box. The probe is always removed.",
            "Splits never land inside a word and avoid an orphan word at the top of a column.",
            "Every run keeps its font, size, line height, letter spacing, case, and fill.",
            "Auto reflow waits 1.2 seconds after the last edit, ignores its own writes, and never overwrites your typing.",
          ],
        },
        { type: "h4", text: "What building it taught me" },
        {
          type: "list",
          items: [
            "Auto reflow looped on its own writes at first. Recognizing its own edits by content fixed it.",
            "Deleting a frame used to lose its text. Now every reflow records what each frame holds, so delete and Undo are safe.",
            "A plugin cannot add ports to Figma's interface or reflow while you type on the canvas. That is the case for building it natively.",
          ],
        },
      ],
    },
    {
      id: "outcome",
      label: "Outcome",
      blocks: [
        { type: "h2", text: "A native concept and a plugin that proves it" },
        {
          type: "p",
          text: "The result is an 8 screen UI3 concept with a Smart Animate prototype, 9 prototype clips, and a working plugin tested on a real magazine spread. This has not shipped and has not been tested with users yet, so there are no usage numbers. Next, I will run the interviews and the unmoderated test, and check every estimated UI3 value against the official kit.",
        },
        {
          type: "pair",
          frames: [
            {
              src: img("outcome-concept.png"),
              width: 1668,
              height: 1114,
              alt: "The Wander magazine Lisbon spread on a mint background, its story flowing across three numbered, linked columns, with a Text flow panel reading Linked, 1 of 3, Previous frame None, Next frame Lisbon / Col 2.",
              caption:
                "The concept: the Wander Lisbon spread threaded across three columns, with Text flow showing Linked, 1 of 3.",
            },
            {
              src: img("outcome-plugin.png"),
              width: 1668,
              height: 1114,
              alt: "The Linked Text Frames prototype plugin panel over the Wander Lisbon spread in Figma, with the story flowing across three columns marked 1, 2, and 3 and joined by thread lines.",
              caption: "The plugin: the same spread in Figma, linked across three columns by my working plugin.",
            },
          ],
        },
      ],
    },
    {
      id: "reflection",
      label: "Reflection",
      blocks: [
        {
          type: "lessons",
          items: [
            {
              title: "Building it changed the design.",
              text: "Delete, drop caps, and typing during a reflow only showed up once real text moved through real boxes.",
            },
            {
              title: "A small feature still has to respect the whole system.",
              text: "Threading had to work with Undo, the Layers panel, collaborators, and the way people already think about text.",
            },
          ],
        },
      ],
    },
  ] satisfies StudySection[],
  credits: [
    "Independent student concept by Immanuel Mensah. Not affiliated with, endorsed by, or sponsored by Figma. Figma and UI3 belong to Figma.",
    "Magazine photos from Wikimedia Commons (CC BY or public domain), credited on the pages: Paxson Woelber (cover), Tiomax80 (contents), Dale Cruse (Lisbon rooftops), Christine Zenino (tram), and thumbnails by Ben and Gab, Joshua Tree NP, Sanshiro Kubota, Don Ramey Logan, procsilas, Winky, and Pierre Selim Huard.",
    "Forum quotes are from public posts on forum.figma.com, credited by username.",
  ],
};
