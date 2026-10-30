import messages from '@plone-collective/volto-techevent/components/Registration/messages';
import type { IntlShape } from 'react-intl';
import type { JSONSchema } from '@plone/types';

export const registrationSchema = ({
  intl,
}: {
  intl: IntlShape;
}): JSONSchema => ({
  title: intl.formatMessage(messages.registrationBlockTitle),
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['title', 'buttonLabel'],
    },
  ],
  properties: {
    title: {
      title: intl.formatMessage(messages.title),
      default: '',
    },
    buttonLabel: {
      title: intl.formatMessage(messages.buttonLabel),
      description: intl.formatMessage(messages.buttonLabelDescription),
      default: '',
    },
  },
  required: [],
});
