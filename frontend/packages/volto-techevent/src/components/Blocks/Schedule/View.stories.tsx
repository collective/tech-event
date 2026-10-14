import React, { type ComponentProps } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import View from './View';
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
  title: 'Techevent/Blocks/Schedule/View',
  component: View,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof View>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: { '@type': 'scheduleBlock', title: 'Programme', filterByDay: [] },
  } as unknown as ComponentProps<typeof View>,
};
