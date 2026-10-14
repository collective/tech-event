import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import SlotView from './SlotView';
import { slotContent } from './fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous>
    <Story />
  </Wrapper>
);

const meta = {
  title: 'Techevent/Schedule/SlotView',
  component: SlotView,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof SlotView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { content: slotContent } };
