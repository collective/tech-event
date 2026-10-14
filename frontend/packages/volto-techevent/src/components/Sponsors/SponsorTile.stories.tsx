import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import SponsorTile from './SponsorTile';
import { sponsorAcme, sponsorsStore } from './fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous customStore={sponsorsStore}>
    <div style={{ padding: 24, maxWidth: 720 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Sponsors/SponsorTile',
  component: SponsorTile,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof SponsorTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { item: sponsorAcme } };

export const WithApiId: Story = {
  args: { item: { ...sponsorAcme, id: 'acme-tile' } },
};
