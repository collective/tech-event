import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Wrapper from '@plone/volto/storybook';
import { DemoContainer } from '@plone-collective/volto-techevent/stories/utils';
import CountdownElement from '../components/Countdown/CountdownElement';

const meta = {
  title: 'TechEvent/Components/Countdown/CountdownElement',
  component: CountdownElement as any,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'One element of the countdown, showing a number and a label (e.g., "Days").',
      },
    },
  },
  args: {
    value: 12,
    label: 'Days',
    size: 'l',
  },
  argTypes: {
    value: {
      control: { type: 'number', min: 0 },
      description: 'Numeric value to display (e.g. days, hours)',
      table: { type: { summary: 'number' }, defaultValue: { summary: 12 } },
    },
    label: {
      control: { type: 'text' },
      description: 'Label for the value (e.g. "Days")',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'Days' } },
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['l', 'm', 's'],
      description: 'Size of the countdown element',
      table: {
        type: { summary: 'select' },
        defaultValue: { summary: 'l' },
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CountdownElement>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <CountdownElement {...args} />,
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
  render: (args) => <CountdownElement {...args} />,
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
  render: (args) => <CountdownElement {...args} />,
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
