import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import Data from './Data';
import { blockEditProps } from '../fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous>
    <div style={{ padding: 24, maxWidth: 720 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Sponsors/Blocks/LevelBenefits/Data',
  component: Data,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof Data>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: blockEditProps({
    type: 'levelBenefitsBlock',
    data: { title: 'Our Packages' },
  }),
};
