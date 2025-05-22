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

const PresenterCategory = ({ label }) => {
  const intl = useIntl();
  const token = label?.token ? label.token : label;
  const title = label?.title
    ? label.title
    : intl.formatMessage(messages[label]);
  const icon = icons[label.token];
  return (
    <Popup
      hoverable
      size={'small'}
      trigger={
        <span className={'presenterCategoryWrapper'}>
          <Icon
            name={icon}
            size={'20px'}
            color={'#FFF'}
            className={`presenterCategory ${token}`}
          />
        </span>
      }
      position="top center"
    >
      <Popup.Content>{title}</Popup.Content>
    </Popup>
  );
};

export default PresenterCategory;
