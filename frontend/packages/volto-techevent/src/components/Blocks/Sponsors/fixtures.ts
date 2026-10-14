/**
 * Fixtures for the sponsor block stories and tests.
 *
 * Block props carry only the keys the blocks read, so the casts go through
 * `unknown`.
 */
import config from '@plone/volto/registry';
import type { BlockEditProps, BlockViewProps } from '@plone/types';
import levelBenefitsBlock from './LevelBenefits';
import levelComparisonBlock from './LevelComparison';
import sponsorLevelBlock from './SponsorLevel';
import sponsorsShowcaseBlock from './SponsorsShowcase';

/**
 * Registers the sponsor blocks in Volto's block configuration, as the add-on
 * does on load. Edit and Data components look their block type up there.
 */
export function registerSponsorBlocks(): void {
  for (const block of [
    levelBenefitsBlock,
    levelComparisonBlock,
    sponsorLevelBlock,
    sponsorsShowcaseBlock,
  ]) {
    config.blocks.blocksConfig[block.id] = block;
  }
}

/** Minimal props for a block's view. `type` defaults to the package benefits block. */
export function blockViewProps(props: {
  type?: string;
  data?: Record<string, unknown>;
  content?: Record<string, unknown>;
  properties?: Record<string, unknown>;
  className?: string;
}): BlockViewProps {
  const {
    type = 'levelBenefitsBlock',
    data = {},
    content = {},
    properties = {},
    className,
  } = props;
  return {
    data: { '@type': type, ...data },
    content,
    properties,
    className,
  } as unknown as BlockViewProps;
}

/** Minimal props for a block's edit mode. */
export function blockEditProps(props: {
  type?: string;
  data?: Record<string, unknown>;
  content?: Record<string, unknown>;
  properties?: Record<string, unknown>;
  selected?: boolean;
}): BlockEditProps {
  const {
    type = 'levelBenefitsBlock',
    data = {},
    content = {},
    properties = {},
    selected = false,
  } = props;
  return {
    block: 'block-1',
    data: { '@type': type, ...data },
    content,
    properties,
    selected,
    onChangeBlock: () => {},
  } as unknown as BlockEditProps;
}
