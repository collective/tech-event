import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import ScheduleTimeslot from './ScheduleTimeslot';
import { eventStore, scheduleSlot, scheduleTalk } from './fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous customStore={eventStore}>
    <div style={{ padding: 24, maxWidth: 480 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Schedule/ScheduleTimeslot',
  component: ScheduleTimeslot,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof ScheduleTimeslot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Session: Story = { args: { slot: scheduleTalk } };

export const Slot: Story = { args: { slot: scheduleSlot } };
