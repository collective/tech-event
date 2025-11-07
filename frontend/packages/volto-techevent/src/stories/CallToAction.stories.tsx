import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Wrapper from '@plone/volto/storybook';
import { DemoContainer } from '@plone-collective/volto-techevent/stories/utils';
import CallToAction from '../components/CallToAction/CallToAction';

const meta = {
  title: 'TechEvent/Components/CallToAction/CallToAction',
  component: CallToAction as any,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A button.',
      },
    },
  },
  args: {
    className: '',
    size: 'm',
    label: 'Schedule',
    item: {
      '@id': '/schedule',
      '@type': 'Schedule',
    },
    isEditMode: false,
  },
  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Classname to be applied to this element',
      table: { type: { summary: 'string' }, defaultValue: { summary: '' } },
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['l', 'm', 's'],
      description: 'Size of the call to action',
      table: {
        type: { summary: 'select' },
        defaultValue: { summary: 'm' },
      },
    },
    label: {
      control: { type: 'text' },
      description: 'Call to action label',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Just do it!' },
      },
    },
    isEditMode: {
      control: { type: 'boolean' },
      description: 'Whether this is being rendered in the edit page',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: false } },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CallToAction>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <CallToAction {...args} />,
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

export const EditMode: Story = {
  render: (args) => <CallToAction {...args} />,
  args: {
    isEditMode: true,
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
  render: (args) => <CallToAction {...args} />,
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

export const SizeMedium: Story = {
  render: (args) => <CallToAction {...args} />,
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

export const SizeLarge: Story = {
  render: (args) => <CallToAction {...args} />,
  args: {
    size: 'l',
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
