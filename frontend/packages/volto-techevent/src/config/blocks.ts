import type { ConfigType } from '@plone/registry';
import type { BlockConfigBase } from '@plone/types';

// SponsorsShowcase
import SponsorsShowcaseBlockInfo from '@plone-collective/volto-techevent/components/Blocks/Sponsors/SponsorsShowcase';

// SponsorLevel
import SponsorLevelBlockInfo from '@plone-collective/volto-techevent/components/Blocks/Sponsors/SponsorLevel';

// LevelBenefits
import LevelBenefitsBlockInfo from '@plone-collective/volto-techevent/components/Blocks/Sponsors/LevelBenefits';

// LevelComparison
import LevelComparisonBlockInfo from '@plone-collective/volto-techevent/components/Blocks/Sponsors/LevelComparison';

declare module '@plone/types' {
  export interface BlocksConfigData {
    levelBenefitsBlock: BlockConfigBase;
    levelComparisonBlock: BlockConfigBase;
    sponsorLevelBlock: BlockConfigBase;
    sponsorsShowcaseBlock: BlockConfigBase;
  }
}

export default function install(config: ConfigType) {
  // Blocks Groups
  config.blocks.groupBlocksOrder = [
    ...config.blocks.groupBlocksOrder,
    { id: 'event', title: 'Event' },
    { id: 'event-sponsors', title: 'Event Sponsors' },
  ];

  // Blocks
  config.blocks.blocksConfig.sponsorsShowcaseBlock = SponsorsShowcaseBlockInfo;
  config.blocks.blocksConfig.sponsorLevelBlock = SponsorLevelBlockInfo;
  config.blocks.blocksConfig.levelBenefitsBlock = LevelBenefitsBlockInfo;
  config.blocks.blocksConfig.levelComparisonBlock = LevelComparisonBlockInfo;

  return config;
}
