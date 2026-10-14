// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect } from 'vitest';
import DndSortableList, {
  type SortableItemRenderProps,
} from './DndSortableList';
import { renderInVolto } from '../../../testing/render';

const items = [
  { '@id': 'step-a', title: 'Intro' },
  { '@id': 'step-b', title: 'Deep dive' },
];

const describeRow = ({
  item,
  uid,
  index,
  activeObject,
}: SortableItemRenderProps) => (
  <span className="row">{`${index}|${uid}|${item.title}|${activeObject}`}</span>
);

describe('DndSortableList', () => {
  it('renders each item with its index, its @id and the active index', () => {
    const { container } = renderInVolto(
      <DndSortableList
        items={items}
        handleDragEnd={() => {}}
        activeObject={1}
        setActiveObject={() => {}}
      >
        {describeRow}
      </DndSortableList>,
    );
    const rows = Array.from(container.querySelectorAll('.row')).map(
      (row) => row.textContent,
    );
    expect(rows).toEqual(['0|step-a|Intro|1', '1|step-b|Deep dive|1']);
  });

  it('uses the index as the id of an item without an @id', () => {
    const { container } = renderInVolto(
      <DndSortableList
        items={[{ title: 'Only' }]}
        handleDragEnd={() => {}}
        activeObject={-1}
        setActiveObject={() => {}}
      >
        {describeRow}
      </DndSortableList>,
    );
    expect(container.querySelector('.row')?.textContent).toBe('0|0|Only|-1');
  });

  it('renders nothing for an empty list', () => {
    const { container } = renderInVolto(
      <DndSortableList
        items={[]}
        handleDragEnd={() => {}}
        activeObject={-1}
        setActiveObject={() => {}}
      >
        {describeRow}
      </DndSortableList>,
    );
    expect(container.querySelectorAll('.row')).toHaveLength(0);
  });
});
