import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import SlotDate from './SlotDate';
import { slotContent } from './fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous>
    <div style={{ padding: 24, maxWidth: 480 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Schedule/SlotDate',
  component: SlotDate,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof SlotDate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Short: Story = {
  args: { item: slotContent, shortFormat: true, locale: 'pt' },
};

export const Long: Story = {
  args: { item: slotContent, shortFormat: false, locale: 'pt' },
};
