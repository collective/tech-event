import React, { type ComponentProps } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import DefaultView from './DefaultView';
import { day, eventStore } from '../../Schedule/fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous customStore={eventStore}>
    <div style={{ padding: 24 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Blocks/Schedule/DefaultView',
  component: DefaultView,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof DefaultView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      '@type': 'scheduleBlock',
      title: 'Schedule',
      filterByDay: [],
      displayDayIndex: true,
    },
    items: [day],
  } as unknown as ComponentProps<typeof DefaultView>,
};

export const WithoutTitle: Story = {
  args: {
    data: {
      '@type': 'scheduleBlock',
      title: '',
      filterByDay: [],
      displayDayIndex: false,
    },
    items: [day],
  } as unknown as ComponentProps<typeof DefaultView>,
};
