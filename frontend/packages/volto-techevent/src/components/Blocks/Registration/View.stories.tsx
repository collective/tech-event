import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import View from './View';
import { blockViewProps } from '../Sponsors/fixtures';
import {
  closedStatus,
  expiredStatus,
  memberStatus,
  openStatus,
  registeredStatus,
  registrationStore,
} from '../../Registration/fixtures';
import type { RegistrationStatus } from '../../../types/registration';

const meta = {
  title: 'Techevent/Registration/Blocks/Registration/View',
  component: View,
  tags: ['autodocs'],
  args: blockViewProps({
    type: 'eventRegistration',
    data: { title: 'Register for the event' },
  }),
} satisfies Meta<typeof View>;

export default meta;
type Story = StoryObj<typeof meta>;

const withStatus = (
  status: RegistrationStatus | null,
  loggedIn = false,
): Story['decorators'] => [
  (Story) => (
    <Wrapper anonymous customStore={registrationStore(status, loggedIn)}>
      <div style={{ padding: 24, maxWidth: 720 }}>
        <Story />
      </div>
    </Wrapper>
  ),
];

export const AnonymousForm: Story = { decorators: withStatus(openStatus) };

export const LogInToRegister: Story = { decorators: withStatus(memberStatus) };

export const LoggedInForm: Story = {
  decorators: withStatus(memberStatus, true),
};

export const Registered: Story = {
  decorators: withStatus(registeredStatus, true),
};

export const Closed: Story = { decorators: withStatus(closedStatus, true) };

export const DeadlinePassed: Story = {
  decorators: withStatus(expiredStatus, true),
};
