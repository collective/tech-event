import messages from '@plone-collective/volto-techevent/messages';
import type { BlockSchemaProps } from '@plone-collective/volto-techevent/types/common';
import type { JSONSchema } from '@plone/types';

export const levelComparisonSchema = (props: BlockSchemaProps): JSONSchema => {
  const { intl } = props;

  const schema: Record<string, unknown> = {
    title: intl.formatMessage(messages.levelComparisonBlockTitle),
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
