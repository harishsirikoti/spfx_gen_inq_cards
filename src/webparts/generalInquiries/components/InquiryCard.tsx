import * as React from 'react';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { IInquiryCard } from '../models/ICard';
import { validateNavigationUrl } from '../utils/urlValidator';
import styles from './InquiryCard.module.scss';

export interface IInquiryCardProps {
  card: IInquiryCard;
}

/**
 * Shows one card: title, description and a pill-shaped button.
 */
const InquiryCard: React.FC<IInquiryCardProps> = ({ card }) => {
  // Check the link again at render time, even though the Property Pane already checks it.
  // This protects the page from bad values saved earlier or edited outside the pane.
  const link = validateNavigationUrl(card.url);
  const titleId: string = `gi-card-title-${card.id}`;

  // Absolute web links open in a new tab; email and site paths stay in the same tab.
  const opensNewTab: boolean = link.isValid && !!link.url && link.url.toLowerCase().indexOf('https://') === 0;

  return (
    <li className={styles.card} aria-labelledby={titleId}>
      <div className={styles.text}>
        <h3 id={titleId} className={styles.cardTitle}>{card.title}</h3>
        {card.description && <p className={styles.description}>{card.description}</p>}
      </div>
      {card.buttonText && (
        <PrimaryButton
          className={styles.button}
          text={card.buttonText}
          // With no valid link the button has no href and is disabled.
          href={link.isValid ? link.url : undefined}
          target={opensNewTab ? '_blank' : undefined}
          rel={opensNewTab ? 'noopener noreferrer' : undefined}
          disabled={!link.isValid}
          // Keep the disabled button reachable by keyboard so screen readers can announce it.
          allowDisabledFocus
          ariaLabel={`${card.buttonText}: ${card.title}`}
        />
      )}
    </li>
  );
};

export default InquiryCard;
