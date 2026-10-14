import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import PresenterActivities from './PresenterActivities';
import { activityGroups } from './fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous>
    <div style={{ padding: 24, maxWidth: 720 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Presenter/PresenterActivities',
  component: PresenterActivities,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof PresenterActivities>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { activities: activityGroups } };

export const Empty: Story = { args: { activities: [] } };
