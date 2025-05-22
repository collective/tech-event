import React from 'react';
import { sponsorsShowcaseSchema } from './schema';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { useIntl } from 'react-intl';
import sponsorsSVG from '@plone/volto/icons/world.svg';
import messages from '@plone-collective/volto-techevent/messages';

const SponsorsShowcaseData = (props) => {
  const { data, block, onChangeBlock, schemaEnhancer, networks } = props;
  const intl = useIntl();
  const schema = schemaEnhancer
    ? schemaEnhancer(
        sponsorsShowcaseSchema({ ...props, intl, networks }),
        props,
      )
    : sponsorsShowcaseSchema({ ...props, intl, networks });
  return (
    <BlockDataForm
      schema={schema}
      icon={<Icon size="24px" name={sponsorsSVG} />}
      title={intl.formatMessage(messages.sponsorsShowcaseBlockTitle)}
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

export default SponsorsShowcaseData;
