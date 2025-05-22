import { addStyling } from '@plone/volto/helpers/Extensions/withBlockSchemaEnhancer';
import messages from '@plone-collective/volto-techevent/messages';
import type { BlockSchemaProps } from '@plone-collective/volto-techevent/types/common';
import type { JSONSchema } from '@plone/types';

export const sponsorsShowcaseSchema = (props: BlockSchemaProps): JSONSchema => {
  const { intl } = props;

  const schema: JSONSchema = {
    title: intl.formatMessage(messages.sponsorsShowcaseBlockTitle),
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['title'],
      },
    ],
    properties: {
      title: {
        title: intl.formatMessage(messages.title),
        default: '',
      },
    },
    required: [],
  };

  addStyling({ schema, intl });

  // Add alignment option under styles
  if (schema.properties.styles?.schema) {
    schema.properties.styles.schema.properties['align:noprefix'] = {
      widget: 'blockAlignment',
      title: intl.formatMessage(messages.align),
      default: 'left',
    };
    schema.properties.styles.schema.fieldsets[0].fields = ['align:noprefix'];
  }

  return schema;
};
