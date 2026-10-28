import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import coffeeSVG from '@plone-collective/volto-techevent/icons/coffee.svg';
import microphoneSVG from '@plone-collective/volto-techevent/icons/microphone.svg';
import ScheduleTimeHeader from './ScheduleTimeHeader';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous>
    <div
      className="tab-content rooms"
      style={{
        padding: 24,
        display: 'grid',
        gridTemplateColumns: '[times] 5rem',
        gridTemplateRows: '[time-0900] auto [time-1030] auto',
      }}
    >
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Schedule/ScheduleTimeHeader',
  component: ScheduleTimeHeader,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof ScheduleTimeHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Session: Story = {
  args: {
    entry: {
      kind: 'time',
      start: '2026-10-13T09:00:00-03:00',
      gridRow: 'time-0900',
      icon: microphoneSVG,
    },
  },
};

export const CoffeeBreak: Story = {
  args: {
    entry: {
      kind: 'time',
      start: '2026-10-13T10:30:00-03:00',
      gridRow: 'time-1030',
      icon: coffeeSVG,
    },
  },
};
