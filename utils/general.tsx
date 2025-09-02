export const cleanPathname = (pathname: string) => {
  return pathname
    .split('/')
    .map((segment) => (isNaN(Number(segment)) ? segment : ''))
    .join('/');
};
