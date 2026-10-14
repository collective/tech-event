import { describe, it, expect } from 'vitest';
import SessionLanguage from './SessionLanguage';
import { renderInVolto } from '../../testing/render';

describe('SessionLanguage', () => {
  it('shows the language token with the given class', () => {
    const { container } = renderInVolto(
      <SessionLanguage
        item={{ session_language: { token: 'en', title: 'English' } }}
        className="sessionInfoItem"
      />,
    );
    const language = container.querySelector('.sessionLanguage');
    expect(language?.className).toBe('sessionLanguage en sessionInfoItem');
    expect(language?.querySelector('.token')?.textContent).toBe('en');
  });

  it('takes the first language when given a list', () => {
    const { container } = renderInVolto(
      <SessionLanguage
        item={{
          session_language: [
            { token: 'pt', title: 'Português' },
            { token: 'en', title: 'English' },
          ],
        }}
      />,
    );
    expect(
      container.querySelector('.sessionLanguage .token')?.textContent,
    ).toBe('pt');
  });

  it('accepts a bare token', () => {
    const { container } = renderInVolto(
      <SessionLanguage item={{ session_language: 'de' }} />,
    );
    expect(
      container.querySelector('.sessionLanguage .token')?.textContent,
    ).toBe('de');
  });

  it('renders nothing without a language', () => {
    const { container } = renderInVolto(
      <SessionLanguage item={{ session_language: null }} />,
    );
    expect(container.querySelectorAll('.sessionLanguage')).toHaveLength(0);
  });
});
