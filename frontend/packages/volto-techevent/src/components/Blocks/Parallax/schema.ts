import messages from '@plone-collective/volto-techevent/messages';
import { addStyling } from '@plone/volto/helpers/Extensions/withBlockSchemaEnhancer';
import { addExtensionFieldToSchema } from '@plone/volto/helpers/Extensions';
import type { BlockSchemaProps } from '@plone-collective/volto-techevent/types/common';
import { defaultStylingSchema } from '@plone-collective/volto-techevent/components/Blocks/schema';
import type { JSONSchema } from '@plone/types';

const itemSchema = (props: BlockSchemaProps): Record<string, unknown> => {
  const { intl } = props;
  return {
    title: intl.formatMessage(messages.buttonTitle),
    addMessage: intl.formatMessage(messages.buttonAdd),
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['href', 'label', 'hideButton', 'openLinkInNewTab'],
      },
    ],

    properties: {
      href: {
        title: intl.formatMessage(messages.buttonHref),
        widget: 'object_browser',
        mode: 'link',
        selectedItemAttrs: [
          'Title',
          'Description',
          'head_title',
          'hasPreviewImage',
          'image_field',
          'image_scales',
          '@type',
        ],
        allowExternals: true,
      },
      label: {
        title: props.intl.formatMessage(messages.buttonLabel),
      },
      hideButton: {
        title: props.intl.formatMessage(messages.buttonHide),
        type: 'boolean',
      },
      openLinkInNewTab: {
        title: props.intl.formatMessage(messages.openLinkInNewTab),
        type: 'boolean',
      },
    },
    required: [],
  };
};

export const parallaxSchema = (props: BlockSchemaProps): JSONSchema => {
  const { intl } = props;

  const overlayColors = [
    {
      style: { '--theme-color': '#000' },
      name: 'rgba(0, 0, 0, 0.66)',
      label: 'Black',
    },
    {
      style: { '--theme-color': '#fff' },
      name: 'rgba(255, 255, 255, 0.66)',
      label: 'White',
    },
  ];
  const colors = [
    {
      style: { '--theme-color': '#000' },
      name: '#000',
      label: 'Black',
    },
    {
      style: { '--theme-color': '#fff' },
      name: '#fff',
      label: 'White',
    },
  ];

  let schema: Record<string, unknown> = {
    title: intl.formatMessage(messages.parallaxBlockTitle),
    block: 'parallaxBlock',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['href', 'title', 'description', 'items'],
      },
    ],

    properties: {
      title: {
        title: intl.formatMessage(messages.title),
      },
      href: {
        title: props.intl.formatMessage(messages.parallaxBgImage),
        widget: 'object_browser',
        mode: 'image',
        allowExternals: true,
      },
      description: {
        title: intl.formatMessage(messages.parallaxDescription),
        widget: 'richtext',
      },
      items: {
        widget: 'object_list',
        title: intl.formatMessage(messages.parallaxCTAItems),
        schema: itemSchema(props),
        default: [],
      },
    },
    required: [],
  };

  const overlays = [
    {
      id: 'full-overlay',
      title: intl.formatMessage(messages.overlayFull),
      isDefault: true,
    },
    {
      id: 'solid-textbox',
      title: intl.formatMessage(messages.overlayBox),
      isDefault: false,
    },
  ];

  schema = addExtensionFieldToSchema({
    schema,
    name: 'overlay',
    items: overlays,
    intl,
    title: messages.overlay,
  });

  addStyling({ schema, intl });

  schema.properties.styles.schema.fieldsets[0].fields.push('height');
  schema.properties.styles.schema.properties['height'] = {
    title: intl.formatMessage(messages.parallaxHeight),
    widget: 'size',
    default: 'l',
  };

  schema.properties.styles.schema.fieldsets[0].fields.push('align:noprefix');
  schema.properties.styles.schema.properties['align:noprefix'] = {
    widget: 'blockAlignment',
    title: intl.formatMessage(messages.align),
    default: 'center',
  };

  schema.properties.styles.schema.fieldsets[0].fields.push(
    '--techevent-parallax-overlay-color',
  );
  schema.properties.styles.schema.properties[
    '--techevent-parallax-overlay-color'
  ] = {
    title: intl.formatMessage(messages.overlayColor),
    widget: 'color_picker',
    colors: overlayColors,
    default: 'rgba(255, 255, 255, 0.66)',
  };

  schema.properties.styles.schema.fieldsets[0].fields.push(
    '--techevent-parallax-foreground-color',
  );
  schema.properties.styles.schema.properties[
    '--techevent-parallax-foreground-color'
  ] = {
    title: intl.formatMessage(messages.overlayForegroundColor),
    widget: 'color_picker',
    colors: colors,
    default: '#000',
  };

  return defaultStylingSchema({ schema, formData: props, intl });
};
