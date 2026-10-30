import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import RegistrationModal from './RegistrationModal';
import { memberStatus, registeredStatus } from './fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous>
    <Story />
  </Wrapper>
);

const meta = {
  title: 'Techevent/Registration/RegistrationModal',
  component: RegistrationModal,
  decorators: [withWrapper],
  tags: ['autodocs'],
  args: {
    open: true,
    status: memberStatus,
    isLoggedIn: true,
    onClose: () => {},
    onRegister: () => {},
    onCancel: () => {},
  },
} satisfies Meta<typeof RegistrationModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Form: Story = {};

export const Registered: Story = {
  args: { status: registeredStatus },
};
