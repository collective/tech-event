import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import LightningTalksView from './LightningTalksView';
import { eventStore, lightningTalksContent } from './fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous customStore={eventStore}>
    <Story />
  </Wrapper>
);

const meta = {
  title: 'Techevent/Schedule/LightningTalksView',
  component: LightningTalksView,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof LightningTalksView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { content: lightningTalksContent } };

export const NoTalks: Story = {
  args: { content: { ...lightningTalksContent, talks: [] } },
};
