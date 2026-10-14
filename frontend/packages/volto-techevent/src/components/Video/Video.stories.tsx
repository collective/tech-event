import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import Video from './Video';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous>
    <div style={{ padding: 24, maxWidth: 640 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Video/Video',
  component: Video,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof Video>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LongUrl: Story = {
  args: { url: 'https://www.youtube.com/watch?v=abc123' },
};

export const ShortUrl: Story = {
  args: { url: 'https://youtu.be/xyz789' },
};
