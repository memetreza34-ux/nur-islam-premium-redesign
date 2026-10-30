import { hasScreenFocus, restoreScreenFocus } from './screenFocusMemory';

export function restoreScrollWhenReady(node: HTMLElement, offset: number, key: string) {
  if (offset <= 0 && !hasScreenFocus(key)) return () => {};
  let stopped = false;
  let frame = 0;
  let observed: Element | null = null;
  node.dataset.restoringScroll = 'true';

  const stop = () => {
    if (stopped) return;
    stopped = true;
    delete node.dataset.restoringScroll;
    cancelAnimationFrame(frame);
    resize.disconnect();
    mutations.disconnect();
    clearTimeout(timeout);
    for (const type of ['wheel', 'touchstart', 'pointerdown', 'keydown']) node.removeEventListener(type, stop);
  };
  const restore = () => {
    if (stopped || !node.isConnected) return;
    const content = node.firstElementChild;
    if (content !== observed) {
      if (observed) resize.unobserve(observed);
      observed = content;
      if (observed) resize.observe(observed);
    }
    node.scrollTop = offset;
    if (Math.abs(node.scrollTop - offset) <= 1 && restoreScreenFocus(key, node)) stop();
  };
  const resize = new ResizeObserver(restore);
  const mutations = new MutationObserver(restore);
  const timeout = setTimeout(stop, 10000);
  mutations.observe(node, { childList: true, subtree: true });
  for (const type of ['wheel', 'touchstart', 'pointerdown', 'keydown']) node.addEventListener(type, stop, { passive: true });
  restore();
  if (!stopped) frame = requestAnimationFrame(restore);
  return stop;
}
