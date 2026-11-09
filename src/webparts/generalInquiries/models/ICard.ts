/**
 * One inquiry card shown by the web part.
 * This is the shape saved in the web part properties.
 */
export interface IInquiryCard {
  /** Stable unique ID. Used as the React key and to keep card identity while reordering. */
  id: string;
  /** Card heading, for example "Need Live Drop-In?". */
  title: string;
  /** Short helper text shown under the title. */
  description: string;
  /** Where the button goes. Allowed: https://, a path starting with a single "/", or mailto:. */
  url: string;
  /** Text shown inside the button. */
  buttonText: string;
}
