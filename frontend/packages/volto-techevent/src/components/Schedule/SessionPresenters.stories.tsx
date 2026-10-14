import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import SessionPresenters from './SessionPresenters';
import {
  brainWithPresenters,
  presenterAda,
  presenterGrace,
  presenterKatherine,
} from './fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous>
    <div style={{ padding: 24, maxWidth: 480 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Schedule/SessionPresenters',
  component: SessionPresenters,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof SessionPresenters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: { item: brainWithPresenters([presenterAda]) },
};

export const Several: Story = {
  args: {
    item: brainWithPresenters([
      presenterAda,
      presenterGrace,
      presenterKatherine,
    ]),
  },
};
