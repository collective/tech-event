import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import SessionPill from './SessionPill';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous>
    <div style={{ padding: 24, maxWidth: 480 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Schedule/SessionPill',
  component: SessionPill,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof SessionPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    term: { token: 'developers', title: 'Developers' },
    className: 'sessionAudience',
    color: '#ff0000',
  },
};

export const Unset: Story = {
  args: {
    term: { token: 'designers', title: 'Designers' },
    className: 'sessionAudience',
    color: 'unset',
  },
};
