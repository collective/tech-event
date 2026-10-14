import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import Wrapper from '@plone/volto/storybook';
import DndSortableList, {
  type SortableItemRenderProps,
} from './DndSortableList';

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous>
    <div style={{ padding: 24, maxWidth: 480 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Widgets/DndSortableList',
  component: DndSortableList,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof DndSortableList>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  { '@id': 'step-a', title: 'Intro' },
  { '@id': 'step-b', title: 'Deep dive' },
  { '@id': 'step-c', title: 'Wrap-up' },
];

const renderItem = ({ item, index }: SortableItemRenderProps) => (
  <div className="story-row">{`${index + 1}. ${item.title}`}</div>
);

export const Default: Story = {
  args: {
    items,
    handleDragEnd: () => {},
    activeObject: -1,
    setActiveObject: () => {},
    children: renderItem,
  },
};

export const Empty: Story = {
  args: {
    items: [],
    handleDragEnd: () => {},
    activeObject: -1,
    setActiveObject: () => {},
    children: renderItem,
  },
};
