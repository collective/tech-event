import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import SessionTile from './SessionTile';
import { brainSession, eventStore } from './fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous customStore={eventStore}>
    <div style={{ padding: 24, maxWidth: 480 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Schedule/SessionTile',
  component: SessionTile,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof SessionTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    item: brainSession,
    showDescription: true,
    showAudience: true,
    showLevel: true,
    shortDate: false,
  },
};

export const Compact: Story = {
  args: {
    item: brainSession,
    showDescription: false,
    showAudience: false,
    showLevel: false,
    shortDate: true,
  },
};
