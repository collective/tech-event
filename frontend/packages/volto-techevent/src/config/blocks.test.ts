import { describe, it, expect, vi } from 'vitest';
import type { ConfigType } from '@plone/registry';
import type { BlockConfigBase } from '@plone/types';
import installBlocks from './blocks';
import SponsorsShowcaseBlockInfo from '../components/Blocks/Sponsors/SponsorsShowcase';
import SponsorLevelBlockInfo from '../components/Blocks/Sponsors/SponsorLevel';
import LevelBenefitsBlockInfo from '../components/Blocks/Sponsors/LevelBenefits';
import LevelComparisonBlockInfo from '../components/Blocks/Sponsors/LevelComparison';
import ScheduleBlockInfo from '../components/Blocks/Schedule';
import RegistrationBlockInfo from '../components/Blocks/Registration';
import SessionGridItem from '../components/Blocks/Listing/SessionGridItem';
import PresenterGridItem from '../components/Blocks/Listing/PresenterGridItem';
import RegistrationForm from '../components/Registration/RegistrationForm';
import RegistrationModal from '../components/Registration/RegistrationModal';

// See views.test.ts: the social networks import is stubbed for this project.
vi.mock(
  '@plonegovbr/volto-social-media/components/SocialNetworks/SocialNetworks',
  () => ({ default: () => null }),
);

function makeConfig(groupBlocksOrder = [{ id: 'common', title: 'Common' }]) {
  return {
    blocks: {
      groupBlocksOrder,
      blocksConfig: {} as Record<string, unknown>,
    },
    registerComponent: vi.fn(),
  } as unknown as ConfigType;
}

describe('installBlocks', () => {
  it('adds the event block groups after the existing ones', () => {
    const config = installBlocks(makeConfig());
    expect(config.blocks.groupBlocksOrder).toEqual([
      { id: 'common', title: 'Common' },
      { id: 'event', title: 'Event' },
      { id: 'event-sponsors', title: 'Event Sponsors' },
    ]);
  });

  it('registers each event block under its block id', () => {
    const config = installBlocks(makeConfig());
    expect(config.blocks.blocksConfig).toEqual({
      sponsorsShowcaseBlock: SponsorsShowcaseBlockInfo,
      sponsorLevelBlock: SponsorLevelBlockInfo,
      levelBenefitsBlock: LevelBenefitsBlockInfo,
      levelComparisonBlock: LevelComparisonBlockInfo,
      scheduleBlock: ScheduleBlockInfo,
      eventRegistration: RegistrationBlockInfo,
    });
    expect(config.blocks.blocksConfig.scheduleBlock).toBe(ScheduleBlockInfo);
  });

  it('keeps block configs registered by other add-ons', () => {
    const other = { id: 'other' } as unknown as BlockConfigBase;
    const config = makeConfig();
    config.blocks.blocksConfig.otherBlock = other;
    installBlocks(config);
    expect(config.blocks.blocksConfig.otherBlock).toBe(other);
  });

  it('registers the grid listing variations for presenters and sessions', () => {
    const config = installBlocks(makeConfig());
    expect(config.registerComponent).toHaveBeenCalledWith({
      name: 'GridListingItemTemplate',
      component: PresenterGridItem,
      dependencies: 'Presenter',
    });
    for (const dependencies of ['Keynote', 'Talk', 'Training']) {
      expect(config.registerComponent).toHaveBeenCalledWith({
        name: 'GridListingItemTemplate',
        component: SessionGridItem,
        dependencies,
      });
    }
  });

  it('registers the registration modal and form, to be replaced', () => {
    const config = installBlocks(makeConfig());
    expect(config.registerComponent).toHaveBeenCalledWith({
      name: 'TechEventRegistrationModal',
      component: RegistrationModal,
    });
    expect(config.registerComponent).toHaveBeenCalledWith({
      name: 'TechEventRegistrationForm',
      component: RegistrationForm,
    });
    expect(config.registerComponent).toHaveBeenCalledTimes(6);
  });

  it('starts an Attendees page with a title and the registration block', () => {
    const config = makeConfig();
    (config.blocks as { initialBlocks?: object }).initialBlocks = {
      Document: ['title'],
    };
    installBlocks(config);
    expect(config.blocks.initialBlocks).toEqual({
      Document: ['title'],
      Attendees: ['title', 'eventRegistration'],
    });
  });
});
