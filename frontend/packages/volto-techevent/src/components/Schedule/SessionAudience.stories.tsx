import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import SessionAudience from './SessionAudience';
import { brainSession, eventStore } from './fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous customStore={eventStore}>
    <div style={{ padding: 24, maxWidth: 480 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Schedule/SessionAudience',
  component: SessionAudience,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof SessionAudience>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { item: brainSession } };

export const NoAudience: Story = {
  args: { item: { session_audience: [] } },
};
