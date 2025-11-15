export const formatDate = (date: Date) => {
  return date ? date.toISOString().split('T')[0] : null;
};

export const differenceInDays = (date1: Date, date2: Date) => {
  return Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
};

export const differenceInHours = (date1: Date, date2: Date) => {
  return Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 60 * 60));
};

export const differenceInMinutes = (date1: Date, date2: Date) => {
  return Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 60));
};

export const differenceInSeconds = (date1: Date, date2: Date) => {
  return Math.ceil((date2.getTime() - date1.getTime()) / 1000);
};