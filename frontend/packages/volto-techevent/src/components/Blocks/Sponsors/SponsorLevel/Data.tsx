import React from 'react';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import config from '@plone/volto/registry';
import { sponsorLevelSchema } from './schema';
import type { BlockEditProps, BlockSchemaArgs } from '@plone/types';
import { useIntl } from 'react-intl';

type SponsorLevelBlockDataProps = Pick<
  BlockEditProps,
  'data' | 'block' | 'onChangeBlock'
> &
  Partial<
    Pick<
      BlockEditProps,
      'blocksConfig' | 'blocksErrors' | 'navRoot' | 'contentType'
    >
  >;

const SponsorLevelBlockData: React.FC<SponsorLevelBlockDataProps> = (props) => {
  const {
    data,
    block,
    onChangeBlock,
    blocksConfig = config.blocks.blocksConfig,
    blocksErrors,
    navRoot,
    contentType,
  } = props;

  const intl = useIntl();
  // Read the schema from the block configuration, so a customized
  // blockSchema applies to the sidebar as it does to @blocks-schema.
  const blockSchema =
    blocksConfig?.[data['@type']]?.blockSchema ?? sponsorLevelSchema;
  // `@plone/types` declares `IntlShape` more narrowly than react-intl does.
  // Cast only `intl`, so the rest of the call stays type-checked.
  const schemaIntl = intl as BlockSchemaArgs['intl'] as any;
  const schema =
    typeof blockSchema === 'function'
      ? blockSchema({ ...props, intl: schemaIntl })
      : blockSchema;

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
      errors={blocksErrors}
    />
  );
};

export default SponsorLevelBlockData;
