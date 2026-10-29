type FocusTarget = { tag: string; attribute: string | null; value: string; index: number };
const targets = new Map<string, FocusTarget>();
const selector = 'button,a,input,select,textarea,summary';

export function rememberScreenFocus(key: string) {
  const active = document.activeElement as HTMLElement | null;
  const frame = active?.closest('.screen-transition-frame');
  if (!active || !frame || !active.matches(selector)) { targets.delete(key); return; }
  const attribute = ['data-home-section', 'data-art', 'data-testid', 'id', 'aria-label', 'placeholder', 'href'].find(name => active.hasAttribute(name)) ?? null;
  const value = attribute ? active.getAttribute(attribute)! : active.textContent?.trim() ?? '';
  if (!value) return;
  const matches = [...frame.querySelectorAll<HTMLElement>(selector)].filter(node => node.tagName === active.tagName
    && (attribute ? node.getAttribute(attribute) : node.textContent?.trim()) === value);
  targets.set(key, { tag: active.tagName, attribute, value, index: matches.indexOf(active) });
}

export function hasScreenFocus(key: string) { return targets.has(key); }

export function restoreScreenFocus(key: string, frame: HTMLElement) {
  const target = targets.get(key);
  if (!target) return true;
  const matches = [...frame.querySelectorAll<HTMLElement>(selector)].filter(node => node.tagName === target.tag
    && (target.attribute ? node.getAttribute(target.attribute) : node.textContent?.trim()) === target.value);
  const element = matches[target.index];
  if (!element) return false;
  element.focus({ preventScroll: true });
  return true;
}
