import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import SponsorView from './SponsorView';
import { sponsorsStore } from './fixtures';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous customStore={sponsorsStore}>
    <div style={{ padding: 24, maxWidth: 720 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Sponsors/SponsorView',
  component: SponsorView,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof SponsorView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextOnly: Story = {
  args: {
    content: {
      title: 'Acme Corp',
      description: 'Makes everything\nFor everyone',
      text: { data: '<p>Acme has been sponsoring since 2010.</p>' },
      social_links: null,
    },
  },
};

export const WithLinks: Story = {
  args: {
    content: {
      title: 'Acme Corp',
      description: 'Makes everything',
      social_links: [],
    },
  },
};
