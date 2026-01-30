import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Wrapper from '@plone/volto/storybook';
import { DemoContainer } from '@plone-collective/volto-techevent/stories/utils';
import Countdown from '../components/Countdown/Countdown';

const meta = {
  title: 'TechEvent/Components/Countdown/Countdown',
  component: Countdown as any,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A countdown timer.',
      },
    },
  },
  args: {
    targetDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    size: 'l',
    displayFormat: 'ddhhmmss',
    hideAfterStart: true,
    hasSeparator: true,
  },
  argTypes: {
    targetDate: {
      control: { type: 'date' },
      description: 'Target date for the countdown',
      table: {
        type: { summary: 'date' },
        defaultValue: { summary: 'ddhhmmss' },
      },
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['l', 'm', 's'],
      description: 'Size of the countdown elements',
      table: {
        type: { summary: 'select' },
        defaultValue: { summary: 'l' },
      },
    },
    displayFormat: {
      control: {
        type: 'select',
      },
      options: ['ddhhmmss', 'ddhhmm', 'ddhh', 'dd'],
      description: 'Display format of the countdown elements',
      table: {
        type: { summary: 'select' },
        defaultValue: { summary: 'ddhhmmss' },
      },
    },
    hideAfterStart: {
      control: { type: 'boolean' },
      description:
        'Whether to hide the countdown after the target date is reached',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: true } },
    },
    hasSeparator: {
      control: { type: 'boolean' },
      description: 'Whether to display a separator between elements',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: true } },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Countdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <Countdown {...args} />,
  decorators: [
    (Story) => (
      <Wrapper>
        <DemoContainer>
          <Story />
        </DemoContainer>
      </Wrapper>
    ),
  ],
};

export const WithoutSeparator: Story = {
  render: (args) => <Countdown {...args} />,
  args: {
    hasSeparator: false,
  },
  decorators: [
    (Story) => (
      <Wrapper>
        <DemoContainer>
          <Story />
        </DemoContainer>
      </Wrapper>
    ),
  ],
};

export const SizeMedium: Story = {
  render: (args) => <Countdown {...args} />,
  args: {
    size: 'm',
  },
  decorators: [
    (Story) => (
      <Wrapper>
        <DemoContainer>
          <Story />
        </DemoContainer>
      </Wrapper>
    ),
  ],
};

export const SizeSmall: Story = {
  render: (args) => <Countdown {...args} />,
  args: {
    size: 's',
  },
  decorators: [
    (Story) => (
      <Wrapper>
        <DemoContainer>
          <Story />
        </DemoContainer>
      </Wrapper>
    ),
  ],
};
