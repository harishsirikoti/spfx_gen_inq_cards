/**
 * Result of checking a navigation URL.
 */
export interface IUrlValidationResult {
  /** True when the URL is safe to use as a link target. */
  isValid: boolean;
  /** True when nothing was entered. Empty is allowed in settings, but the button stays disabled. */
  isEmpty: boolean;
  /** The cleaned (trimmed) URL. Only set when isValid is true. */
  url?: string;
  /** A short message for page editors. Only set when the URL is not empty and not valid. */
  error?: string;
}

// Control characters and spaces are never allowed inside a link.
// This blocks tricks such as "java\tscript:" or line breaks hidden in the text.
// eslint-disable-next-line no-control-regex
const FORBIDDEN_CHARACTERS: RegExp = /[\u0000-\u0020\u007f\\]/;

// One simple email address, optionally followed by ?subject=... style parameters.
const MAILTO_PATTERN: RegExp = /^mailto:[^\s@?#,;<>]+@[^\s@?#,;<>]+\.[^\s@?#,;<>]+(\?[^\s#]*)?$/i;

export const URL_HELP_TEXT: string =
  'Use an https:// link, a path starting with a single "/", or a mailto: link.';

/**
 * Checks a navigation URL. Used both in the Property Pane and again before rendering,
 * so a bad value saved earlier can never become a clickable link.
 */
export function validateNavigationUrl(rawValue: string | undefined): IUrlValidationResult {
  const value: string = (rawValue || '').trim();

  // Nothing entered: not an error, but there is no link to use.
  if (value === '') {
    return { isValid: false, isEmpty: true };
  }

  const invalid = (error: string): IUrlValidationResult => ({ isValid: false, isEmpty: false, error });

  // Reject spaces, control characters and backslashes anywhere in the value.
  if (FORBIDDEN_CHARACTERS.test(value)) {
    return invalid('The link contains spaces or characters that are not allowed. ' + URL_HELP_TEXT);
  }

  // Site-relative path: one "/" at the start. "//" would be a protocol-relative URL, so reject it.
  if (value.charAt(0) === '/') {
    if (value.charAt(1) === '/') {
      return invalid('Links starting with "//" are not allowed. ' + URL_HELP_TEXT);
    }
    return { isValid: true, isEmpty: false, url: value };
  }

  // Email link.
  if (/^mailto:/i.test(value)) {
    return MAILTO_PATTERN.test(value)
      ? { isValid: true, isEmpty: false, url: value }
      : invalid('The email link is not valid. Example: mailto:desk@contoso.com');
  }

  // Secure web link. The URL parser also catches malformed addresses.
  if (/^https:\/\//i.test(value)) {
    try {
      const parsed: URL = new URL(value);
      // Reject an empty host and links that hide a user name or password.
      if (parsed.protocol === 'https:' && parsed.hostname !== '' && parsed.username === '' && parsed.password === '') {
        return { isValid: true, isEmpty: false, url: value };
      }
    } catch {
      // Falls through to the error below.
    }
    return invalid('The web address is not valid. ' + URL_HELP_TEXT);
  }

  // Everything else (javascript:, http:, data:, bare words, ...) is rejected.
  return invalid('This type of link is not allowed. ' + URL_HELP_TEXT);
}
