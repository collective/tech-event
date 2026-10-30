import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import ManageRegistrations from './ManageRegistrations';
import { attendeesStore } from '../Registration/fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper
    customStore={attendeesStore()}
    location="/registrations/manage-registrations"
  >
    <div style={{ padding: 24 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Registration/ManageRegistrations',
  component: ManageRegistrations,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof ManageRegistrations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
