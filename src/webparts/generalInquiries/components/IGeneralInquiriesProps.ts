import { IInquiryCard } from '../models/ICard';

export interface IGeneralInquiriesProps {
  /** Main heading shown above the cards. */
  title: string;
  /** Cards to show, already cleaned by normalizeCards(). */
  cards: IInquiryCard[];
}
