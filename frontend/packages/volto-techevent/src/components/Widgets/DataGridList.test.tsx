// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import DataGridListWidget, {
  type DataGridListWidgetProps,
} from './DataGridList';
import { renderInVolto } from '../../testing/render';

const schema = {
  title: 'Step',
  addMessage: 'Add step',
  fieldsets: [{ id: 'default', title: 'Default', fields: ['title'] }],
  properties: { title: { title: 'Title', type: 'string' } },
  required: [],
};

function props(
  overrides: Partial<DataGridListWidgetProps> = {},
): DataGridListWidgetProps {
  return {
    id: 'steps',
    block: 'block-1',
    fieldSet: 'default',
    title: 'Steps',
    value: [],
    onChange: vi.fn(),
    activeObject: 0,
    setActiveObject: vi.fn(),
    items: schema,
    ...overrides,
  } as DataGridListWidgetProps;
}

describe('DataGridListWidget', () => {
  it('shows the add button with the schema add message', () => {
    const { getByRole } = renderInVolto(<DataGridListWidget {...props()} />);
    expect(getByRole('button', { name: 'Add step' })).toBeTruthy();
  });

  it('adds an item and makes it the active one', () => {
    const onChange = vi.fn();
    const setActiveObject = vi.fn();
    const { getByRole } = renderInVolto(
      <DataGridListWidget
        {...props({
          value: [{ '@id': 'a', title: 'Intro' }],
          onChange,
          setActiveObject,
        })}
      />,
    );
    fireEvent.click(getByRole('button', { name: 'Add step' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    const [id, newValue] = onChange.mock.calls[0];
    expect(id).toBe('steps');
    expect(newValue).toHaveLength(2);
    expect(newValue[0].title).toBe('Intro');
    expect(setActiveObject).toHaveBeenCalledWith(1);
  });

  it('shows one row per item, titled by the item or by its position', () => {
    const { container } = renderInVolto(
      <DataGridListWidget
        {...props({
          value: [{ '@id': 'a', title: 'Intro' }, { '@id': 'b' }],
        })}
      />,
    );
    const titles = Array.from(
      container.querySelectorAll('.olw-item-title'),
    ).map((title) => title.textContent);
    expect(titles).toEqual(['Intro', 'Step #2']);
  });

  it('removes the item of its row', () => {
    const onChange = vi.fn();
    const { getByRole } = renderInVolto(
      <DataGridListWidget
        {...props({
          value: [
            { '@id': 'a', title: 'Intro' },
            { '@id': 'b', title: 'Deep dive' },
          ],
          onChange,
        })}
      />,
    );
    fireEvent.click(getByRole('button', { name: 'Remove item #2' }));
    const [, newValue] = onChange.mock.calls[0];
    expect(newValue.map((item: { title: string }) => item.title)).toEqual([
      'Intro',
    ]);
  });

  it('marks only the active row', () => {
    const { container } = renderInVolto(
      <DataGridListWidget
        {...props({
          activeObject: 1,
          value: [
            { '@id': 'a', title: 'Intro' },
            { '@id': 'b', title: 'Deep dive' },
          ],
        })}
      />,
    );
    const rows = Array.from(container.querySelectorAll('.olw-item-wrapper'));
    expect(rows.map((row) => row.classList.contains('active'))).toEqual([
      false,
      true,
    ]);
  });

  it('asks for the row to be opened when its title bar is clicked', () => {
    const setActiveObject = vi.fn();
    const { container } = renderInVolto(
      <DataGridListWidget
        {...props({
          activeObject: 0,
          setActiveObject,
          value: [
            { '@id': 'a', title: 'Intro' },
            { '@id': 'b', title: 'Deep dive' },
          ],
        })}
      />,
    );
    const bars = container.querySelectorAll('.olw-item-title-bar');
    fireEvent.click(bars[1]);
    expect(setActiveObject).toHaveBeenCalledWith(1);
  });

  it('shows the empty marker and no rows when there are no items', () => {
    const { container } = renderInVolto(<DataGridListWidget {...props()} />);
    const marker = container.querySelector('input[type="hidden"]');
    expect((marker as HTMLInputElement).value).toBe('Empty object list');
    expect(container.querySelectorAll('.olw-item-wrapper')).toHaveLength(0);
  });
});
