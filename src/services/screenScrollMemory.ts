/**
 * Where each screen was left, so going back returns there.
 *
 * Every screen change mounts a fresh `.screen-transition-frame`, and a fresh
 * element starts at scroll position 0. That is right on the way in — a screen
 * you have never opened should begin at its top — but wrong on the way back:
 * scrolling to the bottom of Home, opening the fasting assistant and returning
 * dropped the reader at the very top of Home, with the card they had just
 * tapped somewhere far below.
 *
 * The position is held per screen key, the same key the frame is rendered
 * under, so a Dua, a Surah or a calendar day each keep their own. It lives in
 * memory only: a reload starts the session over, which is what a reload is.
 */

const positions = new Map<string, number>();

/** Last known scroll offset of this screen, or 0 when it is new to the session. */
export function readScreenScroll(key: string) {
  return positions.get(key) ?? 0;
}

export function rememberScreenScroll(key: string, offset: number) {
  // A negative offset is what rubber-band scrolling reports on iOS at the top
  // edge. Storing it would restore into the overscroll gap.
  positions.set(key, Math.max(0, offset));
}

export function forgetScreenScroll(key: string) {
  positions.delete(key);
}

export function clearScreenScrollMemory() {
  positions.clear();
}
