/**
 * The sidebar forms hand BlockDataForm the same props as core, and read the
 * schema from the block configuration. BlockDataForm is mocked here so the
 * test can assert on the props that reach it.
 */
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderInVolto } from '../../testing/render';
import { eventStore } from '../Schedule/fixtures';
import scheduleBlock from './Schedule';
import ScheduleData from './Schedule/Data';
import sponsorsShowcaseBlock from './Sponsors/SponsorsShowcase';
import SponsorsShowcaseData from './Sponsors/SponsorsShowcase/Data';
import sponsorLevelBlock from './Sponsors/SponsorLevel';
import SponsorLevelData from './Sponsors/SponsorLevel/Data';
import levelBenefitsBlock from './Sponsors/LevelBenefits';
import LevelBenefitsData from './Sponsors/LevelBenefits/Data';
import levelComparisonBlock from './Sponsors/LevelComparison';
import LevelComparisonData from './Sponsors/LevelComparison/Data';

const captured = vi.hoisted(() => [] as Array<Record<string, any>>);

vi.mock('@plone/volto/components/manage/Form/BlockDataForm', () => ({
  default: (props: Record<string, any>) => {
    captured.push(props);
    return null;
  },
}));

const cases = [
  { name: 'scheduleBlock', block: scheduleBlock, Data: ScheduleData },
  {
    name: 'sponsorsShowcaseBlock',
    block: sponsorsShowcaseBlock,
    Data: SponsorsShowcaseData,
  },
  {
    name: 'sponsorLevelBlock',
    block: sponsorLevelBlock,
    Data: SponsorLevelData,
  },
  {
    name: 'levelBenefitsBlock',
    block: levelBenefitsBlock,
    Data: LevelBenefitsData,
  },
  {
    name: 'levelComparisonBlock',
    block: levelComparisonBlock,
    Data: LevelComparisonData,
  },
];

describe.each(cases)('sidebar form of $name', ({ name, block, Data }) => {
  it('passes BlockDataForm the props core passes', () => {
    captured.length = 0;
    const onChangeBlock = vi.fn();
    const blocksConfig = { [name]: block } as any;
    // The props are typed by Volto's strict block types; the test only
    // checks that they are forwarded, so their shape is not the point here.
    const blocksErrors = { title: 'Required' } as any;
    const extra = { navRoot: '/event', contentType: 'Event' } as any;
    renderInVolto(
      <Data
        block="block-1"
        data={{ '@type': name, title: 'Heading' }}
        onChangeBlock={onChangeBlock}
        blocksConfig={blocksConfig}
        blocksErrors={blocksErrors}
        {...extra}
      />,
      eventStore,
    );
    const props = captured.at(-1);
    expect(props).toBeTruthy();
    expect(props?.onChangeBlock).toBe(onChangeBlock);
    expect(props?.blocksConfig).toBe(blocksConfig);
    expect(props?.navRoot).toBe('/event');
    expect(props?.contentType).toBe('Event');
    expect(props?.errors).toBe(blocksErrors);
    expect(props?.block).toBe('block-1');
    expect(props?.formData).toEqual({ '@type': name, title: 'Heading' });
  });

  it('reads the schema from the block configuration', () => {
    captured.length = 0;
    const customSchema = {
      title: 'Custom',
      fieldsets: [],
      properties: { custom: { title: 'Custom field' } },
      required: [],
    };
    const blocksConfig = {
      [name]: { ...block, blockSchema: () => customSchema },
    } as any;
    renderInVolto(
      <Data
        block="block-1"
        data={{ '@type': name }}
        onChangeBlock={vi.fn()}
        blocksConfig={blocksConfig}
      />,
      eventStore,
    );
    expect(captured.at(-1)?.schema.properties).toHaveProperty('custom');
  });
});
