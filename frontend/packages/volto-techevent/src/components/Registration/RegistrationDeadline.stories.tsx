import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import RegistrationDeadline from './RegistrationDeadline';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous>
    <div style={{ padding: 24 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Registration/RegistrationDeadline',
  component: RegistrationDeadline,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof RegistrationDeadline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { closesAt: '2030-11-20T21:00:00+00:00' },
};
