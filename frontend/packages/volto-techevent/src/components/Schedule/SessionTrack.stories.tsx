import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import SessionTrack from './SessionTrack';
import { brainSession, eventStore } from './fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous customStore={eventStore}>
    <div style={{ padding: 24, maxWidth: 480 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Schedule/SessionTrack',
  component: SessionTrack,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof SessionTrack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { item: brainSession } };

export const NoTracks: Story = { args: { item: { session_track: [] } } };
