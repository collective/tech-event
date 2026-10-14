import { describe, it, expect } from 'vitest';
import SessionMaterials from './SessionMaterials';
import { renderInVolto } from '../../testing/render';

const material = (title: string, id: string) => ({
  '@id': `https://example.org/files/${id}`,
  '@type': 'File',
  description: '',
  head_title: '',
  image_field: '',
  image_scales: null,
  review_state: 'published',
  title,
});

describe('SessionMaterials', () => {
  it('lists each material as a link that opens in a new tab', () => {
    const { getByRole, container } = renderInVolto(
      <SessionMaterials
        content={{
          items: [material('Slides', 'slides'), material('Notebook', 'nb')],
        }}
      />,
    );
    expect(
      container.querySelectorAll(
        '.session-materials-list .session-material-item',
      ),
    ).toHaveLength(2);
    const link = getByRole('link', { name: 'Slides' });
    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('renders nothing without materials', () => {
    const { container } = renderInVolto(
      <SessionMaterials content={{ items: [] }} />,
    );
    expect(container.querySelector('.session-materials-list')).toBeNull();
  });
});
