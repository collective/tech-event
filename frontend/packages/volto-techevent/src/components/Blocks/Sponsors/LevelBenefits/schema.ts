import messages from '@plone-collective/volto-techevent/messages';
import type { SponsorsSchemaArgs } from '@plone-collective/volto-techevent/components/Sponsors/types';
import type { JSONSchema } from '@plone/types';

export const levelBenefitsSchema = (props: SponsorsSchemaArgs): JSONSchema => {
  const { intl } = props;

  const schema: JSONSchema = {
    title: intl.formatMessage(messages.levelBenefitsBlockTitle),
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['title', 'tableTitle'],
      },
    ],
    properties: {
      title: {
        title: intl.formatMessage(messages.heading),
        default: 'Our Packages',
      },
      tableTitle: {
        title: intl.formatMessage(messages.title),
        default: 'Compare',
      },
    },
    required: [],
  };

  return schema;
};
