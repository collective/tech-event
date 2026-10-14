import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import PresenterView from './PresenterView';
import { activityGroups, presenterAda } from './fixtures';
import type { PresenterItem } from './types';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous>
    <div style={{ padding: 24, maxWidth: 960 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Presenter/PresenterView',
  component: PresenterView,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof PresenterView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { content: presenterAda } };

export const WithActivities: Story = {
  args: {
    content: {
      ...presenterAda,
      activities: activityGroups,
    } as unknown as PresenterItem,
  },
};
