export function extractAlignment(
  styles: Record<string, any>,
): 'left' | 'right' | 'center' {
  const rawValue =
    styles?.['align:noprefix']?.['--block-alignment'] ?? 'align-left';

  if (rawValue.includes('align-left')) {
    return 'left';
  } else if (rawValue.includes('align-right')) {
    return 'right';
  } else if (rawValue.includes('align-center')) {
    return 'center';
  }

  return 'center'; // fallback
}
