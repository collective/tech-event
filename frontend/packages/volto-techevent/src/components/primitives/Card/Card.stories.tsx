import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import Card from './Card';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous>
    <div style={{ padding: 24, maxWidth: 360 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Primitives/Card',
  component: Card,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {
  args: {
    className: 'profile',
    children: (
      <Card.Summary>
        <h3>Ada Lovelace</h3>
        <p>Analytical engine</p>
      </Card.Summary>
    ),
  },
};

export const AsLink: Story = {
  args: {
    href: '/presenters/ada',
    children: (
      <Card.Summary>
        <h3>Ada Lovelace</h3>
      </Card.Summary>
    ),
  },
};

export const WithImage: Story = {
  args: {
    href: '/presenters/ada',
    children: (
      <>
        <Card.Image src="https://example.org/images/ada.png" />
        <Card.Summary>
          <h3>Ada Lovelace</h3>
        </Card.Summary>
      </>
    ),
  },
};

export const WithActions: Story = {
  args: {
    children: (
      <>
        <Card.Summary>
          <h3>Ada Lovelace</h3>
        </Card.Summary>
        <Card.Actions>
          <button type="button">Follow</button>
        </Card.Actions>
      </>
    ),
  },
};
