import React from 'react';
import { levelBenefitsSchema } from './schema';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { useIntl } from 'react-intl';
import listSVG from '@plone/volto/icons/list-numbered.svg';
import messages from '@plone-collective/volto-techevent/messages';

const LevelBenefitsData = (props) => {
  const { data, block, onChangeBlock, schemaEnhancer, networks } = props;
  const intl = useIntl();
  const schema = schemaEnhancer
    ? schemaEnhancer(levelBenefitsSchema({ ...props, intl, networks }), props)
    : levelBenefitsSchema({ ...props, intl, networks });
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
      formData={data}
      fieldIndex={data.index}
      block={block}
    />
  );
};

export default LevelBenefitsData;
