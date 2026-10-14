import { describe, it, expect } from 'vitest';
import type { ConfigType } from '@plone/registry';
import installWidgets from './widgets';
import DataGridListWidget from '../components/Widgets/DataGridList';

describe('installWidgets', () => {
  it('registers the dataGridList widget', () => {
    const config = installWidgets({
      widgets: { widget: {} },
    } as unknown as ConfigType);
    expect(config.widgets.widget.dataGridList).toBe(DataGridListWidget);
  });

  it('keeps the widgets already registered', () => {
    const TextWidget = () => null;
    const config = installWidgets({
      widgets: { widget: { text: TextWidget } },
    } as unknown as ConfigType);
    expect(config.widgets.widget.text).toBe(TextWidget);
    expect(Object.keys(config.widgets.widget)).toEqual([
      'text',
      'dataGridList',
    ]);
  });
});
