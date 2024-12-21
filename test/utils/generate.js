const validators = require("../../managers/_common/schema.validators");

function generate(field, generator) {
  const value = generator();

  // console.log(value);

  // Check if the value passes the validation
  if (validators[field](value)) {
    return value;
  }

  // If not valid, recursively call the function to generate a new value
  return generate(field, generator);
}

module.exports = generate;
