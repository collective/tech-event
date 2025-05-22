import { addStyling } from '@plone/volto/helpers/Extensions/withBlockSchemaEnhancer';
import messages from '@plone-collective/volto-techevent/messages';
import type { BlockSchemaProps } from '@plone-collective/volto-techevent/types/common';
import type { JSONSchema } from '@plone/types';

export const sponsorLevelSchema = (props: BlockSchemaProps): JSONSchema => {
  const { intl } = props;
  const schema = {
    title: props.intl.formatMessage(messages.sponsorLevelBlockTitle),
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['title'],
      },
      {
        id: 'cta',
        title: 'CTA',
        fields: ['displayCTA', 'href', 'label'],
      },
    ],
    properties: {
      title: {
        title: intl.formatMessage(messages.title),
      },
      href: {
        title: intl.formatMessage(messages.sponsorLevelBlockCta),
        widget: 'object_browser',
        mode: 'link',
        selectedItemAttrs: [
          'Title',
          'head_title',
          'Description',
          'hasPreviewImage',
          'image_field',
          'image_scales',
          '@type',
        ],
        allowExternals: true,
      },
      displayCTA: {
        title: intl.formatMessage(messages.displayCTA),
        type: 'boolean',
      },
      label: {
        title: intl.formatMessage(messages.ctaLabel),
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
