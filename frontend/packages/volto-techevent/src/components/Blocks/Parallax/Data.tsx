import React from 'react';
import { parallaxSchema } from './schema';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { useIntl } from 'react-intl';
import parallaxSVG from '@plone/volto/icons/image.svg';
import messages from '@plone-collective/volto-techevent/messages';

const ParallaxData = (props) => {
  const { data, block, onChangeBlock, schemaEnhancer, networks } = props;
  const intl = useIntl();
  const schema = schemaEnhancer
    ? schemaEnhancer(parallaxSchema({ ...props, intl, networks }), props)
    : parallaxSchema({ ...props, intl, networks });
  return (
    <BlockDataForm
      schema={schema}
      icon={<Icon size="24px" name={parallaxSVG} />}
      title={intl.formatMessage(messages.parallaxBlockTitle)}
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

export default ParallaxData;
