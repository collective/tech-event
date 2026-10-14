// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import View from './View';
import { blockViewProps } from '../fixtures';
import {
  benefits,
  goldLevel,
  silverLevel,
  sponsorsStore,
} from '../../../Sponsors/fixtures';
import { renderInVolto } from '../../../../testing/render';

const texts = (container: HTMLElement, selector: string) =>
  Array.from(container.querySelectorAll(selector)).map(
    (node) => node.textContent,
  );

describe('LevelComparison view', () => {
  it('shows the title, a column per level and a row per benefit', () => {
    const { container } = renderInVolto(
      <View
        {...blockViewProps({
          type: 'levelComparisonBlock',
          data: { title: 'Our Packages', tableTitle: 'Compare' },
        })}
      />,
      sponsorsStore,
    );
    expect(texts(container, '.levelComparison.title')).toEqual([
      'Our Packages',
    ]);
    expect(texts(container, '.benefitPlanCol .header span')).toEqual([
      'Gold',
      'Silver',
    ]);
    expect(texts(container, '.benefitTitle .title')).toEqual(['Logo', 'Booth']);
  });

  it('marks the benefits each level includes, and leaves the others empty', () => {
    const { container } = renderInVolto(
      <View
        {...blockViewProps({
          type: 'levelComparisonBlock',
          data: {},
        })}
      />,
      sponsorsStore,
    );
    const rows = Array.from(container.querySelectorAll('tr.benefitRow')).map(
      (row) =>
        Array.from(row.querySelectorAll('.benefitValue .value')).map(
          (cell) => cell.textContent,
        ),
    );
    expect(rows).toEqual([
      ['✅', ''],
      ['', ''],
    ]);
  });

  it('titles the first column with the table title, or Benefit without one', () => {
    const { container, unmount } = renderInVolto(
      <View
        {...blockViewProps({
          type: 'levelComparisonBlock',
          data: { tableTitle: 'Compare' },
        })}
      />,
      sponsorsStore,
    );
    expect(texts(container, '.benefitCol .header')).toEqual(['Compare']);
    unmount();

    const { container: plain } = renderInVolto(
      <View {...blockViewProps({ type: 'levelComparisonBlock', data: {} })} />,
      sponsorsStore,
    );
    expect(texts(plain, '.benefitCol .header')).toEqual(['Benefit']);
  });

  it('leaves out the levels excluded from navigation', () => {
    const store = {
      ...sponsorsStore,
      sponsors: {
        ...sponsorsStore.sponsors,
        levels: [goldLevel, { ...silverLevel, exclude_from_nav: true }],
      },
    };
    const { container } = renderInVolto(
      <View {...blockViewProps({ type: 'levelComparisonBlock', data: {} })} />,
      store,
    );
    expect(texts(container, '.benefitPlanCol .header span')).toEqual(['Gold']);
  });

  it('treats a benefit with no levels as having none of them', () => {
    const store = {
      ...sponsorsStore,
      sponsors: {
        ...sponsorsStore.sponsors,
        benefits: [{ ...benefits[0], levels: null }, benefits[1]],
      },
    };
    const { container } = renderInVolto(
      <View {...blockViewProps({ type: 'levelComparisonBlock', data: {} })} />,
      store,
    );
    const rows = Array.from(container.querySelectorAll('tr.benefitRow')).map(
      (row) =>
        Array.from(row.querySelectorAll('.benefitValue .value')).map(
          (cell) => cell.textContent,
        ),
    );
    expect(rows).toEqual([
      ['', ''],
      ['', ''],
    ]);
  });

  it('shows no table without benefits', () => {
    const store = {
      ...sponsorsStore,
      sponsors: { ...sponsorsStore.sponsors, benefits: [] },
    };
    const { container } = renderInVolto(
      <View {...blockViewProps({ type: 'levelComparisonBlock', data: {} })} />,
      store,
    );
    expect(
      container.querySelector('.levelComparison.tableContainer'),
    ).toBeNull();
  });
});
