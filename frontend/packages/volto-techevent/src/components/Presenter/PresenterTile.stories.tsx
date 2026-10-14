import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import PresenterTile from './PresenterTile';
import { presenterAda } from './fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous>
    <div style={{ padding: 24, maxWidth: 320 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Presenter/PresenterTile',
  component: PresenterTile,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof PresenterTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { item: presenterAda } };
