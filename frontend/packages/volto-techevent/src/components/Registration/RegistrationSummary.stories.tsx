import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import RegistrationSummary from './RegistrationSummary';
import { pendingRegistration, registration } from './fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous>
    <div style={{ padding: 24, maxWidth: 480 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Registration/RegistrationSummary',
  component: RegistrationSummary,
  decorators: [withWrapper],
  tags: ['autodocs'],
  args: { onCancel: () => {} },
} satisfies Meta<typeof RegistrationSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Registered: Story = {
  args: { registration, canCancel: true },
};

export const WaitingForEmail: Story = {
  args: { registration: pendingRegistration },
};

export const Attended: Story = {
  args: {
    registration: { ...registration, state: 'attended' },
    canCancel: true,
  },
};
