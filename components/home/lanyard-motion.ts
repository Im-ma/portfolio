"use client";

import {
  DROP,
  FRAME_CAP,
  SHIFT_X,
  advance,
  createBody,
  createRestBody,
  isSettled,
  poseOf,
} from "./lanyard-physics";

type Nodes = {
  header: HTMLElement;
  page: HTMLElement;
  spins: HTMLElement[];
  card: HTMLElement;
};

let nodes: Nodes | null = null;
let body = createRestBody();
let reduced = false;
let running = false;
let raf = 0;
let last = 0;
let limits = { left: SHIFT_X, right: SHIFT_X };

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function measure() {
  const logo = document.querySelector("header a[class*='logo']");
  const menu = document.querySelector("header button[class*='menuButton']") as HTMLElement | null;
  const nav = document.querySelector("header div[class*='desktop']") as HTMLElement | null;
  if (!logo) return;
  const center = window.innerWidth / 2;
  const strapW = window.innerWidth <= 520 ? 12 : 16;
  const swing = Math.sin((18 * Math.PI) / 180) * 72;
  const half = strapW / 2;
  const pad = 10;
  const logoRight = logo.getBoundingClientRect().right;
  const menuOn = !!menu && getComputedStyle(menu).display !== "none";
  const rightEdge = menuOn
    ? menu!.getBoundingClientRect().left
    : (nav?.getBoundingClientRect().left ?? window.innerWidth);
  limits = {
    left: Math.max(0, center - half - swing - pad - logoRight),
    right: Math.max(0, rightEdge - (center + half + swing + pad)),
  };
}

function apply() {
  if (!nodes) return;
  const pose = poseOf(body);
  const x = clamp(pose.x, -limits.left, limits.right);
  const scroll = window.scrollY || 0;
  nodes.header.style.transform = `translate3d(${x}px, ${pose.y - scroll}px, 0)`;
  nodes.header.style.opacity = String(pose.opacity);
  nodes.page.style.transform = `translate3d(${x}px, ${pose.y}px, 0)`;
  nodes.page.style.opacity = String(pose.opacity);
  const spin = `rotate(${pose.strapDeg}deg)`;
  for (const el of nodes.spins) el.style.transform = spin;
  const local = pose.cardDeg - pose.strapDeg - 1;
  nodes.card.style.transform = `translateY(${pose.cord}px) translateZ(${pose.sway}px) rotate(${local}deg) rotateY(${pose.tiltDeg}deg)`;
}

function frame(now: number) {
  if (!running) return;
  const dt = last ? Math.min((now - last) / 1000, FRAME_CAP) : 1 / 240;
  last = now;
  advance(body, dt);
  apply();
  if (isSettled(body)) {
    running = false;
    return;
  }
  raf = requestAnimationFrame(frame);
}

function start() {
  if (running || reduced) return;
  running = true;
  last = 0;
  raf = requestAnimationFrame(frame);
}

function onScroll() {
  if (nodes) apply();
}

export function mountLanyard(next: Nodes) {
  nodes = next;
  reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  body = reduced ? createRestBody() : createBody();
  measure();
  apply();
  window.addEventListener("resize", measure);
  window.addEventListener("scroll", onScroll, { passive: true });
  if (!reduced) start();
  return () => {
    window.removeEventListener("resize", measure);
    window.removeEventListener("scroll", onScroll);
    running = false;
    cancelAnimationFrame(raf);
    nodes = null;
  };
}

export function pointTarget(clientX: number, rect: DOMRect) {
  if (reduced) return;
  const nx = (clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
  body.target = clamp(nx, -1, 1) * SHIFT_X;
  start();
}

export function releaseTarget() {
  if (reduced) return;
  body.target = 0;
  start();
}

export const dropDistance = DROP;
