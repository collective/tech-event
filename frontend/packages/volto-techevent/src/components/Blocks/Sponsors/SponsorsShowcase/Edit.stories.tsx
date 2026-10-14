import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import Edit from './Edit';
import { blockEditProps, registerSponsorBlocks } from '../fixtures';
import { sponsorsStore } from '../../../Sponsors/fixtures';

registerSponsorBlocks();

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous customStore={sponsorsStore}>
    <div style={{ padding: 24, maxWidth: 720 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Sponsors/Blocks/SponsorsShowcase/Edit',
  component: Edit,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof Edit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: blockEditProps({
    type: 'sponsorsShowcaseBlock',
    data: { title: 'Packages' },
    content: { benefits: [] },
  }),
};
