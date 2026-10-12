import aboutJson from "@/content/pages/about.json";
import gatheringsJson from "@/content/pages/gatherings.json";
import homeJson from "@/content/pages/home.json";
import labJson from "@/content/pages/lab.json";
import talkJson from "@/content/pages/talk-panel.json";
import siteJson from "@/content/site.json";
import campusEventsJson from "@/content/work/campus-events.json";
import campusRideJson from "@/content/work/campus-ride.json";
import mimicJson from "@/content/work/mimic.json";
import traceJson from "@/content/work/trace.json";

export const site = siteJson;
export const home = homeJson;
export const talkCopy = talkJson;
export const aboutPage = aboutJson;
export const gatheringsPage = gatheringsJson;
export const labPage = labJson;

export const works = [traceJson, mimicJson, campusEventsJson, campusRideJson] as const;

export type WorkMeta = (typeof works)[number];

export function getWork(slug: string) {
  return works.find((work) => work.slug === slug);
}

export function talkLabelForPath(pathname: string) {
  if (pathname.startsWith("/work/")) return site.talkButton.labels.work;
  if (pathname.startsWith("/gatherings")) return site.talkButton.labels.gatherings;
  if (pathname.startsWith("/about")) return site.talkButton.labels.about;
  if (pathname.startsWith("/lab")) return site.talkButton.labels.lab;
  return site.talkButton.labels.home;
}
