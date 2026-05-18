import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Wrapper from '@plone/volto/storybook';
import { DemoContainer } from '@plone-collective/volto-techevent/stories/utils';
import { imageHref, parallaxItems } from './mocks';
import Parallax from '../components/Parallax/Parallax';

const meta = {
  title: 'TechEvent/Components/Parallax/Parallax',
  component: Parallax as any,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A parallax component.',
      },
    },
  },
  args: {
    title: 'Parallax Title',
    description: 'Parallax Description',
    href: imageHref,
    overlay: 'full-overlay',
    height: 'l',
    items: parallaxItems,
    isEditMode: false,
    className: '',
  },
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Title applied to the parallax component',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Parallax Title' },
      },
    },
    description: {
      control: { type: 'text' },
      description: 'Description applied to the parallax component',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '<b>Parallax</b Description' },
      },
    },
    overlay: {
      control: {
        type: 'select',
      },
      options: ['full-overlay', 'solid-textbox'],
      description: 'Overlay style',
      table: {
        type: { summary: 'select' },
        defaultValue: { summary: 'full-overlay' },
      },
    },
    height: {
      control: {
        type: 'select',
      },
      options: ['l', 'm', 's'],
      description: 'Height of the parallax component',
      table: {
        type: { summary: 'select' },
        defaultValue: { summary: 'l' },
      },
    },
    className: {
      control: { type: 'text' },
      description: 'Classname to be applied to this element',
      table: { type: { summary: 'string' }, defaultValue: { summary: '' } },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Parallax>;

export default meta;

type Story = StoryObj<typeof meta>;

const transformArgs = (args: Record<string, any>) => {
  return {
    ...args,
    description: { data: `<b>${args.description}</b>` },
  };
};

export const Default: Story = {
  render: (args) => <Parallax {...transformArgs(args)} />,
  decorators: [
    (Story) => (
      <Wrapper>
        <DemoContainer height={1200}>
          <Story />
        </DemoContainer>
      </Wrapper>
    ),
  ],
};
export const SizeSmall: Story = {
  render: (args) => <Parallax {...transformArgs(args)} />,
  args: {
    height: 's',
  },
  decorators: [
    (Story) => (
      <Wrapper>
        <DemoContainer height={1200}>
          <Story />
        </DemoContainer>
      </Wrapper>
    ),
  ],
};

export const SizeMedium: Story = {
  render: (args) => <Parallax {...transformArgs(args)} />,
  args: {
    height: 'm',
  },
  decorators: [
    (Story) => (
      <Wrapper>
        <DemoContainer height={1200}>
          <Story />
        </DemoContainer>
      </Wrapper>
    ),
  ],
};

export const SizeLarge: Story = {
  render: (args) => <Parallax {...transformArgs(args)} />,
  args: {
    height: 'l',
  },
  decorators: [
    (Story) => (
      <Wrapper>
        <DemoContainer height={1200}>
          <Story />
        </DemoContainer>
      </Wrapper>
    ),
  ],
};

export const AlignLeft: Story = {
  render: (args) => <Parallax {...transformArgs(args)} />,
  args: {
    height: 'm',
  },
  decorators: [
    (Story) => (
      <Wrapper>
        <DemoContainer height={1200} style={{ '--block-alignment': 'start' }}>
          <Story />
        </DemoContainer>
      </Wrapper>
    ),
  ],
};

export const AlignCenter: Story = {
  render: (args) => <Parallax {...transformArgs(args)} />,
  args: {
    height: 'm',
  },
  decorators: [
    (Story) => (
      <Wrapper>
        <DemoContainer height={1200} style={{ '--block-alignment': 'center' }}>
          <Story />
        </DemoContainer>
      </Wrapper>
    ),
  ],
};

export const AlignRight: Story = {
  render: (args) => <Parallax {...transformArgs(args)} />,
  args: {
    height: 'm',
  },
  decorators: [
    (Story) => (
      <Wrapper>
        <DemoContainer height={1200} style={{ '--block-alignment': 'end' }}>
          <Story />
        </DemoContainer>
      </Wrapper>
    ),
  ],
};
