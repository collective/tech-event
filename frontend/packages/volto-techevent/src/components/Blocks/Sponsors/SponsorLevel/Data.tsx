import React from 'react';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import { sponsorLevelSchema } from './schema';
import type { BlocksConfigData } from '@plone/types';
import { useIntl } from 'react-intl';

interface SponsorLevelData {
  title?: string;
  href?: string;
  displayCTA?: boolean;
  label?: string;
  [key: string]: any;
}

interface SponsorLevelBlockDataProps {
  data: SponsorLevelData;
  block: string;
  onChangeBlock: (block: string, data: SponsorLevelData) => void;
  blocksConfig?: BlocksConfigData;
  navRoot?: string;
  contentType?: string;
}

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
