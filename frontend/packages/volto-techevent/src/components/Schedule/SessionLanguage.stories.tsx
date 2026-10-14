import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import SessionLanguage from './SessionLanguage';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous>
    <div style={{ padding: 24, maxWidth: 480 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Schedule/SessionLanguage',
  component: SessionLanguage,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof SessionLanguage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    item: { session_language: { token: 'en', title: 'English' } },
    className: 'sessionInfoItem',
  },
};

export const FromList: Story = {
  args: {
    item: { session_language: [{ token: 'pt', title: 'Português' }] },
  },
};
