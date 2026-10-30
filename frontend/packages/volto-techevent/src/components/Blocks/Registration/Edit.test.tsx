// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import config from '@plone/volto/registry';
import Edit from './Edit';
import blockInfo from './index';
import { blockEditProps } from '../Sponsors/fixtures';
import { openStatus, registrationStore } from '../../Registration/fixtures';
import { renderInVolto } from '../../../testing/render';

config.blocks.blocksConfig[blockInfo.id] = blockInfo;

describe('Registration block edit', () => {
  it('renders the block as it looks on the page', () => {
    const { container } = renderInVolto(
      <Edit
        {...blockEditProps({
          type: 'eventRegistration',
          data: { title: 'Register' },
        })}
      />,
      registrationStore(openStatus),
    );
    expect(container.querySelector('.registration-title')?.textContent).toBe(
      'Register',
    );
    expect(
      container.querySelector('button.registration-button'),
    ).not.toBeNull();
  });

  it('shows the hint when the event takes no registrations', () => {
    const { container } = renderInVolto(
      <Edit {...blockEditProps({ type: 'eventRegistration', data: {} })} />,
      registrationStore(null),
    );
    expect(container.textContent).toContain(
      'This event does not take registrations.',
    );
  });
});
