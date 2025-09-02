export const createQueryParams = <T extends Record<string, unknown>>(params: T): string => {
  const queryString = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => queryString.append(key, String(v)));
    } else if (value !== undefined) {
      queryString.append(key, String(value));
    }
  });

  return queryString.toString();
}