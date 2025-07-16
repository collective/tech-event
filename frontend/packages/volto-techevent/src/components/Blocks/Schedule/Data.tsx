import React from 'react';
import { scheduleSchema } from './schema';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { useIntl } from 'react-intl';
import { useEventSettings } from '@plone-collective/volto-techevent/hooks/useEventSettings';
import sponsorsSVG from '@plone/volto/icons/world.svg';
import messages from '@plone-collective/volto-techevent/messages';

const ScheduleData = (props) => {
  const { data, block, onChangeBlock, schemaEnhancer } = props;
  const eventSettings = useEventSettings();
  const days = eventSettings?.data?.days || [];
  const intl = useIntl();
  const schema = schemaEnhancer
    ? schemaEnhancer(scheduleSchema({ ...props, intl, days }), props)
    : scheduleSchema({ ...props, intl, days });
  return (
    <BlockDataForm
      schema={schema}
      icon={<Icon size="24px" name={sponsorsSVG} />}
      title={intl.formatMessage(messages.scheduleBlockTitle)}
      onChangeField={(id, value) => {
        onChangeBlock(block, {
          ...data,
          [id]: value,
        });
      }}
      formData={data}
      fieldIndex={data.index}
      block={block}
    />
  );
};

export default ScheduleData;
