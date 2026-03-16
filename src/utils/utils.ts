export const generateDefaultPassword = (name: string, dob: string) => {
  const namePart = name.substring(0, 4).toUpperCase();
  const dobPart = dob.replace(/-/g, ""); // YYYY-MM-DD -> YYYYMMDD
  return `${namePart}${dobPart}`;
};

