import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import SponsorLevel from './SponsorLevel';
import { goldLevel, sponsorsStore } from './fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous customStore={sponsorsStore}>
    <div style={{ padding: 24, maxWidth: 720 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Sponsors/SponsorLevel',
  component: SponsorLevel,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof SponsorLevel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { item: goldLevel } };

export const CustomTitle: Story = {
  args: { item: goldLevel, title: 'Our Top Partners' },
};

export const RightAligned: Story = {
  args: {
    item: goldLevel,
    styles: { 'align:noprefix': { '--block-alignment': 'align-right' } },
  },
};
