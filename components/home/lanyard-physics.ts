/** Fixed-step pendulum for the hanging badge.
 * Angles are radians. Degrees are rad * 180 / pi, which lands the first
 * swing on the measured -31 deg peak with these constants. */

export const STEP = 1 / 240;
export const FRAME_CAP = 0.05;

const G = 2600;
const STRAP_LEN = 620;
const CARD_LEN = 190;
const STRAP_DAMP = 2.2;
const CARD_DAMP = 1.15;
const STRAP_DRIVE = 0.55;
const STRAP_MAX = (18 * Math.PI) / 180;
const CARD_MAX = (62 * Math.PI) / 180;
const BOUNCE = 0.65;

const DRIVE_K = 90;
const DRIVE_D = 14;

const FALL_G = 3000;
const CATCH_K = 1200;
const CATCH_D = 26;
const CORD_K = 900;
const CORD_D = 18;
const CORD_TRANSFER = 0.5;
const CORD_MAX = 120;

const TILT_GAIN = 16;
const TILT_MAX = 32;

export const DROP = 600;
export const INTRO_DELAY = 0.1;
export const FADE_IN = 0.35;
export const SHIFT_X = 90;

export type Pose = {
  x: number;
  y: number;
  cord: number;
  strapDeg: number;
  cardDeg: number;
  tiltDeg: number;
  sway: number;
  opacity: number;
};

type Body = {
  y: number;
  yv: number;
  caught: boolean;
  cord: number;
  cordV: number;
  x: number;
  xv: number;
  strap: number;
  strapV: number;
  card: number;
  cardV: number;
  sway: number;
  swayV: number;
  target: number;
  time: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function limit(angle: number, vel: number, max: number) {
  if (angle > max) return { angle: max, vel: vel > 0 ? vel * -BOUNCE : vel };
  if (angle < -max) return { angle: -max, vel: vel < 0 ? vel * -BOUNCE : vel };
  return { angle, vel };
}

export function createBody(): Body {
  return {
    y: -DROP,
    yv: 0,
    caught: false,
    cord: 0,
    cordV: 0,
    x: 0,
    xv: 0,
    strap: (14 * Math.PI) / 180,
    strapV: (-150 * 0.2 * Math.PI) / 180,
    card: (14 * Math.PI) / 180,
    cardV: (-150 * Math.PI) / 180,
    sway: 0,
    swayV: 0,
    target: 0,
    time: 0,
  };
}

export function createRestBody(): Body {
  return {
    y: 0,
    yv: 0,
    caught: true,
    cord: 0,
    cordV: 0,
    x: 0,
    xv: 0,
    strap: 0,
    strapV: 0,
    card: 0,
    cardV: 0,
    sway: 0,
    swayV: 0,
    target: 0,
    time: 10,
  };
}

function substep(body: Body) {
  body.time += STEP;
  let fallA = 0;
  if (body.time >= INTRO_DELAY) {
    if (!body.caught) {
      fallA = FALL_G;
    } else {
      fallA = -CATCH_K * body.y - CATCH_D * body.yv;
    }
    body.yv += fallA * STEP;
    body.y += body.yv * STEP;
    if (!body.caught && body.y >= 0) body.caught = true;
  }

  const cordA = -fallA * CORD_TRANSFER - CORD_K * body.cord - CORD_D * body.cordV;
  body.cordV += cordA * STEP;
  body.cord += body.cordV * STEP;
  body.cord = clamp(body.cord, -CORD_MAX, CORD_MAX);

  const driveA = DRIVE_K * (body.target - body.x) - DRIVE_D * body.xv;
  body.xv += driveA * STEP;
  body.x += body.xv * STEP;

  const strapA =
    -(G / STRAP_LEN) * Math.sin(body.strap) -
    ((driveA * STRAP_DRIVE) / STRAP_LEN) * Math.cos(body.strap) -
    STRAP_DAMP * body.strapV;
  body.strapV += strapA * STEP;
  body.strap += body.strapV * STEP;
  const strapHit = limit(body.strap, body.strapV, STRAP_MAX);
  body.strap = strapHit.angle;
  body.strapV = strapHit.vel;

  const cardA =
    -(G / CARD_LEN) * Math.sin(body.card) -
    ((driveA * 1) / CARD_LEN) * Math.cos(body.card) -
    ((strapA * STRAP_LEN) / CARD_LEN) * 0.12 * Math.cos(body.card) -
    CARD_DAMP * body.cardV;
  body.cardV += cardA * STEP;
  body.card += body.cardV * STEP;
  const cardHit = limit(body.card, body.cardV, CARD_MAX);
  body.card = cardHit.angle;
  body.cardV = cardHit.vel;

  const swayA = 0.7 * ((body.cardV * 180) / Math.PI) * 0.08 - 1.5 * body.sway - 0.7 * body.swayV;
  body.swayV += swayA * STEP;
  body.sway += body.swayV * STEP;
  body.sway = clamp(body.sway, -24, 24);
}

export function advance(body: Body, frameDt: number) {
  let remaining = Math.min(Math.max(frameDt, 0), FRAME_CAP);
  while (remaining > 0) {
    substep(body);
    remaining -= STEP;
  }
}

export function poseOf(body: Body): Pose {
  const elapsed = body.time - INTRO_DELAY;
  const opacity = body.time < INTRO_DELAY ? 0 : Math.min(1, elapsed / FADE_IN);
  return {
    x: body.x,
    y: body.y,
    cord: body.cord,
    strapDeg: (body.strap * 180) / Math.PI,
    cardDeg: (body.card * 180) / Math.PI,
    tiltDeg: clamp(body.cardV * TILT_GAIN, -TILT_MAX, TILT_MAX),
    sway: body.sway,
    opacity,
  };
}

export function isSettled(body: Body) {
  if (!body.caught || Math.abs(body.target) > 0.5) return false;
  return (
    body.time > 1 &&
    Math.abs(body.y) < 0.4 &&
    Math.abs(body.yv) < 4 &&
    Math.abs(body.x) < 0.4 &&
    Math.abs(body.xv) < 4 &&
    Math.abs(body.strap) < 0.012 &&
    Math.abs(body.strapV) < 0.02 &&
    Math.abs(body.card) < 0.012 &&
    Math.abs(body.cardV) < 0.02 &&
    Math.abs(body.cord) < 0.4
  );
}
