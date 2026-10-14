import React from 'react';
import { useIntl, defineMessages } from 'react-intl';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { Popup } from 'semantic-ui-react';
import pfMemberSVG from '@plone/volto/icons/plone.svg';
import keynoteSVG from '@plone/volto/icons/star.svg';
import speakerSVG from '@plone/volto/icons/microphone.svg';
import instructorSVG from '@plone/volto/icons/blog-entry.svg';

const icons = {
  'pf-member': pfMemberSVG,
  'keynote-speaker': keynoteSVG,
  speaker: speakerSVG,
  instructor: instructorSVG,
};

const messages = defineMessages({
  'pf-member': {
    id: 'pf-member',
    defaultMessage: 'Plone Foundation Member',
  },
  'keynote-speaker': {
    id: 'keynote-speaker',
    defaultMessage: 'Keynote Speaker',
  },
  speaker: {
    id: 'speaker',
    defaultMessage: 'Speaker',
  },
  instructor: {
    id: 'instructor',
    defaultMessage: 'Instructor',
  },
});

export type PresenterCategoryLabel = string | { token: string; title?: string };

type PresenterCategoryProps = {
  /** A category token, or a term carrying a token and optionally a title. */
  label: PresenterCategoryLabel;
};

const PresenterCategory = ({ label }: PresenterCategoryProps) => {
  const intl = useIntl();
  const token = typeof label === 'string' ? label : label?.token ?? '';
  const term = typeof label === 'string' ? undefined : label;
  const known = token in messages;
  const title = term?.title
    ? term.title
    : known
      ? intl.formatMessage(messages[token as keyof typeof messages])
      : token;
  const icon = icons[token as keyof typeof icons];
  return (
    <Popup
      hoverable
      size={'small'}
      trigger={
        <span className={'presenterCategoryWrapper'}>
          {icon && (
            <Icon
              name={icon}
              size={'20px'}
              color={'#FFF'}
              className={`presenterCategory ${token}`}
            />
          )}
        </span>
      }
      position="top center"
    >
      <Popup.Content>{title}</Popup.Content>
    </Popup>
  );
};

export default PresenterCategory;
