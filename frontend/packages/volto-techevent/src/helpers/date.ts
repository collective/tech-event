export const formatHour = (value: Date): string => {
  return value.toLocaleTimeString('pt', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
