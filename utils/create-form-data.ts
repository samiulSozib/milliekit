export const createFormData = (data: Record<string, any>) => {
  const formData = new FormData();

  for (const key in data) {
    if (Object.hasOwn(data, key) === false) continue;

    const value = data[key];

    if (Array.isArray(value)) {
      for (const item of value) {
        formData.append(key, item);
      }
    } else {
      formData.append(key, value);
    }
  }

  return formData;
};
