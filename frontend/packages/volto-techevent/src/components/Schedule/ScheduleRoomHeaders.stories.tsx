import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import ScheduleRoomHeaders from './ScheduleRoomHeaders';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous>
    <div
      className="tab-content rooms"
      style={{
        padding: 24,
        display: 'grid',
        gridTemplateColumns:
          '[times] 5rem [room-1] 1fr [room-2] 1fr [room-all]',
        gridTemplateRows: '[rooms] auto',
      }}
    >
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Schedule/ScheduleRoomHeaders',
  component: ScheduleRoomHeaders,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof ScheduleRoomHeaders>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rooms: [
      ['room-a', 'Room A'],
      ['room-b', 'Room B'],
    ],
  },
};

export const NoRooms: Story = { args: { rooms: [] } };
