import { Guid } from '@microsoft/sp-core-library';
import { IInquiryCard } from '../models/ICard';

/**
 * The two cards new web parts start with. URLs are left empty on purpose;
 * page editors add the real links.
 * The same values are repeated in the manifest, which is what new instances actually use.
 */
export const DEFAULT_TITLE: string = 'General Inquiries';

export const DEFAULT_CARDS: IInquiryCard[] = [
  {
    id: 'default-drop-in',
    title: 'Need Live Drop-In?',
    description: 'Contact the central mailbox or join bi-weekly Teams drop-in sessions.',
    url: '',
    buttonText: 'Email Desk'
  },
  {
    id: 'default-feedback',
    title: 'Feedback, Issue or Recommendation?',
    description: 'Help us improve request workflows, intake forms, etc.',
    url: '',
    buttonText: 'Submit Feedback'
  }
];

/**
 * Cleans the saved card list.
 * - Never configured (undefined): use the defaults.
 * - Empty array: the editor removed every card on purpose, so keep it empty.
 * - Otherwise: make sure every card has a text value for each field and a stable unique ID.
 */
export function normalizeCards(cards: Partial<IInquiryCard>[] | undefined): IInquiryCard[] {
  if (!Array.isArray(cards)) {
    return DEFAULT_CARDS.map((card) => ({ ...card }));
  }

  return cards.map((card) => {
    // The Property Pane collection control stores its own "uniqueId". Reuse it if present.
    const savedId: string | undefined = card.id || (card as { uniqueId?: string }).uniqueId;
    return {
      id: savedId || Guid.newGuid().toString(),
      title: card.title || '',
      description: card.description || '',
      url: card.url || '',
      buttonText: card.buttonText || ''
    };
  });
}
