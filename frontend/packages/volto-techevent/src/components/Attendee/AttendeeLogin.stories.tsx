import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import RequestOneTimePassword from './AttendeeLogin';

const withWrapper: Decorator = (Story) => (
  <Wrapper
    anonymous
    customStore={{
      users: { reset: { loading: false, loaded: false, error: null } },
    }}
  >
    <div style={{ padding: 24, maxWidth: 480 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Attendee/AttendeeLogin',
  component: RequestOneTimePassword,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof RequestOneTimePassword>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
