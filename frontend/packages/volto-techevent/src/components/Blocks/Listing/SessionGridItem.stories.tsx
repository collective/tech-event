import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import SessionGridItem from './SessionGridItem';
import { brainSession, eventStore } from '../../Schedule/fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous customStore={eventStore}>
    <div style={{ padding: 24, maxWidth: 480 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Blocks/Listing/SessionGridItem',
  component: SessionGridItem,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof SessionGridItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { item: brainSession } };
