import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Wrapper from '@plone/volto/storybook';
import { DemoContainer } from '@plone-collective/volto-techevent/stories/utils';
import CountdownElements from '../components/Countdown/CountdownElements';

const meta = {
  title: 'TechEvent/Components/Countdown/CountdownElements',
  component: CountdownElements as any,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The whole structure of a countdown.',
      },
    },
  },
  args: {
    days: 99,
    hours: 12,
    minutes: 34,
    seconds: 59,
    size: 'l',
    displayFormat: 'ddhhmmss',
    hasSeparator: true,
  },
  argTypes: {
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
    days: {
      control: { type: 'number', min: 0 },
      description: 'Number of days to display',
      table: { type: { summary: 'number' }, defaultValue: { summary: 99 } },
    },
    hours: {
      control: { type: 'number', min: 0, max: 23 },
      description: 'Number of hours to display',
      table: { type: { summary: 'number' }, defaultValue: { summary: 12 } },
    },
    minutes: {
      control: { type: 'number', min: 0, max: 59 },
      description: 'Number of minutes to display',
      table: { type: { summary: 'number' }, defaultValue: { summary: 34 } },
    },
    seconds: {
      control: { type: 'number', min: 0, max: 59 },
      description: 'Number of seconds to display',
      table: { type: { summary: 'number' }, defaultValue: { summary: 59 } },
    },
    hasSeparator: {
      control: { type: 'boolean' },
      description: 'Whether to display a separator between elements',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: true } },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CountdownElements>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <CountdownElements {...args} />,
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
  render: (args) => <CountdownElements {...args} />,
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
  render: (args) => <CountdownElements {...args} />,
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
  render: (args) => <CountdownElements {...args} />,
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
