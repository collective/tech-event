import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import SessionMaterials from './SessionMaterials';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous>
    <div style={{ padding: 24, maxWidth: 480 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Schedule/SessionMaterials',
  component: SessionMaterials,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof SessionMaterials>;

export default meta;
type Story = StoryObj<typeof meta>;

const material = (title: string, id: string) => ({
  '@id': `https://example.org/files/${id}`,
  '@type': 'File',
  description: '',
  head_title: '',
  image_field: '',
  image_scales: null,
  review_state: 'published',
  title,
});

export const Default: Story = {
  args: {
    content: {
      items: [material('Slides', 'slides'), material('Notebook', 'notebook')],
    },
  },
};

export const NoMaterials: Story = { args: { content: { items: [] } } };
