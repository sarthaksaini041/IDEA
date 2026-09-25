/**
 * Paths no real page can have: backslashes (raw or %5C), NUL bytes, or percent-encoding
 * that does not decode. Bots probe these; without this check Next.js tries to resolve them
 * as files and answers 500 instead of 404.
 */
export function isMalformedPath(pathname: string): boolean {
  if (/%5c|\\|%00|\u0000/i.test(pathname)) return true;
  try {
    decodeURIComponent(pathname);
  } catch {
    return true;
  }
  return false;
}
