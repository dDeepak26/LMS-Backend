const toSnakeCaseOnlyLetters = (str) => {
  return str
    .replace(/[^a-zA-Z]/g, " ") // Replace non-letters with space
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Split camelCase: "helloWorld" → "hello World"
    .toLowerCase() // Lowercase everything
    .trim() // Remove leading/trailing spaces
    .split(/\s+/) // Split by one or more spaces
    .join("_"); // Join with underscores
};

export default toSnakeCaseOnlyLetters;
