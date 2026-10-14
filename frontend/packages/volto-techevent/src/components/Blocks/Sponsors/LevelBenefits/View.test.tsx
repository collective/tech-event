// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import View from './View';
import { blockViewProps } from '../fixtures';
import { sponsorsStore } from '../../../Sponsors/fixtures';
import { renderInVolto } from '../../../../testing/render';

const rowsOf = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('.benefit.item')).map((item) => [
    item.querySelector('.title')?.textContent,
    item.querySelector('.value')?.textContent,
  ]);

describe('LevelBenefits view', () => {
  it('shows the title and each benefit of the block with its value', () => {
    const { container } = renderInVolto(
      <View
        {...blockViewProps({
          data: { title: 'Our Packages' },
          content: {
            benefits: [
              { code: { token: 'logo' }, value: 'Yes' },
              { code: { token: 'booth' } },
            ],
          },
        })}
      />,
      sponsorsStore,
    );
    expect(container.querySelector('.benefits.title')?.textContent).toBe(
      'Our Packages',
    );
    expect(rowsOf(container)).toEqual([
      ['Logo', 'Yes'],
      ['Booth', ''],
    ]);
  });

  it('shows a check mark for a benefit included without a value', () => {
    const { container } = renderInVolto(
      <View
        {...blockViewProps({
          content: { benefits: [{ code: { token: 'logo' }, value: '' }] },
        })}
      />,
      sponsorsStore,
    );
    expect(rowsOf(container)).toEqual([['Logo', '✅']]);
  });

  it('uses the benefits of the properties when the content has none', () => {
    const { container } = renderInVolto(
      <View
        {...blockViewProps({
          properties: {
            benefits: [{ code: { token: 'booth' }, value: 'Yes' }],
          },
        })}
      />,
      sponsorsStore,
    );
    expect(rowsOf(container)).toEqual([['Booth', 'Yes']]);
  });

  it('skips a benefit the sponsors state does not know', () => {
    const { container } = renderInVolto(
      <View
        {...blockViewProps({
          content: {
            benefits: [
              { code: { token: 'unknown' }, value: 'Yes' },
              { code: { token: 'logo' }, value: 'Yes' },
            ],
          },
        })}
      />,
      sponsorsStore,
    );
    expect(rowsOf(container)).toEqual([['Logo', 'Yes']]);
  });

  it('shows no list without benefits', () => {
    const { container } = renderInVolto(
      <View {...blockViewProps({ content: { benefits: [] } })} />,
      sponsorsStore,
    );
    expect(container.querySelector('.benefits.wrapper')).toBeNull();
  });
});
