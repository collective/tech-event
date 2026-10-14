import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import Data from './Data';
import { eventStore } from '../../Schedule/fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous customStore={eventStore}>
    <div style={{ padding: 24, maxWidth: 360 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Blocks/Schedule/Data',
  component: Data,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof Data>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    block: 'schedule-1',
    data: { '@type': 'scheduleBlock', title: 'Programme', filterByDay: [] },
    onChangeBlock: () => {},
  },
};
