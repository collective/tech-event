import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import PresenterGridItem from './PresenterGridItem';
import { presenterAda } from '../../Schedule/fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous>
    <div style={{ padding: 24, maxWidth: 360 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Blocks/Listing/PresenterGridItem',
  component: PresenterGridItem,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof PresenterGridItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { item: presenterAda } };
