import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import DataGridListWidget from './DataGridList';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous>
    <div style={{ padding: 24, maxWidth: 640 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Widgets/DataGridList',
  component: DataGridListWidget,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof DataGridListWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

const schema = {
  title: 'Step',
  addMessage: 'Add step',
  fieldsets: [{ id: 'default', title: 'Default', fields: ['title'] }],
  properties: { title: { title: 'Title', type: 'string' } },
  required: [],
};

const common = {
  id: 'steps',
  block: 'block-1',
  fieldSet: 'default',
  title: 'Steps',
  onChange: () => {},
  activeObject: 0,
  setActiveObject: () => {},
  items: schema,
};

export const Empty: Story = {
  args: { ...common, value: [] },
};

export const WithItems: Story = {
  args: {
    ...common,
    value: [
      { '@id': 'a', title: 'Intro' },
      { '@id': 'b', title: 'Deep dive' },
    ],
  },
};
