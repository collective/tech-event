import { addStyling } from '@plone/volto/helpers/Extensions/withBlockSchemaEnhancer';
import { defineMessages } from 'react-intl';
import config from '@plone/volto/registry';
import type { IntlShape } from '@plone/types/src/i18n';
import type { JSONSchema } from '@plone/types/src/config/';

const messages = defineMessages({
  backgroundColor: {
    id: 'Background color',
    defaultMessage: 'Background color',
  },
});

interface StylingSchemaProps {
  schema: JSONSchema;
  formData: any;
  intl: IntlShape;
}

export const defaultStylingSchema = ({
  schema,
  formData,
  intl,
}: StylingSchemaProps): JSONSchema => {
  const themes =
    config.blocks?.blocksConfig?.[formData['@type']]?.themes ||
    config.blocks.themes;

  const defaultTheme =
    config.blocks?.blocksConfig?.[formData['@type']]?.defaultTheme ||
    config.blocks.themes?.[0].name;

  addStyling({ schema, formData, intl });

  const stylingIndex = schema.fieldsets.findIndex(
    (item) => item.id === 'styling',
  );
  if (stylingIndex !== -1 && schema.fieldsets[stylingIndex].fields) {
    schema.fieldsets[stylingIndex].fields = [
      ...schema.fieldsets[stylingIndex].fields,
      'theme',
    ];
  }

  if (schema.properties) {
    (schema.properties as any).theme = {
      widget: 'color_picker',
      title: intl.formatMessage(messages.backgroundColor),
      themes,
      default: defaultTheme,
    };
  }

  return schema;
};

export const removeStylingSchema = ({
  schema,
  formData,
  intl,
}: StylingSchemaProps): JSONSchema => {
  schema.fieldsets = schema.fieldsets.filter((item) => item.id !== 'styling');
  return schema;
};
