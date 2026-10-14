import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import PresenterCategory from './PresenterCategory';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous>
    <div style={{ padding: 24 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Presenter/PresenterCategory',
  component: PresenterCategory,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof PresenterCategory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Speaker: Story = {
  args: { label: { token: 'speaker', title: 'Speaker' } },
};

export const KeynoteSpeaker: Story = {
  args: { label: { token: 'keynote-speaker', title: 'Keynote Speaker' } },
};
