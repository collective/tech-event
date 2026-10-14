import React from 'react';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import { sponsorLevelSchema } from './schema';
import type { BlockEditProps } from '@plone/types';
import { useIntl } from 'react-intl';

type SponsorLevelBlockDataProps = Pick<
  BlockEditProps,
  'data' | 'block' | 'onChangeBlock'
> &
  Partial<Pick<BlockEditProps, 'blocksConfig' | 'navRoot' | 'contentType'>>;

const SponsorLevelBlockData: React.FC<SponsorLevelBlockDataProps> = (props) => {
  const { data, block, onChangeBlock, blocksConfig, navRoot, contentType } =
    props;

  const intl = useIntl();
  const schema = sponsorLevelSchema({ ...props, intl });

  const onChangeField = (id: string, value: any) => {
    onChangeBlock(block, {
      ...data,
      [id]: value,
    });
  };

  return (
    <BlockDataForm
      schema={schema}
      title={schema.title}
      onChangeField={onChangeField}
      onChangeBlock={onChangeBlock}
      formData={data}
      block={block}
      blocksConfig={blocksConfig}
      navRoot={navRoot}
      contentType={contentType}
    />
  );
};

export default SponsorLevelBlockData;
