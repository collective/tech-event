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

describe('SponsorLevel data form', () => {
  it('gives the form its title, its fieldsets and the block data', () => {
    const data = { '@type': 'sponsorLevelBlock', title: 'Our Top Partners' };
    renderInVolto(
      <Data data={data} block="block-1" onChangeBlock={() => {}} />,
    );
    const props = received.at(-1);
    expect(props?.title).toBe('Sponsor Level');
    expect(props?.schema.fieldsets.map((set: any) => set.id)).toEqual([
      'default',
      'cta',
      'styling',
    ]);
    expect(props?.schema.fieldsets[1].fields).toEqual([
      'displayCTA',
      'href',
      'label',
    ]);
    expect(props?.formData).toEqual(data);
  });

  it('writes a changed field back to the block', () => {
    const data = { '@type': 'sponsorLevelBlock', title: 'Our Top Partners' };
    const onChangeBlock = vi.fn();
    renderInVolto(
      <Data data={data} block="block-1" onChangeBlock={onChangeBlock} />,
    );
    received.at(-1)?.onChangeField('label', 'Join us');
    expect(onChangeBlock).toHaveBeenCalledWith('block-1', {
      ...data,
      label: 'Join us',
    });
  });
});
