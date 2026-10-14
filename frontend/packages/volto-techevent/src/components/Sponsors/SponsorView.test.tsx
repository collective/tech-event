// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import SponsorView from './SponsorView';
import { renderInVolto } from '../../testing/render';

const content = {
  title: 'Acme Corp',
  description: 'Makes everything\nFor everyone',
  text: { data: '<em>Since 2010</em>' },
  social_links: null,
};

describe('SponsorView', () => {
  it('shows the title when there is no image', () => {
    const { container } = renderInVolto(<SponsorView content={content} />);
    expect(container.querySelector('h1')?.textContent).toBe('Acme Corp');
    expect(container.querySelector('#sponsorLogo')).toBeNull();
  });

  it('shows one line per line of the description', () => {
    const { container } = renderInVolto(<SponsorView content={content} />);
    const lines = Array.from(
      container.querySelectorAll('.documentDescription span'),
    ).map((span) => span.textContent);
    expect(lines).toEqual(['Makes everything', 'For everyone']);
  });

  it('renders the HTML text', () => {
    const { container } = renderInVolto(<SponsorView content={content} />);
    expect(container.querySelector('.sponsorText em')?.textContent).toBe(
      'Since 2010',
    );
  });

  it('hides the links when there are none', () => {
    const { container } = renderInVolto(<SponsorView content={content} />);
    expect(container.querySelector('.sponsorLinks')).toBeNull();
  });

  it('shows the logo instead of the title when there is an image', () => {
    const { container } = renderInVolto(
      <SponsorView
        content={{
          ...content,
          image: { download: 'logo.png' },
          image_caption: 'Acme logo',
        }}
      />,
    );
    expect(container.querySelector('h1')).toBeNull();
    expect(container.querySelector('#sponsorLogo')).not.toBeNull();
  });
});
