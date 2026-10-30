import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import { ManageRegistrationsButton } from './PlugManageRegistrations';

const withWrapper: Decorator = (Story) => (
  <Wrapper
    location="/registrations"
    customStore={{
      content: {
        data: {
          '@id': 'http://localhost:3000/registrations',
          '@type': 'Attendees',
        },
      },
      actions: { actions: { object: [{ id: 'edit' }], workflow: [] } },
    }}
  >
    <div className="toolbar expanded" style={{ padding: 24 }}>
      <div className="toolbar-actions">
        <Story />
      </div>
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Registration/ManageRegistrationsButton',
  component: ManageRegistrationsButton,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof ManageRegistrationsButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
