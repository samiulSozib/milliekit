export const parseJson = <T>(str: string, logError = false): T | null => {
  let parsedJson: T | null = null;

  try {
    parsedJson = JSON.parse(str);
  } catch (error) {
    if (logError === true) {
      console.error('parseJson Error ', error);
    }
  }

  return parsedJson;
};
