import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import Schedule from './Schedule';
import { day, emptyDay, eventStore } from './fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous customStore={eventStore}>
    <div style={{ padding: 24 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Schedule/Schedule',
  component: Schedule,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof Schedule>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [day, emptyDay],
    filterByDay: [],
    displayDayIndex: true,
    isEditMode: false,
  },
};

export const FilteredByDay: Story = {
  args: {
    items: [day, emptyDay],
    filterByDay: ['2026-10-14'],
    displayDayIndex: true,
    isEditMode: false,
  },
};
