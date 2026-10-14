import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import SessionView from './SessionView';
import { eventStore, sessionContent } from './fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous customStore={eventStore}>
    <Story />
  </Wrapper>
);

const meta = {
  title: 'Techevent/Schedule/SessionView',
  component: SessionView,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof SessionView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: {
      ...sessionContent,
      text: {
        'content-type': 'text/html',
        data: '<p>Hands-on blocks for a Volto site.</p>',
        encoding: 'utf-8',
      },
      session_video: 'https://www.youtube.com/watch?v=abc123',
    },
  },
};
