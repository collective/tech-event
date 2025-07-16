import { addStyling } from '@plone/volto/helpers/Extensions/withBlockSchemaEnhancer';
import messages from '@plone-collective/volto-techevent/messages';
import type { ScheduleBlockSchemaProps } from '@plone-collective/volto-techevent/types/common';
import type { JSONSchema } from '@plone/types';

export const scheduleSchema = (props: ScheduleBlockSchemaProps): JSONSchema => {
  const { intl, days } = props;

  const daysChoices = days !== undefined ? days.map((day) => [day, day]) : [];

  const schema: JSONSchema = {
    title: intl.formatMessage(messages.scheduleBlockTitle),
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['title', 'displayDayIndex', 'filterByDay'],
      },
    ],
    properties: {
      title: {
        title: intl.formatMessage(messages.title),
        default: '',
      },
      displayDayIndex: {
        title: props.intl.formatMessage(messages.displayMenuHeadline),
        default: true,
        type: 'boolean',
      },
      filterByDay: {
        title: props.intl.formatMessage(messages.filterByDay),
        isMulti: true,
        default: [],
        choices: daysChoices,
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
