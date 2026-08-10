/**
 * Refuses to run inside a frame owned by another site.
 *
 * The Content Security Policy lives in a meta tag because GitHub Pages cannot
 * send headers, and `frame-ancestors` is ignored in a meta tag — so nothing
 * currently stops another page from embedding the app invisibly and collecting
 * taps on whatever sits under the pointer. The account screen deletes all cloud
 * data behind a single confirm, which is exactly the kind of control that makes
 * that worth blocking.
 *
 * A same-origin frame is left alone: it cannot be a foreign site, and blocking
 * it would break local tooling that previews the app in an iframe.
 */
export function isFramedByForeignSite() {
  if (window.top === window.self) return false;
  try {
    // Reading the parent's origin throws precisely when it is a foreign site.
    return window.top?.location.origin !== window.location.origin;
  } catch {
    return true;
  }
}

export function blockForeignFraming(root: HTMLElement) {
  const notice = document.createElement('main');
  notice.className = 'frame-guard';
  notice.lang = 'de';

  const heading = document.createElement('h1');
  heading.textContent = 'Nur Islam läuft nicht in fremden Seiten';

  const copy = document.createElement('p');
  copy.textContent = 'Diese Seite hat versucht, Nur Islam eingebettet zu laden. Öffne die App direkt, damit deine Eingaben sicher bleiben.';

  const link = document.createElement('a');
  link.href = window.location.href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'Nur Islam direkt öffnen';

  notice.append(heading, copy, link);
  root.replaceChildren(notice);
}
