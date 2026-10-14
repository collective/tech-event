import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import View from './View';
import { blockViewProps } from '../fixtures';
import { sponsorsStore } from '../../../Sponsors/fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous customStore={sponsorsStore}>
    <div style={{ padding: 24, maxWidth: 720 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Sponsors/Blocks/SponsorLevel/View',
  component: View,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof View>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: blockViewProps({
    type: 'sponsorLevelBlock',
    data: {
      title: 'Our Top Partners',
      href: [{ '@id': '/sponsors/join' }],
      displayCTA: true,
      label: 'Become a sponsor',
    },
    content: { id: 'gold' },
  }),
};
