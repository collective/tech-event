// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import Data from './Data';
import { renderInVolto } from '../../../../testing/render';

// Volto's form needs the whole block sidebar to render; this test checks what
// the Data component hands to it, so the form is replaced by a probe.
const { received } = vi.hoisted(() => ({
  received: [] as Array<Record<string, any>>,
}));

vi.mock('@plone/volto/components/manage/Form/BlockDataForm', () => ({
  default: (props: Record<string, any>) => {
    received.push(props);
    return <div className="block-data-form" />;
  },
}));

describe('LevelComparison data form', () => {
  it('gives the form its title, schema and the block data', () => {
    const data = { '@type': 'levelComparisonBlock', title: 'Our Packages' };
    renderInVolto(
      <Data data={data} block="block-1" onChangeBlock={() => {}} />,
    );
    const props = received.at(-1);
    expect(props?.title).toBe('Package Comparison');
    expect(props?.schema.fieldsets[0].fields).toEqual(['title', 'tableTitle']);
    expect(props?.formData).toEqual(data);
  });

  it('writes a changed field back to the block', () => {
    const data = { '@type': 'levelComparisonBlock', title: 'Our Packages' };
    const onChangeBlock = vi.fn();
    renderInVolto(
      <Data data={data} block="block-1" onChangeBlock={onChangeBlock} />,
    );
    received.at(-1)?.onChangeField('tableTitle', 'Compare');
    expect(onChangeBlock).toHaveBeenCalledWith('block-1', {
      ...data,
      tableTitle: 'Compare',
    });
  });
});
