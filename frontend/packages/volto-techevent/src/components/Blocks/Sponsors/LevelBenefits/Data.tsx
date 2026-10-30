import React from 'react';
import { levelBenefitsSchema } from './schema';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import config from '@plone/volto/registry';
import { useIntl } from 'react-intl';
import listSVG from '@plone/volto/icons/list-numbered.svg';
import messages from '@plone-collective/volto-techevent/messages';

const LevelBenefitsData = (props) => {
  const {
    data,
    block,
    onChangeBlock,
    schemaEnhancer,
    networks,
    blocksConfig = config.blocks.blocksConfig,
    blocksErrors,
    contentType,
    navRoot,
  } = props;
  const intl = useIntl();
  // Read the schema from the block configuration, so a customized
  // blockSchema applies to the sidebar as it does to @blocks-schema.
  const blockSchema =
    blocksConfig?.[data['@type']]?.blockSchema ?? levelBenefitsSchema;
  const baseSchema =
    typeof blockSchema === 'function'
      ? blockSchema({ ...props, intl, networks })
      : blockSchema;
  const schema = schemaEnhancer
    ? schemaEnhancer(baseSchema, props)
    : baseSchema;
  return (
    <BlockDataForm
      schema={schema}
      icon={<Icon size="24px" name={listSVG} />}
      title={intl.formatMessage(messages.levelBenefitsBlockTitle)}
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

export default LevelBenefitsData;
