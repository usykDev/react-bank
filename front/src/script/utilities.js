export const validateAmount = (amount) => {
  const errors = [];

  if (amount === "") {
    errors.push("Please enter the amount you are receiving");
  }

  if (amount.length > 0 && amount.length > 7) {
    errors.push("The value must be less than 7 digits");
  }

  const decimalCount = (amount.split(".")[1] || []).length;
  if (decimalCount > 2) {
    errors.push(
      "A decimal number should only include up to two digits after the decimal point"
    );
  }

  if (amount.startsWith("0") && !amount.includes(".")) {
    errors.push("The value is not correct");
  }

  if (amount.includes("-")) {
    errors.push("Negative numbers are not allowed");
  }

  return errors;
};
