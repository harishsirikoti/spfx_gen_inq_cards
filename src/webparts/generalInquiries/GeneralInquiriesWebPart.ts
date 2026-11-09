import * as React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';

import * as strings from 'GeneralInquiriesWebPartStrings';
import GeneralInquiries from './components/GeneralInquiries';
import { IGeneralInquiriesProps } from './components/IGeneralInquiriesProps';
import { IInquiryCard } from './models/ICard';
import { DEFAULT_TITLE, normalizeCards } from './utils/cardUtils';
import { validateNavigationUrl } from './utils/urlValidator';

export interface IGeneralInquiriesWebPartProps {
  /** Main heading. */
  title: string;
  /** Card list. undefined = never configured; [] = editor removed all cards. */
  cards: IInquiryCard[];
}

export default class GeneralInquiriesWebPart extends BaseClientSideWebPart<IGeneralInquiriesWebPartProps> {

  private _root: Root | undefined;

  public render(): void {
    const element: React.ReactElement<IGeneralInquiriesProps> = React.createElement(
      GeneralInquiries,
      {
        // Only fall back to the default title when it was never set (not when cleared on purpose).
        title: this.properties.title === undefined ? DEFAULT_TITLE : this.properties.title,
        cards: normalizeCards(this.properties.cards)
      }
    );

    if (!this._root) {
      this._root = createRoot(this.domElement);
    }

    this._root.render(element);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    // Pass the SharePoint theme text colour to the SCSS (--bodyText).
    const { semanticColors } = currentTheme;
    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
    }
  }

  protected onDispose(): void {
    this._root?.unmount();
    this._root = undefined;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  /**
   * Runs when a Property Pane value changes.
   * After the cards are edited, we make sure every card has a stable unique ID,
   * so reordering and later edits keep each card's identity.
   */
  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: unknown, newValue: unknown): void {
    if (propertyPath === 'cards' && Array.isArray(newValue)) {
      this.properties.cards = normalizeCards(newValue as Partial<IInquiryCard>[]);
    }
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.MainSettingsGroupName,
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.MainTitleFieldLabel
                })
              ]
            },
            {
              groupName: strings.CardsGroupName,
              groupFields: [
                PropertyFieldCollectionData('cards', {
                  key: 'cards',
                  label: strings.CardsFieldLabel,
                  panelHeader: strings.CardsPanelHeader,
                  manageBtnLabel: strings.CardsManageButtonLabel,
                  // Editors can drag or use arrows to reorder cards.
                  enableSorting: true,
                  value: normalizeCards(this.properties.cards),
                  fields: [
                    {
                      id: 'title',
                      title: strings.CardTitleLabel,
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: 'description',
                      title: strings.CardDescriptionLabel,
                      type: CustomCollectionFieldType.string
                    },
                    {
                      id: 'url',
                      title: strings.CardUrlLabel,
                      type: CustomCollectionFieldType.string,
                      placeholder: 'https://, /path or mailto:',
                      // An empty URL is allowed (button is disabled); a wrong one shows an error.
                      onGetErrorMessage: (value: string) => validateNavigationUrl(value).error || ''
                    },
                    {
                      id: 'buttonText',
                      title: strings.CardButtonTextLabel,
                      type: CustomCollectionFieldType.string,
                      required: true
                    }
                  ]
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
