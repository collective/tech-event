import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import SlotTile from './SlotTile';
import { slotBrain } from './fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous>
    <div style={{ padding: 24, maxWidth: 480 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Schedule/SlotTile',
  component: SlotTile,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof SlotTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { item: slotBrain, showDescription: true, shortDate: true },
};

export const WithoutDescription: Story = {
  args: { item: slotBrain, showDescription: false, shortDate: false },
};
