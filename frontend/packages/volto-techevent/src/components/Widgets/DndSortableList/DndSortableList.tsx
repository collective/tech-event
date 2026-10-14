import * as React from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/** What the render prop receives for each item of the list. */
export type SortableItemRenderProps = {
  /** The unique identifier of the item, its `@id` or its index. */
  uid: string;
  /** The item itself. */
  item: Record<string, any>;
  /** The position of the item in the list. */
  index: number;
  /** The index of the item that is currently active (open). */
  activeObject: number;
  /** The drag attributes to spread on the drag handle. */
  attributes: Record<string, any>;
  /** The drag listeners to spread on the drag handle. */
  listeners: Record<string, any> | undefined;
};

export type DndSortableListProps = {
  /** The items to sort. Each should carry an `@id`, else its index is used. */
  items: Array<Record<string, any>>;
  /** Called with the drag event when a drag ends. */
  handleDragEnd: (event: DragEndEvent) => void;
  /** The index of the currently active (open) item. */
  activeObject: number;
  /** Called when a drag starts, to close the active item. */
  setActiveObject: (index: number | null) => void;
  /** Renders each item. */
  children: (params: SortableItemRenderProps) => React.ReactNode;
};

const uidOf = (item: Record<string, any>, index: number): string =>
  item['@id'] ?? String(index);

const SortableItem = (props: {
  uid: string;
  item: Record<string, any>;
  index: number;
  activeObject: number;
  render: DndSortableListProps['children'];
}) => {
  const { uid, item, index, activeObject, render } = props;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: uid });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {render({ uid, item, index, activeObject, attributes, listeners })}
    </div>
  );
};

/**
 * A vertical list whose items can be reordered by dragging, built on dnd-kit.
 *
 * It replaces the list the Volto light theme used to provide, so the add-on
 * does not depend on that theme.
 */
const DndSortableList = (props: DndSortableListProps) => {
  const { items, children, handleDragEnd, activeObject, setActiveObject } =
    props;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart(_event: DragStartEvent) {
    setActiveObject(null);
  }

  const list = items ?? [];
  const uids = list.map((item, index) => uidOf(item, index));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={uids} strategy={verticalListSortingStrategy}>
        {list.map((item, index) => (
          <SortableItem
            key={uids[index]}
            uid={uids[index]}
            item={item}
            index={index}
            activeObject={activeObject}
            render={children}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default DndSortableList;
