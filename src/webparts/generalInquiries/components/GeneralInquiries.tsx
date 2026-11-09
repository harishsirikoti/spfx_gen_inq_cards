import * as React from 'react';
import type { IGeneralInquiriesProps } from './IGeneralInquiriesProps';
import InquiryCard from './InquiryCard';
import styles from './GeneralInquiries.module.scss';

/**
 * Main web part view: a heading followed by the list of cards.
 */
const GeneralInquiries: React.FC<IGeneralInquiriesProps> = ({ title, cards }) => {
  return (
    <section className={styles.generalInquiries} aria-label={title || undefined}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {/* A real list gives screen readers the number of cards. */}
      {cards.length > 0 && (
        <ul className={styles.cards}>
          {cards.map((card) => (
            <InquiryCard key={card.id} card={card} />
          ))}
        </ul>
      )}
    </section>
  );
};

export default GeneralInquiries;
