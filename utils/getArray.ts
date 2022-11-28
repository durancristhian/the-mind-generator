export const getArray = (length: number) => {
  return Array.from({ length }).map((_, idx) => `${idx + 1}`);
};
