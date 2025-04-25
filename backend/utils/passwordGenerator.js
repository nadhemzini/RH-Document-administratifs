import generator from "generate-password";

export const generatePassword = (length = 10) => {
  return generator.generate({
    length: length,
    numbers: true,
    symbols: true,
    uppercase: true,
    excludeSimilarCharacters: true,
  });
};


const testGeneratePassword = () => {
  const password = generatePassword();
  console.log("Generated Password:", password);

  // Assertions
  console.assert(password.length === 10, "Password length should be 10");
  console.assert(/[A-Z]/.test(password), "Password should contain uppercase letters");
  console.assert(/[0-9]/.test(password), "Password should contain numbers");
  console.assert(/[^a-zA-Z0-9]/.test(password), "Password should contain symbols");
  console.assert(!/[\s]/.test(password), "Password should not contain spaces");
};

testGeneratePassword();