import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import RegistrationVerify from './RegistrationVerify';
import { registration } from './fixtures';
import { initialState } from '../../reducers/registration/registration';

const meta = {
  title: 'Techevent/Registration/RegistrationVerify',
  component: RegistrationVerify,
  tags: ['autodocs'],
} satisfies Meta<typeof RegistrationVerify>;

export default meta;
type Story = StoryObj<typeof meta>;

const withVerify = (
  verify: Partial<typeof initialState.verify>,
): Story['decorators'] => [
  (Story) => (
    <Wrapper
      anonymous
      location="/event/registration/verify?token=abc"
      customStore={{
        registration: {
          ...initialState,
          verify: { ...initialState.verify, ...verify },
        },
      }}
    >
      <div style={{ padding: 24, maxWidth: 720 }}>
        <Story />
      </div>
    </Wrapper>
  ),
];

export const Confirmed: Story = {
  decorators: withVerify({ result: registration }),
};

export const Expired: Story = {
  decorators: withVerify({ error: 'This link is invalid or has expired.' }),
};
