import messages from '@plone-collective/volto-techevent/messages';
import { addStyling } from '@plone/volto/helpers/Extensions/withBlockSchemaEnhancer';
import type { BlockSchemaProps } from '@plone-collective/volto-techevent/types/common';
import { defaultStylingSchema } from '@plone-collective/volto-techevent/components/Blocks/schema';
import type { JSONSchema } from '@plone/types';

export const countdownSchema = (props: BlockSchemaProps): JSONSchema => {
  const { intl } = props;

  const formatOptions = [
    ['ddhhmmss', intl.formatMessage(messages.countdownFormatDDHHMMSS)],
    ['ddhhmm', intl.formatMessage(messages.countdownFormatDDHHMM)],
    ['ddhh', intl.formatMessage(messages.countdownFormatDDHH)],
    ['dd', intl.formatMessage(messages.countdownFormatDD)],
  ];

  let schema: Record<string, unknown> = {
    title: intl.formatMessage(messages.countdownBlockTitle),
    block: 'countdownBlock',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['title', 'hideAfterStart', 'displayFormat', 'hasSeparator'],
      },
    ],

    properties: {
      title: {
        title: intl.formatMessage(messages.title),
        default: '',
      },
      hideAfterStart: {
        title: intl.formatMessage(messages.countdownHideAfterTarget),
        type: 'boolean',
        default: true,
      },
      displayFormat: {
        title: intl.formatMessage(messages.countdownDisplayFormat),
        type: 'choice',
        default: 'ddhhmmss',
        options: formatOptions,
      },
      hasSeparator: {
        title: intl.formatMessage(messages.countdownHasSeparator),
        type: 'boolean',
        default: true,
      },
    },
    required: [],
  };

  addStyling({ schema, intl });

  schema.properties.styles.schema.fieldsets[0].fields.push(
    'blockWidth:noprefix',
  );
  schema.properties.styles.schema.properties['blockWidth:noprefix'] = {
    title: intl.formatMessage(messages.blockWidth),
    widget: 'blockWidth',
    default: 'default',
  };

  schema.properties.styles.schema.fieldsets[0].fields.push('size');
  schema.properties.styles.schema.properties['size'] = {
    title: intl.formatMessage(messages.countdownSize),
    widget: 'size',
    default: 'l',
  };

  schema.properties.styles.schema.fieldsets[0].fields.push('align:noprefix');
  schema.properties.styles.schema.properties['align:noprefix'] = {
    widget: 'blockAlignment',
    title: intl.formatMessage(messages.align),
    default: 'center',
  };

  return defaultStylingSchema({ schema, formData: props, intl });
};
