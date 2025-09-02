export const isFalsyValue = (value: unknown): boolean => {
  if (value == null) return true;
  if (typeof value === 'boolean') return value === false;
  if (typeof value === 'number') return value === 0;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;

  return false;
};