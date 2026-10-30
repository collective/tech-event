import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import AttendeeView from './AttendeeView';

const withWrapper: Decorator = (Story) => (
  <Wrapper>
    <div style={{ padding: 24 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Registration/AttendeeView',
  component: AttendeeView,
  decorators: [withWrapper],
  tags: ['autodocs'],
  args: {
    content: {
      id: 'PYC26-7KQ3M9XD',
      title: 'Ada Lovelace',
      email: 'ada@example.org',
      email_verified: true,
      review_state: 'registered',
    },
  },
} satisfies Meta<typeof AttendeeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Registered: Story = {};

export const Pending: Story = {
  args: {
    content: {
      id: 'PYC26-NSK3S0G6',
      title: 'Grace Hopper',
      email: 'grace@example.org',
      email_verified: false,
      review_state: 'pending',
    },
  },
};
