import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import SlotRoom from './SlotRoom';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous>
    <div style={{ padding: 24, maxWidth: 480 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Schedule/SlotRoom',
  component: SlotRoom,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof SlotRoom>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    item: { room: [{ token: 'room-a', title: 'Room A' }] },
    className: 'sessionInfoItem',
  },
};

export const NoRoom: Story = { args: { item: { room: null }, className: '' } };
