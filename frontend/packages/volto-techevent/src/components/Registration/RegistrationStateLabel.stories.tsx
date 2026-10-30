import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import RegistrationStateLabel from './RegistrationStateLabel';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous>
    <div style={{ padding: 24 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Registration/RegistrationStateLabel',
  component: RegistrationStateLabel,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof RegistrationStateLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = { args: { state: 'pending' } };
export const Registered: Story = { args: { state: 'registered' } };
export const Attended: Story = { args: { state: 'attended' } };
export const Cancelled: Story = { args: { state: 'cancelled' } };
