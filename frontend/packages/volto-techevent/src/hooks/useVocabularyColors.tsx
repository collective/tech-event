import { useEventSettings } from './useEventSettings';

export function useVocabularyColors(
  vocabulary: string,
): Record<string, string> {
  const { data } = useEventSettings();
  const colors = data?.[vocabulary]?.reduce(
    (acc, item) => {
      acc[item.id] = item.color;
      return acc;
    },
    {} as Record<string, string>,
  );
  return colors;
}
