import React from 'react';
import { scheduleSchema } from './schema';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import config from '@plone/volto/registry';
import { useIntl } from 'react-intl';
import { useEventSettings } from '@plone-collective/volto-techevent/hooks/useEventSettings';
import sponsorsSVG from '@plone/volto/icons/world.svg';
import messages from '@plone-collective/volto-techevent/messages';

const ScheduleData = (props) => {
  const {
    data,
    block,
    onChangeBlock,
    schemaEnhancer,
    blocksConfig = config.blocks.blocksConfig,
    blocksErrors,
    contentType,
    navRoot,
  } = props;
  const eventSettings = useEventSettings();
  const days = eventSettings?.data?.days || [];
  const intl = useIntl();
  // Read the schema from the block configuration, so a customized
  // blockSchema applies to the sidebar as it does to @blocks-schema.
  const blockSchema =
    blocksConfig?.[data['@type']]?.blockSchema ?? scheduleSchema;
  const baseSchema =
    typeof blockSchema === 'function'
      ? blockSchema({ ...props, intl, days })
      : blockSchema;
  const schema = schemaEnhancer
    ? schemaEnhancer(baseSchema, props)
    : baseSchema;
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
      onChangeBlock={onChangeBlock}
      formData={data}
      fieldIndex={data.index}
      block={block}
      blocksConfig={blocksConfig}
      navRoot={navRoot}
      contentType={contentType}
      errors={blocksErrors}
    />
  );
};

export default ScheduleData;
