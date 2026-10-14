import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import SessionMetadata from './SessionMetadata';
import { sessionContent } from './fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous>
    <div style={{ padding: 24, maxWidth: 480 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Schedule/SessionMetadata',
  component: SessionMetadata,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof SessionMetadata>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { item: sessionContent, showRoom: true, shortDate: false },
};

export const Short: Story = {
  args: { item: sessionContent, showRoom: false, shortDate: true },
};
