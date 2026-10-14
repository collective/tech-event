import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import Edit from './Edit';
import { day, eventStore } from '../../Schedule/fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper
    anonymous
    customStore={{
      ...eventStore,
      schedule: { items: [day], loading: false, loaded: true, error: null },
    }}
  >
    <div style={{ padding: 24 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Blocks/Schedule/Edit',
  component: Edit,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof Edit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: { '@type': 'scheduleBlock', title: 'Programme', filterByDay: [] },
    selected: false,
  },
};
