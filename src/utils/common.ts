export const formatDate = (date: Date) => {
  return date ? date.toISOString().split('T')[0] : null;
};