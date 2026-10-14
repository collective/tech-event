import { describe, it, expect } from 'vitest';
import { extractAlignment } from './styles';

const withAlignment = (value: string) => ({
  'align:noprefix': { '--block-alignment': value },
});

describe('extractAlignment', () => {
  it('defaults to left when no alignment is set', () => {
    expect(extractAlignment({})).toBe('left');
  });

  it('reads left, right and center alignments', () => {
    expect(extractAlignment(withAlignment('align-left'))).toBe('left');
    expect(extractAlignment(withAlignment('align-right'))).toBe('right');
    expect(extractAlignment(withAlignment('align-center'))).toBe('center');
  });

  it('finds the alignment among other classes', () => {
    expect(extractAlignment(withAlignment('full align-right'))).toBe('right');
  });

  it('falls back to center for an unknown alignment', () => {
    expect(extractAlignment(withAlignment('align-justify'))).toBe('center');
  });
});
