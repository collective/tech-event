import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import RegistrationForm from './RegistrationForm';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous>
    <div style={{ padding: 24, maxWidth: 480 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Registration/RegistrationForm',
  component: RegistrationForm,
  decorators: [withWrapper],
  tags: ['autodocs'],
  args: { onSubmit: () => {} },
} satisfies Meta<typeof RegistrationForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Anonymous: Story = {};

export const LoggedIn: Story = {
  args: {
    defaults: {
      first_name: 'Ada',
      last_name: 'Lovelace',
      email: 'ada@example.org',
    },
  },
};

export const Refused: Story = {
  args: { error: 'This email is already registered for this event.' },
};
