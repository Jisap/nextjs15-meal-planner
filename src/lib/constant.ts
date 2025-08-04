
const patterns = {
  // Valida un número entre 0 y 9999, permitiendo hasta dos decimales.
  // También permite que el campo esté vacío.
  zeroTo9999: /^(|0|0\.\d{0,2}|[1-9]\d{0,3}(\.\d{0,2})?)$/,

  // Valida un formato de correo electrónico estándar.
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  // Valida que la contraseña contenga al menos una letra mayúscula.
  minimumOneUpperCaseLetter: /[A-Z]/,

  // Valida que la contraseña contenga al menos una letra minúscula.
  minimumOneLowerCaseLetter: /[a-z]/,

  // Valida que la contraseña contenga al menos un dígito.
  minimumOneDigit: /[0-9]/,

  // Valida que la contraseña contenga al menos uno de estos caracteres especiales.
  minimumOneSpecialCharacter: /[@$!%*#?&]/,

  // Valida que la contraseña tenga una longitud mínima de 8 caracteres.
  minEightCharacters: /^.{8,}$/,
};

export { patterns };
