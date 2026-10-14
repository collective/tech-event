import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import SponsorList from './SponsorList';
import { goldLevel, sponsorsStore } from './fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous customStore={sponsorsStore}>
    <div style={{ padding: 24, maxWidth: 720 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Sponsors/SponsorList',
  component: SponsorList,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof SponsorList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { sponsors: goldLevel.items },
};

export const Empty: Story = { args: { sponsors: [] } };
